/**
 * Circuit Breaker for External API Calls
 * Prevents cascade failures when upstream services are unavailable
 */
export declare enum CircuitState {
    CLOSED = "closed",
    OPEN = "open",
    HALF_OPEN = "half_open"
}
export interface CircuitBreakerOptions {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    monitoringWindow?: number;
    excludedErrors?: string[];
}
export interface CircuitBreakerStats {
    state: CircuitState;
    failures: number;
    successes: number;
    lastFailure?: Date;
    lastSuccess?: Date;
    nextAttempt?: Date;
}
/**
 * Circuit Breaker Implementation
 */
export declare class CircuitBreaker {
    private state;
    private failures;
    private successes;
    private lastFailure?;
    private lastSuccess?;
    private nextAttempt?;
    private readonly options;
    private readonly name;
    private failureTimestamps;
    constructor(name: string, options?: Partial<CircuitBreakerOptions>);
    /**
     * Execute an operation with circuit breaker protection
     */
    execute<T>(operation: () => Promise<T>): Promise<T>;
    /**
     * Handle successful operation
     */
    private onSuccess;
    /**
     * Handle failed operation
     */
    private onFailure;
    /**
     * Extract error code from various error types
     */
    private extractErrorCode;
    /**
     * Transition to OPEN state
     */
    private transitionToOpen;
    /**
     * Transition to HALF_OPEN state
     */
    private transitionToHalfOpen;
    /**
     * Transition to CLOSED state
     */
    private transitionToClosed;
    /**
     * Get current circuit breaker stats
     */
    getStats(): CircuitBreakerStats;
    /**
     * Force reset circuit breaker (for testing/admin)
     */
    reset(): void;
    /**
     * Force open circuit breaker (for maintenance)
     */
    forceOpen(): void;
}
/**
 * Error thrown when circuit is open
 */
export declare class CircuitOpenError extends Error {
    readonly nextAttempt?: Date | undefined;
    constructor(message: string, nextAttempt?: Date | undefined);
}
/**
 * Circuit Breaker Registry - manages multiple breakers
 */
export declare class CircuitBreakerRegistry {
    private breakers;
    get(name: string, options?: Partial<CircuitBreakerOptions>): CircuitBreaker;
    getAllStats(): Record<string, CircuitBreakerStats>;
    resetAll(): void;
}
export declare const circuitBreakerRegistry: CircuitBreakerRegistry;
/**
 * Pre-configured breakers for NVIDIA NIM APIs
 */
export declare function getVisionCircuitBreaker(): CircuitBreaker;
export declare function getReasoningCircuitBreaker(): CircuitBreaker;
//# sourceMappingURL=circuit-breaker.d.ts.map