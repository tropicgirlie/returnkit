// Real Tusla registry data for Dublin childcare services
// All crèche names, addresses, and service details are from official Tusla registry
// ⚠️ WAIT TIMES AND FEES ARE ENTIRELY FICTIONAL for demonstration purposes only
// Users must contact services directly for actual availability and pricing information

export interface TuslaCreche {
  id: number;
  tuslaNumber: string;
  name: string;
  area: string;
  council: 'Dublin City' | 'Fingal' | 'South Dublin' | 'Dún Laoghaire-Rathdown';
  address: string;
  town: string;
  ageProfile: string;
  serviceType: string;
  capacity: string;
  phone: string;
  // FICTIONAL DEMO DATA below - NOT REAL
  estimatedWaitMonths: number;
  monthlyFee: number;
  lat: number;
  lng: number;
  lastUpdated: string;
}

// Determine council from location
function getCouncil(town: string, address: string): 'Dublin City' | 'Fingal' | 'South Dublin' | 'Dún Laoghaire-Rathdown' {
  const text = `${town} ${address}`.toLowerCase();
  
  if (text.includes('fingal') || text.includes('swords') || text.includes('malahide') || text.includes('howth') || 
      text.includes('sutton') || text.includes('portmarnock') || text.includes('balbriggan') ||
      text.includes('skerries') || text.includes('donabate') || text.includes('blanchardstown') ||
      text.includes('castleknock') || text.includes('rush') || text.includes('lusk') ||
      text.includes('kinsealy') || text.includes('dublin 15') || text.includes('dublin 13')) {
    return 'Fingal';
  }
  
  if (text.includes('south dublin') || text.includes('lucan') || text.includes('clondalkin') || text.includes('tallaght') ||
      text.includes('dublin 22') || text.includes('dublin 24') || text.includes('firhouse') ||
      text.includes('saggart') || text.includes('newcastle') || text.includes('citywest') ||
      text.includes('templeogue') || text.includes('palmerstown') || text.includes('rathcoole')) {
    return 'South Dublin';
  }
  
  if (text.includes('dun laoghaire') || text.includes('dún laoghaire') || text.includes('dundrum') || 
      text.includes('blackrock') || text.includes('dalkey') || text.includes('killiney') || 
      text.includes('shankill') || text.includes('foxrock') || text.includes('cabinteely') || 
      text.includes('stillorgan') || text.includes('sandyford') || text.includes('monkstown') || 
      text.includes('glenageary') || text.includes('rathfarnham') || text.includes('ballinteer') || 
      text.includes('churchtown') || text.includes('dublin 14') || text.includes('dublin 16') || 
      text.includes('dublin 18') || text.includes('leopardstown') || text.includes('cherrywood') || 
      text.includes('loughlinstown') || text.includes('glasthule') || text.includes('sallynoggin') || 
      text.includes('goatstown')) {
    return 'Dún Laoghaire-Rathdown';
  }
  
  return 'Dublin City';
}

// Generate coordinates
function generateCoords(council: string, id: number): { lat: number; lng: number } {
  const bases = {
    'Dublin City': { lat: 53.3498, lng: -6.2603 },
    'Fingal': { lat: 53.4598, lng: -6.2189 },
    'South Dublin': { lat: 53.2889, lng: -6.3567 },
    'Dún Laoghaire-Rathdown': { lat: 53.2889, lng: -6.1334 }
  };
  const base = bases[council];
  const offset = ((id * 97) % 200) / 1000 - 0.1;
  return { lat: base.lat + offset, lng: base.lng + offset * 1.5 };
}

export const tuslaCreches: TuslaCreche[] = [
  { id: 1, tuslaNumber: "TU2015DR031", name: "Naionra Lorcain", area: "Baile na Manach", council: "Dublin City", address: "Scoil Lorcáin, Cearnóg Eaton, Baile na Manach", town: "Baile na Manach", ageProfile: "3 - 6 Years", serviceType: "Sessional", capacity: "18", phone: "0868508924", estimatedWaitMonths: 18, monthlyFee: 1320, ...generateCoords("Dublin City", 1), lastUpdated: "Jan 2026" },
  { id: 2, tuslaNumber: "TU2015FL018", name: "Childcare Balbriggan Community", area: "Balbriggan", council: "Fingal", address: "14 Bremore Castle, Brecan Close, Balbriggan", town: "Balbriggan", ageProfile: "1 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "54", phone: "018417104", estimatedWaitMonths: 14, monthlyFee: 1240, ...generateCoords("Fingal", 2), lastUpdated: "Jan 2026" },
  { id: 3, tuslaNumber: "TU2022FL004", name: "Bremore Castle Montessori", area: "Balbriggan", council: "Fingal", address: "159 Bath Road, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "19", phone: "0863661170", estimatedWaitMonths: 15, monthlyFee: 1270, ...generateCoords("Fingal", 3), lastUpdated: "Aug 2025" },
  { id: 4, tuslaNumber: "TU2015FL049", name: "Busy Bees Pre School", area: "Balbriggan", council: "Fingal", address: "101 Pine Ridge, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "12", phone: "087952944", estimatedWaitMonths: 13, monthlyFee: 1210, ...generateCoords("Fingal", 4), lastUpdated: "Jan 2026" },
  { id: 5, tuslaNumber: "TU2015FL068", name: "Circle of Friends", area: "Balbriggan", council: "Fingal", address: "Cardy Rock, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "22", phone: "018413882", estimatedWaitMonths: 16, monthlyFee: 1290, ...generateCoords("Fingal", 5), lastUpdated: "Jan 2026" },
  { id: 6, tuslaNumber: "TU2015FL071", name: "Cocoon Childcare - Balbriggan", area: "Balbriggan", council: "Fingal", address: "1 Naul Road, Balbriggan", town: "Balbriggan", ageProfile: "0 - 6 Years", serviceType: "Full Day", capacity: "151", phone: "016903350", estimatedWaitMonths: 19, monthlyFee: 1370, ...generateCoords("Fingal", 6), lastUpdated: "Jan 2026" },
  { id: 7, tuslaNumber: "TU2015FL096", name: "Funtimes", area: "Balbriggan", council: "Fingal", address: "Mill Street, Balbriggan", town: "Balbriggan", ageProfile: "0 - 6 Years", serviceType: "Full Day, Part Time", capacity: "95", phone: "018417244", estimatedWaitMonths: 17, monthlyFee: 1310, ...generateCoords("Fingal", 7), lastUpdated: "Jan 2026" },
  { id: 8, tuslaNumber: "TU2025FL003", name: "Funtimes Creche Home from Home", area: "Balbriggan", council: "Fingal", address: "Hampton Lane, Balbriggan", town: "Balbriggan", ageProfile: "1 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "60", phone: "018417244", estimatedWaitMonths: 18, monthlyFee: 1330, ...generateCoords("Fingal", 8), lastUpdated: "Sep 2025" },
  { id: 9, tuslaNumber: "TU2015FL118", name: "Creche", area: "Balbriggan", council: "Fingal", address: "Balbriggan", town: "Balbriggan", ageProfile: "0 - 6 Years", serviceType: "Sessional", capacity: "65", phone: "018417700", estimatedWaitMonths: 15, monthlyFee: 1260, ...generateCoords("Fingal", 9), lastUpdated: "Jan 2026" },
  { id: 10, tuslaNumber: "TU2021FL002", name: "Kids Campus", area: "Balbriggan", council: "Fingal", address: "Castleland Community Centre, Castlelands, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "138", phone: "018417700", estimatedWaitMonths: 20, monthlyFee: 1400, ...generateCoords("Fingal", 10), lastUpdated: "Aug 2024" },
  { id: 11, tuslaNumber: "TU2015FL148", name: "Little Cherubs Links Childcare", area: "Balbriggan", council: "Fingal", address: "69 Craoibhin Park, Balbriggan", town: "Balbriggan", ageProfile: "0 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "119", phone: "016905598", estimatedWaitMonths: 21, monthlyFee: 1420, ...generateCoords("Fingal", 11), lastUpdated: "Jan 2026" },
  { id: 12, tuslaNumber: "TU2015FL162", name: "Little Gumboots Montessori", area: "Balbriggan", council: "Fingal", address: "Sunshine House, Church Street, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "11", phone: "0874144816", estimatedWaitMonths: 12, monthlyFee: 1180, ...generateCoords("Fingal", 12), lastUpdated: "Jan 2026" },
  { id: 13, tuslaNumber: "TU2016FL006", name: "Little Wonders Pre-Preschool", area: "Balbriggan", council: "Fingal", address: "Hyde Park FC, Balbriggan Town Park", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "33", phone: "0894149923", estimatedWaitMonths: 14, monthlyFee: 1240, ...generateCoords("Fingal", 13), lastUpdated: "Jan 2026" },
  { id: 14, tuslaNumber: "TU2015FL195", name: "Market Green School", area: "Balbriggan", council: "Fingal", address: "25 New Market Green, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "22", phone: "0863528676", estimatedWaitMonths: 13, monthlyFee: 1220, ...generateCoords("Fingal", 14), lastUpdated: "Jan 2026" },
  { id: 15, tuslaNumber: "TU2015FL207", name: "Montessori", area: "Balbriggan", council: "Fingal", address: "Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "19", phone: "018413542", estimatedWaitMonths: 14, monthlyFee: 1230, ...generateCoords("Fingal", 15), lastUpdated: "Jan 2026" },
  { id: 16, tuslaNumber: "TU2015FL254", name: "Really Cool Afterschool & Montessori", area: "Balbriggan", council: "Fingal", address: "Flemington Community Centre, Hamlet Lane", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "22", phone: "0838021855", estimatedWaitMonths: 15, monthlyFee: 1260, ...generateCoords("Fingal", 16), lastUpdated: "Jan 2026" },
  { id: 17, tuslaNumber: "TU2018FL508", name: "Really Cool Afterschool & Montessori School", area: "Balbriggan", council: "Fingal", address: "Unit 102A Milfield, Georges Hill", town: "Balbriggan", ageProfile: "1 - 6 Years", serviceType: "Full Day", capacity: "60", phone: "0896174925", estimatedWaitMonths: 18, monthlyFee: 1340, ...generateCoords("Fingal", 17), lastUpdated: "Jan 2026" },
  { id: 18, tuslaNumber: "TU2016FL011", name: "Really Cool Afterschool & Montessori Ltd", area: "Balbriggan", council: "Fingal", address: "29 Clonuske Shopping Centre, Naul Road", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "22", phone: "0838021855", estimatedWaitMonths: 16, monthlyFee: 1290, ...generateCoords("Fingal", 18), lastUpdated: "Jan 2026" },
  { id: 19, tuslaNumber: "TU2015FL275", name: "Snowdrops Crèche & Montessori", area: "Balbriggan", council: "Fingal", address: "6 Fulham Street, Balbriggan", town: "Balbriggan", ageProfile: "0 - 6 Years", serviceType: "Full Day", capacity: "95", phone: "016906132", estimatedWaitMonths: 19, monthlyFee: 1380, ...generateCoords("Fingal", 19), lastUpdated: "Jan 2026" },
  { id: 20, tuslaNumber: "TU2015FL287", name: "Sunbeams Playschool", area: "Balbriggan", council: "Fingal", address: "Chieftan's Way, Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Part Time, Sessional", capacity: "22", phone: "0872986968", estimatedWaitMonths: 14, monthlyFee: 1250, ...generateCoords("Fingal", 20), lastUpdated: "Jan 2026" },
  { id: 21, tuslaNumber: "TU2015FL299", name: "The Children's Village", area: "Balbriggan", council: "Fingal", address: "Unit 4 Balbriggan Retail Park, Balbriggan", town: "Balbriggan", ageProfile: "1 - 6 Years", serviceType: "Full Day", capacity: "95", phone: "018411770", estimatedWaitMonths: 17, monthlyFee: 1320, ...generateCoords("Fingal", 21), lastUpdated: "Jan 2026" },
  { id: 22, tuslaNumber: "TU2015FL330", name: "Tots & Swots", area: "Balbriggan", council: "Fingal", address: "Balbriggan", town: "Balbriggan", ageProfile: "2 - 6 Years", serviceType: "Full Day", capacity: "22", phone: "0876707175", estimatedWaitMonths: 13, monthlyFee: 1200, ...generateCoords("Fingal", 22), lastUpdated: "Jan 2026" },
  { id: 23, tuslaNumber: "TU2015DS008", name: "Junior Genius Learn And Laugh Childcare Ltd", area: "Baldonnell", council: "South Dublin", address: "13 Foxborough Gardens, Castle Bagot House, Balgaddy", town: "Baldonnell", ageProfile: "0 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "250", phone: "0858351280", estimatedWaitMonths: 22, monthlyFee: 1480, ...generateCoords("South Dublin", 23), lastUpdated: "Jan 2026" },
  { id: 24, tuslaNumber: "TU2017DS502", name: "Childcare", area: "Balgaddy", council: "South Dublin", address: "St. Bartholomews Church, Clyde Road", town: "Balgaddy", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "25", phone: "016105547", estimatedWaitMonths: 11, monthlyFee: 1170, ...generateCoords("South Dublin", 24), lastUpdated: "Sep 2023" },
  { id: 25, tuslaNumber: "TU2023DR003", name: "The Embassy Montessori Primary School", area: "Ballsbridge", council: "Dublin City", address: "St. Patricks Hall, Ballsbridge, Dublin 4", town: "Ballsbridge", ageProfile: "2 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "22", phone: "0868473862", estimatedWaitMonths: 24, monthlyFee: 1520, ...generateCoords("Dublin City", 25), lastUpdated: "May 2023" },
  { id: 26, tuslaNumber: "TU2015FL044", name: "Bualadh Bos Montessori", area: "Ballyboughal", council: "Fingal", address: "Loughshinny Community Centre, Ballyboughal", town: "Ballyboughal", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "33", phone: "0879345325", estimatedWaitMonths: 13, monthlyFee: 1210, ...generateCoords("Fingal", 26), lastUpdated: "Jan 2026" },
  { id: 27, tuslaNumber: "TU2015FL027", name: "Olive's Bizzy B's Preschool Limited", area: "Ballykea", council: "Fingal", address: "Darcystown, Loughshinny, Ballykea", town: "Ballykea", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "58", phone: "0863854380", estimatedWaitMonths: 14, monthlyFee: 1240, ...generateCoords("Fingal", 27), lastUpdated: "Jan 2026" },
  { id: 28, tuslaNumber: "TU2024FL012", name: "Balrothery Home from Home Creche", area: "Balrothery", council: "Fingal", address: "Balrothery", town: "Balrothery", ageProfile: "1 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "48", phone: "0861741809", estimatedWaitMonths: 12, monthlyFee: 1190, ...generateCoords("Fingal", 28), lastUpdated: "Dec 2024" },
  { id: 29, tuslaNumber: "TU2015FL114", name: "Little Sprouts Community Preschool", area: "Balscadden", council: "Fingal", address: "Balscadden Community Centre, Urban St, Balscadden", town: "Balscadden", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "22", phone: "0861980558", estimatedWaitMonths: 13, monthlyFee: 1220, ...generateCoords("Fingal", 29), lastUpdated: "Jan 2026" },
  { id: 30, tuslaNumber: "TU2015DR003", name: "Brighter Bunnies Playgroup", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Unit 5, Crofters Quarter, Deansgrange Road, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Part Time, Full Day, Sessional", capacity: "30", phone: "0879773073", estimatedWaitMonths: 18, monthlyFee: 1350, ...generateCoords("Dún Laoghaire-Rathdown", 30), lastUpdated: "Jan 2026" },
  { id: 31, tuslaNumber: "TU2024DR005", name: "Childcare", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "114 Mount Merrion Avenue, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "33", phone: "0863294779", estimatedWaitMonths: 19, monthlyFee: 1370, ...generateCoords("Dún Laoghaire-Rathdown", 31), lastUpdated: "Nov 2024" },
  { id: 32, tuslaNumber: "TU2015DR142", name: "Coco's Childcare", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Lanford, Sydney, Blackrock", town: "Blackrock", ageProfile: "0 - 6 Years", serviceType: "Full Day", capacity: "54", phone: "012833140", estimatedWaitMonths: 22, monthlyFee: 1470, ...generateCoords("Dún Laoghaire-Rathdown", 32), lastUpdated: "Jan 2026" },
  { id: 33, tuslaNumber: "TU2015DR101", name: "Coco's Creche & Montessori", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "17 Hollypark Terrace, Blackrock", town: "Blackrock", ageProfile: "0 - 6 Years", serviceType: "Full Day", capacity: "37", phone: "012886937", estimatedWaitMonths: 20, monthlyFee: 1410, ...generateCoords("Dún Laoghaire-Rathdown", 33), lastUpdated: "Jan 2026" },
  { id: 34, tuslaNumber: "TU2015DR064", name: "Hollypark Montessori", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Hollypark Avenue, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "24", phone: "0864083232", estimatedWaitMonths: 16, monthlyFee: 1300, ...generateCoords("Dún Laoghaire-Rathdown", 34), lastUpdated: "Jan 2026" },
  { id: 35, tuslaNumber: "TU2015DR150", name: "Little Apples Links Childcare", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "2 Carbury Place, Main Street, Stradbrook Road, Blackrock", town: "Blackrock", ageProfile: "0 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "240", phone: "018666620", estimatedWaitMonths: 26, monthlyFee: 1550, ...generateCoords("Dún Laoghaire-Rathdown", 35), lastUpdated: "Jan 2026" },
  { id: 36, tuslaNumber: "TU2015DR158", name: "Academy", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Oatlands, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "51", phone: "0867792578", estimatedWaitMonths: 21, monthlyFee: 1430, ...generateCoords("Dún Laoghaire-Rathdown", 36), lastUpdated: "Jan 2026" },
  { id: 37, tuslaNumber: "TU2015DR005", name: "Oatlands Pre, After, Montessori, School Age Childcare", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "St. Phillip & James Parish Centre, Cross Avenue, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "36", phone: "0879875528", estimatedWaitMonths: 19, monthlyFee: 1380, ...generateCoords("Dún Laoghaire-Rathdown", 37), lastUpdated: "Jan 2026" },
  { id: 38, tuslaNumber: "TU2015DR134", name: "Our World Rowan House Montessori Ltd.", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Stradbrook Road, Blackrock", town: "Blackrock", ageProfile: "3 - 6 Years", serviceType: "Full Day, Part Time", capacity: "24", phone: "0863110668", estimatedWaitMonths: 23, monthlyFee: 1500, ...generateCoords("Dún Laoghaire-Rathdown", 38), lastUpdated: "Jan 2026" },
  { id: 39, tuslaNumber: "TU2016DR008", name: "Montessori", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "12 Stradbrook Park, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Sessional", capacity: "38", phone: "012845688", estimatedWaitMonths: 18, monthlyFee: 1340, ...generateCoords("Dún Laoghaire-Rathdown", 39), lastUpdated: "Jan 2026" },
  { id: 40, tuslaNumber: "TU2015DR047", name: "Simbas Childcare Limited", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "42 Main Street, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "31", phone: "012845398", estimatedWaitMonths: 20, monthlyFee: 1400, ...generateCoords("Dún Laoghaire-Rathdown", 40), lastUpdated: "Jan 2026" },
  { id: 41, tuslaNumber: "TU2015DR046", name: "Simbas Childcare Limited", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "38", phone: "012845398", estimatedWaitMonths: 19, monthlyFee: 1370, ...generateCoords("Dún Laoghaire-Rathdown", 41), lastUpdated: "Jan 2026" },
  { id: 42, tuslaNumber: "TU2023DR004", name: "St. Nicholas Montessori School Blackrock Childcare", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Pastoral Centre, Newtown Park Avenue, Blackrock", town: "Blackrock", ageProfile: "3 - 6 Years", serviceType: "Part Time, Sessional", capacity: "22", phone: "012806064", estimatedWaitMonths: 21, monthlyFee: 1440, ...generateCoords("Dún Laoghaire-Rathdown", 42), lastUpdated: "Aug 2023" },
  { id: 43, tuslaNumber: "TU2015DR089", name: "Willow House Newtownpark", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "3 Woodbine Road, Blackrock", town: "Blackrock", ageProfile: "1 - 6 Years", serviceType: "Full Day", capacity: "40", phone: "012899394", estimatedWaitMonths: 20, monthlyFee: 1410, ...generateCoords("Dún Laoghaire-Rathdown", 43), lastUpdated: "Jan 2023" },
  { id: 44, tuslaNumber: "TU2015DR143", name: "Willow House Woodbine Childcare", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "1 Lower Kilmacud Road, Stillorgan", town: "Blackrock", ageProfile: "1 - 6 Years", serviceType: "Full Day", capacity: "36", phone: "012692565", estimatedWaitMonths: 19, monthlyFee: 1390, ...generateCoords("Dún Laoghaire-Rathdown", 44), lastUpdated: "Jan 2026" },
  { id: 45, tuslaNumber: "TU2018DR502", name: "Wise Little Owls", area: "Blackrock", council: "Dún Laoghaire-Rathdown", address: "Booterstown Community Centre, Grotto Ave, Blackrock", town: "Blackrock", ageProfile: "2 - 6 Years", serviceType: "Part Time, Sessional", capacity: "88", phone: "012055789", estimatedWaitMonths: 22, monthlyFee: 1480, ...generateCoords("Dún Laoghaire-Rathdown", 45), lastUpdated: "Jan 2025" },
  { id: 46, tuslaNumber: "TU2015DR040", name: "Booterstown Childcare Montessori School", area: "Booterstown", council: "Dún Laoghaire-Rathdown", address: "Lapwing, Booterstown", town: "Booterstown", ageProfile: "2 - 6 Years", serviceType: "Part Time", capacity: "22", phone: "0877496837", estimatedWaitMonths: 17, monthlyFee: 1320, ...generateCoords("Dún Laoghaire-Rathdown", 46), lastUpdated: "Jan 2026" },
  { id: 47, tuslaNumber: "TU2015DR152", name: "The Park Academy Thornwood", area: "Booterstown", council: "Dún Laoghaire-Rathdown", address: "Thornwood, Booterstown", town: "Booterstown", ageProfile: "2 - 6 Years", serviceType: "Full Day", capacity: "40", phone: "017643020", estimatedWaitMonths: 21, monthlyFee: 1450, ...generateCoords("Dún Laoghaire-Rathdown", 47), lastUpdated: "Jan 2026" },
  { id: 48, tuslaNumber: "TU2024DR003", name: "The Nest Tigers Childcare", area: "Cabinteely", council: "Dún Laoghaire-Rathdown", address: "Unit 2006 Block C, Beech Park, Cabinteely", town: "Cabinteely", ageProfile: "3 - 6 Years", serviceType: "Full Day, Part Time, Sessional", capacity: "47", phone: "012118831", estimatedWaitMonths: 18, monthlyFee: 1360, ...generateCoords("Dún Laoghaire-Rathdown", 48), lastUpdated: "Jan 2026" },
  { id: 49, tuslaNumber: "TU2021DY006", name: "Charlestown", area: "Charlestown", council: "Dún Laoghaire-Rathdown", address: "Unit 6, Cherrywood Town Centre, Grande Parade, Cherrywood", town: "Charlestown", ageProfile: "1 - 6 Years", serviceType: "Sessional", capacity: "75", phone: "018346303", estimatedWaitMonths: 19, monthlyFee: 1380, ...generateCoords("Dún Laoghaire-Rathdown", 49), lastUpdated: "Jan 2026" },
  { id: 50, tuslaNumber: "TU2023DR001", name: "Once Upon a Time Ashgrove Creche and Montessori", area: "Cherrywood", council: "Dún Laoghaire-Rathdown", address: "1 Dundrum Road, Churchtown Lower", town: "Cherrywood", ageProfile: "1 - 6 Years", serviceType: "Full Day", capacity: "80", phone: "015688355", estimatedWaitMonths: 20, monthlyFee: 1420, ...generateCoords("Dún Laoghaire-Rathdown", 50), lastUpdated: "Jan 2026" }
].slice(0, 50);