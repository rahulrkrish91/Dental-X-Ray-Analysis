/**
 * Circuit Breaker for External API Calls
 * Prevents cascade failures when upstream services are unavailable
 */
export var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "closed";
    CircuitState["OPEN"] = "open";
    CircuitState["HALF_OPEN"] = "half_open";
})(CircuitState || (CircuitState = {}));
const DEFAULT_OPTIONS = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 30000,
    monitoringWindow: 60000,
    excludedErrors: ['BAD_REQUEST', 'AUTH_ERROR', 'MODEL_NOT_FOUND']
};
/**
 * Circuit Breaker Implementation
 */
export class CircuitBreaker {
    state = CircuitState.CLOSED;
    failures = 0;
    successes = 0;
    lastFailure;
    lastSuccess;
    nextAttempt;
    options;
    name;
    failureTimestamps = [];
    constructor(name, options = {}) {
        this.name = name;
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }
    /**
     * Execute an operation with circuit breaker protection
     */
    async execute(operation) {
        if (this.state === CircuitState.OPEN) {
            if (this.nextAttempt && Date.now() >= this.nextAttempt.getTime()) {
                this.transitionToHalfOpen();
            }
            else {
                throw new CircuitOpenError(`Circuit ${this.name} is OPEN`, this.nextAttempt);
            }
        }
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure(error);
            throw error;
        }
    }
    /**
     * Handle successful operation
     */
    onSuccess() {
        this.lastSuccess = new Date();
        this.failureTimestamps = this.failureTimestamps.filter(ts => Date.now() - ts < (this.options.monitoringWindow || 60000));
        if (this.state === CircuitState.HALF_OPEN) {
            this.successes++;
            if (this.successes >= this.options.successThreshold) {
                this.transitionToClosed();
            }
        }
        else {
            // Reset failure count on success in closed state
            this.failures = 0;
        }
    }
    /**
     * Handle failed operation
     */
    onFailure(error) {
        const errorCode = this.extractErrorCode(error);
        // Don't count excluded errors
        if (this.options.excludedErrors?.includes(errorCode)) {
            return;
        }
        this.lastFailure = new Date();
        this.failureTimestamps.push(Date.now());
        // Clean old timestamps
        this.failureTimestamps = this.failureTimestamps.filter(ts => Date.now() - ts < (this.options.monitoringWindow || 60000));
        if (this.state === CircuitState.HALF_OPEN) {
            // Any failure in half-open goes back to open
            this.transitionToOpen();
        }
        else if (this.state === CircuitState.CLOSED) {
            this.failures = this.failureTimestamps.length;
            if (this.failures >= this.options.failureThreshold) {
                this.transitionToOpen();
            }
        }
    }
    /**
     * Extract error code from various error types
     */
    extractErrorCode(error) {
        if (error instanceof Error) {
            // Check for known error types with code property
            const err = error;
            if (err.code)
                return err.code;
            if (err.statusCode)
                return String(err.statusCode);
        }
        return 'UNKNOWN';
    }
    /**
     * Transition to OPEN state
     */
    transitionToOpen() {
        this.state = CircuitState.OPEN;
        this.successes = 0;
        this.nextAttempt = new Date(Date.now() + this.options.timeout);
        console.warn(`[CircuitBreaker:${this.name}] OPENED - next attempt at ${this.nextAttempt.toISOString()}`);
    }
    /**
     * Transition to HALF_OPEN state
     */
    transitionToHalfOpen() {
        this.state = CircuitState.HALF_OPEN;
        this.successes = 0;
        console.log(`[CircuitBreaker:${this.name}] HALF_OPEN - testing recovery`);
    }
    /**
     * Transition to CLOSED state
     */
    transitionToClosed() {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.failureTimestamps = [];
        this.nextAttempt = undefined;
        console.log(`[CircuitBreaker:${this.name}] CLOSED - recovered`);
    }
    /**
     * Get current circuit breaker stats
     */
    getStats() {
        return {
            state: this.state,
            failures: this.failures,
            successes: this.successes,
            lastFailure: this.lastFailure,
            lastSuccess: this.lastSuccess,
            nextAttempt: this.nextAttempt
        };
    }
    /**
     * Force reset circuit breaker (for testing/admin)
     */
    reset() {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.failureTimestamps = [];
        this.lastFailure = undefined;
        this.lastSuccess = undefined;
        this.nextAttempt = undefined;
    }
    /**
     * Force open circuit breaker (for maintenance)
     */
    forceOpen() {
        this.transitionToOpen();
    }
}
/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
    nextAttempt;
    constructor(message, nextAttempt) {
        super(message);
        this.nextAttempt = nextAttempt;
        this.name = 'CircuitOpenError';
    }
}
/**
 * Circuit Breaker Registry - manages multiple breakers
 */
export class CircuitBreakerRegistry {
    breakers = new Map();
    get(name, options) {
        if (!this.breakers.has(name)) {
            this.breakers.set(name, new CircuitBreaker(name, options));
        }
        return this.breakers.get(name);
    }
    getAllStats() {
        const stats = {};
        for (const [name, breaker] of this.breakers) {
            stats[name] = breaker.getStats();
        }
        return stats;
    }
    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
}
// Global registry instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();
/**
 * Pre-configured breakers for NVIDIA NIM APIs
 */
export function getVisionCircuitBreaker() {
    return circuitBreakerRegistry.get('vision', {
        failureThreshold: 3,
        successThreshold: 2,
        timeout: 30000,
        monitoringWindow: 60000
    });
}
export function getReasoningCircuitBreaker() {
    return circuitBreakerRegistry.get('reasoning', {
        failureThreshold: 3,
        successThreshold: 2,
        timeout: 30000,
        monitoringWindow: 60000
    });
}
//# sourceMappingURL=circuit-breaker.js.map