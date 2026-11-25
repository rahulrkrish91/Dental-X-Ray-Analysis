// glossary.js - Plain-language dental glossary
// Content must be reviewed by a dentist before launch
// Reviewers: Roshna (English & Malayalam)

const GLOSSARY = [
  {
    id: 'caries',
    en: {
      term: 'Caries',
      plain: 'Tooth decay (a cavity)',
      what: 'Caries is the medical word for tooth decay. Bacteria in your mouth make acid that slowly eats through the hard outer layer of your tooth.',
      why: 'If not treated, it can reach the inner living part of the tooth and cause pain or infection.',
      usually: 'The dentist removes the decay and fills the hole with a filling material.',
      aliases: ['caries', 'cavity', 'cavities', 'tooth decay', 'decay']
    },
    ml: {
      term: 'കെയ്‌സ് (Caries)',
      plain: 'പല്ല് നശിക്കുന്നത് (ക่ว്)',
      what: 'കെയ്‌സ് എന്നത് പല്ല് നശിക്കുന്നതിന്റെ മെഡിക്കൽ പേരാണ്. വായ്പ്പുള്ള ബാക്റ്റീരിയകൾ ആംലം ഉണ്ടാക്കുന്നു, അത് പല്ലിന്റെ കടinburgh ഭാഗംDetroit धीरे-धीरे കളയുന്നു.',
      why: 'ചികിത്സിക്കാതിരുന്നാൽ, ഇത് പല്ലിനുള്ളിലെ ജീവനുള്ള ഭാഗത്തെത്തി വേദനയോ അണുബാധയോ ഉണ്ടാക്കാം.',
      usually: 'ഡെന്റിസ്റ്റ് നശിച്ച ഭാഗം നീക്കി, குழിയിൽ ഫില്ലിംഗ് സvojism സാധനം നിറക്കും.',
      aliases: ['കെയ്‌സ്', 'ക�', 'പല്ല് നശിക്കൽ', 'നശിച്ച പല്ല്']
    },
    art: 'tooth-layers'
  },
  {
    id: 'enamel',
    en: {
      term: 'Enamel',
      plain: 'Tooth enamel (the hard white outer coat)',
      what: 'Enamel is the hardest substance in your body. It covers the crown of each tooth and protects the softer layers underneath.',
      why: 'Once enamel is lost, it does not grow back. Acid from food, drink, or bacteria can wear it down.',
      usually: 'Dentists may apply fluoride varnish or suggest toothpaste to help strengthen remaining enamel.',
      aliases: ['enamel', 'tooth enamel', 'outer layer']
    },
    ml: {
      term: 'എനാമൽ (Enamel)',
      plain: 'പല്ലിന്റെ എനാമൽ (കടinburgh വെളുത്ത ദIBLE പുറത്തെ പophy)',
      what: 'എനാമൽ നിങ്ങളുടെ ശരീരത്തിലെ ഏറ്റവും കടinburgh പദാർത്ഥമാണ്. ഓരോ പല്ലിന്റെ കിരീടം ഇത് മൂടുന്നു, താഴെയുള്ള മൃദുവായ പാളികൾ സംരക്ഷിക്കുന്നു.',
      why: 'ഒരിക്കൽ എനാമൽ നഷ്ടപ്പെട്ടാൽ, അത് വീണ്ടും വളരില്ല. ഭക്ഷണം, പാനീയം, അല്ലെങ്കിൽ ബാക്റ്റീരിയകളിൽനിന്നുള്ള ആംലം ഇത് തകര്ത്തിനിൽക്കാം.',
      usually: 'ഡെന്റിസ്റ്റുകൾ ഫ్లోറൈഡ് വാണിഷ് ഉപയോഗിക്കാമോ അല്ലെങ്കിൽ ബാക്കി എനാമൽ ബലപ്പെടുത്താൻ ტൂথ്പേസ്റ്റ് നിർദ്ദേശിക്കാമോ.',
      aliases: ['എനാമൽ', 'പല്ലിന്റെ എനാമൽ', 'പുറത്തെ പാളി']
    },
    art: 'tooth-layers'
  },
  {
    id: 'dentin',
    en: {
      term: 'Dentin',
      plain: 'The layer under the enamel',
      what: 'Dentin is the yellowish layer beneath the enamel. It makes up most of the tooth and contains tiny tubes that lead to the nerve.',
      why: 'When enamel wears away, dentin is exposed. This can make teeth sensitive to hot, cold, or sweet things.',
      usually: 'Dentists may cover exposed dentin with a filling, bonding, or a crown to stop sensitivity.',
      aliases: ['dentin', 'dentine', 'inner layer']
    },
    ml: {
      term: 'ഡെന്റിൻ (Dentin)',
      plain: 'എനാമലിന് താഴെയുള്ള പാളി',
      what: 'ഡെന്റിൻ എനാമലിന് താഴെയുള്ള മഞ്ഞനിറമുള്ള പാളിയാണ്. പല്ലിന്റെ大部部分 ഇത് കൊണ്ട് നിർമ്മിച്ചിരിക്കുന്നു, സ്നായുവിലേക്ക് നയിക്കുന്ന ক্ষുദ്ര നാളങ്ങൾ ഇതിൽ ഉണ്ട്.',
      why: 'എനാമൽ തകരുമ്പോൾ ഡെന്റിൻ പുറത്തുവരുന്നു. ഇത് പല്ലുകൾ ചൂട്, തണുപ്പ്, മധുരം എന്നിവയ്ക്ക് സംവേദനശീലമാക്കാം.',
      usually: 'ഡെന്റിസ്റ്റുകൾ പ്രകടമായ ഡെന്റിനിൽ ഫില്ലിംഗ്, ബോണ്ടിംഗ്, അല്ലെങ്കിൽ ക്രോൺ ചേർത്ത് സംവേദനশീಲത തടയാം.',
      aliases: ['ഡെന്റിൻ', 'ഡെന്റിൻ', 'അകത്തുള്ള പാളി']
    },
    art: 'tooth-layers'
  },
  {
    id: 'pulp',
    en: {
      term: 'Pulp',
      plain: 'The living center of the tooth (nerve and blood vessels)',
      what: 'The pulp is the soft tissue inside the tooth. It has nerves and blood vessels that keep the tooth alive and let you feel hot, cold, and pain.',
      why: 'If decay or a crack reaches the pulp, it can get inflamed or infected, causing severe pain.',
      usually: 'The dentist may do a root canal treatment to remove the damaged pulp and save the tooth.',
      aliases: ['pulp', 'tooth nerve', 'nerve', 'pulp chamber']
    },
    ml: {
      term: 'പൾപ് (Pulp)',
      plain: 'പല്ലിന്റെ ജീവനുള്ള കേന്ദ്രം (സ്നായু & രക്തനാളങ്ങൾ)',
      what: 'പൾപ് പല്ലിനുള്ളിലെ മൃദുവായ ത Darling ആണ്. ഇതിൽ സ്നായുക്കളും രക്തനാളുകളുമുണ്ട്, അവ പല്ലിനെ ജീവितമാക്കുന്നു, ചൂട്/തണുപ്പ്/വേദന അനുഭവപ്പെടാൻ സഹായിക്കുന്നു.',
      why: 'ക�ോ പൊട്ടലോ പൾപിനെ എത്തിച്ചേരുമ്പോൾ, അത് വീഴ്ചയോ അണുബാധയോ ഉണ്ടാക്കി, തീവ്ര വേദനയ്ക്ക് കാരണമാകാം.',
      usually: 'ഡെന്റിസ്റ്റ് 루ট് കനാൽ ചികിത്സ ചെയ്ത് നശിച്ച പൾപ് നീക്കി, പല്ല് സംരക്ഷിക്കാം.',
      aliases: ['പൾപ്', 'പല്ലിന്റെ സ്നായു', 'സ്നായു', 'പൾപ് ചേംബർ']
    },
    art: 'tooth-layers'
  },
  {
    id: 'root-canal',
    en: {
      term: 'Root canal',
      plain: 'Root canal treatment',
      what: 'A root canal is a procedure to remove infected or damaged pulp from inside the tooth, clean the canals, and seal them.',
      why: 'It saves a tooth that would otherwise need to be pulled out.',
      usually: 'The dentist numbs the area, removes the pulp, cleans and fills the canals, then often places a crown on the tooth.',
      aliases: ['root canal', 'root canal treatment', 'RCT', 'endodontic treatment']
    },
    ml: {
      term: 'റൂട്ട് കനാൽ (Root canal)',
      plain: 'റൂട്ട് കനാൽ ചികിത്സ',
      what: 'റൂട്ട് കനാൽ എന്നത് പല്ലിനുള്ളിൽനിന്ന് അണുബാധിതമോ നശിച്ചമോയ പൾപ് നീക്കി, കനാലുകൾ ശുദ്ധമാക്കി, അവ മുദ്രവയ്ക്കുന്ന ഒരു പ്രൊസീജർ ആണ്.',
      why: 'അത് മറ്റു മാർഗ്ഗം പിക്കേണ്ടി വരുമായിരുന്ന ഒരു പല്ല് രക്ഷിക്കാൻ സഹായിക്കുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് പ്രദേശം സുന്നമാക്കി, പൾപ് നീക്കം ചെയ്യും, കനാലുകൾ ശുദ്ധമാക്കി നിറക്കും, പിന്നീട് പല്ലിൽ ഒരു ക്രോൺ വെക്കും.',
      aliases: ['റൂട്ട് കനാൽ', 'റൂട്ട് കനാൽ ചികിത്സ', 'RCT', 'എൻഡൊഡോണ്ടിക് ചികിത്സ']
    },
    art: 'tooth-layers'
  },
  {
    id: 'periapical-lesion',
    en: {
      term: 'Periapical lesion / Abscess',
      plain: 'Infection at the root tip',
      what: 'A periapical lesion is a dark spot at the tip of a tooth root on an x-ray. It often means the pulp has died and bacteria have spread into the bone, forming a pocket of pus (abscess).',
      why: 'It can cause pain, swelling, and damage the bone around the tooth.',
      usually: 'The dentist usually does a root canal treatment to clean out the infection. Sometimes the tooth needs to be removed.',
      aliases: ['periapical lesion', 'periapical abscess', 'abscess', 'root tip infection', 'apical periodontitis']
    },
    ml: {
      term: 'പെറിയാപിക്കൽ ലേശൻ / അബ്സെസ്സ് (Periapical lesion)',
      plain: 'പല്ലിന്റെ മൂലത്ത 플레이ന്റ് മുകളിലുള്ള അണുബാധ',
      what: 'പെറിയാപിക്കൽ ലേശൻ എന്നത് എക്‌സ്-റേയിൽ പല്ലിന്റെ മൂലത്തേയും 플레이ന്റ് മുകളിലും കാണപ്പെടുന്ന ഒരു കറുപ്പ് പ കളയാണ്. ഇത് സാധാരണയായി പൾപ് മരിച്ചു, ബാക്റ്റീരിയകൾ അസ്ഥിയിലേക്ക് പടർന്നു, പുസ്സിന്റെ ഒരു കൊട്ടാരം (അബ്സെസ്സ്) ഉണ്ടാക്കി എന്ന് സൂചിപ്പിക്കുന്നു.',
      why: 'ഇത് വേദന, വ്രണം, പല്ലിനുചുറ്റുള്ള അസ്ഥി നശിപ്പിക്കാൻ കാരണമാകാം.',
      usually: 'ഡെന്റിസ്റ്റ് സാധാരണയായി റൂട്ട് കനാൽ ചികിത്സയിലൂടെ അണുബാധ തírഃस्कരിക്കും. ചില സമയങ്ങളിൽ പല്ല് നീക്കം ചെയ്യേണ്ടി വരും.',
      aliases: ['പെറിയാപിക്കൽ ലേശൻ', 'പെറിയാപിക്കൽ അബ്സെസ്സ്', 'അബ്സെസ്സ്', 'മൂല 플레이ന്റ് അണുബാധ', 'അപിക്കൽ പെറിയോഡൊണ്ടൈറ്റിസ്']
    },
    art: 'bone-level'
  },
  {
    id: 'bone-loss',
    en: {
      term: 'Bone loss',
      plain: 'Loss of jaw bone around the tooth',
      what: 'Bone loss means the jaw bone that holds the tooth in place has shrunk down. On an x-ray, the bone level looks lower than it should be.',
      why: 'It is often caused by long-standing gum disease (periodontitis). If too much bone is lost, the tooth can become loose.',
      usually: 'The dentist cleans deep under the gums (scaling and root planing). In severe cases, surgery or bone grafts may be needed.',
      aliases: ['bone loss', 'alveolar bone loss', 'jaw bone loss', 'bone level']
    },
    ml: {
      term: 'ബോൺ ലോസ് (Bone loss)',
      plain: 'പല്ലിനു ചുറ്റുള്ള തvival അസ്ഥിയുടെ നഷ്ടം',
      what: 'ബോൺ ലോസ് എന്നത് പല്ലിനെ നിലനിർത്തുന്ന തvival അസ്ഥി കുരുങ്ങിയിരിക്കുന്നതിനെ സൂചിപ്പിക്കുന്നു. എക്‌സ്-റേയിൽ അസ്ഥിയുടെ നില സാധാരണയുണ്ടായിരുന്നതിലും താഴെയായി കാണപ്പെടും.',
      why: 'ഇത് സാധാരണയായി ദീർഘകാലമായ മസecutor രോഗം (പെറിയോഡൊണ്ടൈറ്റിസ്) കാരണമാണ്. очень അധികം അസ്ഥി നഷ്ടപ്പെട്ടാൽ, പല്ല് ലൂസാകാം.',
      usually: 'ഡെന്റിസ്റ്റ് മസ التنفيذيിന്റെ കീഴിൽ sâuूबായി വൃത്തിയാക്കും (സ്കെയ്‌ലിംഗ് & റൂട്ട് പ്ലാനിംഗ്). ഗുരുതരമായ കേസുകളിൽ ശസ്ത്രക്രിയ അല്ലെങ്കിൽ അസ്ഥി ഗ്രാഫ്റ്റ് ആവശ്യമാകാം.',
      aliases: ['ബോൺ ലോസ്', 'അൽവിയോളർ ബോൺ ലോസ്', 'തvival അസ്ഥി നഷ്ടം', 'ബോൺ ലെവൽ']
    },
    art: 'bone-level'
  },
  {
    id: 'periodontitis',
    en: {
      term: 'Periodontitis',
      plain: 'Advanced gum disease',
      what: 'Periodontitis is a serious gum infection that damages the soft tissue and bone supporting the teeth. It starts as gingivitis (mild gum inflammation) and gets worse over time.',
      why: 'It is the main cause of tooth loss in adults. It can also affect overall health.',
      usually: 'Deep cleaning (scaling and root planing), better home care, and regular dental visits. Severe cases may need surgery.',
      aliases: ['periodontitis', 'gum disease', 'periodontal disease', 'pyorrhea']
    },
    ml: {
      term: 'പെറിയോഡൊണ്ടൈറ്റിസ് (Periodontitis)',
      plain: 'മൂന്നാം Stadia മസ executor രോഗം',
      what: 'പെറിയോഡൊണ്ടൈറ്റിസ് ഒരു ഗുരുതരമായ മസ executor അണുബാധയാണ്, ഇത് പല്ലുകളെ പിന്തുണയ്ക്കുന്ന മൃദുവായ Texaco & അസ്ഥി നശിപ്പിക്കുന്നു. ഇത് gingivitis (മൃദു മസ executor പ്രദാഹം) ആയി ആരംഭിച്ച് കാലത്തോടെ വർദ്ധിക്കുന്നു.',
      why: 'വയസ്സുള്ളവരിൽ പല്ല് നഷ്ടമാകാൻ പ്രധാന കാരണമിത്. ഇത് സർവ്വাঙ്ഗ ആരോഗ്യവും ബാധിക്കാം.',
      usually: 'ഗാഢമായ വൃത്തിയാക്കൽ (സ്കെയ്‌ലിംഗ് & റൂട്ട് പ്ലാനിംഗ്), വീട്ടിൽ നല്ല പരിചരണം, നിരന്തര ഡെന്റൽ വിസിറ്റുകൾ. ഗുരുതരമായ കേസുകളിൽ ശസ്ത്രക്രിയ ആവശ്യമാകാം.',
      aliases: ['പെറിയോഡൊണ്ടൈറ്റിസ്', 'മസ executor രോഗം', 'പെറിയോഡൊണ്ടൽ രോഗം', 'പയോറിയ']
    },
    art: 'bone-level'
  },
  {
    id: 'gingivitis',
    en: {
      term: 'Gingivitis',
      plain: 'Mild gum inflammation',
      what: 'Gingivitis is the early stage of gum disease. The gums become red, swollen, and may bleed when you brush. It is reversible with good cleaning.',
      why: 'If not treated, it can progress to periodontitis and cause bone loss.',
      usually: 'Professional cleaning, better brushing and flossing at home.',
      aliases: ['gingivitis', 'gum inflammation', 'swollen gums', 'bleeding gums']
    },
    ml: {
      term: 'ജിൻജിവൈറ്റിസ് (Gingivitis)',
      plain: 'മൃദു മസ executor പ്രദാഹം',
      what: 'ജിൻജിവൈറ്റിസ് മസ executor രോഗത്തിന്റെ ആദ്യ Stadia ആണ്. മസ التنفيذي് ചുവപ്പായി, വ്രണമയായി, ബ്രഷ് ചെയ്യുമ്പോൾ രക്തം വരാം. നല്ല വൃത്തിയാക്കലിലൂടെ ഇത് മാറ്റിയെടുക്കാം.',
      why: 'ചികിത്സിക്കാതിരുന്നാൽ, ഇത് പെറിയോഡൊണ്ടൈറ്റിസിലേക്ക് മാറി, അസ്ഥി നഷ്ടത്തിനു കാരണമാകാം.',
      usually: 'വൃത്തിയാക്കൽ, വീട്ടിൽ നല്ല ബ്രഷിംഗ് & ഫ്ലോസ്സിംഗ്.',
      aliases: ['ജിൻജിവൈറ്റിസ്', 'മസ executor പ്രദാഹം', 'വ്രണമയ മസ executor', 'രക്തസ്രാവിക്കുന്ന മസ executor']
    },
    art: 'healthy-vs-decay'
  },
  {
    id: 'calculus',
    en: {
      term: 'Calculus (Tartar)',
      plain: 'Hardened plaque on teeth',
      what: 'Calculus (also called tartar) is plaque that has hardened on the teeth. It cannot be removed by brushing alone. It forms above and below the gum line.',
      why: 'It gives bacteria a rough surface to stick to, making gum disease worse.',
      usually: 'A dentist or hygienist removes it with special tools (scaling).',
      aliases: ['calculus', 'tartar', 'hardened plaque', 'dental calculus']
    },
    ml: {
      term: 'കാൽക്കുലസ് (Calculus / Tartar)',
      plain: 'പല്ലിൽ കട്ടിയ പ്ലാക്',
      what: 'കാൽക്കുലസ് (കैलกുലസ്, ടാർട്ടാർ എന്നും അറിയപ്പെടുന്നു) പല്ലിൽ കട്ടിയ പ്ലാക് ആണ്. ബ്രഷിംഗ് മാത്രം കൊണ്ട് നീക്കം ചെയ്യാൻ കഴിയില്ല. മസ executorരേഖയിലും അതിൽ താഴെയും ഇത് உருவാകും.',
      why: 'ബാക്റ്റീരിയകൾക്കിടയ്ക്കാനുള്ള eine rough സർഫേസ് ഇത് നൽകുന്നു, മസ executor രോഗം വർദ്ധിപ്പിക്കുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് അല്ലെങ്കിൽ ഹൈജീനിസ്റ്റ് ప్రత్యേക ഉപകരണങ്ങളാൽ (സ്കെയ്‌ലിംഗ്) ഇത് നീക്കം ചെയ്യും.',
      aliases: ['കാൽക്കുലസ്', 'ടാർട്ടാർ', 'കട്ടിയ പ്ലാക്', 'ഡെന്റൽ കാൽക്കുലസ്']
    },
    art: 'healthy-vs-decay'
  },
  {
    id: 'impacted-tooth',
    en: {
      term: 'Impacted tooth',
      plain: 'A tooth stuck under the gum or bone',
      what: 'An impacted tooth cannot come through the gum into its normal position. It may be blocked by another tooth, bone, or thick gum tissue. Wisdom teeth are the most common.',
      why: 'It can cause pain, swelling, infection, or damage to nearby teeth.',
      usually: 'The dentist monitors it. If it causes problems, it is usually removed surgically.',
      aliases: ['impacted tooth', 'impacted wisdom tooth', 'unerupted tooth', 'stuck tooth']
    },
    ml: {
      term: 'ഇംപാക്ടഡ് ടൂത്ത് (Impacted tooth)',
      plain: 'മസ executor അല്ലെങ്കിൽ അസ്ഥിക്കടിയിൽ കുടുങ്ങിയ പല്ല്',
      what: 'ഒരു ഇംപാക്ടഡ് ടൂത്ത് മസ executor വഴി സാധാരണ സ്ഥാനത്തേക്ക് വരാൻ സാധിക്കില്ല. അത് മറ്റ് പല്ല്, അസ്ഥി, അല്ലെങ്കിൽ നിർബന്ധമായ മസ executor 모տാൽ ബ്ലോക്ക് ചെയ്യപ്പെട്ടിരിക്കാം. വിസ്ഡം ടൂത്ത് (ജ്ഞാനപല്ല്) ഏറ്റവും സാധാരണമാണ്.',
      why: 'വേദന, വ്രണം, അണുബാധ, അല്ലെങ്കിൽ സമീപത്തെ പല്ലുകൾക്കു നാശം ഉണ്ടാക്കാം.',
      usually: 'ഡെന്റിസ്റ്റ് നിരീക്ഷിക്കും. പ്രശ്നങ്ങൾ ഉണ്ടായാൽ, അത് സാധാരണയായി ശസ്ത്രക്രിയയിലൂടെ നീക്കം ചെയ്യും.',
      aliases: ['ഇംപാക്ടഡ് ടൂത്ത്', 'ഇംപാക്ടഡ് വിസ്ഡം ടൂത്ത്', 'അനkişafിച്ച പല്ല്', 'കുടുങ്ങിയ പല്ല്']
    },
    art: 'implant'
  },
  {
    id: 'wisdom-tooth',
    en: {
      term: 'Wisdom tooth',
      plain: 'Third molar (back tooth that comes in late teens/20s)',
      what: 'Wisdom teeth are the last molars at the back of the mouth. They usually appear between ages 17 and 25. There often is not enough room for them.',
      why: 'They can become impacted, cause crowding, decay, or gum problems.',
      usually: 'If they cause problems, the dentist usually removes them. If they come in straight and healthy, they can stay.',
      aliases: ['wisdom tooth', 'third molar', 'wisdom teeth']
    },
    ml: {
      term: 'വിസ്ഡം ടൂത്ത് (Wisdom tooth)',
      plain: 'തൃതീയ മോളർ (പിന്നിൽ വരുന്ന പല്ല്, 17-25 വയസ്സിൽ)',
      what: 'വിസ്ഡം ടूത്ത് വായുടെ പിന്നിൽ ഏറ്റവും അകലെയുള്ള മോളറുകളാണ്. ഇത് സാധാരണയായി 17-25 വയസ്സിനിടെ വരുന്നു. പലപ്പോഴും അവയ്ക്ക് পর്യാപ്ത ഇടം കിട്ടാറില്ല.',
      why: 'അവ ഇംപാക്ടഡ് ആകാം, ക്രൗഡിംഗ്, ക�, മസ executor പ്രശ്നങ്ങൾ ഉണ്ടാക്കാം.',
      usually: 'പ്രശ്നങ്ങൾ ഉണ്ടായാൽ ഡെന്റിസ്റ്റ് നീക്കം ചെയ്യും. സधीകമായി സുഖാരോഗ്യமாக വന്നാൽ തുടർന്നിരിക്കാം.',
      aliases: ['വിസ്ഡം ടൂത്ത്', 'തൃതീയ മോളർ', 'വിസ്ഡം ടൂത്ത്കൾ']
    },
    art: 'implant'
  },
  {
    id: 'filling',
    en: {
      term: 'Filling (Restoration)',
      plain: 'Material that fills a cavity',
      what: 'A filling is a material the dentist puts into a cleaned-out cavity to restore the tooth shape and function. Common types are composite (tooth-colored) and amalgam (silver).',
      why: 'It seals the tooth so bacteria cannot get in and cause more decay.',
      usually: 'The dentist numbs the tooth, removes decay, and places the filling material.',
      aliases: ['filling', 'restoration', 'tooth filling', 'composite filling', 'amalgam filling']
    },
    ml: {
      term: 'ഫില്ലിംഗ് (Filling / Restoration)',
      plain: 'ക� നിറയ്ക്കുന്ന വസ്തു',
      what: 'ഫില്ലിംഗ് എന്നത് ഡെന്റിസ്റ്റ് ശുദ്ധമാക്കിയ ക�യിൽ വെച്ച് പല്ലിന്റെ രൂപവും പ്രവർത്തനവും വീണ്ടെടുക്കുന്ന ഒരു വസ്തുവാണ്. സാധാരണ തരം: কম്പോസിറ്റ് (പല്ലിന്റെ നിറം) & അമൽഗം (വെളുത്ത മഞ്ഞ്).',
      why: 'ബാക്റ്റീരിയകൾ അകത്തേക്ക് പ്രവേശിച്ച് കൂടുതൽ ക� ഉണ്ടാക്കുന്നത് ഇത് തടയുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് പല്ല് സുന്നമാക്കി, ക� നീക്കം ചെയ്യും, ഫില്ലിംഗ് വസ്തു വെക്കും.',
      aliases: ['ഫില്ലിംഗ്', 'റസ്റ്ററേഷൻ', 'പല്ല് ഫില്ലിംഗ്', 'കമ്പോസിറ്റ് ഫില്ലിംഗ്', 'അമൽഗം ഫില്ലിംഗ്']
    },
    art: 'healthy-vs-decay'
  },
  {
    id: 'crown',
    en: {
      term: 'Crown',
      plain: 'A cap that covers the whole tooth',
      what: 'A crown is a custom-made cap that fits over a damaged or weak tooth. It restores the shape, strength, and appearance. Materials include ceramic, metal, or porcelain-fused-to-metal.',
      why: 'It protects a tooth that has a large filling, had a root canal, or is cracked.',
      usually: 'The dentist shapes the tooth, takes a mold, and places a temporary crown. The permanent crown is fitted at a later visit.',
      aliases: ['crown', 'dental crown', 'tooth cap', 'cap']
    },
    ml: {
      term: 'ക്രോൺ (Crown)',
      plain: 'പല്ലിനെ മുഴുവൻ മൂടുന്ന ഒരു മുടി',
      what: 'ക്രോൺ ഒരു കസ്റ്റം-മേയ്ഡ് മുടിയാണ്, നശിച്ചോ ബലഹീനമായോയ ഒരു പല്ലിന് മുകളിൽ ഫിറ്റ് ചെയ്യുന്നു. ഇത് രൂപം, ബലം, സൗന്ദര്യം എന്നിവ വീണ്ടെടുക്കുന്നു. സാമഗ്രികൾ: സെറാമിക്, മെറ്റൽ, അല്ലെങ്കിൽ പോസിലിൻ-ഫ്യൂസ്ഡ്-ടു-മെറ്റൽ.',
      why: 'വലുത് ഫില്ലിംഗ് ഉള്ള, റൂട്ട് കനാൽ ചെയ്ത, അല്ലെങ്കിൽ പൊട്ടിയ പല്ലിനെ ഇത് സംരക്ഷിക്കുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് പല്ല് കരവ conservation ചെയ്യും, മോൾഡ് എടുക്കും, താൽക്കാലിക ക്രോൺ വെക്കും. സ്ഥായി ക്രോൺ പിന്നീട് ഒരു വിസിറ്റിൽ ഫിറ്റ് ചെയ്യും.',
      aliases: ['ക്രോൺ', 'ഡെന്റൽ ക്രോൺ', 'പല്ല് മുടി', 'മുടി']
    },
    art: 'healthy-vs-decay'
  },
  {
    id: 'bridge',
    en: {
      term: 'Bridge',
      plain: 'Fixed replacement for missing tooth/teeth',
      what: 'A bridge fills the gap left by one or more missing teeth. It uses the teeth on either side as anchors (abutments) to hold a false tooth (pontic) in place.',
      why: 'It restores chewing, speech, and appearance, and keeps other teeth from shifting.',
      usually: 'The dentist prepares the anchor teeth, takes a mold, and fits the custom bridge.',
      aliases: ['bridge', 'dental bridge', 'fixed bridge', 'tooth bridge']
    },
    ml: {
      term: 'ബ്രിഡ്ജ് (Bridge)',
      plain: 'നഷ്ടപ്പെട്ട പല്ലിന് സ്ഥിരമായ പകരം',
      what: 'ബ്രിഡ്ജ് ഒന്നോ അധികമോ നഷ്ടപ്പെട്ട പല്ലുകളുടെ ഇടനില നിറയ്ക്കുന്നു. ഇത് ഇരുവശത്തെ പല്ലുകളെ ആങ്കറുകളായി (അബറ്റ്മെന്റ്സ്) ഉപയോഗിച്ച് ഒരു വ്യാജ പല്ല് (പൊണ്ടിക്) സ്ഥിരമാക്കുന്നു.',
      why: 'ചവിട്ടുക, സംസാരിക്കുക, സൗന്ദര്യം എന്നിവ വീണ്ടെടുക്കുന്നു, മറ്റു പല്ലുകൾ മാറുന്നത് തടയുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് ആങ്കർ പല്ലുകൾ തയ്യാറാക്കി, മോൾഡ് എടുത്ത്, കസ്റ്റം ബ്രിഡ്ജ് ഫിറ്റ് ചെയ്യും.',
      aliases: ['ബ്രിഡ്ജ്', 'ഡെന്റൽ ബ്രിഡ്ജ്', 'സ്റ്റയിറ്റ് ബ്രിഡ്ജ്', 'പല്ല് ബ്രിഡ്ജ്']
    },
    art: 'implant'
  },
  {
    id: 'implant',
    en: {
      term: 'Dental implant',
      plain: 'Artificial tooth root placed in the jaw bone',
      what: 'An implant is a small titanium post that the dentist surgically places into the jaw bone. It acts like a tooth root. A crown is attached on top later.',
      why: 'It replaces a missing tooth without touching neighboring teeth. It helps preserve jaw bone.',
      usually: 'The implant is placed, bone heals around it (3-6 months), then a crown is attached.',
      aliases: ['implant', 'dental implant', 'tooth implant', 'titanium implant']
    },
    ml: {
      term: 'ഡെന്റൽ ഇംപ്ലാന്റ് (Dental implant)',
      plain: 'തvival അസ്ഥിയിൽ സ്ഥാപിക്കുന്ന കൃത്രിമ പല്ലിന്റെ മൂലം',
      what: 'ഒരു ഇംപ്ലാന്റ് ചെറിയ ഒരു ടൈറ്റാനിയം പോസ്റ്റാണ്, ഡെന്റിസ്റ്റ് ശസ്ത്രക്രിയയിലൂടെ തvival അസ്ഥിയിൽ സ്ഥാപിക്കുന്നു. ഇത് ഒരു പല്ലിന്റെ മൂലം പോലെ പ്രവർത്തിക്കുന്നു. പിന്നീട് മുകളിൽ ഒരു ക്രോൺ ചേർക്കുന്നു.',
      why: 'അനുവശത്തെ പല്ലുകൾ സ്പർശിക്കാതെ നഷ്ടപ്പെട്ട പല്ലിനെ പകരുന്നു. തvival അസ്ഥി സംരക്ഷിക്കാൻ ഇത് സഹായിക്കുന്നു.',
      usually: 'ഇംപ്ലാന്റ് സ്ഥാപിക്കും, അസ്ഥി അതിനുചുറ്റ് ഭീതി (3-6 മാസം), പിന്നീട് ക്രോൺ ചേർക്കും.',
      aliases: ['ഇംപ്ലാന്റ്', 'ഡെന്റൽ ഇംപ്ലാന്റ്', 'പല്ല് ഇംപ്ലാന്റ്', 'ടൈറ്റാനിയം ഇംപ്ലാന്റ്']
    },
    art: 'implant'
  },
  {
    id: 'extraction',
    en: {
      term: 'Extraction',
      plain: 'Removing a tooth',
      what: 'Extraction means taking a tooth out completely. It is done when a tooth cannot be saved (severe decay, fracture, advanced gum disease, or for orthodontic reasons).',
      why: 'It stops pain and infection from spreading.',
      usually: 'The dentist numbs the area, loosens the tooth, and removes it. The socket heals over 1-2 weeks.',
      aliases: ['extraction', 'tooth extraction', 'tooth removal', 'pulling a tooth']
    },
    ml: {
      term: 'എക്സ്ട്രാക്ഷൻ (Extraction)',
      plain: 'പല്ല് നീക്കം ചെയ്യൽ',
      what: 'എക്സ്ട്രാക്ഷൻ എന്നത് ഒരു പല്ലിനെ সম্পൂർണ്ണമായി പുറത്തേക്ക് എടുക്കലാണ്. ഇത് ഒരു പല്ലിനെ സംരക്ഷിക്കാൻ കഴിയാത്ത സമയത്ത് ചെയ്യുന്നു (തീവ്ര ക�, പൊട്ടൽ, എഡ്വാൻസ്ഡ് മസ executor രോഗം, അല്ലെങ്കിൽ അതോർപ്പ്രോഡോണ്ടിക് കാരണങ്ങൾ).',
      why: 'വേദനയും അണുബാധ പടരുന്നതും ഇത് തടയുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് പ്രദേശം സുന്നമാക്കി, പല്ല് ഢीലമാക്കി, നീക്കം ചെയ്യും. സോക്കറ്റ് 1-2 ആഴ്ചകളിൽ ഭീതി.',
      aliases: ['എക്സ്ട്രാക്ഷൻ', 'പല്ല് എക്സ്ട്രാക്ഷൻ', 'പല്ല് നീക്കം ചെയ്യൽ', 'പല്ല് പിളിക്കൽ']
    },
    art: 'implant'
  },
  {
    id: 'root',
    en: {
      term: 'Root',
      plain: 'The part of the tooth inside the bone',
      what: 'The root anchors the tooth in the jaw bone. Front teeth usually have one root; back teeth have two or three. The root contains canals with nerves and blood vessels.',
      why: 'Root health is essential for tooth stability. Infection at the root tip can spread to the bone.',
      usually: 'Root canal treatment cleans the inside of the root. Gum disease treatment helps the bone around the root.',
      aliases: ['root', 'tooth root', 'root canal', 'root apex']
    },
    ml: {
      term: 'റൂട്ട് (Root)',
      plain: 'അസ്ഥിക്കുള്ളിലുള്ള പല്ലിന്റെ ഭാഗം',
      what: 'റൂട്ട് പല്ലിനെ തvival അസ്ഥിയിൽ ആങ്കർ ചെയ്യുന്നു. മുൻപല്ലുകൾക്ക് സാധാരണയായി ഒരു റൂട്ട്; പിൻപല്ലുകൾക്ക് രണ്ടോ മൂന്നോ. റൂട്ടിൽ സ്നായുക്കളും രക്തനാളുകളുമുള്ള കനാലുകൾ ഉണ്ട്.',
      why: 'റൂട്ട് ആരോഗ്യം പല്ലിന്റെ സ്ഥിരതയ്ക്ക് അടിസ്ഥാനമാണ്. മൂല 플레이ന്റിൽ അണുബാധ അസ്ഥിയിലേക്ക് പടരാം.',
      usually: 'റൂട്ട് കനാൽ ചികിത്സ റൂട്ടിന്റെ അകത്തെ ഭാഗം ശുദ്ധമാക്കും. മസ executor രോഗ ചികിത്സ റൂട്ടിനു ചുറ്റുള്ള അസ്ഥി സഹായിക്കുന്നു.',
      aliases: ['റൂട്ട്', 'പല്ല് റൂട്ട്', 'റൂട്ട് കനാൽ', 'റൂട്ട് എപക്സ്']
    },
    art: 'tooth-layers'
  },
  {
    id: 'bone-level',
    en: {
      term: 'Bone level',
      plain: 'Height of the jaw bone around the tooth',
      what: 'Bone level refers to how high the jaw bone comes up around the tooth roots. Healthy bone is high, near the crown. Low bone level suggests gum disease has caused bone loss.',
      why: 'It shows how well the tooth is supported.',
      usually: 'The dentist measures bone level on x-rays to check gum health and plan treatment.',
      aliases: ['bone level', 'alveolar bone level', 'crestal bone level', 'bone height']
    },
    ml: {
      term: 'ബോൺ ലെവൽ (Bone level)',
      plain: 'പല്ലിനു ചുറ്റുള്ള തvival അസ്ഥിയുടെ ഉയരം',
      what: 'ബോൺ ലെവൽ എന്നത് തvival അസ്ഥി പല്ലിന്റെ മൂലങ്ങൾ ചുറ്റി എത്ര ഉയരമുണ്ട് എന്നെ സൂചിപ്പിക്കുന്നു. സുഖാരോഗ്യമുള്ള അസ്ഥി ഉയർന്നിരിക്കും, കിരീടത്തോട് സമീപം. താഴ്ന്ന ബോൺ ലെവൽ മസ executor രോഗം അസ്ഥി നഷ്ടമുണ്ടാക്കിയതായി സൂചിപ്പിക്കുന്നു.',
      why: 'പല്ല് എത്ര നല്ലായി പിന്തുണയ്ക്കപ്പെടുന്നു എന്ന് ഇത് കാണിക്കുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് എക്‌സ്-റേകളിൽ ബോൺ ലെവൽ നിരൂപിക്കും, മസ executor ആരോഗ്യം പരിശോധിക്കും, ചികിത്സ പ്ലാൻ ചെയ്യും.',
      aliases: ['ബോൺ ലെവൽ', 'അൽവിയോളർ ബോൺ ലെവൽ', 'ക്രെസ്റ്റൽ ബോൺ ലെവൽ', 'ബോൺ ഹൈറ്റ്']
    },
    art: 'bone-level'
  },
  {
    id: 'radiolucent',
    en: {
      term: 'Radiolucent',
      plain: 'Dark area on x-ray (less dense)',
      what: 'On an x-ray, radiolucent areas look dark because x-rays pass through them easily. They are less dense. Examples: decay, abscess, air spaces, pulp chamber.',
      why: 'It helps the dentist spot problems like decay or infection.',
      usually: 'The dentist investigates dark spots to find the cause.',
      aliases: ['radiolucent', 'radiolucency', 'dark spot', 'lucent area']
    },
    ml: {
      term: 'റേഡിയোলൂസന്റ് (Radiolucent)',
      plain: 'എക്‌സ്-റേയിൽ കറുപ്പ് പ്രദേശം (കുറഞ്ഞ densidad)',
      what: 'എക്‌സ്-റേയിൽ, റേഡിയোলൂസന്റ് പ്രദേശങ്ങൾ കറുപ്പായി കാണപ്പെടുന്നു കാരണം എക്‌സ്-റേകൾ അവയിലൂടെ എളുപ്പത്തിൽ കടന്നുപോകും. അവ കുറഞ്ഞ density ഉള്ളവയാണ്. ഉദാഹരണം: ക�, അബ്സെസ്സ്, വായു ഇടങ്ങൾ, പൾപ് ചേംബർ.',
      why: 'ക� അല്ലെങ്കിൽ അണുബാധ പോലുള്ള പ്രശ്നങ്ങൾ ഡെന്റിസ്റ്റ് കണ്ടെത്താൻ ഇത് സഹായിക്കുന്നു.',
      why: 'ഡെന്റിസ്റ്റ് കറുപ്പ് പടികൾ അന്വേഷിച്ച് കാരണം കണ്ടെത്തും.',
      aliases: ['റേഡിയોલൂസന്റ്', 'റേഡിയোলൂസൻസി', 'കറുപ്പ് പടി', 'ലൂസന്റ് ഏറിയ']
    },
    art: 'healthy-vs-decay'
  },
  {
    id: 'radiopaque',
    en: {
      term: 'Radiopaque',
      plain: 'White/bright area on x-ray (dense)',
      what: 'On an x-ray, radiopaque areas look white or bright because they block x-rays. They are dense. Examples: enamel, metal fillings, crowns, implants, bone.',
      why: 'It helps the dentist see fillings, crowns, implants, and bone.',
      usually: 'The dentist uses bright areas to identify restorations and anatomy.',
      aliases: ['radiopaque', 'radiopacity', 'white spot', 'opaque area', 'bright area']
    },
    ml: {
      term: 'റേഡിയോപേക്ക് (Radiopaque)',
      plain: 'എക്‌സ്-റേയിൽ വെളുത്ത/പ്രകാശമയ പ്രദേശം (ഉയർന്ന density)',
      what: 'എക്‌സ്-റേയിൽ, റേഡിയോപേക്ക് പ്രദേശങ്ങൾ വെളുത്തോ പ്രകാശമയോ കാണപ്പെടുന്നു കാരണം അവ എക്‌സ്-റേകൾ ബ്ലോക്ക് ചെയ്യുന്നു. അവ ഉയർന്ന density ഉള്ളവയാണ്. ഉദാഹരണം: എനാമൽ, മെറ്റൽ ഫില്ലിംഗുകൾ, ക്രോണുകൾ, ഇംപ്ലാന്റുകൾ, അസ്ഥി.',
      why: 'ഫില്ലിംഗുകൾ, ക്രോണുകൾ, ഇംപ്ലാന്റുകൾ, അസ്ഥി എന്നിവ ഡെന്റിസ്റ്റ് കാണാൻ ഇത് സഹായിക്കുന്നു.',
      usually: 'ഡെന്റിസ്റ്റ് പ്രകാശമയ പ്രദേശങ്ങൾ ഉപയോഗിച്ച് റസ്റ്ററേഷനുകളും അനാറ്റോമിയും തിരിച്ചറിയുന്നു.',
      aliases: ['റേഡിയോപേക്ക്', 'റേഡിയോപാസിറ്റി', 'വെളുത്ത പടി', 'ഓപേക്ക് ഏറിയ', 'പ്രകാശമയ പ്രദേശം']
    },
    art: 'healthy-vs-decay'
  },
  {
    id: 'fdi-numbering',
    en: {
      term: 'FDI tooth numbering',
      plain: 'Two-digit system for naming teeth',
      what: 'The FDI system uses two digits: the first is the quadrant (1=upper right, 2=upper left, 3=lower left, 4=lower right), the second is the tooth number from front to back (1-8). Example: 36 = lower left first molar.',
      why: 'It is the standard way dentists worldwide identify teeth.',
      usually: 'The dentist records findings using FDI numbers for clear communication.',
      aliases: ['FDI', 'FDI numbering', 'tooth number', 'tooth notation', 'dental notation']
    },
    ml: {
      term: 'FDI പല്ല് നമ്പറിംഗ് (FDI tooth numbering)',
      plain: 'പല്ലുകൾ നാമകരണം ചെയ്യുന്ന രണ്ട്-സंख്യാ സംവിധാനം',
      what: 'FDI സംവിധാനം രണ്ട് അക്കങ്ങൾ ഉപയോഗിക്കുന്നു: ഒന്നാമത്തെത് квад്രന്റ് (1=മുകളിൽ വലത്, 2=മുകളിൽ ഇടത്, 3=താഴെ ഇടത്, 4=താഴെ വലത്), രണ്ടാമത്തെത് മുൻപിൽനിന്ന് പിന്നിലേക്ക് പല്ല് നമ്പർ (1-8). ഉദാഹരണം: 36 = താഴെ ഇടതു ഫസ്റ്റ് മോളർ.',
      why: 'ലോകമെമ്പാടുമുള്ള ഡെന്റിസ്റ്റുകൾ പല്ലുകൾ തിരിച്ചറിയാൻ ഉപയോഗിക്കുന്ന മാനക സംവിധാനമിത്.',
      usually: 'ഡെന്റിസ്റ്റ് ഫലങ്ങൾ FDI നമ്പറുകളിൽ രേഖപ്പെടുത്തും, വ്യക്തമായ ആശയവിനിമയത്തിന്.',
      aliases: ['FDI', 'FDI നമ്പറിംഗ്', 'പല്ല് നമ്പർ', 'പല്ല് നോട്ടേഷൻ', 'ഡെന്റൽ നോട്ടേഷൻ']
    },
    art: null
  },
  {
    id: 'bitewing',
    en: {
      term: 'Bitewing x-ray',
      plain: 'X-ray of back teeth (top & bottom together)',
      what: 'A bitewing x-ray shows the upper and lower back teeth in one image. You bite down on a wing-shaped tab. It is best for spotting decay between teeth and checking bone level.',
      why: 'It shows areas that are hard to see in a visual exam.',
      usually: 'Taken at routine check-ups, usually once a year.',
      aliases: ['bitewing', 'bitewing x-ray', 'bitewing radiograph', 'BW']
    },
    ml: {
      term: 'ബൈറ്റ്‌വിംഗ് എക്‌സ്-റേ (Bitewing)',
      plain: 'പിൻപല്ലുകളുടെ എക്‌സ്-റേ (മുകളിലും താഴെയുമൊരുമിച്ച്)',
      what: 'ബൈറ്റ്‌വിംഗ് എക്‌സ്-റേയിൽ മുകളിലും താഴെയുമുള്ള പിൻപല്ലുകൾ ഒരേ ചിത്രത്തിൽ കാണാം. നിങ്ങൾ ഒരു വിംഗ്-ആകൃതിയിലുള്ള ടാബിൽ കടിക്കുന്നു. പല്ലുകൾക്കിടയിലെ ക� & ബോൺ ലെവൽ പരിശോധിക്കാൻ ഇതാണ ഏറ്റവും നല്ലത്.',
      why: 'ദൃശ്യ പരിശോധനയിൽ കാണാൻ ബുദ്ധിമുട്ടുള്ള പ്രദേശങ്ങൾ ഇത് കാണിക്കുന്നു.',
      usually: 'ചവിട്ടുവരവ് ചെകപ്പുകളിൽ എടുക്കുന്നു, സാധാരണ വർഷത്തിൽ ഒരു തവണ.',
      aliases: ['ബൈറ്റ്‌വിംഗ്', 'ബൈറ്റ്‌വിംഗ് എക്‌സ്-റേ', 'ബൈറ്റ്‌വിംഗ് റേഡിയോഗ്രാഫ്', 'BW']
    },
    art: null
  },
  {
    id: 'periapical-xray',
    en: {
      term: 'Periapical x-ray',
      plain: 'X-ray of one or two teeth (root to crown)',
      what: 'A periapical x-ray shows the whole tooth from crown to root tip, plus the surrounding bone. It is used to check the root, abscesses, and bone around a specific tooth.',
      why: 'It gives a detailed view of a single tooth and its support.',
      usually: 'Taken when there is pain, swelling, or a specific tooth problem.',
      aliases: ['periapical', 'periapical x-ray', 'PA', 'periapical radiograph']
    },
    ml: {
      term: 'പെറിയാപിക്കൽ എക്‌സ്-റേ (Periapical x-ray)',
      plain: 'ഒന്ന് രണ്ട് പല്ലുകളുടെ എക്‌സ്-റേ (മൂലം മുതൽ കിരീടം വരെ)',
      what: 'പെറിയാപിക്കൽ എക്‌സ്-റേയിൽ പല്ല് മുഴുവൻ - കിരീടം മുതൽ മൂല പ്ലേയിന്റ് വരെ - এবং അതിനു ചുറ്റുള്ള അസ്ഥി കാണാം. ഇത് ഒരു നിശ്ചിത പല്ലിന്റെ മൂലം, അബ്സെസ്സുകൾ, അസ്ഥി എന്നിവ പരിശോധിക്കാൻ ഉപയോഗിക്കുന്നു.',
      why: 'ഒറ്റ പല്ലിനും അതിന്റെ പിന്തുണയ്ക്കും എന്ത് വिस्तൃത ദൃശ്യമേൽപ്പിക്കുന്നു.',
      usually: 'വേദന, വ്രണം, അല്ലെങ്കിൽ ഒരു നിശ്ചിത പല്ല് പ്രശ്നം ഉണ്ടായാല് എടുക്കുന്നു.',
      aliases: ['പെറിയാപിക്കൽ', 'പെറിയാപിക്കൽ എക്‌സ്-റേ', 'PA', 'പെറിയാപിക്കൽ റേഡിയോഗ്രാഫ്']
    },
    art: null
  },
  {
    id: 'opg',
    en: {
      term: 'OPG (Panoramic x-ray)',
      plain: 'One wide x-ray of the whole jaw',
      what: 'An OPG (orthopantomogram) is a single wide image showing all teeth, both jaws, sinuses, and jaw joints. The machine rotates around your head.',
      why: 'It gives an overview of everything: wisdom teeth, jaw bone, sinuses, joints, and overall dental development.',
      usually: 'Taken for braces planning, wisdom teeth, implants, or a full mouth overview.',
      aliases: ['OPG', 'panoramic x-ray', 'orthopantomogram', 'panorex', 'full mouth x-ray']
    },
    ml: {
      term: 'OPG (പാനൊറാമിക് എക്‌സ്-റേ)',
      plain: 'മുഴുവൻ തvivalയുടെ ഒരു വിശാല എക്‌സ്-റേ',
      what: 'OPG (ഓർത്തോപാന്റമോഗ്രാം) ഒരു একক വിശാല ചിത്രമാണ്, എല്ലാ പല്ലുകൾ, രണ്ട് തvivalകൾ, സൈനസുകൾ, തvival സന്ധികൾ എന്നിവ കാണിക്കുന്നു. മেশീൻ നിങ്ങളുടെ തലയുടെ ചുറ്റും സുരുളുന്നു.',
      why: 'എല്ലാത്തിനും ഒരു അവലോകനം നൽകുന്നു: വിസ്ഡം ടൂത്ത്, തvival അസ്ഥി, സൈനസുകൾ, സന്ധികൾ, സർവ്വাঙ്ഗ ഡെന്റൽ വികാസം.',
      usually: 'ബ്രേസ്സ് പ്ലാനിംഗ്, വിസ്ഡം ടൂത്ത്, ഇംപ്ലാന്റ്, അല്ലെങ്കിൽ ഫുൾ മൗത്ത് അവലോകനത്തിന് എടുക്കുന്നു.',
      aliases: ['OPG', 'പാനൊറാമിക് എക്‌സ്-റേ', 'ഓർത്തോപാന്റമോഗ്രാം', 'പാനൊറെക്സ്', 'ഫുൾ മൗത്ത് എക്‌സ്-റേ']
    },
    art: null
  }
];

// SVG Illustrations (inline, using currentColor & CSS variables)
const GLOSSARY_ART = {
  'tooth-layers': `<svg viewBox="0 0 200 200" role="img" aria-label="Tooth cross-section showing enamel, dentin, pulp, and root" style="width:100%;height:auto;max-width:200px"><defs><linearGradient id="enamelGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="var(--color-primary-light)"/><stop offset="100%" stop-color="var(--color-surface)"/></linearGradient><linearGradient id="dentinGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5e6c8"/><stop offset="100%" stop-color="#e8d4b0"/></linearGradient><linearGradient id="pulpGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f8c8c8"/><stop offset="100%" stop-color="#f0a0a0"/></linearGradient></defs><!-- Crown --><path d="M100 20 Q70 20 55 55 Q40 90 55 125 Q70 160 100 160 Q130 160 145 125 Q160 90 145 55 Q130 20 100 20" fill="url(#enamelGrad)" stroke="var(--color-primary-border)" stroke-width="1.5"/><!-- Dentin --><path d="M100 40 Q78 40 68 65 Q60 90 68 115 Q78 140 100 140 Q122 140 132 115 Q140 90 132 65 Q122 40 100 40" fill="url(#dentinGrad)"/><!-- Pulp chamber --><path d="M100 55 Q85 55 80 80 Q78 105 85 120 Q92 130 100 130 Q108 130 115 120 Q122 105 120 80 Q115 55 100 55" fill="url(#pulpGrad)"/><!-- Root canals --><path d="M85 130 Q85 150 82 170" stroke="#d08080" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M115 130 Q115 150 118 170" stroke="#d08080" stroke-width="3" fill="none" stroke-linecap="round"/><!-- Bone --><path d="M30 165 Q30 175 50 180 Q150 180 170 175 Q170 165 170 165" fill="var(--color-border)" opacity="0.3"/><text x="100" y="195" text-anchor="middle" font-size="10" fill="var(--color-text-muted)" font-family="system-ui">Enamel • Dentin • Pulp • Root canals • Bone</text></svg>`,

  'healthy-vs-decay': `<svg viewBox="0 0 400 200" role="img" aria-label="Healthy tooth vs decayed tooth comparison" style="width:100%;height:auto;max-width:400px"><defs><linearGradient id="healthyEnamel" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="var(--color-primary-light)"/><stop offset="100%" stop-color="var(--color-surface)"/></linearGradient><linearGradient id="healthyDentin" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5e6c8"/><stop offset="100%" stop-color="#e8d4b0"/></linearGradient><linearGradient id="decayEnamel" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe0e0"/><stop offset="100%" stop-color="#ffcccc"/></linearGradient><linearGradient id="decayDentin" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffd0b0"/><stop offset="100%" stop-color="#ffb880"/></linearGradient><linearGradient id="decayCaries" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ff8080"/><stop offset="100%" stop-color="#cc4040"/></linearGradient></defs><!-- Healthy tooth --><g transform="translate(40,20)"><path d="M60 10 Q30 10 15 45 Q5 80 15 115 Q30 150 60 150 Q90 150 105 115 Q115 80 105 45 Q90 10 60 10" fill="url(#healthyEnamel)" stroke="var(--color-primary-border)" stroke-width="1.5"/><path d="M60 30 Q42 30 32 55 Q24 80 32 105 Q42 130 60 130 Q78 130 88 105 Q96 80 88 55 Q78 30 60 30" fill="url(#healthyDentin)"/><path d="M60 45 Q48 45 43 70 Q41 95 48 110 Q55 120 60 120 Q65 120 72 110 Q79 95 77 70 Q73 45 60 45" fill="url(#pulpGrad)"/><text x="60" y="175" text-anchor="middle" font-size="11" fill="var(--color-success-text)" font-weight="600" font-family="system-ui">Healthy</text></g><!-- Decayed tooth --><g transform="translate(240,20)"><path d="M60 10 Q30 10 15 45 Q5 80 15 115 Q30 150 60 150 Q90 150 105 115 Q115 80 105 45 Q90 10 60 10" fill="url(#decayEnamel)" stroke="var(--color-primary-border)" stroke-width="1.5"/><path d="M60 30 Q42 30 32 55 Q24 80 32 105 Q42 130 60 130 Q78 130 88 105 Q96 80 88 55 Q78 30 60 30" fill="url(#decayDentin)"/><path d="M60 45 Q48 45 43 70 Q41 95 48 110 Q55 120 60 120 Q65 120 72 110 Q79 95 77 70 Q73 45 60 45" fill="url(#pulpGrad)"/><!-- Caries lesion --><ellipse cx="85" cy="65" rx="18" ry="14" fill="url(#decayCaries)" opacity="0.9"/><ellipse cx="85" cy="65" rx="12" ry="9" fill="#cc3030" opacity="0.8"/><text x="60" y="175" text-anchor="middle" font-size="11" fill="var(--color-error-text)" font-weight="600" font-family="system-ui">With caries</text></g></svg>`,

  'bone-level': `<svg viewBox="0 0 300 220" role="img" aria-label="Bone level around tooth root - healthy vs bone loss" style="width:100%;height:auto;max-width:300px"><defs><linearGradient id="boneGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f0f0f0"/><stop offset="100%" stop-color="#e0e0e0"/></linearGradient><linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="var(--color-primary-light)"/><stop offset="100%" stop-color="var(--color-surface)"/></linearGradient><linearGradient id="dentinGrad2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5e6c8"/><stop offset="100%" stop-color="#e8d4b0"/></linearGradient></defs><!-- Healthy side --><g transform="translate(30,20)"><!-- Bone --><path d="M20 40 Q20 30 40 25 Q80 20 120 25 Q140 30 140 40 L140 160 L20 160 Z" fill="url(#boneGrad)" stroke="var(--color-primary-border)" stroke-width="1"/><text x="80" y="35" text-anchor="middle" font-size="10" fill="var(--color-text-muted)" font-family="system-ui">Healthy bone level</text><!-- Tooth --><path d="M70 30 Q55 30 45 55 Q40 80 45 105 Q55 130 70 130 Q85 130 95 105 Q100 80 95 55 Q85 30 70 30" fill="url(#toothGrad)" stroke="var(--color-primary-border)" stroke-width="1.5"/><path d="M70 45 Q60 45 55 65 Q52 85 55 105 Q60 120 70 120 Q80 120 85 105 Q88 85 85 65 Q80 45 70 45" fill="url(#dentinGrad2)"/><path d="M70 55 Q63 55 60 75 Q59 95 63 108 Q68 115 70 115 Q72 115 75 108 Q76 95 75 75 Q72 55 70 55" fill="url(#pulpGrad)"/><path d="M60 130 Q60 145 58 160" stroke="#d08080" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M80 130 Q80 145 82 160" stroke="#d08080" stroke-width="2" fill="none" stroke-linecap="round"/></g><!-- Bone loss side --><g transform="translate(180,20)"><!-- Bone (lower) --><path d="M20 80 Q20 70 40 65 Q80 60 120 65 Q140 70 140 80 L140 160 L20 160 Z" fill="url(#boneGrad)" stroke="var(--color-primary-border)" stroke-width="1"/><path d="M20 40 Q20 30 40 25 Q80 20 120 25 Q140 30 140 40 L140 80 L20 80 Z" fill="var(--color-error-bg)" opacity="0.3"/><text x="80" y="35" text-anchor="middle" font-size="10" fill="var(--color-text-muted)" font-family="system-ui">Healthy level</text><text x="80" y="75" text-anchor="middle" font-size="10" fill="var(--color-error-text)" font-family="system-ui">Bone loss</text><!-- Tooth --><path d="M70 30 Q55 30 45 55 Q40 80 45 105 Q55 130 70 130 Q85 130 95 105 Q100 80 95 55 Q85 30 70 30" fill="url(#toothGrad)" stroke="var(--color-primary-border)" stroke-width="1.5"/><path d="M70 45 Q60 45 55 65 Q52 85 55 105 Q60 120 70 120 Q80 120 85 105 Q88 85 85 65 Q80 45 70 45" fill="url(#dentinGrad2)"/><path d="M70 55 Q63 55 60 75 Q59 95 63 108 Q68 115 70 115 Q72 115 75 108 Q76 95 75 75 Q72 55 70 55" fill="url(#pulpGrad)"/><path d="M60 130 Q60 145 58 160" stroke="#d08080" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M80 130 Q80 145 82 160" stroke="#d08080" stroke-width="2" fill="none" stroke-linecap="round"/></g></svg>`,

  'implant': `<svg viewBox="0 0 200 280" role="img" aria-label="Dental implant with crown, abutment, implant body in jaw bone" style="width:100%;height:auto;max-width:200px"><defs><linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="var(--color-primary-light)"/><stop offset="100%" stop-color="var(--color-surface)"/></linearGradient><linearGradient id="implantGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#b0b0b0"/><stop offset="50%" stop-color="#e0e0e0"/><stop offset="100%" stop-color="#b0b0b0"/></linearGradient><linearGradient id="boneGrad2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f0f0f0"/><stop offset="100%" stop-color="#e0e0e0"/></linearGradient></defs><!-- Crown --><path d="M100 30 Q70 30 55 65 Q40 100 55 135 Q70 170 100 170 Q130 170 145 135 Q160 100 145 65 Q130 30 100 30" fill="url(#crownGrad)" stroke="var(--color-primary-border)" stroke-width="1.5"/><!-- Abutment --><rect x="85" y="170" width="30" height="25" rx="2" fill="url(#implantGrad)" stroke="#999" stroke-width="1"/><!-- Implant body --><path d="M82 195 L82 260 Q82 268 88 270 L112 270 Q118 268 118 260 L118 195" fill="url(#implantGrad)" stroke="#999" stroke-width="1.5"/><!-- Threads on implant --><g stroke="#999" stroke-width="0.8"><line x1="82" y1="205" x2="118" y2="205"/><line x1="82" y1="215" x2="118" y2="215"/><line x1="82" y1="225" x2="118" y2="225"/><line x1="82" y1="235" x2="118" y2="235"/><line x1="82" y1="245" x2="118" y2="245"/><line x1="82" y1="255" x2="118" y2="255"/></g><!-- Bone --><path d="M20 195 Q20 185 40 180 Q160 180 180 185 Q180 195 180 195 L180 270 L20 270 Z" fill="url(#boneGrad2)" stroke="var(--color-primary-border)" stroke-width="1"/><text x="100" y="290" text-anchor="middle" font-size="10" fill="var(--color-text-muted)" font-family="system-ui">Crown • Abutment • Implant (titanium) • Bone</text></svg>`
};

// Export for use in app.js
window.GLOSSARY = GLOSSARY;
window.GLOSSARY_ART = GLOSSARY_ART;