const stockDatabase = [
  // Short-Term Growth Stocks (Volatile) - 50 stocks
  { symbol: 'TSLA', price: 180, type: 'short' },  // Tesla
  { symbol: 'NVDA', price: 450, type: 'short' },  // NVIDIA
  { symbol: 'AMD', price: 120, type: 'short' },    // AMD
  { symbol: 'META', price: 220, type: 'short' },   // Meta (Facebook)
  { symbol: 'SHOP', price: 65, type: 'short' },    // Shopify
  { symbol: 'SNOW', price: 140, type: 'short' },   // Snowflake
  { symbol: 'CRWD', price: 160, type: 'short' },   // CrowdStrike
  { symbol: 'NET', price: 75, type: 'short' },      // Cloudflare
  { symbol: 'DDOG', price: 95, type: 'short' },     // Datadog
  { symbol: 'UPST', price: 30, type: 'short' },     // Upstart
  { symbol: 'COIN', price: 85, type: 'short' },     // Coinbase
  { symbol: 'SQ', price: 60, type: 'short' },       // Block (Square)
  { symbol: 'MRNA', price: 110, type: 'short' },    // Moderna
  { symbol: 'PTON', price: 8, type: 'short' },      // Peloton
  { symbol: 'RIVN', price: 15, type: 'short' },     // Rivian
  { symbol: 'LCID', price: 6, type: 'short' },      // Lucid Motors
  { symbol: 'PLTR', price: 18, type: 'short' },     // Palantir
  { symbol: 'HOOD', price: 12, type: 'short' },     // Robinhood
  { symbol: 'AFRM', price: 22, type: 'short' },     // Affirm
  { symbol: 'SNAP', price: 11, type: 'short' },     // Snapchat
  { symbol: 'TWLO', price: 65, type: 'short' },     // Twilio
  { symbol: 'ZM', price: 70, type: 'short' },       // Zoom
  { symbol: 'DOCU', price: 55, type: 'short' },     // DocuSign
  { symbol: 'ASAN', price: 18, type: 'short' },     // Asana
  { symbol: 'U', price: 25, type: 'short' },        // Unity Software
  { symbol: 'RBLX', price: 30, type: 'short' },     // Roblox
  { symbol: 'AI', price: 28, type: 'short' },       // C3.ai
  { symbol: 'SPCE', price: 4, type: 'short' },      // Virgin Galactic
  { symbol: 'FSR', price: 6, type: 'short' },      // Fisker
  { symbol: 'NIO', price: 8, type: 'short' },       // NIO
  { symbol: 'XPEV', price: 10, type: 'short' },     // XPeng
  { symbol: 'LI', price: 30, type: 'short' },       // Li Auto
  { symbol: 'BYND', price: 8, type: 'short' },      // Beyond Meat
  { symbol: 'DKNG', price: 35, type: 'short' },     // DraftKings
  { symbol: 'PENN', price: 22, type: 'short' },     // Penn Entertainment
  { symbol: 'RKT', price: 8, type: 'short' },       // Rocket Companies
  { symbol: 'WISH', price: 5, type: 'short' },      // ContextLogic
  { symbol: 'CLOV', price: 1, type: 'short' },     // Clover Health
  { symbol: 'SDC', price: 0.5, type: 'short' },     // SmileDirectClub
  { symbol: 'BB', price: 5, type: 'short' },        // BlackBerry
  { symbol: 'NOK', price: 4, type: 'short' },       // Nokia
  { symbol: 'SENS', price: 1, type: 'short' },      // Senseonics
  { symbol: 'OCGN', price: 1, type: 'short' },      // Ocugen
  { symbol: 'BNGO', price: 0.5, type: 'short' },    // Bionano Genomics
  { symbol: 'ATOS', price: 0.3, type: 'short' },    // Atossa Therapeutics
  { symbol: 'CTRM', price: 0.2, type: 'short' },    // Castor Maritime
  { symbol: 'SOS', price: 2, type: 'short' },       // SOS Limited
  { symbol: 'MVIS', price: 3, type: 'short' },      // MicroVision
  { symbol: 'GME', price: 15, type: 'short' },      // GameStop
  { symbol: 'AMC', price: 5, type: 'short' },       // AMC Entertainment

  // Long-Term Value Stocks (Stable) - 50 stocks
  { symbol: 'JNJ', price: 160, type: 'long' },      // Johnson & Johnson
  { symbol: 'PG', price: 150, type: 'long' },       // Procter & Gamble
  { symbol: 'KO', price: 60, type: 'long' },        // Coca-Cola
  { symbol: 'PEP', price: 170, type: 'long' },      // PepsiCo
  { symbol: 'WMT', price: 160, type: 'long' },      // Walmart
  { symbol: 'MCD', price: 260, type: 'long' },      // McDonald's
  { symbol: 'VZ', price: 40, type: 'long' },        // Verizon
  { symbol: 'T', price: 18, type: 'long' },         // AT&T
  { symbol: 'O', price: 60, type: 'long' },         // Realty Income
  { symbol: 'MO', price: 45, type: 'long' },        // Altria
  { symbol: 'PM', price: 95, type: 'long' },        // Philip Morris
  { symbol: 'KHC', price: 36, type: 'long' },       // Kraft Heinz
  { symbol: 'CL', price: 75, type: 'long' },        // Colgate-Palmolive
  { symbol: 'GIS', price: 70, type: 'long' },       // General Mills
  { symbol: 'K', price: 60, type: 'long' },         // Kellogg's
  { symbol: 'HSY', price: 200, type: 'long' },      // Hershey
  { symbol: 'SYY', price: 75, type: 'long' },       // Sysco
  { symbol: 'ED', price: 90, type: 'long' },        // Consolidated Edison
  { symbol: 'DUK', price: 95, type: 'long' },       // Duke Energy
  { symbol: 'SO', price: 70, type: 'long' },        // Southern Company
  { symbol: 'D', price: 55, type: 'long' },         // Dominion Energy
  { symbol: 'NEE', price: 80, type: 'long' },       // NextEra Energy
  { symbol: 'AEP', price: 85, type: 'long' },       // American Electric Power
  { symbol: 'XEL', price: 65, type: 'long' },       // Xcel Energy
  { symbol: 'PPL', price: 28, type: 'long' },       // PPL Corporation
  { symbol: 'WEC', price: 90, type: 'long' },       // WEC Energy
  { symbol: 'AEE', price: 85, type: 'long' },       // Ameren
  { symbol: 'LNT', price: 55, type: 'long' },       // Alliant Energy
  { symbol: 'ATO', price: 110, type: 'long' },      // Atmos Energy
  { symbol: 'CMS', price: 60, type: 'long' },       // CMS Energy
  { symbol: 'AWK', price: 130, type: 'long' },      // American Water Works
  { symbol: 'CNP', price: 30, type: 'long' },       // CenterPoint Energy
  { symbol: 'DTE', price: 110, type: 'long' },      // DTE Energy
  { symbol: 'EIX', price: 70, type: 'long' },       // Edison International
  { symbol: 'ETR', price: 105, type: 'long' },      // Entergy
  { symbol: 'FE', price: 40, type: 'long' },        // FirstEnergy
  { symbol: 'PEG', price: 60, type: 'long' },       // Public Service Enterprise
  { symbol: 'PNW', price: 75, type: 'long' },       // Pinnacle West
  { symbol: 'SRE', price: 75, type: 'long' },       // Sempra Energy
  { symbol: 'WTRG', price: 150, type: 'long' },     // Essential Utilities
  { symbol: 'AES', price: 18, type: 'long' },       // AES Corporation
  { symbol: 'NRG', price: 40, type: 'long' },       // NRG Energy
  { symbol: 'PCG', price: 18, type: 'long' },       // PG&E
  { symbol: 'EXC', price: 40, type: 'long' },       // Exelon
  { symbol: 'EVRG', price: 55, type: 'long' },      // Evergy
  { symbol: 'NI', price: 30, type: 'long' },        // NiSource
  { symbol: 'PNM', price: 45, type: 'long' },       // PNM Resources
  { symbol: 'ALE', price: 55, type: 'long' },       // ALLETE
  { symbol: 'OTTR', price: 85, type: 'long' },      // Otter Tail Corporation

  // Mixed/Blue-Chip Stocks - 50 stocks
  { symbol: 'AAPL', price: 170, type: 'mixed' },    // Apple
  { symbol: 'MSFT', price: 300, type: 'mixed' },    // Microsoft
  { symbol: 'GOOGL', price: 130, type: 'mixed' },   // Alphabet (Google)
  { symbol: 'AMZN', price: 120, type: 'mixed' },    // Amazon
  { symbol: 'BRK.B', price: 350, type: 'mixed' },   // Berkshire Hathaway
  { symbol: 'JPM', price: 150, type: 'mixed' },     // JPMorgan Chase
  { symbol: 'V', price: 240, type: 'mixed' },       // Visa
  { symbol: 'MA', price: 380, type: 'mixed' },      // Mastercard
  { symbol: 'HD', price: 320, type: 'mixed' },      // Home Depot
  { symbol: 'COST', price: 500, type: 'mixed' },    // Costco
  { symbol: 'DIS', price: 90, type: 'mixed' },      // Disney
  { symbol: 'NFLX', price: 450, type: 'mixed' },    // Netflix
  { symbol: 'ADBE', price: 380, type: 'mixed' },    // Adobe
  { symbol: 'CRM', price: 210, type: 'mixed' },     // Salesforce
  { symbol: 'INTC', price: 35, type: 'mixed' },     // Intel
  { symbol: 'CSCO', price: 50, type: 'mixed' },     // Cisco
  { symbol: 'ORCL', price: 110, type: 'mixed' },    // Oracle
  { symbol: 'IBM', price: 140, type: 'mixed' },     // IBM
  { symbol: 'QCOM', price: 120, type: 'mixed' },    // Qualcomm
  { symbol: 'TXN', price: 160, type: 'mixed' },     // Texas Instruments
  { symbol: 'AVGO', price: 850, type: 'mixed' },    // Broadcom
  { symbol: 'ACN', price: 280, type: 'mixed' },     // Accenture
  { symbol: 'INTU', price: 500, type: 'mixed' },    // Intuit
  { symbol: 'PYPL', price: 60, type: 'mixed' },     // PayPal
  { symbol: 'ABNB', price: 120, type: 'mixed' },    // Airbnb
  { symbol: 'UBER', price: 45, type: 'mixed' },    // Uber
  { symbol: 'LYFT', price: 12, type: 'mixed' },     // Lyft
  { symbol: 'DASH', price: 95, type: 'mixed' },     // DoorDash
  { symbol: 'ZM', price: 70, type: 'mixed' },       // Zoom
  { symbol: 'ROKU', price: 65, type: 'mixed' },     // Roku
  { symbol: 'SPOT', price: 180, type: 'mixed' },    // Spotify
  { symbol: 'PINS', price: 25, type: 'mixed' },     // Pinterest
  { symbol: 'TWTR', price: 50, type: 'mixed' },     // Twitter (now X)
  { symbol: 'SNAP', price: 11, type: 'mixed' },     // Snap
  { symbol: 'CHWY', price: 35, type: 'mixed' },     // Chewy
  { symbol: 'ETSY', price: 70, type: 'mixed' },     // Etsy
  { symbol: 'FVRR', price: 25, type: 'mixed' },     // Fiverr
  { symbol: 'BIDU', price: 120, type: 'mixed' },    // Baidu
  { symbol: 'JD', price: 30, type: 'mixed' },       // JD.com
  { symbol: 'BABA', price: 80, type: 'mixed' },     // Alibaba
  { symbol: 'TCOM', price: 35, type: 'mixed' },     // Trip.com
  { symbol: 'PDD', price: 120, type: 'mixed' },     // Pinduoduo
  { symbol: 'NTES', price: 90, type: 'mixed' },     // NetEase
  { symbol: 'VIPS', price: 15, type: 'mixed' },     // Vipshop
  { symbol: 'YUM', price: 130, type: 'mixed' },     // Yum! Brands
  { symbol: 'SBUX', price: 90, type: 'mixed' },     // Starbucks
  { symbol: 'MGM', price: 45, type: 'mixed' },      // MGM Resorts
  { symbol: 'WYNN', price: 100, type: 'mixed' },    // Wynn Resorts
  { symbol: 'LVS', price: 50, type: 'mixed' }       // Las Vegas Sands
];

// Enhanced stock selection function
function selectStocks(investmentType, count = 12) {
  // Filter candidates based on investment type
  const typeFilter = investmentType === 'short' 
    ? ['short'] 
    : investmentType === 'long' 
      ? ['long'] 
      : ['short', 'long', 'mixed'];
  
  let candidates = stockDatabase.filter(stock => typeFilter.includes(stock.type));
  
  // Price categories
  const cheap = candidates.filter(s => s.price < 30);
  const medium = candidates.filter(s => s.price >= 30 && s.price < 150);
  const expensive = candidates.filter(s => s.price >= 150);
  
  // Determine allocation (adjustable ratios)
  const allocation = {
    cheap: 0.3,    // 30% cheap stocks
    medium: 0.5,   // 50% medium-priced
    expensive: 0.2 // 20% expensive
  };
  
  // Calculate counts for each category
  const cheapCount = Math.max(1, Math.floor(count * allocation.cheap));
  const mediumCount = Math.max(1, Math.floor(count * allocation.medium));
  const expensiveCount = Math.max(1, count - cheapCount - mediumCount);
  
  // Random selection function with Fisher-Yates shuffle
  const selectRandom = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };
  
  // Select from each category
  const selected = [
    ...selectRandom(cheap, cheapCount),
    ...selectRandom(medium, mediumCount),
    ...selectRandom(expensive, expensiveCount)
  ];
  
  // Final shuffle to mix categories
  let res = []
  let ran = selectRandom(selected, count)
  for( let i  in  ran){
    let stock = ran[i]
   
    res.push(stock.symbol)
  }
  return res;
}

export default selectStocks