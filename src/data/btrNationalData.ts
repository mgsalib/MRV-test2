/**
 * Official Data Extracted from Egypt's First Biennial Transparency Report (BTR1)
 * Chapter 5: Financial, Technology Development and Transfer, and Capacity Building
 * Needed and Received under Articles 9-11, and Article 13 of the Paris Agreement
 */

export interface BTRMacroRequirement {
  framework: string;
  totalUSD: number;
  mitigationUSD: number;
  adaptationUSD: number;
  securedUSD?: number;
  gapUSD?: number;
  notes: string;
}

export interface BTRFinancialNeededSector {
  sector: string;
  category: 'Mitigation' | 'Adaptation';
  amountUSD: number;
  amountEGP: number;
  keyProjects: { name: string; amountUSD: number; note?: string }[];
  description: string;
  expectedUse: string;
  expectedImpact: string;
  anchor: string;
}

export interface BTRFinancialReceivedProject {
  id: string;
  title: string;
  description: string;
  channel: string;
  recipientEntity: string;
  implementingEntity: string;
  amountUSD: number;
  amountEGP: number;
  amountOriginalStr: string;
  timeFrame: string;
  financialInstrument: string;
  status: string;
  sector: string;
  subsector: string;
  typeOfSupport: 'Mitigation' | 'Adaptation' | 'Crosscutting';
  statusOfActivity: string;
  useOfSupport: string;
  impact: string;
  estimatedResults: string;
}

export interface BTRTechNeededItem {
  sector: string;
  project: string;
  technologyNeeded: string;
  purpose: string;
}

export interface BTRTechReceivedProject {
  title: string;
  description: string;
  typeOfTechnology: string;
  channel: string;
  recipientEntity: string;
  implementingEntity: string;
  amountUSD?: number;
  timeFrame: string;
  financialInstrument: string;
  sector: string;
  subsector: string;
  typeOfSupport: string;
  useOfSupport: string;
  impact: string;
  estimatedResults: string;
}

export interface BTRCapacityReceivedProject {
  title: string;
  description: string;
  recipientEntity: string;
  implementingEntity: string;
  timeFrame: string;
  sector: string;
  subsector: string;
  typeOfSupport: string;
  impact: string;
  estimatedResults: string;
}

export interface BTRArticle13Support {
  title: string;
  description: string;
  channel: string;
  recipientEntity: string;
  implementingEntity?: string;
  amountUSD?: string;
  amountEGP?: string;
  timeFrame: string;
  status: string;
  impact: string;
  estimatedResults?: string;
  outputs?: string[];
}

// 1. MACRO CLIMATE FINANCE TARGETS
export const BTR_MACRO_FINANCIAL_NEEDS = {
  exchangeRateUSD_EGP: 50.4094,
  exchangeRateEUR_EGP: 53.0610,
  currencyDate: '10th - 11th December 2024 (Central Bank of Egypt)',
  reportingPeriod: 'January 1, 2022 to June 6, 2024',
  
  nccs2050: {
    title: "National Climate Change Strategy 2050 (NCCS)",
    totalUSD: 324_000_000_000,
    mitigationUSD: 211_000_000_000,
    mitigationSecuredUSD: 57_600_000_000,
    mitigationGapUSD: 153_600_000_000,
    adaptationUSD: 113_000_000_000,
    adaptationSecuredUSD: 18_300_000_000,
    adaptationGapUSD: 94_700_000_000,
    goals: [
      { id: 1, name: "Achieving Sustainable Economic Growth & Low-Emission Development" },
      { id: 2, name: "Enhancing Adaptive Capacity & Resilience to Climate Change" },
      { id: 3, name: "Enhancing Climate Change Action Governance" },
      { id: 4, name: "Enhancing Climate Financing Infrastructure" },
      { id: 5, name: "Enhancing Scientific Research, Technology Transfer & Knowledge Management" },
    ]
  },
  
  updatedNDC: {
    title: "Egypt's Second Updated Nationally Determined Contribution (NDC)",
    totalUSD: 246_000_000_000,
    mitigationUSD: 196_000_000_000,
    adaptationUSD: 50_000_000_000,
    mitigationTargets: [
      { sector: 'Electricity (Generation, T&D)', target: '37% GHG reduction below BAU by 2030 (80,520 Gg CO2e)' },
      { sector: 'Oil & Gas (Associated Petroleum Gases)', target: '65% GHG reduction below BAU by 2030 (1,682 Gg CO2e)' },
      { sector: 'Transport Sector', target: '7% GHG reduction below BAU by 2030 (8,960 Gg CO2e)' },
    ]
  },

  sovereignGreenFinance: {
    greenBondUSD: 750_000_000,
    issuanceDate: 'September 2020 (1st Sovereign Green Bond in MENA)',
    internationalMarkets: ['Panda Bonds (Chinese Yuan)', 'Samurai Bonds (Japanese Yen)'],
    greenHydrogenLaw: 'Green Hydrogen Incentives Law (2024) providing 33%-55% tax credits and Golden License administrative approvals.',
    fraRegulations: 'Financial Regulatory Authority (FRA) mandatory ESG reporting for listed firms & non-banking institutions (2021) and Green Bond Framework (2020).',
    cbeRegulations: 'Central Bank of Egypt Guiding Principles for Sustainable Finance (2021) & Binding Regulations (2022).'
  }
};

// 2. TABLE 79: BARRIERS & GAPS ATTRACTING INTERNATIONAL FINANCE
export const BTR_FINANCE_BARRIERS = [
  {
    barrier: "High Initial Capital Costs",
    description: "Large-scale projects, particularly in renewable energy and transport infrastructure, require significant upfront investments, deterring investors who seek shorter payback periods."
  },
  {
    barrier: "Technological and Capacity Constraints",
    description: "Key sectors like industry, agriculture, and water resources require costly, advanced technologies. Difficulty accessing these technologies deters financiers who prefer proven, scalable solutions."
  },
  {
    barrier: "Limited Private Sector Engagement",
    description: "The private sector’s participation in climate finance is limited due to insufficient financial incentives and perceived risks, particularly in sectors like renewable energy and green urban development."
  },
  {
    barrier: "Low Returns in Agriculture and Water Sectors",
    description: "Projects in agriculture and water resources offer long-term environmental benefits but relatively low financial returns, discouraging investment without concessional finance or grants."
  },
  {
    barrier: "Inadequate Risk Mitigation Mechanisms",
    description: "A lack of insurance mechanisms, especially in vulnerable sectors like coastal zones and agriculture, deters investment due to the high risk of climate-related impacts."
  }
];

// 3. TABLE 80 & 81: BREAKDOWN OF FINANCIAL SUPPORT NEEDED
export const BTR_FINANCIAL_NEEDED_BREAKDOWN: BTRFinancialNeededSector[] = [
  {
    sector: "Electricity Programme",
    category: "Mitigation",
    amountUSD: 93_686_000_000,
    amountEGP: 4_722_617_574_000,
    keyProjects: [
      { name: "Wind power plants deployment", amountUSD: 40_526_000_000 },
      { name: "Solar PV power plants", amountUSD: 23_754_000_000 },
      { name: "Solar Concentrated Solar Power (CSP)", amountUSD: 18_109_000_000 },
      { name: "Replacement of inefficient thermal power plants", amountUSD: 10_000_000_000 },
      { name: "Smart grid meters for energy management", amountUSD: 1_297_000_000 },
    ],
    description: "Renewable energy projects aimed at increasing clean generation, replacing thermal plants, and deploying smart grid metering.",
    expectedUse: "Generating renewable electricity, reducing GHG emissions, and improving energy efficiency of the national grid.",
    expectedImpact: "Significant reduction in GHG emissions, increased RE share to 42% by 2030/2035, and improved energy management.",
    anchor: "Updated NDC (37% electricity reduction) & ISES 2035"
  },
  {
    sector: "Oil & Gas Programme",
    category: "Mitigation",
    amountUSD: 3_290_000_000,
    amountEGP: 165_845_610_000,
    keyProjects: [
      { name: "Associated petroleum gas flaring reduction", amountUSD: 150_000_000 },
      { name: "Biodegradable plastic production", amountUSD: 600_000_000 },
      { name: "Bioethanol production", amountUSD: 130_000_000 },
      { name: "Melamine CCU project at Damietta Port", amountUSD: 260_000_000 },
      { name: "Extracting algae oil for biofuels", amountUSD: 600_000_000 },
      { name: "Fuel oil from waste plastics", amountUSD: 50_000_000 },
      { name: "MDF wooden plates production from rice straw (Idku)", amountUSD: 1_500_000_000 },
    ],
    description: "Associated gas recovery, energy efficiency, biofuels, carbon capture & utilization (CCU), and agricultural residue repurposing.",
    expectedUse: "Reducing flaring emissions, producing biofuels, and recycling waste materials for energy and sustainable building materials.",
    expectedImpact: "Significant reduction in CO2 and fugitive emissions, transition to renewable products, and reduced fossil reliance.",
    anchor: "Updated NDC (65% APG reduction) & Petroleum Energy Efficiency Strategy 2022-2035"
  },
  {
    sector: "Transport Programme",
    category: "Mitigation",
    amountUSD: 5_485_670_000,
    amountEGP: 276_527_139_030,
    keyProjects: [
      { name: "Cairo Metro Line 6 expansion", amountUSD: 2_160_000_000 },
      { name: "Electric Light Rail Transit (Port Said - Abu Qir)", amountUSD: 3_000_000_000 },
      { name: "Bus Rapid Transit (BRT) Ring Road system", amountUSD: 83_670_000 },
      { name: "Alexandria Raml Tram rehabilitation", amountUSD: 242_000_000 },
    ],
    description: "Large-scale urban transport infrastructure: metro expansion, electric high-speed rail, BRT systems, and tram rehabilitation.",
    expectedUse: "Modernizing public transport infrastructure, reducing urban congestion, and promoting low-carbon modal shift.",
    expectedImpact: "Significant reduction in transport CO2 emissions, improved urban mobility, and lower air pollution.",
    anchor: "Updated NDC (7% transport emission reduction) & National Transport Policy"
  },
  {
    sector: "Industry Programme",
    category: "Mitigation",
    amountUSD: 11_920_000_000,
    amountEGP: 600_875_280_000,
    keyProjects: [
      { name: "Charcoal open pits to mechanized kilns transformation", amountUSD: 138_000_000 },
      { name: "Green hydrogen feedstock for green ammonia production", amountUSD: 140_000_000 },
      { name: "Regulatory High-Efficiency Motors (IE3 standard)", amountUSD: 11_642_000_000 },
    ],
    description: "Enhancing energy efficiency in heavy industries, deploying green hydrogen/ammonia, and upgrading industrial motor systems.",
    expectedUse: "Efficient industrial operations, decarbonization of cement/fertilizers/steel, and clean hydrogen substitution.",
    expectedImpact: "Substantial industrial GHG reductions, improved resource productivity, and global green export competitiveness.",
    anchor: "National Low-Carbon Hydrogen Strategy & Industrial Roadmap"
  },
  {
    sector: "Waste Sector Programme",
    category: "Mitigation",
    amountUSD: 5_601_000_000,
    amountEGP: 282_340_809_000,
    keyProjects: [
      { name: "Upgrading MSW infrastructure & MBT treatment plants", amountUSD: 3_800_000_000 },
      { name: "Waste-to-energy (WtE) facilities & sanitary landfills", amountUSD: 1_801_000_000 },
    ],
    description: "Upgrading municipal solid waste management, MBT plants, composting, RDF for cement factories, and 300 MW waste-to-energy capacity.",
    expectedUse: "Managing 26M tons of annual MSW, reducing landfill methane emissions, and recovering energy.",
    expectedImpact: "Reduces methane emissions by diversion from dumpsites, enhances circular economy, and produces clean RDF fuel.",
    anchor: "Waste Management Regulation Law 202/2020 & NSWMP"
  },
  {
    sector: "Ports & Local Transport Initiatives",
    category: "Mitigation",
    amountUSD: 23_120_000,
    amountEGP: 1_162_000_000,
    keyProjects: [
      { name: "Unified Smart Card Project for Transport (MaaS)", amountUSD: 8_380_000 },
      { name: "Solar power plants in 5 maritime ports", amountUSD: 6_621_888 },
      { name: "Onshore Power Supply (OPS) in port terminals", amountUSD: 2_959_500 },
      { name: "Power plants in 3 Land Ports (Qustal, Arquin, Kafra)", amountUSD: 3_000_000 },
      { name: "EV Charging station works in Sharm El Sheikh", amountUSD: 2_160_000 },
    ],
    description: "Port electrification, cold ironing onshore power supply, rooftop solar on port terminals, and digital unified transport smart card.",
    expectedUse: "Lower ship auxiliary engine emissions at berth, clean energy in land border crossings, and integrated transit payment.",
    expectedImpact: "Eliminates port air pollution, improves green logistics, and modernizes multi-modal transit ticketing.",
    anchor: "Sustainable Logistics & Green Ports Framework"
  },
  {
    sector: "Buildings, Urban Cities & Tourism",
    category: "Mitigation",
    amountUSD: 595_000_000,
    amountEGP: 29_993_355_000,
    keyProjects: [
      { name: "Energy efficient cooling in urban buildings", amountUSD: 250_000_000 },
      { name: "Renewable energy & energy efficiency in hotels and resorts", amountUSD: 345_000_000 },
    ],
    description: "Energy efficiency codes, rooftop PV on government buildings, and green certification for hospitality sector.",
    expectedUse: "Reduces summer peak cooling demand in Cairo and coastal resorts, and scales Green Star Hotel certifications.",
    expectedImpact: "Cuts building energy consumption by 15-20% and lowers reliance on fossil fuel peaking plants.",
    anchor: "National Energy Efficiency Action Plan (NEEAP II) & Green Star Hotel Programme"
  },
  {
    sector: "Agriculture Adaptation Programme",
    category: "Adaptation",
    amountUSD: 15_000_000_000,
    amountEGP: 756_135_000_000,
    keyProjects: [
      { name: "Enhancing agricultural production adaptation in Valley & Delta", amountUSD: 4_000_000_000 },
      { name: "Rehabilitation of Northern Delta areas affected by Sea Level Rise", amountUSD: 2_000_000_000 },
      { name: "Combating desertification, water harvesting & degraded pastures", amountUSD: 3_500_000_000 },
      { name: "Development of on-farm modern irrigation in old lands", amountUSD: 4_000_000_000 },
      { name: "Early warning systems, agro-weather forecasting & insurance", amountUSD: 1_500_000_000 },
    ],
    description: "Enhancing crop resilience, drip irrigation rollout on 4 million feddans, soil salinity mitigation, and climate risk insurance.",
    expectedUse: "Protecting food security for 105M+ citizens, conserving 20% irrigation water, and safeguarding rural farming incomes.",
    expectedImpact: "Boosts crop yields by 10-15%, prevents soil salinization in the Nile Delta, and provides real-time agro-meteorological advisories.",
    anchor: "Sustainable Agricultural Development Strategy 2030 (SADS) & NAP"
  },
  {
    sector: "Water Resources Adaptation Programme",
    category: "Adaptation",
    amountUSD: 11_295_000_000,
    amountEGP: 569_369_655_000,
    keyProjects: [
      { name: "Rehabilitation of 20,000 km of irrigation canals", amountUSD: 4_500_000_000 },
      { name: "Modernizing on-farm water management practices", amountUSD: 4_000_000_000 },
      { name: "Coastal protection & development in 3 Mediterranean cities", amountUSD: 2_000_000_000 },
      { name: "Water desalination powered by solar energy", amountUSD: 625_000_000 },
      { name: "Natural shore protection of Rosetta using the sand motor", amountUSD: 120_000_000 },
      { name: "Scaling up solar pumping for irrigation wells", amountUSD: 50_000_000 },
    ],
    description: "Canal lining, solar-powered seawater desalination, agricultural drainage reuse (New Delta & Bahr el Baqar), and sand motor nature-based defenses.",
    expectedUse: "Diverting treated drainage water for 2 million acres, securing potable water for 33M people, and preventing coastal inundation.",
    expectedImpact: "Drastically reduces conveyance water losses, protects Alexandria and Nile Delta coasts against 22cm sea level rise, and ensures water security.",
    anchor: "National Water Resources Plan 2017-2037 & Water Strategy 2050"
  }
];

// 4. TABLE 82: BREAKDOWN OF FINANCIAL SUPPORT RECEIVED
export const BTR_FINANCIAL_RECEIVED_PROJECTS: BTRFinancialReceivedProject[] = [
  {
    id: "BTR-REC-01",
    title: "Green Economy Financing Facility Egypt II (GEFF Egypt II)",
    description: "Concessional loans and grants to private sector MSMEs for energy efficiency, renewable energy, water efficiency, and resource-efficient technologies with 10-15% performance grants.",
    channel: "Multilateral (EBRD, supported by EU, AFD, and GCF)",
    recipientEntity: "Private sector MSMEs across agriculture, construction, and manufacturing",
    implementingEntity: "European Bank for Reconstruction and Development (EBRD)",
    amountUSD: 175_000_000,
    amountEGP: 8_821_575_000,
    amountOriginalStr: "$175 million (GEFF II total funding)",
    timeFrame: "Start: 2022",
    financialInstrument: "Grant and Loan",
    status: "Received",
    sector: "Energy efficiency, renewable energy, circular economy",
    subsector: "Agriculture, construction, manufacturing, MSMEs",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Financing green technologies and sustainable solutions for MSMEs to promote energy efficiency and renewable energy.",
    impact: "Significantly reduces Egypt's carbon footprint, fosters equal access to green finance for men and women.",
    estimatedResults: "More than €150M in green investments; substantial emissions reductions; job creation."
  },
  {
    id: "BTR-REC-02",
    title: "Egypt - Electricity and Green Growth Support Programme II (EGGSP II)",
    description: "Promoting a sustainable, competitive, and diversified electricity sector in Egypt to ensure security of supply and support climate change mitigation and green growth.",
    channel: "Bilateral (via African Development Bank - AfDB)",
    recipientEntity: "Government of Egypt (Ministry of Electricity and Renewable Energy)",
    implementingEntity: "AfDB & Ministry of Electricity and Renewable Energy",
    amountUSD: 90_000_000,
    amountEGP: 4_536_810_000,
    amountOriginalStr: "USD 90 million",
    timeFrame: "Signature Date: 20 April 2022",
    financialInstrument: "Loan",
    status: "Received",
    sector: "Energy (Electricity and Green Energy Growth)",
    subsector: "Electricity sector reforms, renewable energy, energy efficiency",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Improve the efficiency of electricity infrastructure, facilitate reforms, and support green energy growth.",
    impact: "Enhances the reliability of electricity supply and promotes low-carbon economic growth.",
    estimatedResults: "Increased share of renewable energy in energy mix and reduced greenhouse gas emissions."
  },
  {
    id: "BTR-REC-03",
    title: "Helwan Wastewater Treatment Project (WWTP)",
    description: "Expanding and upgrading the Helwan WWTP in Cairo, providing treated wastewater for irrigation and generating biogas for electricity, serving 2.2 million inhabitants.",
    channel: "Multilateral (EIB, EU-NIP, AFD)",
    recipientEntity: "Construction Authority for Potable Water and Wastewater",
    implementingEntity: "European Investment Bank (EIB) and partner organizations",
    amountUSD: 178_044_297,
    amountEGP: 8_975_213_000,
    amountOriginalStr: "EUR 88M EIB loan + USD 57M AFD loan + EUR 27M EU grant (Total: $178,044,297 USD)",
    timeFrame: "Signature Date: 30 November 2022",
    financialInstrument: "Loan and Grant",
    status: "Received",
    sector: "Water, waste",
    subsector: "Water treatment, waste management, sanitation",
    typeOfSupport: "Crosscutting",
    statusOfActivity: "Ongoing",
    useOfSupport: "Water management, pollution reduction, and renewable biogas energy generation.",
    impact: "Enhances sanitation for 2.2 million people, provides non-conventional irrigation water, and creates 2,000+ jobs.",
    estimatedResults: "Significant improvements in water quality, sanitation, and climate resilience in Helwan."
  },
  {
    id: "BTR-REC-04",
    title: "Sustainable Transformation for Agricultural Resilience in Upper Egypt (STAR)",
    description: "Improving the livelihoods of smallholder farmers, poor households, and vulnerable women and youth in Upper Egypt through climate-adapted agricultural practices and water infrastructure.",
    channel: "Bilateral (via International Fund for Agricultural Development - IFAD)",
    recipientEntity: "Government of Egypt",
    implementingEntity: "International Fund for Agricultural Development (IFAD)",
    amountUSD: 64_540_000,
    amountEGP: 3_253_396_860,
    amountOriginalStr: "USD 64.54 million",
    timeFrame: "Start Date: 2022",
    financialInstrument: "Grant and Loan",
    status: "Received",
    sector: "Agriculture, Water",
    subsector: "Agricultural resilience, rural business development, irrigation infrastructure",
    typeOfSupport: "Crosscutting",
    statusOfActivity: "Ongoing",
    useOfSupport: "Improving productivity and resilience of smallholders, rehabilitating water infrastructure.",
    impact: "Improves livelihoods of 240,000 rural households and strengthens rural institutions.",
    estimatedResults: "160,000 smallholder households and 80,000 households benefiting from rehabilitated water infrastructure."
  },
  {
    id: "BTR-REC-05",
    title: "Transport Program - Cairo Monorail (NAC & 6th October Lines)",
    description: "Construction of the Cairo Monorail (New Administrative Capital Line 56.5 km and 6th October Line 42 km) creating driverless mass transit.",
    channel: "Green Bond (Sovereign Allocation)",
    recipientEntity: "Government of Egypt (Ministry of Transport / National Authority for Tunnels)",
    implementingEntity: "National Authority for Tunnels (NAT)",
    amountUSD: 347_000_000,
    amountEGP: 17_492_061_800,
    amountOriginalStr: "USD 347 million",
    timeFrame: "Signature Date: September 2020",
    financialInstrument: "Green Bond",
    status: "Received",
    sector: "Transport",
    subsector: "Electric transport systems, urban mobility, emission reduction",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Modernizing public transport infrastructure, reducing emissions, and promoting sustainable urban mobility.",
    impact: "Massive modal shift avoiding urban congestion and reducing fossil fuel combustion.",
    estimatedResults: "500,000 passengers per day on each line, large-scale deployment of electric rail."
  },
  {
    id: "BTR-REC-06",
    title: "Transforming Financial Systems for Climate (TFSC) – NBE Second Advance",
    description: "Credit facility agreement between AFD and National Bank of Egypt (NBE) to support low-carbon and climate-resilient SME investments in Egypt.",
    channel: "Bilateral (via Agence Française de Développement - AFD)",
    recipientEntity: "National Bank of Egypt (NBE)",
    implementingEntity: "NBE and AFD",
    amountUSD: 30_103_472,
    amountEGP: 1_517_516_000,
    amountOriginalStr: "EUR 28.6 million (Second advance under EUR 100M line) / $30,103,472 USD",
    timeFrame: "Start Date: 19 December 2022",
    financialInstrument: "Loan",
    status: "Received",
    sector: "Finance",
    subsector: "Climate finance, SME investments, low-carbon projects",
    typeOfSupport: "Crosscutting",
    statusOfActivity: "Ongoing",
    useOfSupport: "Financing low-carbon and climate-resilient SME investments across industrial and agricultural supply chains.",
    impact: "Strengthens commercial banking capacity for green portfolio management.",
    estimatedResults: "Increased financing for climate-compatible projects and enhanced NBE climate finance capacity."
  },
  {
    id: "BTR-REC-07",
    title: "Green Sustainable Industries (GSI) – Egypt",
    description: "Part of a €271 million agreement between Egypt and the EU, supported by EIB and NBE, financing industrial projects for pollution abatement, decarbonization, and resource efficiency.",
    channel: "Bilateral (via European Investment Bank - EIB)",
    recipientEntity: "Egyptian Environmental Affairs Agency (EEAA), National Bank of Egypt (NBE)",
    implementingEntity: "EIB, EEAA, NBE",
    amountUSD: 164_200_754,
    amountEGP: 8_277_360_000,
    amountOriginalStr: "€156 million (EIB financing) / $164,200,754 USD",
    timeFrame: "Start Date: 2023",
    financialInstrument: "Loan",
    status: "Received",
    sector: "Industry",
    subsector: "Pollution abatement, decarbonization, energy/resource efficiency",
    typeOfSupport: "Crosscutting",
    statusOfActivity: "Ongoing",
    useOfSupport: "Funds climate-friendly industrial projects focusing on pollution reduction, energy efficiency, and resource management.",
    impact: "Assists Egypt's industrial transition to a green economy and compliance with environmental regulations.",
    estimatedResults: "Reduction in industrial pollution load and enhanced energy/resource efficiency."
  },
  {
    id: "BTR-REC-08",
    title: "Development & Energy Efficiency Improvement at Suez Oil Processing Company",
    description: "Optimization measures, Energy Management System implementation, process unit upgrades, and waste gas recovery for LPG production.",
    channel: "Multilateral (via EBRD)",
    recipientEntity: "Suez Oil Processing Company (Ministry of Petroleum and Mineral Resources)",
    implementingEntity: "Suez Oil Processing Company & EBRD",
    amountUSD: 250_000_000,
    amountEGP: 12_602_250_000,
    amountOriginalStr: "$250,000,000 USD",
    timeFrame: "Start Date: 2018",
    financialInstrument: "Concessional Loan",
    status: "Received",
    sector: "Energy",
    subsector: "Petroleum refining",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Upgrading refining processes, implementing energy efficiency measures, and developing gas recovery infrastructure.",
    impact: "Significantly enhances refining efficiency, reducing fuel consumption and greenhouse gas emissions.",
    estimatedResults: "Annual energy savings of 3,295,000 MMBtu and emissions reduction of ~214,000 tCO2e/year."
  },
  {
    id: "BTR-REC-09",
    title: "Waste Heat Recovery and Gas Compressors Upgrade at Dahshour (GASCO)",
    description: "Waste heat recovery system and 3 new compressors at Dahshour station plus 2 electric compressors for Raven Gas Field (Western Desert).",
    channel: "Multilateral (via EBRD)",
    recipientEntity: "Egyptian Natural Gas Company (GASCO)",
    implementingEntity: "GASCO & EBRD",
    amountUSD: 140_000_000,
    amountEGP: 7_057_260_000,
    amountOriginalStr: "$140,000,000 USD",
    timeFrame: "Start Date: 2018",
    financialInstrument: "Concessional Loan",
    status: "Received",
    sector: "Energy",
    subsector: "Gas processing and transmission",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Waste heat recovery, new compressor installations, and upgrading gas metering systems.",
    impact: "Optimizes compression efficiency and minimizes natural gas transmission energy losses.",
    estimatedResults: "Annual energy savings of 1,963,000 MMBtu and emission reductions of ~123,000 tCO2e/year."
  },
  {
    id: "BTR-REC-10",
    title: "Egypt Sustainable Transport and Digital Infrastructure Guarantee",
    description: "Guarantee provided by AIIB to back investments in green, climate-resilient transportation systems and enhanced digital infrastructure.",
    channel: "Bilateral (via Asian Infrastructure Investment Bank - AIIB)",
    recipientEntity: "Government of Egypt",
    implementingEntity: "Egyptian Government",
    amountUSD: 150_000_000,
    amountEGP: 7_561_350_000,
    amountOriginalStr: "$150 million (AIIB Guarantee)",
    timeFrame: "Start Date: 2023",
    financialInstrument: "Guarantee",
    status: "Received",
    sector: "Transport, Digital Infrastructure",
    subsector: "Sustainable transport and digital connectivity",
    typeOfSupport: "Crosscutting",
    statusOfActivity: "Ongoing",
    useOfSupport: "Backs investments in sustainable transport and digital infrastructure to de-risk commercial financing.",
    impact: "Accelerates transport electrification and digital route optimization across major urban centers.",
    estimatedResults: "Enhanced creditworthiness for municipal green mobility and digital logistics projects."
  },
  {
    id: "BTR-REC-11",
    title: "CIB Senior Loan for Climate Finance Expansion",
    description: "Senior loan of up to $100 million from IFC to Commercial International Bank (CIB) to support SME green lending and decarbonization.",
    channel: "Bilateral (via International Finance Corporation - IFC)",
    recipientEntity: "Commercial International Bank (CIB)",
    implementingEntity: "IFC and CIB",
    amountUSD: 100_000_000,
    amountEGP: 5_040_900_000,
    amountOriginalStr: "$100 million USD",
    timeFrame: "Start Date: 2023",
    financialInstrument: "Senior Loan",
    status: "Received",
    sector: "Finance",
    subsector: "SME finance, climate risk management, sustainable finance",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Expands CIB's climate portfolio for private green investments and energy efficiency.",
    impact: "Enables private sector SMEs to adopt clean technologies and align with national NDC goals.",
    estimatedResults: "Increased financing for SMEs and sustainable projects, with enhanced environmental risk management."
  },
  {
    id: "BTR-REC-12",
    title: "Alcazar Energy Partners II – Egypt",
    description: "Supporting renewable energy infrastructure by developing a portfolio of greenfield solar, wind, and hydropower assets in Egypt.",
    channel: "Bilateral (via EIB)",
    recipientEntity: "Alcazar Energy Management Services Ltd, Egypt",
    implementingEntity: "EIB and Alcazar Energy",
    amountUSD: 75_000_000,
    amountEGP: 3_780_675_000,
    amountOriginalStr: "USD 75 million (EIB funding)",
    timeFrame: "Start Date: 2022",
    financialInstrument: "Concessional Loan",
    status: "Received",
    sector: "Energy",
    subsector: "Wind energy, solar energy, hydropower",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Financing greenfield renewable energy generation assets.",
    impact: "Promotes the development of renewable energy capacity and reduces reliance on fossil fuels.",
    estimatedResults: "Increased deployment of renewable energy technologies and enhanced energy access."
  },
  {
    id: "BTR-REC-13",
    title: "USAID Climate Change Adaptation Initiative with Egypt",
    description: "Grant approved by Parliament in July 2023 for ecosystem preservation, Red Sea biodiversity resilience, and community adaptation.",
    channel: "Bilateral (via USAID and Government of Egypt)",
    recipientEntity: "Government of Egypt",
    implementingEntity: "USAID",
    amountUSD: 15_000_000,
    amountEGP: 756_135_000,
    amountOriginalStr: "USD 15 million grant",
    timeFrame: "Start Date: September 2022",
    financialInstrument: "Grant",
    status: "Received",
    sector: "Crosscutting",
    subsector: "Climate adaptation, biodiversity preservation, emissions reduction",
    typeOfSupport: "Crosscutting",
    statusOfActivity: "Ongoing",
    useOfSupport: "Preserving coastal ecosystems, reducing emissions, and strengthening community resilience.",
    impact: "Protects sensitive marine habitats in the Red Sea and improves local climate resilience.",
    estimatedResults: "Enhanced ecosystem protection and localized climate risk response frameworks."
  },
  {
    id: "BTR-REC-14",
    title: "Suez Oil Processing Company Boiler Modernization & SAF Feasibility",
    description: "Grant for feasibility studies, boiler modernization at Suez Oil, and economic feasibility for Sustainable Aviation Fuel (SAF).",
    channel: "Bilateral (via European Union - EU)",
    recipientEntity: "Suez Oil Processing Company & Ministry of Petroleum",
    implementingEntity: "EU Project Management Unit",
    amountUSD: 13_680_474,
    amountEGP: 689_780_048,
    amountOriginalStr: "$13,680,474 USD",
    timeFrame: "2018",
    financialInstrument: "Grant",
    status: "Received",
    sector: "Energy",
    subsector: "Petroleum refining and energy efficiency",
    typeOfSupport: "Mitigation",
    statusOfActivity: "Ongoing",
    useOfSupport: "Modernizing boilers, low-carbon petroleum strategy, and SAF production assessments.",
    impact: "Minimizes industrial heat losses and establishes Egypt's roadmap for sustainable aviation fuels.",
    estimatedResults: "Completed technical audits and energy efficiency capacity building for sector engineers."
  }
];

// 5. TABLE 84: NEEDS FOR ENHANCING ENDOGENOUS TECHNOLOGIES
export const BTR_ENDOGENOUS_TECH_NEEDS: BTRTechNeededItem[] = [
  {
    sector: "Renewable Energy",
    project: "Decommissioning Inefficient Thermal Power Plants",
    technologyNeeded: "Solar and wind power generation, grid integration, energy storage",
    purpose: "Replace 5 GW of thermal power with 10 GW of renewables under NWFE & ISES 2035."
  },
  {
    sector: "Renewable Energy",
    project: "Solar Energy for Water Desalination",
    technologyNeeded: "Solar-powered reverse osmosis desalination technologies",
    purpose: "Address water scarcity in coastal areas without increasing fossil energy consumption."
  },
  {
    sector: "Renewable Energy",
    project: "Solar Irrigation Pumps",
    technologyNeeded: "Solar-powered water pumps and hybrid PV-diesel units",
    purpose: "Improve water efficiency in agriculture and eliminate diesel pumping fuel consumption."
  },
  {
    sector: "Energy Efficiency",
    project: "Grid Modernization and Energy Storage",
    technologyNeeded: "Advanced battery energy storage (BESS), smart grid telemetry",
    purpose: "Stabilize national energy grid with high renewable influx and mitigate intermittency."
  },
  {
    sector: "Energy Efficiency",
    project: "Energy-Efficient Industrial Technologies",
    technologyNeeded: "Advanced industrial manufacturing systems & IE3 electric motors",
    purpose: "Enhance thermal and electrical energy efficiency across energy-intensive heavy industries."
  },
  {
    sector: "Agriculture and Water",
    project: "Modernizing Irrigation Systems",
    technologyNeeded: "Drip irrigation, climate-resilient automated irrigation controls",
    purpose: "Conserve water on 4 million feddans and boost crop productivity by 10-15%."
  },
  {
    sector: "Agriculture and Water",
    project: "Smart Agricultural Practices",
    technologyNeeded: "Precision farming technologies, soil salinity sensors, drought seeds",
    purpose: "Increase resilience and productivity against extreme heatwaves and drought."
  },
  {
    sector: "Transport",
    project: "Electrification of Railways and Metro Lines",
    technologyNeeded: "Electric train traction, overhead catenary, metro signaling systems",
    purpose: "Transition to low-carbon mass transit and reduce diesel dependence in urban areas."
  },
  {
    sector: "Adaptation",
    project: "Multi-Hazard Early Warning Systems (MHEWS)",
    technologyNeeded: "Satellite meteorological telemetry, AI storm surge modeling, flash flood sensors",
    purpose: "Improve national resilience and emergency response to sea level rise and flash floods."
  },
  {
    sector: "Oil and Gas",
    project: "Methane Emission Reduction in Petroleum Sector",
    technologyNeeded: "Advanced Leak Detection and Repair (LDAR) Optical Gas Imaging & Satellites",
    purpose: "Improve methane monitoring and eliminate fugitive flaring at crude oil production sites."
  },
  {
    sector: "Oil and Gas",
    project: "Digitalization and Smart Energy Management",
    technologyNeeded: "AI-Based Energy Management and Blockchain for Carbon Accounting",
    purpose: "Enhance energy efficiency and verify carbon credit trading in international markets."
  }
];

// 6. TABLE 86: TECHNOLOGY DEVELOPMENT & TRANSFER SUPPORT RECEIVED
export const BTR_TECH_RECEIVED_PROJECTS: BTRTechReceivedProject[] = [
  {
    title: "Red Sea Wind Energy Project – Ras Ghareb 500 MW Onshore Wind Farm",
    description: "JBIC signed a $240M loan agreement with RED SEA WIND ENERGY S.A.E. Co-financed by EBRD, Sumitomo Mitsui, Norinchukin, and Société Générale for a total of $501 million.",
    typeOfTechnology: "500 MW utility-scale onshore wind turbine generators and grid interconnection.",
    channel: "Bilateral (JBIC, with multilateral consortium)",
    recipientEntity: "RED SEA WIND ENERGY S.A.E., Egyptian Electricity Transmission Company (EETC)",
    implementingEntity: "RED SEA WIND ENERGY S.A.E. & EETC",
    amountUSD: 240_000_000,
    timeFrame: "Start Date: 2022 (25-year PPA)",
    financialInstrument: "Concessional Loan / Project Finance ($501M total)",
    sector: "Energy",
    subsector: "Wind Renewable Energy, Grid Integration",
    typeOfSupport: "Mitigation",
    useOfSupport: "Construction and operation of 500 MW onshore wind farm in Ras Ghareb.",
    impact: "Massive generation of clean wind electricity, advancing Egypt's 42% RE target by 2035.",
    estimatedResults: "Displaces approx. 1,000,000 tCO2e annually and transfers state-of-the-art wind turbine technology."
  },
  {
    title: "Improved Management of E-Waste & Healthcare Waste (UPOPs / Air Pollution Project)",
    description: "World Bank GEF grant to develop hazardous electronic and medical waste treatment facilities and climate-friendly waste technologies in Greater Cairo.",
    typeOfTechnology: "E-waste dismantling technologies, autoclave healthcare waste treatment, and hazardous containment.",
    channel: "Bilateral (via Global Environment Facility - GEF)",
    recipientEntity: "Egyptian Environmental Affairs Agency (EEAA)",
    implementingEntity: "World Bank & EEAA",
    amountUSD: 9_130_000,
    timeFrame: "Start Date: 2023",
    financialInstrument: "Grant",
    sector: "Waste Management, Air Pollution",
    subsector: "Electronic waste, healthcare waste, hazardous waste",
    typeOfSupport: "Crosscutting",
    useOfSupport: "Develop waste treatment facilities, provide technical capacity, and implement e-waste recycling.",
    impact: "Reduces toxic emissions (UPOPs) and greenhouse gases from open burning and uncontrolled dumping.",
    estimatedResults: "Enhanced recycling facilities and protected public health across Greater Cairo."
  },
  {
    title: "Promoting Climate-Smart Agriculture and Biodiversity in Upper & Lower Egypt",
    description: "Funded through an $8 million grant from the Canadian Government, implemented by FAO in Aswan, Beheira, and Kafr El-Sheikh.",
    typeOfTechnology: "Climate-smart seed varieties, precision irrigation telemetry, and agrobiodiversity tools.",
    channel: "Bilateral (via Canada)",
    recipientEntity: "Government of Egypt (Ministry of Agriculture)",
    implementingEntity: "Food and Agriculture Organization (FAO)",
    amountUSD: 8_000_000,
    timeFrame: "2023 - 2027",
    financialInstrument: "Grant",
    sector: "Agriculture",
    subsector: "Climate-Smart Agriculture, Food Security",
    typeOfSupport: "Crosscutting",
    useOfSupport: "Builds capacity for 4,536 farmers to adopt climate-resilient farming and soil conservation.",
    impact: "Enhances adaptive capacity in rural communities with strong focus on women empowerment.",
    estimatedResults: "Increased crop resilience against heat stress and reduced water consumption."
  },
  {
    title: "Greening Hurghada – Climate Resilience & Biodiversity Conservation",
    description: "GEF/UNIDO project integrating sustainable and climate-smart technologies across tourism, energy, and transport sectors in Hurghada.",
    typeOfTechnology: "Solar thermal water heating, decentralized solar PV, and eco-friendly municipal transit.",
    channel: "Multilateral (GEF & Government of Egypt)",
    recipientEntity: "EEAA & Organization for Urban Development and Architecture (OUDA)",
    implementingEntity: "UNIDO",
    timeFrame: "2024 - 2028",
    financialInstrument: "Grant",
    sector: "Tourism, Energy",
    subsector: "Sustainable Tourism, Coastal Protection",
    typeOfSupport: "Crosscutting",
    useOfSupport: "De-risking green investments in hotels and integrating renewable energy into coastal infrastructure.",
    impact: "Reduces GHG emissions while safeguarding Red Sea coral reef ecosystems from thermal stress.",
    estimatedResults: "Adoption of green hotel standards and reduction of tourism footprint."
  },
  {
    title: "Cleantech Innovation for Climate Action and Energy Transition",
    description: "GCF funded, UNIDO managed project supporting local SMEs and startups in commercializing cleantech innovations.",
    typeOfTechnology: "Clean energy technologies, energy storage, and climate tech business incubation.",
    channel: "Bilateral (via Green Climate Fund - GCF)",
    recipientEntity: "Egyptian Private Sector, SMEs, Startups",
    implementingEntity: "UNIDO",
    timeFrame: "Start Date: 2024 (Ongoing)",
    financialInstrument: "Grant & Technical Assistance",
    sector: "Energy, Innovation",
    subsector: "Cleantech Startups, Private Sector Engagement",
    typeOfSupport: "Crosscutting",
    useOfSupport: "Enhancing SME capacity to develop and invest in clean energy technologies.",
    impact: "Strengthens Egypt's cleantech ecosystem and expands private sector participation in NDC goals.",
    estimatedResults: "Pipeline of bankable cleantech startups and local manufacturing acceleration."
  }
];

// 7. TABLE 87 & 88: CAPACITY BUILDING SUPPORT NEEDED & RECEIVED
export const BTR_CAPACITY_BUILDING_SUMMARY = {
  needed: [
    {
      category: "Institutional Strengthening",
      description: "Expanding CCCD with specialists in climate finance, adaptation, and mitigation; drafting national climate change law; and international negotiations training."
    },
    {
      category: "Establishing Climate Change Units (CCUs)",
      description: "Activating formal climate units across line ministries (Energy, Oil & Gas, Transport, Agriculture, Water, Industry, Waste) with standardized guidelines and tools."
    },
    {
      category: "Institutionalizing National MRV System",
      description: "Designing and operationalizing the centralized digital climate MRV data management platform and training sector focal points."
    },
    {
      category: "Enhancing Technical Capabilities",
      description: "Curricula in climate data management, IPCC 2006/2019 software modeling, Multi-Hazard Early Warning Systems (MHEWS), and coastal adaptation."
    }
  ],
  received: [
    {
      title: "National Solid Waste Management Programme (NSWMP) / EU GREEN",
      partner: "GIZ / EU / BMZ (2022-2026)",
      focus: "Capacity building for MoE, EEAA, WMRA, and line ministries on circular economy, waste MRV templates, and ISO 14067 product carbon footprinting."
    },
    {
      title: "Transforming Financial Systems for Climate (TFSC Egypt I & II)",
      partner: "UNDP / AFD / DAI (2022-2026)",
      focus: "MRV governance framework design, industrial MRV mapping, and assisting NBE in developing its Climate Change Strategy and Environmental & Social Risk Management."
    },
    {
      title: "Egyptian German Joint Committee on Renewable Energy & EE (JCEE)",
      partner: "GIZ / BMZ / MoERE (2023-2027)",
      focus: "Institutional development of sectoral Energy Efficiency Units, smart grid roadmap, and digital licensing for renewable energy projects."
    },
    {
      title: "30 by 30 Egypt & IESG Climate Finance Initiatives",
      partner: "IFC / CIB / Banque du Caire (2023)",
      focus: "Integrating ESG and climate risk management into commercial banking to achieve 30% climate finance portfolio share by 2030."
    },
    {
      title: "Green Sharm El Sheikh Sustainable Tourism",
      partner: "UNDP / MoE (2022)",
      focus: "Action plan for zero-carbon resort transformation, hotel energy audits, and sustainable waste segregation."
    },
    {
      title: "Connective Cities & Extreme Heat Resilience in Megacity Cairo",
      partner: "UDF / Cairo University / Cardiff University / Habitat for Humanity",
      focus: "Urban heat island modeling, microclimate satellite telemetry, and neighborhood heat action plans in Aswan and Cairo."
    }
  ]
};

// 8. TABLE 89 & 90: ARTICLE 13 TRANSPARENCY & MRV SUPPORT
export const BTR_ARTICLE_13_SUPPORT: BTRArticle13Support[] = [
  {
    title: "Development of Egypt's First BTR (1BTR) and Combined 2BTR + 5NC",
    description: "Assisting the Government of Egypt in preparing and submitting BTR1 and combining BTR2 with the Fifth National Communication (5NC) under the Paris Agreement ETF.",
    channel: "Global Environment Facility (GEF)",
    recipientEntity: "Egyptian Environmental Affairs Agency (EEAA)",
    implementingEntity: "United Nations Development Programme (UNDP)",
    amountUSD: "$1,233,000 (GEF Project Grant)",
    amountEGP: "EGP 62,154,297",
    timeFrame: "Start Date: 2024 (Ongoing)",
    status: "Ongoing",
    impact: "Strengthens national institutional arrangements, tools, and methodologies for transparent GHG inventorying and NDC tracking.",
    estimatedResults: "Delivered official BTR1 report, enhanced ETF compliance, and conducted 3-day national capacity-building workshop in Cairo (Oct 2024) for 64 government officials."
  },
  {
    title: "TFSC Egypt I – National MRV Governance & Industrial Mapping",
    description: "Design of the institutional MRV framework, data mapping templates for industry, and inter-ministerial coordination protocols.",
    channel: "Agence Française de Développement (AFD)",
    recipientEntity: "Egyptian Environmental Affairs Agency (EEAA)",
    implementingEntity: "UNDP",
    amountUSD: "1.6 Million USD",
    amountEGP: "EGP 80,654,400",
    timeFrame: "Jan 2023 - Dec 2026",
    status: "Ongoing",
    impact: "Provides institutional architecture for MRV units across line ministries.",
    estimatedResults: "Established standardized sector data collection protocols and capacity training."
  },
  {
    title: "Development of National NDC Tracking Tool",
    description: "Designing and deploying a digital software tool for data entry, progress tracking of quantitative & qualitative NDC targets, and generating CTF Table 4/5 outputs.",
    channel: "Bilateral (via JCEE / GIZ / BMZ)",
    recipientEntity: "Egyptian Environmental Affairs Agency (EEAA)",
    timeFrame: "Feb 2024 - Feb 2025",
    status: "Completed",
    impact: "Streamlines BTR compilation and automates progress calculations for Electricity, Oil & Gas, and Transport sectors.",
    estimatedResults: "Fully operationalized web platform for national NDC tracking aligned with Decision 18/CMA.1."
  },
  {
    title: "World Bank Diagnostic Assessment of National MRV System",
    description: "Evaluating regulatory frameworks, institutional structures, and technical capacities; comparing Egypt with 5 benchmark countries (including Germany and China) for digital automation.",
    channel: "World Bank (WB)",
    recipientEntity: "Government of Egypt",
    implementingEntity: "World Bank",
    timeFrame: "Start Date: 2023",
    status: "Completed (Ended)",
    impact: "Identified institutional barriers and developed a comprehensive roadmap for automated digital MRV implementation.",
    outputs: [
      "Diagnostic assessment report on regulatory gaps",
      "Comparative international analysis (China, Germany)",
      "Digital MRV implementation roadmap",
      "Stakeholder capacity workshops"
    ]
  },
  {
    title: "World Bank Assessment of Data & Procedures for MRV in Energy, O&G, and Transport",
    description: "Review of data collection practices, establishing sector guidelines, and designing QA/QC procedures aligned with 2006 IPCC Guidelines and Paris Agreement ETF.",
    channel: "World Bank (WB)",
    recipientEntity: "Government of Egypt",
    implementingEntity: "World Bank",
    timeFrame: "Start Date: 2024",
    status: "Ongoing",
    impact: "Enhances accuracy and verifiability of emissions activity data across the top 3 emitting sectors.",
    outputs: [
      "Sector-specific MRV guidelines for electricity, oil & gas, and transport",
      "Standardized data collection templates",
      "MRV automation framework design",
      "QA/QC protocol implementation"
    ]
  },
  {
    title: "World Bank Assessment of Capacity Improvements for MRV in Energy, O&G, and Transport",
    description: "Harmonizing IT systems, integrating automated reporting solutions, and establishing cross-sectoral data exchange mechanisms.",
    channel: "World Bank (WB)",
    recipientEntity: "Government of Egypt",
    implementingEntity: "World Bank",
    timeFrame: "Start Date: 2024",
    status: "Ongoing",
    impact: "Enables streamlined electronic data transmission between line ministries, holding companies, and CCCD/CAPMAS.",
    outputs: [
      "Harmonized MRV procedures for key sectors",
      "Digital emissions tracking system implementation",
      "Specialized training for ministerial focal points",
      "Cross-sectoral data exchange mechanisms"
    ]
  }
];
