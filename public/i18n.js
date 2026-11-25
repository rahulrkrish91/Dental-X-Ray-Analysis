// i18n.js - English and Malayalam translations
// Malayalam strings marked "needs native/dentist review" must be reviewed before launch

const I18N = {
  en: {
    // General
    'app.title': 'Dental X-ray Insights',
    'app.description': 'AI-powered preliminary analysis for dental X-rays. Not a medical diagnosis.',
    'loading.analysing': 'Analysing your X-ray…',
    'loading.wait': 'This may take up to 90 seconds',
    'error.title': 'Analysis Failed',
    'error.retry': 'Retry',
    'error.reset': 'Choose another image',

    // Upload
    'upload.status': 'Preliminary AI reading',
    'upload.title': 'Understand your dental x-ray in plain words.',
    'upload.lead': 'Pick a scan from your gallery. In about a minute you get a clear summary, the areas worth asking your dentist about, and how soon to go.',
    'upload.benefit1.title': 'Not stored',
    'upload.benefit1.desc': 'Your image is processed in memory and discarded after the result is made.',
    'upload.benefit2.title': 'No jargon',
    'upload.benefit2.desc': 'Every finding is explained simply, with how sure the AI is.',
    'upload.benefit3.title': 'A second look, not a diagnosis',
    'upload.benefit3.desc': 'Only a dentist can diagnose. Use this to prepare your questions.',
    'upload.tip': 'Photographing a printed film? Hold it against a bright window or a phone screen at full brightness, keep the camera straight above it, and avoid glare.',
    'upload.step1': 'Your x-ray',
    'upload.change': 'Choose a different image',
    'upload.choose': 'Choose X-ray image',
    'upload.hint': 'Drag & drop or click the button above',
    'upload.rotate.left': 'Rotate left',
    'upload.rotate.right': 'Rotate right',
    'upload.step2': 'What kind of x-ray is it?',
    'upload.type.unknown': 'Not sure',
    'upload.type.unknown.desc': 'Let the AI work it out',
    'upload.type.bitewing': 'Bitewing',
    'upload.type.bitewing.desc': 'Back teeth, top and bottom',
    'upload.type.periapical': 'Periapical',
    'upload.type.periapical.desc': 'One or two teeth, root to crown',
    'upload.type.opg': 'Panoramic (OPG)',
    'upload.type.opg.desc': 'One wide image of the whole jaw',
    'upload.step3': 'Any symptoms right now?',
    'upload.optional': 'Optional',
    'upload.symptom.none': 'None',
    'upload.symptom.pain': 'Pain',
    'upload.symptom.swelling': 'Swelling',
    'upload.symptom.fever': 'Fever',
    'upload.symptom.injury': 'Recent injury',
    'upload.symptom.bleeding': 'Bleeding',
    'upload.consent': 'I understand my image is sent to a third-party AI service for analysis, is not stored by this tool, and the result is not a medical diagnosis.',
    'upload.analyse': 'Analyse x-ray',

    // Results
    'results.not_dental': 'Not a dental X-ray',
    'results.poor_quality': 'Image quality too poor',
    'results.retry': 'Please upload a clear dental X-ray image (bitewing, periapical, or panoramic) and try again.',
    'results.ready': 'Your result is ready',
    'results.title': 'What your x-ray may be showing',
    'results.urgent': 'Urgent finding(s) — seek prompt dental care',
    'results.print': 'Print or save as PDF',
    'results.another': 'Analyse another x-ray',
    'results.disclaimer': 'This is an AI-generated preliminary observation, not a medical diagnosis. Please consult a qualified dentist.',
    'results.annotated': 'Annotated X-ray',
    'results.findings': 'Findings',
    'results.healthy': 'Healthy Observations',
    'results.next_steps': 'Recommended Next Steps',
    'results.limitations': 'Limitations',
    'results.none': 'None noted.',
    'results.confidence.low': 'Low confidence',
    'results.confidence.medium': 'Medium confidence',
    'results.confidence.high': 'High confidence',
    'results.urgency.routine': 'Routine urgency',
    'results.urgency.soon': 'Soon urgency',
    'results.urgency.urgent': 'Urgent urgency',

    // Follow-up Questions (Part 1)
    'ask.panel_title': 'Ask about this report',
    'ask.helper': 'Tap a suggested question or type your own. General information only, not a diagnosis.',
    'ask.chip.1': 'What does this mean in simple words?',
    'ask.chip.2': 'How urgent is this?',
    'ask.chip.3': 'What will the dentist probably do?',
    'ask.chip.4': 'How can I look after this tooth until my appointment?',
    'ask.placeholder': 'Type your question here…',
    'ask.counter': '{count}/300',
    'ask.submit': 'Ask',
    'ask.ask_about': 'Ask about this',
    'ask.remaining': '{count} question{plural} left',
    'ask.limit_reached': 'You\'ve reached the limit for this report. Talk to a dentist for more.',
    'ask.dentist_note': 'General information only, not a diagnosis. For anything urgent, contact a dentist.',
    'ask.dentist_urgent': 'This could be urgent. Please contact a dentist or emergency service now. Do not wait.',
    'ask.whatsapp': 'Message the clinic on WhatsApp',
    'ask.fallback': 'I can\'t answer that safely here. Please ask your dentist.',
    'ask.lang_note': 'This conversation is in {lang}. The interface language has changed.',
    'ask.errors.network': 'Network error. Please check your connection and try again.',
    'ask.errors.timeout': 'Request timed out. Please try again.',
    'ask.errors.too_many': 'Too many questions right now, please try again later.',
    'ask.errors.invalid': 'Invalid session. Please start a new analysis.',
    'ask.errors.limit': 'Question limit reached for this report.',
    'ask.errors.generic': 'Something went wrong. Please try again.',

    // Glossary (Part 2)
    'glossary.terms_title': 'Terms in your report',
    'glossary.open': 'Open glossary',
    'glossary.what': 'What it is',
    'glossary.why': 'Why it matters',
    'glossary.usually': 'What dentists usually do',
    'glossary.ask': 'Ask about this',
    'glossary.close': 'Close',
    'glossary.plain': 'Plain name: {plain}',

    // Footer
    'footer.disclaimer': 'This is an AI-generated preliminary observation, not a medical diagnosis. Please consult a qualified dentist.',
    'footer.privacy': 'Images are processed in memory and not stored. They are sent to a third-party AI service for analysis and never used for training. Follow-up questions are sent to the AI provider and not stored by this tool.',

    // Languages
    'lang.en': 'English',
    'lang.ml': 'മലയാളം'
  },
  ml: {
    // General
    'app.title': 'ഡെന്റൽ എക്‌സ്-റേ ഇൻസൈറ്റ്സ്',
    'app.description': 'ഡെന്റൽ എക്‌സ്-റേയ്ക്കുള്ള AI-സംവിധാനത്തിൽനിന്നുള്ള പ്രാഥമിക വിശകലനം. മെഡിക്കൽ ഡയഗ്നോസിസ് അല്ല.',
    'loading.analysing': 'നിങ്ങളുടെ എക്‌സ്-റേ വിശകലനം ചെയ്യുന്നു…',
    'loading.wait': 'ഇത് 90 സെക്കന്റുകൾ വരെ എടുക്കാം',
    'error.title': 'വിശകലനം നഷ്ടമായി',
    'error.retry': 'മുന്നോട്ട് ശ്രമിക്കുക',
    'error.reset': 'വേറെ ഒരു ചിത്രം തിരഞ്ഞെടുക്കുക',

    // Upload
    'upload.status': 'പ്രാഥമിക AI വായന',
    'upload.title': 'നിങ്ങളുടെ ഡെന്റൽ എക്‌സ്-റേ സरलമായ വാക്കുകളിൽ മനസ്സിലാക്കുക.',
    'upload.lead': 'നിങ്ങളുടെ ഗാലറിയിൽനിന്ന് ഒരു സ്കാൻ തിരഞ്ഞെടുക്കുക. ഏകദേശം ഒരു മിനിറ്റിനുള്ളിൽ നിങ്ങൾക്ക് ഒരു വ്യക്തമായ സാരാംശം, നിങ്ങളുടെ ഡെന്റിസ്റ്റിനോട് ചോദിക്കാവുന്ന പ്രദേശങ്ങൾ, اور എത്രയും വേഗം പോകണമെന്ന് ലഭിക്കും.',
    'upload.benefit1.title': 'സൂക്ഷിക്കാത്തത്',
    'upload.benefit1.desc': 'നിങ്ങളുടെ ചിത്രം മെമ്മറിയിൽ പ്രോസസ്സ് ചെയ്യുന്നു և ഫലം തയ്യാറായുടനേ ഡിസ്കാർഡ് ചെയ്യുന്നു.',
    'upload.benefit2.title': 'ജാർഗൺ ഇല്ല',
    'upload.benefit2.desc': 'ஒന്നും കണ്ടെത്തലുകൾ സർവ്വസാധാരണ വാക്കുകളിൽ വിശദീകരിക്കുന്നു, AI എത്ര ശ്രദ്ധയോടെ കണ്ടെത്തിയതെന്നും പറയുന്നു.',
    'upload.benefit3.title': 'ഒരു രണ്ടാമത്തെ നോട്ടം, ഡയഗ്നോസിസ് അല്ല',
    'upload.benefit3.desc': 'മാത്രം ഒരു ഡെന്റിസ്റ്റിന് മാത്രമേ ഡയഗ്നോസിസ് ചെയ്യാൻ കഴിയൂ. നിങ്ങളുടെ ചോദ്യങ്ങൾ തയ്യാറാക്കാൻ ഇത് ഉപയോഗിക്കുക.',
    'upload.tip': 'പ്രിന്റ করা ഫിലിം ഫോട്ടോഗ്രാഫ് ചെയ്യുന്നു? അത് ഒരു പരിഭാഷാ ജാലകത്തോ അല്ലെങ്കിൽ പൂർണ പ്രകാശത്തിൽ ഒരു ഫോൺ സ്ക്രീനിൽ നിർത്തി, കാമেরা നേരെ മുകളിൽ നിർത്തി, പ്രതിബിംബം ഒഴിവാക്കുക.',
    'upload.step1': 'നിങ്ങളുടെ എക്‌സ്-റേ',
    'upload.change': 'വേറെ ഒരു ചിത്രം തിരഞ്ഞെടുക്കുക',
    'upload.choose': 'എക്‌സ്-റേ ചിത്രം തിരഞ്ഞെടുക്കുക',
    'upload.hint': 'డ్రాగ് & ഡ്രോപ് ചെയ്യുക അല്ലെങ്കിൽ മുകളിലുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്യുക',
    'upload.rotate.left': 'വലത്തോട്ട് തിരിക്കുക',
    'upload.rotate.right': 'ഇടത്തോട്ട് തിരിക്കുക',
    'upload.step2': 'ഏത് തരം എക്‌സ്-റേ ആണ്?',
    'upload.type.unknown': 'നിശ്ചയമില്ല',
    'upload.type.unknown.desc': 'AI തന്നെ മനസ്സിലാക്കാൻ ബ.widgetslaştെക്കുക',
    'upload.type.bitewing': 'ബൈറ്റ്‌വിംഗ്',
    'upload.type.bitewing.desc': 'മുകളിലും താഴേയും പിൻപല്ലുകൾ',
    'upload.type.periapical': 'പെറിയാപിക്കൽ',
    'upload.type.periapical.desc': 'മൂലം മുതൽ മുടി വരെ ഒന്ന് രണ്ട് പല്ലുകൾ',
    'upload.type.opg': 'പാനൊറാമിക് (OPG)',
    'upload.type.opg.desc': 'സമ്പൂർണ്ണ തvivalയത്തിന്റെ ഒരു വിശാല ചിത്രം',
    'upload.step3': 'ഇപ്പോൾ ഏതെങ്കിലും ലക്ഷണങ്ങൾ ഉണ്ടോ?',
    'upload.optional': 'ആവശ്യമില്ല',
    'upload.symptom.none': 'ഏതുമില്ല',
    'upload.symptom.pain': 'വേദന',
    'upload.symptom.swelling': 'വ്രണം',
    'upload.symptom.fever': 'ജ്വരം',
    'upload.symptom.injury': 'സമീപകാല പരിക്ക്',
    'upload.symptom.bleeding': 'രക്തസ്രാവം',
    'upload.consent': 'എനിക്ക് മനസ്സിലാക്കാം: എന്റെ ചിത്രം ഒരു മൂന്നാം കക്ഷി AI സേവനത്തിന് അയയ്ക്കപ്പെടുന്നു, ഈ ഉപകരണത്തിൽ സംഭരിക്കാത്തതാണ്, ഫലം ഒരു മെഡിക്കൽ ഡയഗ്നോസിസ് അല്ല.',
    'upload.analyse': 'എക്‌സ്-റേ വിശകലനം ചെയ്യുക',

    // Results
    'results.not_dental': 'ഡെന്റൽ എക്‌സ്-റേ അല്ല',
    'results.poor_quality': 'ചിത്ര ഗുണം വളരെ മോശം',
    'results.retry': 'ദയവായി വ്യക്തമായ ഒരു ഡെന്റൽ എക്‌സ്-റേ ചിത്രം (ബൈറ്റ്‌വിംഗ്, പെറിയാപിക്കൽ, അല്ലെങ്കിൽ പാനൊറാമിക്) അപ്‌ലോഡ് ചെയ്യി വീണ്ടും ശ്രമിക്കുക.',
    'results.ready': 'നിങ്ങളുടെ ഫലം തയ്യാർ',
    'results.title': 'നിങ്ങളുടെ എക്‌സ്-റേ എന്താണ് കാണിക്കാൻ സാധ്യത',
    'results.urgent': 'അടിയന്തര കണ്ടെത്തല(കൾ) — ഉടൻ ഡെന്റിസ്റ്റിനെ സമീപിക്കുക',
    'results.print': 'പ്രിന്റ് ചെയ്യുക അല്ലെങ്കിൽ PDF ആക്കി സേവ് ചെയ്യുക',
    'results.another': 'വേറെ ഒരു എക്‌സ്-റേ വിശകലനം ചെയ്യുക',
    'results.disclaimer': 'ഇത് ഒരു AI-നിർമ്മിത പ്രാഥമിക നിരീക്ഷണമാണ്, ഒരു മെഡിക്കൽ ഡയഗ്നോസിസ് അല്ല. ദയവായി ഒരു യോഗ്യനായ ഡെന്റിസ്റ്റിനെ സമീപിക്കുക.',
    'results.annotated': 'ച román കേന്ദ്രീകരിച്ച എക്‌സ്-റേ',
    'results.findings': 'കണ്ടെത്തലുകൾ',
    'results.healthy': 'സുഖകരമായ നിരീക്ഷണങ്ങൾ',
    'results.next_steps': 'ശുപാർശ ചെയ്യുന്ന അടുത്ത നടപടികൾ',
    'results.limitations': 'പരിമിതികൾ',
    'results.none': 'കൊണ്ടുവരാൻ കഴിയുന്നതില്ല.',
    'results.confidence.low': 'കുറഞ്ഞ വിശ്വാസം',
    'results.confidence.medium': 'മധ്യಮ വിശ്വാസം',
    'results.confidence.high': 'ഉയർന്ന വിശ്വാസം',
    'results.urgency.routine': 'ചവിട്ടുവരവ് അടിയന്തരത',
    'results.urgency.soon': 'വേഗം അടിയന്തരത',
    'results.urgency.urgent': 'അടിയന്തര അടിയന്തരത',

    // Follow-up Questions (Part 1)
    'ask.panel_title': 'ഈ റിപ്പോർട്ട് കുറിച്ച് ചോദിക്കുക',
    'ask.helper': 'ഒരു സൂചിപ്പിച്ച ചോദ്യം തൊട്ട് അല്ലെങ്കിൽ സ്വന്തം ചോദ്യം ടൈപ്പ് ചെയ്യുക. സാമാന്യ വിവരമേ, ഡയഗ്നോസിസ് അല്ല.',
    'ask.chip.1': 'ഇത് സർവ്വസാധാരണ വാക്കുകളിൽ എന്താണ് അർത്ഥം?',
    'ask.chip.2': 'ഇത് എത്ര അടിയന്തരമാണ്?',
    'ask.chip.3': 'ഡെന്റിസ്റ്റ് സാധാരണയായി എന്താണ് ചെയ്യും?',
    'ask.chip.4': 'അപ്പോയിന്മെന്റ് വരെ ഈ പല്ലു എങ്ങനെ സംരക്ഷിക്കാം?',
    'ask.placeholder': 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക…',
    'ask.counter': '{count}/300',
    'ask.submit': 'ചോദിക്കുക',
    'ask.ask_about': 'ഇതെക്കുറിച്ച് ചോദിക്കുക',
    'ask.remaining': '{count} ചോദ്യം ബാക്കി',
    'ask.limit_reached': 'ഈ റിപ്പോർട്ടിനായുള്ള ചോദ്യ പരിധി പൂർത്തിയായി. കൂടുതൽ വിവരങ്ങൾക്കായി ഡെന്റിസ്റ്റിനെ സമീപിക്കുക.',
    'ask.dentist_note': 'സാമാന്യ വിവരമേ, ഡയഗ്നോസിസ് അല്ല. ഏതെങ്കിലും അടിയന്തര കാര്യമാണെങ്കിൽ ഡെന്റിസ്റ്റിനെ സമീപിക്കുക.',
    'ask.dentist_urgent': 'ഇത് അടിയന്തരമായിരിക്കാം. എന്തായാലും ഒരു ഡെന്റിസ്റ്റിനെയോ അതിയന്തര സേവനങ്ങളെയോ ഉടൻ ബന്ധപ്പെടുക. കാത്തിരിക്കരുത്.',
    'ask.whatsapp': 'WhatsApp-ൽ ക്ലിനിക്കിനെ മെസേജ് ചെയ്യുക',
    'ask.fallback': 'ഇത് സുരക്ഷിതമായി ഉത്തരിക്കാൻ സാധിക്കില്ല. ദയവായി നിങ്ങളുടെ ഡെന്റിസ്റ്റിനെ ചോദിക്കുക.',
    'ask.lang_note': 'இந்த സംഭാഷണം {lang} ൽ आहे. ഇന്റർഫേസ് ഭാഷ മാറി.',
    'ask.errors.network': 'നെറ്റ്‌വർക്ക് പിശക്. ദയവായി നിങ്ങളുടെ കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.',
    'ask.errors.timeout': 'വേള ഒടുവിൽപോയി. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
    'ask.errors.too_many': 'ഇപ്പോൾ ചോദ്യങ്ങളുടെ പരിധി തികഞ്ഞു. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
    'ask.errors.invalid': 'അസാധുവായ സെഷൻ. ദയവായി പുതിയ ഒരു വിശകലനം ആരംഭിക്കുക.',
    'ask.errors.limit': 'ഈ റിപ്പോർട്ടിനായുള്ള ചോദ്യ പരിധി തികഞ്ഞു.',
    'ask.errors.generic': 'തെറ്റായിടം സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.',

    // Glossary (Part 2)
    'glossary.terms_title': 'നിങ്ങളുടെ റിപ്പോർട്ടിലുള്ള പദങ്ങൾ',
    'glossary.open': 'ഗ്ലോസറി തുറക്കുക',
    'glossary.what': 'അതെന്താണ്',
    'glossary.why': 'അത് എന്തുകൊണ്ട് പ്രധാനമാണ്',
    'glossary.usually': 'ഡെന്റിസ്റ്റുമാർ സാധാരണയായി എന്താണ് ചെയ്യുക',
    'glossary.ask': 'ഇതെക്കുറിച്ച് ചോദിക്കുക',
    'glossary.close': 'മൂയ്ക്കുക',
    'glossary.plain': 'സാധാരണ പേര്: {plain}',

    // Footer
    'footer.disclaimer': 'ഇത് ഒരു AI-നിർമ്മിത പ്രാഥമിക നിരീക്ഷണമാണ്, ഒരു മെഡിക്കൽ ഡയഗ്നോസിസ് അല്ല. ദയവായി ഒരു യോഗ്യനായ ഡെന്റിസ്റ്റിനെ സമീപിക്കുക.',
    'footer.privacy': 'ചിത്രങ്ങൾ മെമ്മറിയിൽ പ്രോസസ്സ് ചെയ്യുന്നു, സംഭരിക്കുന്നില്ല. വേര്‍നيشകലനത്തിനായി ഒരു മൂന്നാം കക്ഷി AI സേവനത്തിലേക്ക് അയക്കുന്നു, പരിശീലനത്തിന് പോരോ ആകുന്നില്ല. പിൻനിര ചോദ്യങ്ങൾ AI வழங்கുന്നവരിലേക്ക് അയയ്ക്കപ്പെടുന്നു, ഈ ഉപകരണത്തിൽ സംഭരിക്കുന്നില്ല.',

    // Languages
    'lang.en': 'English',
    'lang.ml': 'മലയാളം'
  }
};

// Simple i18n helper
window.I18N = {
  currentLang: 'en',
  t(key, vars = {}) {
    const dict = I18N[this.currentLang] || I18N.en;
    let text = dict[key] || key;
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  },
  setLang(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key) el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const [key, attr] = el.dataset.i18nAttr.split(':');
      if (key && attr) el.setAttribute(attr, this.t(key));
    });
    // Fire event for other components
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  },
  init() {
    // Apply translations to static elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key) el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const [key, attr] = el.dataset.i18nAttr.split(':');
      if (key && attr) el.setAttribute(attr, this.t(key));
    });
  }
};