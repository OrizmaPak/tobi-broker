window.APP_STATIC_DATA = {
  brand: {
    name: "BullPort",
    email: "support@bullport.com",
    phone: "+234 800 BULLPORT",
    address: "Lagos, Nigeria",
    supportHours: "Monday - Friday, 9:00 AM - 5:00 PM",
    tagline: "Multi-Asset Investing Built for Growth, Income and Control.",
    risk: "Market data is informational. Investing involves risk. Returns are not guaranteed.",
    marketHours: {
      label: "Global Markets",
      timeZone: "America/New_York",
      openDay: 0,
      openHour: 17,
      openMinute: 0,
      closeDay: 5,
      closeHour: 17,
      closeMinute: 0
    }
  },
  navigation: [
    { label: "Home", href: "index.html" },
    {
      label: "Markets",
      href: "pages/markets.html",
      children: [
        { label: "All Instruments", href: "pages/markets.html" },
        { label: "Stocks & ETFs", href: "pages/stocks-etfs.html" },
        { label: "Commodities", href: "pages/commodities.html" },
        { label: "Options", href: "pages/options.html" }
      ]
    },
    {
      label: "Portfolios",
      href: "pages/portfolios.html",
      children: [
        { label: "All Portfolios", href: "pages/portfolios.html" },
        { label: "Conservative Income", href: "pages/portfolio-conservative-income.html" },
        { label: "Balanced Growth", href: "pages/portfolio-balanced-growth.html" },
        { label: "Commodity Opportunity", href: "pages/portfolio-commodity-opportunity.html" },
        { label: "Dividend Income", href: "pages/portfolio-dividend-income.html" },
        { label: "Equity Growth", href: "pages/portfolio-equity-growth.html" },
        { label: "Premium Managed", href: "pages/portfolio-premium-managed.html" }
      ]
    },
    {
      label: "Education",
      href: "pages/education.html",
      children: [
        { label: "Investor Education", href: "pages/education.html" },
        { label: "Risk Disclosure", href: "pages/risk-disclosure.html" },
        { label: "FAQs", href: "pages/faqs.html" }
      ]
    },
    { label: "About", href: "pages/about.html" },
    { label: "Contact", href: "pages/contact.html" }
  ],
  footerNavigation: [
    { label: "Home", href: "index.html" },
    { label: "Portfolios", href: "pages/portfolios.html" },
    { label: "Markets", href: "pages/markets.html" },
    { label: "Stocks & ETFs", href: "pages/stocks-etfs.html" },
    { label: "Commodities", href: "pages/commodities.html" },
    { label: "Options", href: "pages/options.html" },
    { label: "How It Works", href: "pages/how-it-works.html" },
    { label: "Pricing & Fees", href: "pages/pricing-fees.html" },
    { label: "Education", href: "pages/education.html" },
    { label: "Risk Disclosure", href: "pages/risk-disclosure.html" },
    { label: "FAQs", href: "pages/faqs.html" },
    { label: "About", href: "pages/about.html" },
    { label: "Contact", href: "pages/contact.html" },
    { label: "Login", href: "pages/login.html" },
    { label: "Get Started", href: "pages/register.html" },
    { label: "Terms", href: "pages/terms.html" },
    { label: "Privacy", href: "pages/privacy.html" }
  ],
  heroSlides: [
    {
      eyebrow: "Managed Portfolios",
      title: "Multi-Asset Investing Built for Growth, Income and Control.",
      text: "Access managed portfolios, stocks, commodities, ETFs, bonds and options from one secure investment platform.",
      cta: "Explore Portfolios",
      href: "pages/portfolios.html"
    },
    {
      eyebrow: "Market Discovery",
      title: "Monitor Instruments, Risk and Opportunity Across Core Markets.",
      text: "Review market coverage for stocks, ETFs, commodities, bonds, indices and options education before you onboard.",
      cta: "View Markets",
      href: "pages/markets.html"
    },
    {
      eyebrow: "Client Onboarding",
      title: "Start with Education, Clear Fees and Suitability-First Access.",
      text: "Compare portfolios, disclosures, pricing and investor guides before moving into future account registration and portal workflows.",
      cta: "Create Account",
      href: "pages/register.html"
    }
  ],
  portfolios: [
    {
      slug: "conservative-income",
      title: "Conservative Income Portfolio",
      description: "A lower-volatility portfolio built for investors who want stability, recurring income positioning and controlled market exposure.",
      riskLevel: "Low",
      focus: "Bonds, dividend stocks, cash-like instruments",
      bestFor: "Stability and income",
      minimumInvestment: "$1,000",
      suggestedDuration: "12+ months",
      assetMix: "45% bonds, 30% dividend stocks, 15% broad ETFs, 10% cash-like instruments",
      estimatedReturnRange: "Projected 3% - 6% annually, simulated and not guaranteed",
      feeSummary: "Illustrative annual management fee from 0.75% plus normal execution costs where applicable.",
      dividendProfitStructure: "Income events can be posted for reporting and either reinvested or held in wallet balances when the portal is connected.",
      rebalancingInfo: "Reviewed quarterly to manage duration risk, issuer concentration and income stability.",
      disclaimer: "Even conservative allocations can decline in value. Income levels and capital preservation are not guaranteed.",
      image: "wp-content/uploads/2025/09/account-v1-1.jpg",
      allocation: [
        { label: "Bonds", value: 45 },
        { label: "Dividend Stocks", value: 30 },
        { label: "ETFs", value: 15 },
        { label: "Cash-Like", value: 10 }
      ]
    },
    {
      slug: "balanced-growth",
      title: "Balanced Growth Portfolio",
      description: "A diversified portfolio designed to combine market growth, income support and measured commodity exposure within a controlled risk profile.",
      riskLevel: "Medium",
      focus: "Stocks, ETFs, commodities and income assets",
      bestFor: "Balanced growth and controlled risk",
      minimumInvestment: "$2,500",
      suggestedDuration: "18+ months",
      assetMix: "40% diversified ETFs, 25% listed equities, 20% income assets, 15% commodities",
      estimatedReturnRange: "Projected 5% - 10% annually, estimated for illustration only",
      feeSummary: "Illustrative annual management fee from 1.00% with standard execution and custody cost assumptions.",
      dividendProfitStructure: "Income and realized gains can be reported monthly with optional reinvestment instructions.",
      rebalancingInfo: "Reviewed monthly to maintain allocation discipline and control drift across risk buckets.",
      disclaimer: "Balanced portfolios still carry market, liquidity and allocation risk. Actual returns can be lower or negative.",
      image: "wp-content/uploads/2025/09/account-v1-2.jpg",
      allocation: [
        { label: "ETFs", value: 40 },
        { label: "Equities", value: 25 },
        { label: "Income Assets", value: 20 },
        { label: "Commodities", value: 15 }
      ]
    },
    {
      slug: "commodity-opportunity",
      title: "Commodity Opportunity Portfolio",
      description: "A more active portfolio focused on real-asset themes, inflation sensitivity and commodity-linked market cycles.",
      riskLevel: "Medium to High",
      focus: "Gold, oil-linked products, agriculture commodities, commodity ETFs",
      bestFor: "Commodity exposure and inflation hedge",
      minimumInvestment: "$3,000",
      suggestedDuration: "12 - 24 months",
      assetMix: "35% gold and metals, 25% oil-linked products, 25% agriculture commodities, 15% commodity ETFs",
      estimatedReturnRange: "Projected 6% - 14% annually, simulated and highly market-dependent",
      feeSummary: "Illustrative annual management fee from 1.10% plus execution and roll-related costs where relevant.",
      dividendProfitStructure: "Commodity-linked positions may generate realized profit reports rather than recurring dividend income.",
      rebalancingInfo: "Reviewed monthly with exposure caps around energy volatility, seasonal agriculture moves and commodity concentration.",
      disclaimer: "Commodity strategies can be volatile and may react sharply to policy, supply disruptions and global pricing shocks.",
      image: "wp-content/uploads/2025/09/account-v1-3.jpg",
      allocation: [
        { label: "Metals", value: 35 },
        { label: "Energy", value: 25 },
        { label: "Agriculture", value: 25 },
        { label: "Commodity ETFs", value: 15 }
      ]
    },
    {
      slug: "dividend-income",
      title: "Dividend Income Portfolio",
      description: "An equity-income portfolio structured around dividend-paying stocks and ETFs for investors who want periodic income visibility.",
      riskLevel: "Medium",
      focus: "Dividend-paying stocks and ETFs",
      bestFor: "Periodic income",
      minimumInvestment: "$2,000",
      suggestedDuration: "18+ months",
      assetMix: "55% dividend stocks, 25% dividend ETFs, 10% bonds, 10% cash-like instruments",
      estimatedReturnRange: "Projected 4% - 9% annually, estimated and not guaranteed",
      feeSummary: "Illustrative annual management fee from 0.95% plus instrument-level transaction costs.",
      dividendProfitStructure: "Dividend receipts can be shown in periodic reports and may be reinvested or left as available balance.",
      rebalancingInfo: "Reviewed around earnings seasons, payout changes and valuation shifts across the dividend basket.",
      disclaimer: "Dividend payouts can be reduced, delayed or cancelled. Capital losses can outweigh income received.",
      image: "wp-content/uploads/2025/09/standard-account-v-1-1.jpg",
      allocation: [
        { label: "Dividend Stocks", value: 55 },
        { label: "Dividend ETFs", value: 25 },
        { label: "Bonds", value: 10 },
        { label: "Cash-Like", value: 10 }
      ]
    },
    {
      slug: "equity-growth",
      title: "Equity Growth Portfolio",
      description: "A higher-volatility portfolio for investors focused on capital growth through selected equities, sector themes and growth-oriented exposure.",
      riskLevel: "High",
      focus: "Growth stocks, sector ETFs, selected equities",
      bestFor: "Capital growth",
      minimumInvestment: "$5,000",
      suggestedDuration: "24+ months",
      assetMix: "60% growth stocks, 25% sector ETFs, 10% international equities, 5% cash-like instruments",
      estimatedReturnRange: "Projected 8% - 18% annually, simulated and subject to significant drawdown risk",
      feeSummary: "Illustrative annual management fee from 1.20% plus execution costs tied to active portfolio changes.",
      dividendProfitStructure: "Income may be limited. Performance reporting should distinguish unrealized gains from realized exits.",
      rebalancingInfo: "Reviewed monthly to manage sector concentration, valuation compression and volatility spikes.",
      disclaimer: "Growth portfolios can experience sharp losses over short periods. Investors should be prepared for higher drawdowns.",
      image: "wp-content/uploads/2025/09/all-market-1-2.jpg",
      allocation: [
        { label: "Growth Stocks", value: 60 },
        { label: "Sector ETFs", value: 25 },
        { label: "International", value: 10 },
        { label: "Cash-Like", value: 5 }
      ]
    },
    {
      slug: "premium-managed",
      title: "Premium Managed Portfolio",
      description: "A tailored managed solution aligned to investor profile, suitability review and custom allocation objectives.",
      riskLevel: "Custom",
      focus: "Tailored mix based on investor profile",
      bestFor: "Investors needing a managed approach",
      minimumInvestment: "$25,000",
      suggestedDuration: "Custom",
      assetMix: "Custom blend across stocks, ETFs, bonds, commodities, options-approved strategies and liquidity reserves",
      estimatedReturnRange: "Projected by mandate, simulated and dependent on investor objectives and market conditions",
      feeSummary: "Illustrative advisory and premium management fee set after mandate review, account scope and reporting requirements.",
      dividendProfitStructure: "Income, realized gains and portfolio reporting cadence are defined inside the agreed management mandate.",
      rebalancingInfo: "Managed according to client mandate with periodic review, suitability controls and portfolio oversight.",
      disclaimer: "Tailored portfolios still involve risk. Customization does not eliminate market loss, liquidity risk or execution risk.",
      image: "wp-content/uploads/2025/09/platform-v2-1.jpg",
      allocation: [
        { label: "Equities", value: 30 },
        { label: "ETFs", value: 25 },
        { label: "Bonds", value: 20 },
        { label: "Alternatives", value: 15 },
        { label: "Cash-Like", value: 10 }
      ]
    }
  ],
  instruments: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      assetClass: "Stock",
      price: 198.42,
      changePercent: 0.64,
      riskLevel: "Medium",
      chartData: [192, 194, 193, 196, 198],
      href: "pages/stocks-etfs.html"
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      assetClass: "Stock",
      price: 431.17,
      changePercent: 0.48,
      riskLevel: "Medium",
      chartData: [422, 424, 427, 429, 431],
      href: "pages/stocks-etfs.html"
    },
    {
      symbol: "SPY",
      name: "S&P 500 ETF",
      assetClass: "ETF",
      price: 589.18,
      changePercent: 0.31,
      riskLevel: "Medium",
      chartData: [580, 582, 585, 587, 589],
      href: "pages/stocks-etfs.html"
    },
    {
      symbol: "VEA",
      name: "Developed Markets ETF",
      assetClass: "ETF",
      price: 52.44,
      changePercent: -0.14,
      riskLevel: "Medium",
      chartData: [53.1, 52.9, 52.7, 52.6, 52.44],
      href: "pages/stocks-etfs.html"
    },
    {
      symbol: "GLD",
      name: "Gold ETF",
      assetClass: "Commodity ETF",
      price: 228.34,
      changePercent: -0.18,
      riskLevel: "Medium",
      chartData: [231, 230, 229.4, 228.9, 228.34],
      href: "pages/commodities.html"
    },
    {
      symbol: "USO",
      name: "Oil-Linked Fund",
      assetClass: "Commodity",
      price: 77.91,
      changePercent: 0.84,
      riskLevel: "Medium to High",
      chartData: [74.6, 75.3, 76.1, 77.2, 77.91],
      href: "pages/commodities.html"
    },
    {
      symbol: "COCOA",
      name: "Cocoa Basket",
      assetClass: "Commodity",
      price: 41.62,
      changePercent: 0.57,
      riskLevel: "Medium to High",
      chartData: [39.2, 39.8, 40.6, 41.1, 41.62],
      href: "pages/commodities.html"
    },
    {
      symbol: "BND",
      name: "Total Bond Market ETF",
      assetClass: "Bond",
      price: 72.25,
      changePercent: 0.09,
      riskLevel: "Low",
      chartData: [72.1, 72.0, 72.08, 72.14, 72.25],
      href: "pages/markets.html"
    },
    {
      symbol: "IEF",
      name: "7-10 Year Treasury ETF",
      assetClass: "Bond",
      price: 94.73,
      changePercent: -0.06,
      riskLevel: "Low",
      chartData: [95.1, 94.98, 94.9, 94.82, 94.73],
      href: "pages/markets.html"
    },
    {
      symbol: "NDX",
      name: "Nasdaq 100 Index",
      assetClass: "Index",
      price: 21342.70,
      changePercent: 0.52,
      riskLevel: "High",
      chartData: [20920, 21040, 21110, 21220, 21342],
      href: "pages/markets.html"
    },
    {
      symbol: "DJI",
      name: "Dow Jones Industrial Average",
      assetClass: "Index",
      price: 38966.50,
      changePercent: 0.21,
      riskLevel: "Medium",
      chartData: [38620, 38680, 38790, 38850, 38966],
      href: "pages/markets.html"
    },
    {
      symbol: "AAPL C210",
      name: "Apple Call Option",
      assetClass: "Option",
      price: 6.42,
      changePercent: -1.15,
      riskLevel: "High",
      chartData: [7.1, 6.95, 6.8, 6.6, 6.42],
      href: "pages/options.html"
    },
    {
      symbol: "SPY P560",
      name: "S&P 500 Put Option",
      assetClass: "Option",
      price: 8.17,
      changePercent: 1.42,
      riskLevel: "High",
      chartData: [7.5, 7.7, 7.9, 8.0, 8.17],
      href: "pages/options.html"
    }
  ],
  categories: [
    {
      name: "Stocks",
      image: "wp-content/uploads/2025/09/all-market-1-1.jpg",
      description: "Blue-chip, growth and dividend equities across sectors and regions.",
      href: "pages/stocks-etfs.html"
    },
    {
      name: "ETFs",
      image: "wp-content/uploads/2025/09/all-market-1-2.jpg",
      description: "Diversified funds for market, sector, dividend and international exposure.",
      href: "pages/stocks-etfs.html"
    },
    {
      name: "Commodities",
      image: "wp-content/uploads/2025/09/all-market-1-3.jpg",
      description: "Gold, oil-linked instruments, agriculture baskets and commodity ETFs.",
      href: "pages/commodities.html"
    },
    {
      name: "Bonds",
      image: "wp-content/uploads/2025/09/all-market-1-4.jpg",
      description: "Income-oriented fixed income exposure for conservative and balanced mandates.",
      href: "pages/markets.html"
    },
    {
      name: "Indices",
      image: "wp-content/uploads/2025/09/all-market-1-5.jpg",
      description: "Broad market and benchmark monitoring for portfolio construction and comparison.",
      href: "pages/markets.html"
    },
    {
      name: "Options",
      image: "wp-content/uploads/2025/09/all-market-1-6.jpg",
      description: "Advanced derivatives content with suitability, approval and risk warnings.",
      href: "pages/options.html"
    }
  ],
  fees: [
    {
      label: "Management fee",
      value: "0.75% - 1.20% annually",
      note: "Varies by portfolio type, investor profile and service level."
    },
    {
      label: "Performance fee",
      value: "Mandate-specific",
      note: "Only applies where explicitly agreed inside a premium management mandate."
    },
    {
      label: "Brokerage commission",
      value: "Illustrative 0.05% - 0.20%",
      note: "Depends on instrument, venue, order size and execution model."
    },
    {
      label: "Spread / market execution cost",
      value: "Market-based",
      note: "Can widen with volatility, lower liquidity or stressed market conditions."
    },
    {
      label: "Withdrawal fee",
      value: "Illustrative $0 - $25",
      note: "Final amount depends on payment rail, settlement method and jurisdiction."
    },
    {
      label: "Options fee",
      value: "Illustrative contract fee",
      note: "Applies only to approved options access and may include exchange or clearing charges."
    },
    {
      label: "Advisory / premium management fee",
      value: "Custom",
      note: "Quoted after suitability review, portfolio scope and reporting requirements are defined."
    }
  ],
  educationCategories: [
    "Understanding Risk",
    "Stocks & ETFs",
    "Commodities",
    "Dividends",
    "Options",
    "Portfolio Reporting"
  ],
  educationPosts: [
    {
      slug: "understanding-investment-risk",
      title: "Understanding Investment Risk",
      category: "Risk Management",
      image: "wp-content/uploads/2025/09/education-page-img1.jpg",
      summary: "A practical introduction to market risk, liquidity risk, concentration and time horizon.",
      readTime: "6 min read",
      body: [
        "Investment risk is the possibility that outcomes differ from expectations, including partial or total loss of capital.",
        "Risk should be reviewed through volatility, liquidity, concentration, investor objective and time horizon instead of headline return alone.",
        "No allocation removes risk entirely, so portfolio selection should start with suitability, downside tolerance and clear liquidity planning."
      ]
    },
    {
      slug: "what-are-stocks-and-etfs",
      title: "What Are Stocks and ETFs?",
      category: "Stocks & ETFs",
      image: "wp-content/uploads/2025/09/education-page-img2.jpg",
      summary: "How listed shares and exchange-traded funds can support growth, income and diversification.",
      readTime: "5 min read",
      body: [
        "Stocks represent ownership in listed companies and their prices can move with earnings, rates, sentiment and industry conditions.",
        "ETFs bundle securities into one traded instrument and can improve diversification across sectors, geographies or themes.",
        "Both asset classes can lose value, and real results are affected by costs, taxes, timing and market liquidity."
      ]
    },
    {
      slug: "how-commodity-investing-works",
      title: "How Commodity Investing Works",
      category: "Commodities",
      image: "wp-content/uploads/2025/09/education-page-img3.jpg",
      summary: "A guide to gold, oil-linked products, agriculture exposure and commodity-linked funds.",
      readTime: "7 min read",
      body: [
        "Commodity exposure can support diversification and inflation hedging, but prices can be cyclical and highly event-driven.",
        "Gold, oil-linked instruments, cocoa, maize, soybean and rice can react to weather, transport, policy, currency and global demand shifts.",
        "Commodity funds may not perfectly track spot prices because of roll costs, expenses, contract structure and liquidity conditions."
      ]
    },
    {
      slug: "dividends-and-profit-posting-explained",
      title: "Dividends and Profit Posting Explained",
      category: "Income Reporting",
      image: "wp-content/uploads/2025/09/education-page-img4.jpg",
      summary: "How income events, realized gains and investor reporting can be presented clearly.",
      readTime: "4 min read",
      body: [
        "Dividends are company distributions and can increase, decrease or stop based on issuer performance and board decisions.",
        "Profit reporting should distinguish realized gains from unrealized market movement so investors understand what has actually been booked.",
        "Fees, taxes and timing should be reviewed before deciding whether to withdraw or reinvest reported income."
      ]
    },
    {
      slug: "introduction-to-options-trading",
      title: "Introduction to Options Trading",
      category: "Options",
      image: "wp-content/uploads/2025/09/education-page-img5.jpg",
      summary: "Calls, puts, strike prices, expiries, premiums and why options access needs approval.",
      readTime: "8 min read",
      body: [
        "Options are contracts whose value can change quickly because of price movement, time decay, volatility and liquidity conditions.",
        "A call provides upside-oriented exposure while a put can provide downside or hedging exposure depending on how it is used.",
        "Options are not suitable for everyone and should be accessed only after suitability review and explicit approval."
      ]
    },
    {
      slug: "how-to-read-portfolio-performance",
      title: "How to Read Portfolio Performance",
      category: "Portfolio Reporting",
      image: "wp-content/uploads/2025/09/blog-page-v1-1.jpg",
      summary: "Understand returns, drawdowns, allocation drift, fees and reporting periods.",
      readTime: "6 min read",
      body: [
        "Portfolio performance should be reviewed over a defined period and alongside deposits, withdrawals, fees and benchmark context.",
        "Reports should separate contributions, income, realized gains and unrealized changes to avoid overstating progress.",
        "Projected returns are estimates for planning and comparison only. Actual outcomes depend on market behavior and investor actions."
      ]
    }
  ],
  faqs: [
    {
      question: "How do I create an account?",
      answer: "Use Get Started to enter the placeholder registration flow for account creation, KYC and suitability review."
    },
    {
      question: "Why is KYC required?",
      answer: "KYC helps verify identity, assess suitability and support compliance before funding or investment activity."
    },
    {
      question: "How will wallet funding work?",
      answer: "The public website is prepared for a future funding workflow. Live deposits and withdrawals should happen only inside the secure client portal."
    },
    {
      question: "How do I choose a portfolio?",
      answer: "Compare risk level, focus, minimum investment, suggested duration, estimated return range, fees and disclosures before selecting a portfolio."
    },
    {
      question: "How are dividends and profit reports shown?",
      answer: "Income and realized gain reporting should distinguish periodic distributions from unrealized movement and should remain subject to fees, taxes and market conditions."
    },
    {
      question: "How do withdrawals work?",
      answer: "Withdrawals are a future portal feature and should be handled only after authentication, KYC and payment method validation."
    },
    {
      question: "What fees should I expect?",
      answer: "The pricing page shows illustrative management, execution, options, withdrawal and advisory fee categories. Final fees should be confirmed before investment."
    },
    {
      question: "What are the main risks?",
      answer: "Risk depends on allocation and instrument type. Conservative, balanced and growth portfolios can all lose value under adverse market conditions."
    },
    {
      question: "How does options approval work?",
      answer: "Options access should require an application, suitability assessment and status review such as pending approval, approved, restricted or suspended."
    },
    {
      question: "How do I contact support?",
      answer: "Use the contact form or the support details on the contact page for onboarding, market, disclosure, pricing and portfolio questions."
    }
  ],
  riskDisclosures: [
    {
      title: "General Investment Risk",
      text: "All investing involves risk, including possible loss of principal. Past, projected or simulated performance is not a guarantee of future results."
    },
    {
      title: "Market Risk",
      text: "Prices can change because of earnings, rates, inflation, sentiment, policy changes and unexpected macro or geopolitical events."
    },
    {
      title: "Liquidity Risk",
      text: "Some instruments may be difficult to sell quickly or at expected prices, especially during stressed or thinly traded market periods."
    },
    {
      title: "Commodity Risk",
      text: "Commodity-linked exposure can be affected by weather, transport, storage, supply disruptions, sanctions, policy and futures-market structure."
    },
    {
      title: "Equity Risk",
      text: "Stocks and equity funds can decline because of company performance, valuation shifts, sector rotation and broad market weakness."
    },
    {
      title: "Options Risk",
      text: "Options are advanced instruments. They can lose value quickly, may expire worthless and may not be suitable for all investors."
    },
    {
      title: "Currency Risk",
      text: "Investments linked to foreign currency can gain or lose value because of exchange-rate movements and cross-border settlement conditions."
    },
    {
      title: "No Guaranteed Returns",
      text: "Returns, income, dividends and profits are not guaranteed. All return ranges shown are illustrative estimates for presentation."
    },
    {
      title: "User Responsibility",
      text: "Investors are responsible for reviewing suitability, objectives, risk tolerance, fees and disclosures before making any investment decision."
    },
    {
      title: "Not Financial Advice",
      text: "Public website content is educational and informational. It is not personal financial, tax or legal advice."
    },
    {
      title: "Regulatory / Compliance Placeholder",
      text: "Jurisdiction-specific licensing, marketing approvals and regulatory disclosures should be verified before public launch."
    }
  ],
  howItWorks: [
    {
      title: "Create Account",
      text: "Start with the placeholder registration flow for onboarding and suitability review."
    },
    {
      title: "Complete KYC",
      text: "Verify identity and investor profile before funding or product access is enabled."
    },
    {
      title: "Fund Wallet",
      text: "Prepare the future client wallet for secure deposits and withdrawals."
    },
    {
      title: "Choose Portfolio or Instrument",
      text: "Review risk, allocation, fees, disclosures and instrument education before proceeding."
    },
    {
      title: "Monitor Performance",
      text: "Track reporting, allocation drift, income events and market movement through future portal tools."
    },
    {
      title: "Receive or Reinvest",
      text: "Dividends or realized profits can be reported and later reinvested or withdrawn by instruction."
    }
  ],
  trust: [
    {
      title: "Transparent fees",
      text: "Clear pricing categories for management, execution, options access and premium advisory work."
    },
    {
      title: "Multi-asset access",
      text: "Portfolios, stocks, ETFs, commodities, bonds, indices and options education from one public site."
    },
    {
      title: "Risk-aware onboarding",
      text: "Suitability, KYC and disclosure-first positioning before any future client portal flow."
    },
    {
      title: "Portfolio reporting structure",
      text: "Content prepared for dividends, profit posting, fee visibility and future statement workflows."
    },
    {
      title: "Instrument monitoring",
      text: "Market tables and category pages for investor discovery without connecting to a live API."
    },
    {
      title: "Support readiness",
      text: "Public support routes for onboarding, education, risk, pricing and account questions."
    }
  ]
};
