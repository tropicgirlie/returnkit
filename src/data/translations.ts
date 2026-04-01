export type Lang = 'en' | 'ga';

export const translations: Record<string, Record<Lang, string>> = {
  // Navigation
  'nav.calculator': { en: 'Calculator', ga: 'Áireamhán' },
  'nav.actions': { en: 'Actions', ga: 'Gníomhartha' },
  'nav.emails': { en: 'Emails', ga: 'Ríomhphoist' },
  'nav.creches': { en: 'Crèches', ga: 'Naíolanna' },
  'nav.links': { en: 'Links', ga: 'Naisc' },
  'nav.manifesto': { en: 'Manifesto', ga: 'Forógra' },
  'nav.facebook': { en: 'Facebook Group', ga: 'Grúpa Facebook' },

  // Hero
  'hero.title': { en: 'The Real Cost of Returning to Work', ga: 'Fíorchostas an Fhillte ar Obair' },
  'hero.question': { en: 'Can you afford to go back?', ga: 'An féidir leat filleadh?' },
  'hero.subtitle': {
    en: "See what you'd actually keep after tax and childcare in Dublin. Accurate 2025 Irish tax, NCS subsidies, and ECCE included.",
    ga: 'Féach cad a choimeádfá i ndáiríre tar éis cánach agus cúram leanaí i mBaile Átha Cliath. Cáin chruinn na hÉireann 2025, fóirdheontais NCS, agus ECCE san áireamh.'
  },
  'hero.startCalc': { en: 'Start Calculator', ga: 'Tosaigh an tÁireamhán' },
  'hero.maternity': { en: 'How maternity leave works', ga: 'Conas a oibríonn saoire mháithreachais' },
  'hero.stat1': { en: 'of take-home consumed by childcare', ga: 'den phá baile caite ar chúram leanaí' },
  'hero.stat2': { en: 'typical crèche waiting list', ga: 'liosta feithimh tipiciúil naíolainne' },
  'hero.stat3': { en: 'no login, no fees, forever', ga: 'gan logáil isteach, gan táillí, go deo' },
  'hero.stat3value': { en: 'Free', ga: 'Saor in Aisce' },

  // Calculator
  'calc.yourIncome': { en: 'Your Income', ga: 'D\'Ioncam' },
  'calc.household': { en: 'Household', ga: 'Teaghlach' },
  'calc.single': { en: 'Single', ga: 'Singil' },
  'calc.marriedOne': { en: 'Married (one income)', ga: 'Pósta (ioncam amháin)' },
  'calc.marriedTwo': { en: 'Married (two incomes)', ga: 'Pósta (dhá ioncam)' },
  'calc.grossSalary': { en: 'Gross Salary', ga: 'Olltuarastal' },
  'calc.yourGross': { en: 'Your Gross', ga: 'D\'Ollioncam' },
  'calc.partnerGross': { en: "Partner's Gross", ga: 'Ollioncam do Pháirtí' },
  'calc.annual': { en: 'Annual', ga: 'In aghaidh na bliana' },

  // Childcare setup
  'calc.childcareSetup': { en: 'Childcare Setup', ga: 'Socrú Cúram Leanaí' },
  'calc.children': { en: 'Children', ga: 'Leanaí' },
  'calc.youngestAge': { en: 'Youngest Age', ga: 'Aois is Óige' },
  'calc.under1': { en: 'Under 1', ga: 'Faoi 1' },
  'calc.year1': { en: '1 year', ga: '1 bhliain' },
  'calc.years2': { en: '2 years', ga: '2 bhliain' },
  'calc.years3ecce': { en: '3+ years (ECCE eligible)', ga: '3+ bliain (incháilithe ECCE)' },
  'calc.providerType': { en: 'Provider Type', ga: 'Cineál Soláthraí' },
  'calc.registered': { en: 'Registered', ga: 'Cláraithe' },
  'calc.unregistered': { en: 'Unregistered', ga: 'Neamhchláraithe' },
  'calc.nanny': { en: 'Nanny', ga: 'Feighlí' },
  'calc.hoursWeek': { en: 'Hours/Week', ga: 'Uaireanta/Seachtain' },
  'calc.ncsMax': { en: 'NCS max: 45hrs', ga: 'NCS uasmhéid: 45u' },
  'calc.costMonth': { en: 'Cost/Month', ga: 'Costas/Mí' },
  'calc.perChild': { en: 'Per child', ga: 'In aghaidh an linbh' },

  // Results
  'results.whatYouKeep': { en: "What you'd keep", ga: 'Cad a choimeádfá' },
  'results.strong': { en: 'Strong', ga: 'Láidir' },
  'results.moderate': { en: 'Moderate', ga: 'Measartha' },
  'results.weak': { en: 'Weak', ga: 'Lag' },
  'results.perMonth': { en: 'per month after tax + childcare', ga: 'sa mhí tar éis cánach + cúram leanaí' },
  'results.pctKept': { en: '% Kept', ga: '% Coinnithe' },
  'results.eurHour': { en: '€/Hour', ga: '€/Uair' },
  'results.belowMinWage': { en: 'Below minimum wage', ga: 'Faoin íosphá' },
  'results.grossPayGoes': { en: 'Where your gross pay goes', ga: 'Cá dtéann d\'ollphá' },
  'results.youKeep': { en: 'You keep', ga: 'Coinníonn tú' },
  'results.childcare': { en: 'Childcare', ga: 'Cúram Leanaí' },
  'results.tax': { en: 'Tax', ga: 'Cáin' },
  'results.showBreakdown': { en: 'Show full breakdown', ga: 'Taispeáin miondealú iomlán' },
  'results.hideBreakdown': { en: 'Hide full breakdown', ga: 'Folaigh miondealú iomlán' },
  'results.grossSalary': { en: 'Gross salary', ga: 'Olltuarastal' },
  'results.incomeTax': { en: '- Income Tax', ga: '- Cáin Ioncaim' },
  'results.netSalary': { en: 'Net salary', ga: 'Glantuarastal' },
  'results.childcareGross': { en: '- Childcare (gross)', ga: '- Cúram leanaí (ollfhigiúr)' },
  'results.ncsSubsidy': { en: '+ NCS subsidy', ga: '+ Fóirdheontas NCS' },
  'results.eccePreschool': { en: '+ ECCE (free preschool)', ga: '+ ECCE (réamhscoil saor in aisce)' },
  'results.childcareNet': { en: '- Childcare (net)', ga: '- Cúram leanaí (glan)' },
  'results.whatYouKeepLabel': { en: 'What you keep', ga: 'A choimeádann tú' },
  'results.ncsSubsidyLabel': { en: 'NCS Subsidy', ga: 'Fóirdheontas NCS' },
  'results.ecceLabel': { en: 'ECCE Free Preschool', ga: 'Réamhscoil Saor in Aisce ECCE' },
  'results.ecceDesc': { en: '15 free hours/week for children aged 2y8m–5y6m (term-time)', ga: '15 uair an chloig saor in aisce/seachtain do leanaí 2bl 8m–5bl 6m (téarma-am)' },
  'results.noNcs': { en: 'No NCS subsidy available', ga: 'Níl aon fhóirdheontas NCS ar fáil' },
  'results.noNcsDesc': { en: "Unregistered providers don't qualify for NCS. You're paying the full cost. Consider registered alternatives.", ga: 'Ní cháilíonn soláthraithe neamhchláraithe do NCS. Tá an costas iomlán á íoc agat. Smaoinigh ar roghanna cláraithe eile.' },
  'results.shareResult': { en: 'Share Result', ga: 'Roinn an Toradh' },
  'results.compareScenarios': { en: 'Compare Scenarios', ga: 'Cuir Cásanna i gComparáid' },

  // Scenario comparison
  'scenario.title': { en: 'Full-time vs Part-time vs Not Returning', ga: 'Lánaimseartha vs Páirtaimseartha vs Gan Filleadh' },
  'scenario.subtitle': { en: 'Based on your current inputs. Part-time assumes 3 days/week (60%).', ga: 'Bunaithe ar do chuid ionchur reatha. Glacann páirtaimseartha le 3 lá/seachtain (60%).' },
  'scenario.fulltime': { en: 'Full-time', ga: 'Lánaimseartha' },
  'scenario.parttime': { en: 'Part-time (3 days)', ga: 'Páirtaimseartha (3 lá)' },
  'scenario.notReturning': { en: 'Not returning', ga: 'Gan filleadh' },
  'scenario.best': { en: 'Best', ga: 'Is Fearr' },
  'scenario.note': {
    en: "This doesn't factor in pension contributions, career progression, or the compounding cost of career gaps. Even a financially \"worse\" scenario may be better long-term.",
    ga: 'Ní chuireann sé seo ranníocaíochtaí pinsin, dul chun cinn gairme, ná costas carnach bearnaí gairme san áireamh. Fiú cás atá "níos measa" ó thaobh airgeadais de, d\'fhéadfadh sé a bheith níos fearr san fhadtéarma.'
  },

  // Calculator footer
  'calc.footer': { en: 'Calculations based on Budget 2025 • Not financial advice • ECCE estimates averaged over 12 months', ga: 'Ríomhanna bunaithe ar Bhuiséad 2025 • Ní comhairle airgeadais é • Meastacháin ECCE meánaithe thar 12 mhí' },

  // Alternatives section
  'alt.title': { en: "What if you can't get a place?", ga: 'Cad a tharlóidh mura féidir leat áit a fháil?' },
  'alt.subtitle': { en: 'Waiting lists are 2-3 years. Here are alternatives real Dublin parents actually use.', ga: 'Tá liostaí feithimh 2-3 bliana. Seo roghanna eile a úsáideann tuismitheoirí i mBaile Átha Cliath.' },
  'alt.childminder': { en: 'Childminder', ga: 'Feighlí Leanaí' },
  'alt.childminderDesc': { en: "Individual carer in their home. Often more flexible hours. Based on minimum wage (€14.15/hr). Ask if they're Tusla-registered to qualify for NCS.", ga: 'Cúramóir aonair ina dteach féin. Uaireanta níos solúbtha go minic. Bunaithe ar an íosphá (€14.15/u). Fiafraigh an bhfuil siad cláraithe le Tusla chun cáiliú do NCS.' },
  'alt.auPair': { en: 'Au pair (domestic worker)', ga: 'Au pair (oibrí baile)' },
  'alt.auPairDesc': { en: 'Live-in carer from abroad. Legally classified as a domestic worker in Ireland, entitled to minimum wage (€14.15/hr), annual leave, and full employment rights. You also provide room and board.', ga: 'Cúramóir cónaitheach ón iasacht. Rangaithe go dlíthiúil mar oibrí baile in Éirinn, i dteideal an íosphá (€14.15/u), saoire bhliantúil, agus cearta fostaíochta iomlána. Soláthraíonn tú lóistín agus bia freisin.' },
  'alt.grandparents': { en: 'Grandparents / family', ga: 'Seantuismitheoirí / teaghlach' },
  'alt.grandparentsDesc': { en: "The most common \"backup plan\" in Ireland. Free but comes with emotional complexity and isn't always available.", ga: 'An "plean cúltaca" is coitianta in Éirinn. Saor in aisce ach tagann castacht mhothúchánach leis agus ní bhíonn sé ar fáil i gcónaí.' },
  'alt.partTime': { en: 'Part-time / job sharing', ga: 'Páirtaimseartha / comhroinnt poist' },
  'alt.partTimeDesc': { en: 'Reduce hours to 3 days/week. Childcare costs drop proportionally. Use the Compare Scenarios tool above.', ga: 'Laghdaigh uaireanta go 3 lá/seachtain. Titeann costais chúram leanaí go comhréireach. Úsáid an uirlis Cásanna i gComparáid thuas.' },
  'alt.toddlerGroups': { en: 'Parent & toddler groups', ga: 'Grúpaí tuismitheoirí & tachrán' },
  'alt.toddlerGroupsDesc': { en: 'Not a childcare solution, but reduces isolation and helps build a local network. Community centre sessions from €2, dedicated paid classes up to €20+ per session.', ga: 'Ní réiteach cúram leanaí é, ach laghdaíonn sé uaigneas agus cuidíonn sé le líonra áitiúil a thógáil. Seisiúin ionaid phobail ó €2, ranganna íoctha tiomnaithe suas le €20+ an seisiún.' },
  'alt.nannyShare': { en: 'Nanny share', ga: 'Comhroinnt feighlí' },
  'alt.nannyShareDesc': { en: 'Split a nanny with another family. A full-time nanny costs approx. €2,240/mo (€14.15/hr minimum wage), split between two families. Find partners through local parent groups.', ga: 'Roinn feighlí le teaghlach eile. Cosnaíonn feighlí lánaimseartha thart ar €2,240/mí (€14.15/u íosphá), roinnte idir dhá theaghlach. Aimsigh páirtithe trí ghrúpaí tuismitheoirí áitiúla.' },
  'alt.weeks': { en: 'Weeks', ga: 'Seachtainí' },
  'alt.immediate': { en: 'Immediate', ga: 'Láithreach' },
  'alt.free': { en: 'Free', ga: 'Saor in Aisce' },
  'alt.reducedSalary': { en: 'Reduced salary', ga: 'Tuarastal laghdaithe' },
  'alt.employerDependent': { en: 'Employer-dependent', ga: 'Ag brath ar an bhfostóir' },

  // Elephant callout
  'alt.elephantTitle': { en: 'The elephant in the room', ga: 'An eilifint sa seomra' },
  'alt.elephantDesc': {
    en: "At €14.15/hr minimum wage, a full-time nanny costs over €2,400/mo before employer PRSI. A childminder charging legal rates is often out of reach. The result: many families are quietly pushed towards informal, cash-in-hand arrangements. This is not a parenting failure. It is a policy failure. When compliance is unaffordable, the system itself creates the shadow economy it claims to regulate.",
    ga: 'Ag €14.15/u íosphá, cosnaíonn feighlí lánaimseartha os cionn €2,400/mí roimh ÁSPC an fhostóra. Is minic nach féidir le teaghlaigh íoc as feighlí leanaí ag rátaí dlíthiúla. An toradh: brúitear go ciúin go leor teaghlach i dtreo socruithe neamhfhoirmiúla, airgead tirim sa lámh. Ní teip tuismitheoireachta é seo. Is teip bheartais é. Nuair nach bhfuil comhlíonadh inacmhainne, cruthaíonn an córas féin an geilleagar scáthach a mhaíonn sé a rialáil.'
  },

  // Actions
  'actions.title': { en: 'What to Do Right Now', ga: 'Cad ba Cheart a Dhéanamh Anois' },
  'actions.completed': { en: 'completed', ga: 'críochnaithe' },
  'actions.of': { en: 'of', ga: 'as' },
  'actions.today': { en: 'Today', ga: 'Inniu' },
  'actions.thisWeek': { en: 'This Week', ga: 'An tSeachtain Seo' },
  'actions.thisMonth': { en: 'This Month', ga: 'An Mhí Seo' },
  'actions.checkNcs': { en: 'Check NCS calculator to confirm your subsidy rate', ga: 'Seiceáil áireamhán NCS chun do ráta fóirdheontais a dhearbhú' },
  'actions.joinWaiting': { en: 'Join waiting lists for 3-5 registered crèches near you', ga: 'Cuir d\'ainm ar liostaí feithimh do 3-5 naíolann cláraithe in aice leat' },
  'actions.saveSummary': { en: 'Share your calculator result with your partner/family', ga: 'Roinn toradh an áireamháin le do pháirtí/teaghlach' },
  'actions.contactLocal': { en: 'Contact local parent groups for provider recommendations', ga: 'Déan teagmháil le grúpaí tuismitheoirí áitiúla le haghaidh moltaí soláthraí' },
  'actions.visitCreches': { en: 'Visit 2-3 crèches to assess quality and wait times', ga: 'Tabhair cuairt ar 2-3 naíolann chun cáilíocht agus amanna feithimh a mheas' },
  'actions.researchChildminders': { en: 'Research childminders and ask about NCS registration', ga: 'Déan taighde ar fheighlíthe leanaí agus fiafraigh faoi chlárú NCS' },
  'actions.budgetReview': { en: 'Review your family budget based on these costs', ga: 'Déan athbhreithniú ar bhuiséad do theaghlaigh bunaithe ar na costais seo' },
  'actions.employerFlex': { en: 'Discuss flexible working with your employer', ga: 'Pléigh obair sholúbtha le d\'fhostóir' },
  'actions.backupPlan': { en: 'Create backup plan (childminder, nanny share, family, job-sharing)', ga: 'Cruthaigh plean cúltaca (feighlí leanaí, comhroinnt feighlí, teaghlach, comhroinnt poist)' },

  // Emails
  'emails.title': { en: 'Email Scripts', ga: 'Scripteanna Ríomhphoist' },
  'emails.subtitle': { en: 'Copy-paste templates for contacting crèches. Edit the [brackets] with your details.', ga: 'Teimpléid gearr-ghreamaigh chun teagmháil a dhéanamh le naíolanna. Cuir do shonraí féin in áit na [lúibíní].' },
  'emails.waitlist': { en: 'Waiting List Registration', ga: 'Clárú Liosta Feithimh' },
  'emails.subsidy': { en: 'NCS Subsidy Inquiry', ga: 'Fiosrú Fóirdheontais NCS' },
  'emails.followUp': { en: 'Follow-Up Request', ga: 'Iarratas Leantach' },
  'emails.copy': { en: 'Copy', ga: 'Cóipeáil' },
  'emails.copied': { en: 'Email copied to clipboard', ga: 'Ríomhphost cóipeáilte go dtí an ghearrthaisce' },

  // Email content
  'emails.waitlistBody': {
    en: `Subject: Waiting List Registration Request

Dear [Crèche Name],

I am writing to register my child for your waiting list.

Child's name: [Child's name]
Date of birth: [DOB]
Anticipated start date: [Date]
Required days: Monday to Friday
Required hours: Full-time (8:00-18:00)

I would appreciate confirmation of this registration and an estimate of current waiting times.

Thank you,
[Your name]
[Your phone]
[Your email]`,
    ga: `Ábhar: Iarratas Clárúcháin ar Liosta Feithimh

A [Ainm na Naíolainne] a chara,

Táim ag scríobh chun mo leanbh a chlárú ar do liosta feithimh.

Ainm an linbh: [Ainm an linbh]
Dáta breithe: [Dáta breithe]
Dáta tosaithe measta: [Dáta]
Laethanta riachtanacha: Luan go hAoine
Uaireanta riachtanacha: Lánaimseartha (8:00-18:00)

Bheinn buíoch as dearbhú an chlárúcháin seo agus meastachán ar amanna feithimh reatha.

Go raibh maith agat,
[D'ainm]
[D'uimhir ghutháin]
[Do ríomhphost]`
  },
  'emails.subsidyBody': {
    en: `Subject: NCS Subsidy Information Request

Dear [Crèche Name],

I am currently on your waiting list for [anticipated start date] and would like to confirm your participation in the National Childcare Scheme.

Could you please confirm:
- You are a registered NCS provider
- The process for applying for subsidy through your crèche
- Any additional paperwork required

Thank you,
[Your name]`,
    ga: `Ábhar: Iarratas ar Eolas Fóirdheontais NCS

A [Ainm na Naíolainne] a chara,

Táim ar do liosta feithimh faoi láthair do [dáta tosaithe measta] agus ba mhaith liom do rannpháirtíocht sa Scéim Náisiúnta Cúram Leanaí a dhearbhú.

An féidir leat a dhearbhú le do thoil:
- Go bhfuil tú i do sholáthraí cláraithe NCS
- An próiseas chun iarratas a dhéanamh ar fhóirdheontas tríd do naíolann
- Aon pháipéarachas breise atá ag teastáil

Go raibh maith agat,
[D'ainm]`
  },
  'emails.followUpBody': {
    en: `Subject: Waiting List Status Update Request

Dear [Crèche Name],

I registered for your waiting list on [date] for a start date of [anticipated date].

Could you please provide an update on:
- Current position on waiting list
- Estimated waiting time
- Likelihood of a place by [date]

This information will help me make alternative arrangements if needed.

Thank you,
[Your name]`,
    ga: `Ábhar: Iarratas ar Nuashonrú Stádas Liosta Feithimh

A [Ainm na Naíolainne] a chara,

Chláraigh mé ar do liosta feithimh ar [dáta] le haghaidh dáta tosaithe [dáta measta].

An féidir leat nuashonrú a chur ar fáil le do thoil ar:
- Suíomh reatha ar an liosta feithimh
- Am feithimh measta
- Dóchúlacht áite faoi [dáta]

Cabhróidh an t-eolas seo liom socruithe malartacha a dhéanamh más gá.

Go raibh maith agat,
[D'ainm]`
  },

  // Directory
  'dir.title': { en: 'Find Crèches Near You', ga: 'Aimsigh Naíolanna in Aice Leat' },
  'dir.subtitle': { en: 'Community-maintained directory covering Dublin, Kildare, Meath & Wicklow. Estimated wait times and openings.', ga: 'Eolaire pobalmhaoinithe a chlúdaíonn Baile Átha Cliath, Cill Dara, An Mhí & Cill Mhantáin. Amanna feithimh measta agus oscailtí.' },

  // Links
  'links.title': { en: 'Useful Links', ga: 'Naisc Úsáideacha' },
  'links.subtitle': { en: 'Official resources for childcare, subsidies, and support', ga: 'Acmhainní oifigiúla do chúram leanaí, fóirdheontais, agus tacaíocht' },
  'links.govSubsidies': { en: 'Government & Subsidies', ga: 'Rialtas & Fóirdheontais' },
  'links.childcareServices': { en: 'Childcare Services', ga: 'Seirbhísí Cúram Leanaí' },
  'links.supportAdvocacy': { en: 'Support & Advocacy', ga: 'Tacaíocht & Abhcóideacht' },
  'links.employmentRights': { en: 'Employment Rights', ga: 'Cearta Fostaíochta' },

  // Link descriptions
  'links.ncsTitle': { en: 'National Childcare Scheme', ga: 'An Scéim Náisiúnta Cúram Leanaí' },
  'links.ncsDesc': { en: 'Apply for NCS subsidies and check eligibility', ga: 'Déan iarratas ar fhóirdheontais NCS agus seiceáil incháilitheacht' },
  'links.coreFundingTitle': { en: 'Core Funding Information', ga: 'Eolas Maoinithe Lárnaigh' },
  'links.coreFundingDesc': { en: 'Fee caps and registered childcare providers', ga: 'Uasteorainneacha táillí agus soláthraithe cúram leanaí cláraithe' },
  'links.revenueTitle': { en: 'Revenue Tax Calculator', ga: 'Áireamhán Cánach na gCoimisinéirí Ioncaim' },
  'links.revenueDesc': { en: 'Calculate income tax, USC, and PRSI', ga: 'Ríomh cáin ioncaim, MSU, agus ÁSPC' },
  'links.citizensTitle': { en: 'Citizens Information', ga: 'Faisnéis do Shaoránaigh' },
  'links.citizensDesc': { en: 'Comprehensive guide to childcare supports', ga: 'Treoir chuimsitheach do thacaíochtaí cúram leanaí' },
  'links.tuslaTitle': { en: 'Tusla Early Years', ga: 'Tusla Luathbhlianta' },
  'links.tuslaDesc': { en: 'Childcare regulation and childminder registration', ga: 'Rialáil cúram leanaí agus clárú feighlíthe leanaí' },
  'links.pobalTitle': { en: 'Pobal Early Childhood', ga: 'Pobal Luathóige' },
  'links.pobalDesc': { en: 'Childcare programs and provider directory', ga: 'Cláir chúram leanaí agus eolaire soláthraithe' },
  'links.barnardosTitle': { en: 'Barnardos Early Years', ga: 'Barnardos Luathbhlianta' },
  'links.barnardosDesc': { en: 'Community childcare services and support', ga: 'Seirbhísí cúram leanaí pobail agus tacaíocht' },
  'links.cccTitle': { en: 'City & County Childcare', ga: 'Cúram Leanaí Cathrach & Contae' },
  'links.cccDesc': { en: 'Local childcare information and resources', ga: 'Eolas áitiúil cúram leanaí agus acmhainní' },
  'links.parentlineTitle': { en: 'Parentline', ga: 'Líne na dTuismitheoirí' },
  'links.parentlineDesc': { en: 'Free helpline for parents', ga: 'Líne chabhrach saor in aisce do thuismitheoirí' },
  'links.treoirTitle': { en: 'Treoir', ga: 'Treoir' },
  'links.treoirDesc': { en: 'Info for unmarried parents', ga: 'Eolas do thuismitheoirí neamhphósta' },
  'links.oneFamilyTitle': { en: 'One Family', ga: 'One Family' },
  'links.oneFamilyDesc': { en: 'One-parent family support', ga: 'Tacaíocht do theaghlaigh aontuismitheora' },
  'links.startStrongTitle': { en: 'Start Strong', ga: 'Start Strong' },
  'links.startStrongDesc': { en: 'Childcare policy advocacy', ga: 'Abhcóideacht beartas cúram leanaí' },
  'links.wrcTitle': { en: 'WRC Family Leave', ga: 'Saoire Teaghlaigh WRC' },
  'links.wrcDesc': { en: 'Maternity, paternity, parental leave', ga: 'Saoire mháithreachais, atharthachta, tuismitheoireachta' },
  'links.parentsLeaveTitle': { en: "Parent's Leave", ga: 'Saoire Tuismitheora' },
  'links.parentsLeaveDesc': { en: '9 weeks paid parental leave', ga: '9 seachtaine saoire tuismitheoireachta íoctha' },
  'links.workLifeTitle': { en: 'Work Life Balance Act', ga: 'Acht um Chothromaíocht Oibre is Saoil' },
  'links.workLifeDesc': { en: 'Right to request flexible work', ga: 'Ceart obair sholúbtha a iarraidh' },
  'links.ictuTitle': { en: 'ICTU Working Family', ga: 'ICTU Teaghlach Oibre' },
  'links.ictuDesc': { en: 'Trade union parent support', ga: 'Tacaíocht ceardchumann do thuismitheoirí' },

  // Manifesto
  'manifesto.quoteText': { en: '"Children are not a distraction from more important work. They are the most important work."', ga: '"Ní cur isteach ón obair níos tábhachtaí iad leanaí. Is iad an obair is tábhachtaí."' },
  'manifesto.title': { en: 'Why we built this', ga: 'Cén fáth ar thógamar é seo' },
  'manifesto.subtitle': { en: 'An open letter from the parents behind ReturnKit', ga: 'Litir oscailte ó na tuismitheoirí taobh thiar de ReturnKit' },
  'manifesto.p1': {
    en: "We built ReturnKit because we went through it. The spreadsheets at 2am. The calls to crèches that never called back. The conversation with our partners where the numbers just didn't add up.",
    ga: 'Thógamar ReturnKit mar gur chuamar tríd. Na scarbhileoga ag 2am. Na glaonna chuig naíolanna nár ghlaoigh ar ais riamh. An comhrá lenár bpáirtithe nuair nár tháinig na huimhreacha le chéile.'
  },
  'manifesto.p2': {
    en: "Ireland's childcare system puts the cost and risk on families. Fee caps help. Subsidies help. But after the NCS subsidy, many parents still face €200+ per week out of pocket, and that's <em>if</em> you can find a place at all.",
    ga: 'Cuireann córas cúram leanaí na hÉireann an costas agus an riosca ar theaghlaigh. Cabhraíonn uasteorainneacha táillí. Cabhraíonn fóirdheontais. Ach tar éis fóirdheontas NCS, tá €200+ sa tseachtain as póca fós ag go leor tuismitheoirí, agus sin <em>má</em> aimsíonn tú áit ar chor ar bith.'
  },
  'manifesto.p3': {
    en: "Affordability is meaningless without access. You can't budget around a 2-year waiting list.",
    ga: 'Níl aon mhaith le hinacmhainneacht gan rochtain. Ní féidir leat buiséad a dhéanamh thart ar liosta feithimh 2 bhliain.'
  },
  'manifesto.p4': {
    en: 'The burden falls disproportionately on women. Not by rule, but by structure. The "second earner" penalty is real, and it\'s overwhelmingly mothers who absorb it through reduced hours, career breaks, or leaving the workforce entirely.',
    ga: 'Titeann an t-ualach go díréireach ar mhná. Ní de réir rialach, ach de réir struchtúir. Tá pionós an "dara tuillteoir" fíor, agus is máithreacha go mór mór a ghlacann leis trí uaireanta laghdaithe, sosanna gairme, nó an lucht oibre a fhágáil ar fad.'
  },
  'manifesto.p5': {
    en: "We're not a company. There's no subscription, no investors, no data collection. Just parents who think other parents deserve clear numbers before making one of the biggest financial decisions of their lives.",
    ga: 'Ní cuideachta sinn. Níl aon síntiús, aon infheisteoirí, aon bhailiú sonraí. Tuismitheoirí atá ionainn a cheapann go bhfuil tuismitheoirí eile i dteideal uimhreacha soiléire sula ndéanann siad ceann de na cinntí airgeadais is mó ina saol.'
  },
  'manifesto.p6': {
    en: "We believe childcare is infrastructure. We're asking the government to treat it that way.",
    ga: 'Creidimid gur bonneagar é cúram leanaí. Táimid ag iarraidh ar an rialtas caitheamh leis mar sin.'
  },
  'manifesto.askingFor': { en: "What we're asking for", ga: 'Cad atá á iarraidh againn' },
  'manifesto.demand1': { en: 'A national real-time vacancy system so parents can see available places without calling 30 crèches.', ga: 'Córas náisiúnta folúntas fíor-ama ionas gur féidir le tuismitheoirí áiteanna ar fáil a fheiceáil gan glaoch ar 30 naíolann.' },
  'manifesto.demand2': { en: 'NCS subsidies that reflect the actual cost of care in Dublin, not a national average that leaves urban families short.', ga: 'Fóirdheontais NCS a léiríonn costas iarbhír an chúraim i mBaile Átha Cliath, ní meán náisiúnta a fhágann teaghlaigh uirbeacha gann.' },
  'manifesto.demand3': { en: "Enough places. Fee caps mean nothing if there's a 2-year queue. Build capacity first.", ga: 'Go leor áiteanna. Ní fiú dada uasteorainneacha táillí má tá scuaine 2 bhliain ann. Tóg acmhainneacht ar dtús.' },
  'manifesto.demand4': { en: "Pay childcare workers properly. You can't retain quality care on €13/hour. The staffing crisis is the capacity crisis.", ga: 'Íoc oibrithe cúram leanaí i gceart. Ní féidir cúram ar ardchaighdeán a choinneáil ar €13/uair. Is í an ghéarchéim foirne an ghéarchéim acmhainneachta.' },
  'manifesto.demand5': { en: 'Right to a childcare place from age 1. Germany, Denmark and Sweden guarantee this. Ireland has no legal entitlement to childcare at any age.', ga: 'Ceart ar áit chúram leanaí ó aois 1. Ráthaíonn an Ghearmáin, an Danmhairg agus an tSualainn é seo. Níl aon teidlíocht dhlíthiúil ar chúram leanaí ag aon aois in Éirinn.' },
  'manifesto.demand6': { en: 'Childcare facilities required in all new housing developments. A planning rule that costs the state nothing. Ireland builds thousands of homes with zero provision.', ga: 'Áiseanna cúram leanaí de dhíth i ngach forbairt tithíochta nua. Riail pleanála nach gcosnaíonn dada ar an stát. Tógann Éire na mílte teach gan aon soláthar.' },
  'manifesto.demand7': { en: 'Individualise the tax system to remove the second-earner penalty. Each person taxed independently, as in Nordic countries. ReturnKit shows exactly what this penalty costs.', ga: 'Córas cánach a aonánú chun deireadh a chur le pionós an dara tuillteora. Gach duine cánach go neamhspleách, mar atá sna tíortha Nordacha. Taispeánann ReturnKit go díreach cad a chosnaíonn an pionós seo.' },
  'manifesto.demand8': { en: 'Close the affordability gap that forces families off the books. When legal childcare costs €2,400/mo for a nanny or €1,200+ for a childminder, the system itself pushes families into informal, cash-in-hand arrangements. This is a policy failure, not a parenting failure.', ga: 'Dún an bhearna inacmhainneachta a bhrúnn teaghlaigh amach ón gcóras. Nuair a chosnaíonn cúram leanaí dlíthiúil €2,400/mí ar fheighlí nó €1,200+ ar fheighlí leanaí, brúnn an córas féin teaghlaigh i dtreo socruithe neamhfhoirmiúla, airgead tirim sa lámh. Is teip bheartais é seo, ní teip tuismitheoireachta.' },
  'manifesto.signCta': { en: 'These are our demands. Add your name.', ga: 'Seo iad ár n-éilimh. Cuir d\'ainm leis.' },
  'manifesto.signPetition': { en: 'Sign the petition', ga: 'Sínigh an achainí' },
  'manifesto.joinConversation': { en: 'Join the conversation', ga: 'Bí páirteach sa chomhrá' },
  'manifesto.sources': {
    en: 'Tax rates from revenue.ie • NCS from ncs.gov.ie • ECCE from gov.ie • Core Funding rates from gov.ie • Childminder registration from tusla.ie • Minimum wage (€14.15/hr) from gov.ie',
    ga: 'Rátaí cánach ó revenue.ie • NCS ó ncs.gov.ie • ECCE ó gov.ie • Rátaí Maoinithe Lárnaigh ó gov.ie • Clárú feighlíthe leanaí ó tusla.ie • Íosphá (€14.15/u) ó gov.ie'
  },

  // Footer
  'footer.tagline': { en: 'The real cost of returning to work', ga: 'Fíorchostas an fhillte ar obair' },
  'footer.builtBy': { en: 'March 2026 • Built by parents, for parents • Based on Budget 2025', ga: 'Márta 2026 • Tógtha ag tuismitheoirí, do thuismitheoirí • Bunaithe ar Bhuiséad 2025' },
  'footer.noData': { en: 'No data collected • No cookies • Open source', ga: 'Gan sonraí a bhailiú • Gan fianáin • Foinse oscailte' },
  'footer.admin': { en: 'Admin', ga: 'Riarachán' },

  // Misc
  'skip.toCalc': { en: 'Skip to calculator', ga: 'Léim go dtí an t-áireamhán' },
  'menu.open': { en: 'Open menu', ga: 'Oscail an roghchlár' },
  'menu.close': { en: 'Close menu', ga: 'Dún an roghchlár' },
  'share.copied': { en: 'Result copied to clipboard', ga: 'Toradh cóipeáilte go dtí an ghearrthaisce' },

  // Scenario descriptions
  'scenario.fulltimeDesc': { en: 'full childcare costs', ga: 'costais chúram leanaí iomlána' },
  'scenario.parttimeDesc': { en: 'reduced childcare costs', ga: 'costais chúram leanaí laghdaithe' },
  'scenario.notworkingDesc': { en: 'Stay home, no income, no childcare costs', ga: 'Fan sa bhaile, gan ioncam, gan costais chúram leanaí' },

  // Research Contribution
  'research.title': { en: 'Help improve maternal workforce research', ga: 'Cabhraigh le taighde ar lucht saothair máithreacha a fheabhsú' },
  'research.description': { 
    en: 'Your anonymized responses will be stored and used for aggregated research insights by MomOps to help policymakers and journalists understand the childcare crisis.',
    ga: 'Déanfar do chuid freagraí gan ainm a stóráil agus a úsáid le haghaidh léargais thaighde comhiomlánaithe ag MomOps chun cabhrú le lucht déanta beartas agus iriseoirí an ghéarchéim chúraim leanaí a thuiscint.'
  },
  'research.whatWeCollect': { en: 'What we collect:', ga: 'Cad a bhailímid:' },
  'research.salaryBand': { en: 'Salary band (not exact amount)', ga: 'Banda tuarastail (ní méid beacht)' },
  'research.costBand': { en: 'Childcare cost band (not exact amount)', ga: 'Banda costas cúraim leanaí (ní méid beacht)' },
  'research.industrySector': { en: 'Industry sector', ga: 'Earnáil tionscail' },
  'research.workArrangement': { en: 'Work arrangement (remote, hybrid, office)', ga: 'Socrú oibre (cianda, hibrideach, oifig)' },
  'research.returnStatus': { en: 'Return-to-work status', ga: 'Stádas fillte ar obair' },
  'research.region': { en: 'Region (Dublin area)', ga: 'Réigiún (limistéar Bhaile Átha Cliath)' },
  'research.noIdentifiable': { en: 'No names, emails, or identifiable information is collected.', ga: 'Ní bhailítear ainmneacha, ríomhphoist, nó faisnéis inaitheanta.' },
  'research.contributeBtn': { en: 'Contribute Anonymously', ga: 'Cuidigh go hAinmnitheach' },
  'research.skip': { en: 'Skip', ga: 'Léim' },
  'research.formTitle': { en: 'Quick research questions', ga: 'Ceisteanna taighde tapa' },
  'research.formSubtitle': { en: 'Just a few more details to help us understand the full picture', ga: 'Roinnt sonraí eile le cabhrú linn an pictiúr iomlán a thuiscint' },
  'research.industrySectorLabel': { en: 'Industry sector', ga: 'Earnáil tionscail' },
  'research.selectIndustry': { en: 'Select industry...', ga: 'Roghnaigh earnáil...' },
  'research.maternityLeaveLabel': { en: 'Maternity leave taken (weeks)', ga: 'Saoire mháithreachais (seachtainí)' },
  'research.returnToWorkLabel': { en: 'Return to work status', ga: 'Stádas fillte ar obair' },
  'research.workArrangementLabel': { en: 'Work arrangement', ga: 'Socrú oibre' },
  'research.required': { en: '*', ga: '*' },
  'research.submit': { en: 'Submit', ga: 'Cuir isteach' },
  'research.submitting': { en: 'Submitting...', ga: 'Á chur isteach...' },
  'research.cancel': { en: 'Cancel', ga: 'Cealaigh' },
  'research.thankYouTitle': { en: 'Thank you for contributing to the research', ga: 'Go raibh maith agat as cur leis an taighde' },
  'research.thankYouDesc': { 
    en: 'Your anonymized data will help MomOps build evidence for policy change and support mothers navigating the return-to-work decision.',
    ga: 'Cabhróidh do chuid sonraí gan ainm le MomOps fianaise a thógáil le haghaidh athrú beartais agus tacaíocht a thabhairt do mháithreacha atá ag déanamh an chinneadh fillte ar obair.'
  },
  'research.recorded': { en: 'Your response has been recorded', ga: 'Tá do fhreagra taifeadta' },
  'research.errorRequired': { en: 'Please answer all required questions', ga: 'Freagair gach ceist riachtanach le do thoil' },
  'research.errorFailed': { en: 'Failed to submit. Please try again.', ga: 'Theip ar an gcur isteach. Bain triail eile as le do thoil.' },
  
  // Industry sectors
  'industry.technology': { en: 'Technology', ga: 'Teicneolaíocht' },
  'industry.finance': { en: 'Finance', ga: 'Airgeadas' },
  'industry.healthcare': { en: 'Healthcare', ga: 'Cúram Sláinte' },
  'industry.education': { en: 'Education', ga: 'Oideachas' },
  'industry.legal': { en: 'Legal', ga: 'Dlíthiúil' },
  'industry.publicSector': { en: 'Public Sector', ga: 'An Earnáil Phoiblí' },
  'industry.retail': { en: 'Retail/Hospitality', ga: 'Miondíol/Fáilteachas' },
  'industry.manufacturing': { en: 'Manufacturing', ga: 'Monarú' },
  'industry.creative': { en: 'Creative/Media', ga: 'Cruthaitheach/Meáin' },
  'industry.other': { en: 'Other', ga: 'Eile' },
  
  // Return to work statuses
  'return.fulltime': { en: 'Returned full-time', ga: 'Ar ais lánaimseartha' },
  'return.parttime': { en: 'Returned part-time', ga: 'Ar ais páirtaimseartha' },
  'return.planning': { en: 'Planning to return', ga: 'Ag pleanáil filleadh' },
  'return.extended': { en: 'Extended leave', ga: 'Saoire fhadaithe' },
  'return.didnot': { en: 'Did not return', ga: 'Níor fhill' },
  
  // Work arrangements
  'work.remote': { en: 'Remote', ga: 'Cianda' },
  'work.hybrid': { en: 'Hybrid', ga: 'Hibrideach' },
  'work.office': { en: 'Office-based', ga: 'Bunaithe san oifig' },
};
