(function () {
  const PAGE_META = {
    "index.html": { title: "Dashboard", subtitle: "Client dashboard overview" },
    "dashboard.html": { title: "Dashboard", subtitle: "Client dashboard overview" },
    "wallet.html": { title: "Wallet Overview", subtitle: "Wallet balance, funding summary and cash movement." },
    "deposit.html": { title: "Deposit Funds", subtitle: "Fund wallet before investing or trading." },
    "withdraw.html": { title: "Withdraw Funds", subtitle: "Request withdrawals from available wallet balance." },
    "transactions.html": { title: "Transactions", subtitle: "Wallet funding, withdrawals, fees and movement history." },
    "investment-plans.html": { title: "Investment Portfolios", subtitle: "Broker-managed portfolio models by risk and strategy." },
    "active-investments.html": { title: "My Investments", subtitle: "Monitor active portfolio subscriptions, value and next payouts." },
    "portfolio.html": { title: "Portfolio Details", subtitle: "Allocation, holdings, performance and exposure." },
    "dividends.html": { title: "Dividends & Profits", subtitle: "Dividend postings, profit credits and reinvestment activity." },
    "market.html": { title: "Markets", subtitle: "Multi-asset market watch across broker-supported instruments." },
    "trading.html": { title: "Trading Terminal", subtitle: "Instrument detail, chart view and broker trading actions." },
    "watchlist.html": { title: "Watchlist", subtitle: "Track preferred instruments, alerts and trade candidates." },
    "orders.html": { title: "Order Activity", subtitle: "Open, filled, cancelled and rejected trade activity." },
    "options-access.html": { title: "Options Access", subtitle: "Eligibility status, approval workflow and risk controls." },
    "risk.html": { title: "Risk Center", subtitle: "Profile, concentration, alerts and options suitability." },
    "reports.html": { title: "Reports & Statements", subtitle: "Statements, account summaries and export-ready records." },
    "notifications.html": { title: "Notifications", subtitle: "Account, funding, investment and market notifications." },
    "kyc.html": { title: "KYC Verification", subtitle: "Identity verification status, document checklist and next actions." },
    "profile.html": { title: "Profile", subtitle: "Client identity, contact information and account status." },
    "settings.html": { title: "Settings", subtitle: "Security, notification preferences and withdrawal controls." },
    "support.html": { title: "Support", subtitle: "Support channels, ticket tracking and broker help resources." },
    "components.html": { title: "Components", subtitle: "Named BullPort UI patterns for reuse across the dashboard and admin build." },
    "login.html": { title: "Client Login", subtitle: "Sign in to your BullPort broker dashboard." },
    "register.html": { title: "Create Account", subtitle: "Open your BullPort client portal account." },
    "forgot-password.html": { title: "Reset Password", subtitle: "Recover secure access to your client portal." },
    "analytics.html": { title: "Portfolio Insight", subtitle: "Portfolio analytics, allocation and performance context." },
    "alerts.html": { title: "Notifications", subtitle: "Price, portfolio and account alerts." },
    "charts.html": { title: "Portfolio Insight", subtitle: "Portfolio charts and market comparisons." },
    "tax.html": { title: "Reports & Statements", subtitle: "Tax-style summaries and downloadable records." },
    "screener.html": { title: "Markets", subtitle: "Instrument screening across supported asset classes." },
    "movers.html": { title: "Markets", subtitle: "Top gainers, losers and active instruments." },
    "earnings.html": { title: "Markets", subtitle: "Market events and scheduled releases." },
    "users.html": { title: "Support", subtitle: "Reference-only screen retained from the original template." },
    "docs.html": { title: "Reference", subtitle: "Template reference retained for internal use." }
  };

  const DEMO = {
    client: {
      name: "Tobi Adeyemi",
      tier: "Premium Managed",
      walletBalance: 24850,
      totalPortfolioValue: 164380,
      activeInvestments: 5,
      totalDividends: 12480,
      totalProfits: 18640,
      profitLoss: 14220,
      pendingWithdrawals: 2400,
      nextPayout: "12 Jul 2026",
      kycStatus: "Under final review",
      riskProfile: "Balanced",
      profileCompletion: 86,
      optionsStatus: "Level 2 review in progress",
      lastLogin: "Today, 10:25 AM",
      accountNo: "BP-447215",
      email: "tobi.adeyemi@example.com",
      phone: "+234 803 555 1476",
      country: "Nigeria",
      currency: "USD"
    },
    wallet: {
      available: 24850,
      reserved: 4200,
      pendingDeposit: 3500,
      pendingWithdrawal: 2400,
      monthlyInflow: 18200,
      monthlyOutflow: 7400,
      fees: 185,
      linkedBank: "Zenith Bank - 2014"
    },
    portfolioSeries: [
      { month: "Jan", value: 128400, profit: 2200, dividends: 540 },
      { month: "Feb", value: 131900, profit: 2740, dividends: 620 },
      { month: "Mar", value: 136500, profit: 3180, dividends: 810 },
      { month: "Apr", value: 145200, profit: 3640, dividends: 960 },
      { month: "May", value: 154800, profit: 4120, dividends: 1180 },
      { month: "Jun", value: 164380, profit: 4760, dividends: 1390 }
    ],
    allocation: [
      { label: "Stocks & ETFs", value: 32, amount: 52600 },
      { label: "Fixed Income", value: 24, amount: 39450 },
      { label: "Commodities", value: 18, amount: 29590 },
      { label: "Bonds & REITs", value: 16, amount: 26300 },
      { label: "Options Strategies", value: 10, amount: 16440 }
    ],
    plans: [
      {
        name: "Conservative Income Portfolio",
        risk: "Low",
        investor: "Beginners and capital-preservation investors",
        strategy: "Treasury bills, government bonds and money market instruments.",
        assets: "T-Bills, bonds, money market",
        projected: "6.8% to 9.4% annualized market-based projection",
        minimum: "$1,000",
        payout: "Monthly income distribution",
        button: "Review plan"
      },
      {
        name: "Balanced Growth Portfolio",
        risk: "Moderate",
        investor: "Salary earners and steady-growth investors",
        strategy: "Blends fixed income, dividend stocks, ETFs and commodity exposure.",
        assets: "ETFs, dividend stocks, fixed income, commodity basket",
        projected: "10.5% to 14.8% annualized projection",
        minimum: "$2,500",
        payout: "Quarterly distributions",
        button: "Explore allocation"
      },
      {
        name: "Commodity Opportunity Portfolio",
        risk: "Moderate / High",
        investor: "Commodity-focused investors",
        strategy: "Commodity-linked products across gold, cocoa, grains and energy.",
        assets: "Gold, crude-linked funds, cocoa, maize, soybean, commodity ETFs",
        projected: "12.2% to 18.9% annualized projection",
        minimum: "$5,000",
        payout: "Quarterly review cycle",
        button: "See commodity mix"
      },
      {
        name: "Dividend Income Portfolio",
        risk: "Moderate",
        investor: "Passive-income and long-term investors",
        strategy: "Income-led equity and fund exposure with REIT and bond support.",
        assets: "Dividend stocks, REITs, income ETFs, corporate bonds",
        projected: "8.9% to 13.1% annualized projection",
        minimum: "$3,500",
        payout: "Monthly and quarterly payouts",
        button: "View income profile"
      },
      {
        name: "Equity Growth Portfolio",
        risk: "High",
        investor: "Growth-focused investors",
        strategy: "Blue-chip and growth equity exposure across sectors and geographies.",
        assets: "Blue-chip stocks, growth stocks, sector ETFs, global equities",
        projected: "14.4% to 21.6% annualized projection",
        minimum: "$4,000",
        payout: "Growth-first, optional distributions",
        button: "Inspect holdings"
      },
      {
        name: "Premium Managed Portfolio",
        risk: "Custom",
        investor: "High-net-worth and bespoke managed accounts",
        strategy: "Broker-managed custom allocations across all supported asset classes.",
        assets: "Stocks, bonds, ETFs, commodities, REITs, alternatives",
        projected: "Mandate-based projection by portfolio mandate",
        minimum: "$25,000",
        payout: "Customized mandate schedule",
        button: "Book a portfolio call"
      }
    ],
    investments: [
      { name: "Balanced Growth Portfolio", invested: 42000, current: 47180, projected: "11.9%", payout: "12 Jul 2026", status: "Active", action: "Top up" },
      { name: "Dividend Income Portfolio", invested: 31000, current: 33810, projected: "9.7%", payout: "05 Jul 2026", status: "Income paid", action: "Reinvest" },
      { name: "Commodity Opportunity Portfolio", invested: 22500, current: 24890, projected: "13.4%", payout: "26 Jul 2026", status: "Active", action: "Review" },
      { name: "Equity Growth Portfolio", invested: 18000, current: 20160, projected: "14.8%", payout: "31 Jul 2026", status: "Active", action: "View details" },
      { name: "Conservative Income Portfolio", invested: 12000, current: 12340, projected: "7.1%", payout: "02 Jul 2026", status: "Active", action: "Withdraw income" }
    ],
    holdings: [
      { asset: "SPDR S&P 500 ETF", category: "ETF", allocation: "14%", price: "$564.12", change: "+1.8%", risk: "Moderate", status: "Investable" },
      { asset: "Dangote Cement Plc", category: "Stock", allocation: "11%", price: "$34.85", change: "+0.6%", risk: "Moderate", status: "Tradable" },
      { asset: "iShares Global REIT", category: "REIT", allocation: "9%", price: "$28.42", change: "+0.4%", risk: "Low / Moderate", status: "Investable" },
      { asset: "US Treasury 5Y", category: "Bond", allocation: "16%", price: "$99.14", change: "+0.2%", risk: "Low", status: "Income eligible" },
      { asset: "Gold Commodity Fund", category: "Commodity ETF", allocation: "12%", price: "$187.70", change: "+2.1%", risk: "Moderate / High", status: "Tradable" },
      { asset: "BullPort Covered Call Basket", category: "Options Strategy", allocation: "8%", price: "$41.18", change: "+1.3%", risk: "High", status: "Advanced access" }
    ],
    transactions: [
      { date: "27 Jun 2026", type: "Deposit", reference: "Bank transfer funding", amount: "+$3,500", status: "Pending" },
      { date: "25 Jun 2026", type: "Dividend credit", reference: "Dividend Income Portfolio", amount: "+$620", status: "Posted" },
      { date: "23 Jun 2026", type: "Portfolio subscription", reference: "Balanced Growth top-up", amount: "-$4,000", status: "Completed" },
      { date: "22 Jun 2026", type: "Withdrawal request", reference: "Wallet withdrawal to bank", amount: "-$2,400", status: "Under review" },
      { date: "18 Jun 2026", type: "Profit credit", reference: "Commodity Opportunity realized gain", amount: "+$810", status: "Posted" },
      { date: "14 Jun 2026", type: "Fee", reference: "Broker service and reporting", amount: "-$35", status: "Completed" }
    ],
    instruments: [
      { symbol: "AAPL", name: "Apple Inc.", category: "Stock", market: "NASDAQ", currency: "USD", price: "$213.80", risk: "Moderate", dividend: "Yes", tradable: "Yes", investable: "Yes", status: "Active" },
      { symbol: "GLD", name: "SPDR Gold Shares", category: "Commodity ETF", market: "NYSE Arca", currency: "USD", price: "$224.44", risk: "Moderate", dividend: "No", tradable: "Yes", investable: "Yes", status: "Active" },
      { symbol: "VNQ", name: "Vanguard Real Estate ETF", category: "REIT ETF", market: "NYSE", currency: "USD", price: "$86.51", risk: "Moderate", dividend: "Yes", tradable: "Yes", investable: "Yes", status: "Active" },
      { symbol: "US5Y", name: "US Treasury 5 Year", category: "Bond", market: "OTC", currency: "USD", price: "$99.14", risk: "Low", dividend: "No", tradable: "No", investable: "Yes", status: "Active" },
      { symbol: "XOM C115", name: "Exxon Jul Call 115", category: "Option", market: "OPRA", currency: "USD", price: "$3.60", risk: "High", dividend: "No", tradable: "Yes", investable: "No", status: "Restricted" },
      { symbol: "NGX30", name: "NGX 30 Index Tracker", category: "Index Fund", market: "NGX", currency: "USD", price: "$42.70", risk: "Moderate", dividend: "Yes", tradable: "Yes", investable: "Yes", status: "Active" }
    ],
    watchlist: [
      { symbol: "AAPL", theme: "Large-cap growth", price: "$213.80", move: "+1.8%", note: "Earnings support steady trend" },
      { symbol: "GLD", theme: "Inflation hedge", price: "$224.44", move: "+2.4%", note: "Commodity momentum remains positive" },
      { symbol: "VNQ", theme: "Income REITs", price: "$86.51", move: "+0.7%", note: "Yield remains attractive" },
      { symbol: "XOM C115", theme: "Covered call watch", price: "$3.60", move: "-0.3%", note: "Advanced options only" }
    ],
    orderActivity: [
      { instrument: "AAPL", side: "Buy", type: "Limit", quantity: "30 units", price: "$211.50", status: "Filled" },
      { instrument: "GLD", side: "Buy", type: "Market", quantity: "20 units", price: "$224.10", status: "Filled" },
      { instrument: "VNQ", side: "Sell", type: "Limit", quantity: "14 units", price: "$87.00", status: "Open" },
      { instrument: "XOM C115", side: "Buy", type: "Call Option", quantity: "2 contracts", price: "$3.55", status: "Approval required" }
    ],
    payouts: [
      { source: "Dividend Income Portfolio", date: "25 Jun 2026", type: "Dividend", amount: "$620", mode: "Credited to wallet", status: "Posted" },
      { source: "Commodity Opportunity Portfolio", date: "18 Jun 2026", type: "Profit", amount: "$810", mode: "Reinvested", status: "Posted" },
      { source: "Balanced Growth Portfolio", date: "12 Jul 2026", type: "Projected payout", amount: "$740", mode: "Pending selection", status: "Upcoming" },
      { source: "Conservative Income Portfolio", date: "02 Jul 2026", type: "Projected income", amount: "$210", mode: "Wallet credit", status: "Scheduled" }
    ],
    notifications: [
      { category: "KYC", title: "Proof of address received", time: "20 min ago", state: "In review" },
      { category: "Wallet", title: "Bank transfer deposit submitted", time: "2 hr ago", state: "Pending confirmation" },
      { category: "Portfolio", title: "Balanced Growth top-up completed", time: "1 day ago", state: "Completed" },
      { category: "Dividends", title: "Dividend Income payout posted", time: "2 days ago", state: "Credited" },
      { category: "Risk", title: "Commodity allocation moved above preferred range", time: "3 days ago", state: "Review suggested" }
    ],
    reports: [
      { name: "June 2026 Account Statement", type: "Statement", format: "PDF", period: "Monthly", status: "Ready" },
      { name: "Quarterly Portfolio Performance", type: "Performance report", format: "PDF / XLSX", period: "Q2 2026", status: "Ready" },
      { name: "Wallet Activity Export", type: "Transaction export", format: "CSV", period: "Last 90 days", status: "Ready" },
      { name: "Dividend and Profit Summary", type: "Income summary", format: "PDF", period: "Year to date", status: "Ready" }
    ],
    supportTickets: [
      { id: "#BP-1208", subject: "Withdrawal timing clarification", channel: "Portal ticket", priority: "Normal", status: "Awaiting broker response" },
      { id: "#BP-1191", subject: "Options access questionnaire", channel: "Email support", priority: "High", status: "Resolved" },
      { id: "#BP-1174", subject: "Bank account verification", channel: "Portal ticket", priority: "Normal", status: "Resolved" }
    ],
    kycChecklist: [
      { item: "Government-issued ID", state: "Approved" },
      { item: "Proof of address", state: "Under review" },
      { item: "Selfie / liveness check", state: "Approved" },
      { item: "Bank account confirmation", state: "Pending upload" }
    ],
    settings: [
      { label: "Two-factor authentication", value: "Enabled" },
      { label: "Login alert emails", value: "Enabled" },
      { label: "Withdrawal confirmation hold", value: "24 hours" },
      { label: "Preferred report currency", value: "USD" }
    ],
    risk: {
      score: "63 / 100",
      concentration: "Commodity exposure at 18%",
      options: "Advanced options access still restricted to level 2",
      liquidity: "Liquid reserve covers 6.2 months of planned withdrawals"
    }
  };

  const STATE_KEY = "bullport-portal-state-v1";
  const DEFAULT_STATE = {
    kycStatus: "Under final review",
    profileCompletion: 86,
    walletBalance: 24850,
    pendingDeposit: 3500,
    pendingWithdrawal: 2400,
    activeInvestments: 5,
    nextPayout: "12 Jul 2026",
    notifications: DEMO.notifications.slice(),
    transactions: DEMO.transactions.slice(),
    payouts: DEMO.payouts.slice()
  };

  const DEFAULT_API_BASE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? "http://127.0.0.1:4000" : "https://bullport-backend-tobi.vercel.app";
  const API_BASE = (localStorage.getItem("bullport_api_base") || DEFAULT_API_BASE).replace(/\/$/, "");
  const CLIENT_TOKEN_KEY = "bullport_client_token";
  const CLIENT_ID_KEY = "bullport_client_id";
  const DEMO_CLIENT_EMAIL = "tobi.adeyemi@example.com";
  const DEMO_CLIENT_PASSWORD = "ClientPass123!";
  const appState = {
    apiOnline: false,
    apiMessage: "Static fallback",
    apiLoaded: false,
    loadPromise: null,
    lastSync: null
  };

  const NAV_GROUPS = [
    { group: "Overview", items: [["Dashboard", "dashboard.html", "layout"], ["Notifications", "notifications.html", "bell"]] },
    { group: "Onboarding", items: [["KYC Verification", "kyc.html", "usercheck"]] },
    { group: "Wallet", items: [["Wallet Overview", "wallet.html", "wallet"], ["Deposit Funds", "deposit.html", "arrowdown"], ["Withdraw Funds", "withdraw.html", "arrowup"], ["Transactions", "transactions.html", "receipt"]] },
    { group: "Investments", items: [["Investment Portfolios", "investment-plans.html", "briefcase"], ["My Investments", "active-investments.html", "activity"], ["Portfolio Details", "portfolio.html", "pie"], ["Dividends & Profits", "dividends.html", "coins"]] },
    { group: "Trading", items: [["Markets", "market.html", "trend"], ["Trading Terminal", "trading.html", "candles"], ["Watchlist", "watchlist.html", "star"], ["Order Activity", "orders.html", "receipt"], ["Options Access", "options-access.html", "shield"], ["Risk Center", "risk.html", "alert"]] },
    { group: "Account", items: [["Reports & Statements", "reports.html", "file"], ["Support", "support.html", "help"], ["Profile", "profile.html", "user"], ["Settings", "settings.html", "settings"], ["Components", "components.html", "layout"]] }
  ];

  const activeItemClass = "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 bg-sidebar-accent text-sidebar-primary";
  const inactiveItemClass = "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground";
  const activeIconClass = "h-[18px] w-[18px] shrink-0 transition-colors text-sidebar-primary";
  const inactiveIconClass = "h-[18px] w-[18px] shrink-0 transition-colors text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80";
  const groupButtonClass = "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 transition-colors hover:text-sidebar-foreground/50";
  const groupWrapClass = "grid transition-all duration-200 ease-in-out grid-rows-[1fr] opacity-100";

  const iconPaths = {
    layout: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5"></path><path d="M18 12h.01"></path>',
    arrowdown: '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>',
    arrowup: '<path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path>',
    receipt: '<path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"></path><path d="M8 12h8"></path><path d="M8 16h8"></path><path d="M8 8h8"></path>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>',
    pie: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>',
    coins: '<circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="m6.71 10.83 2.58-1.66"></path>',
    trend: '<path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path>',
    candles: '<path d="M9 5v14"></path><path d="M15 5v14"></path><rect x="6" y="9" width="6" height="7" rx="1"></rect><rect x="12" y="7" width="6" height="9" rx="1"></rect>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"></path>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
    usercheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    settings: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle>',
    help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>'
  };

  function currentFile() {
    const file = location.pathname.split("/").pop() || "index.html";
    return file === "" ? "index.html" : file;
  }

  function isAuthPage() {
    const cur = currentFile();
    return cur === "login.html" || cur === "register.html" || cur === "forgot-password.html";
  }

  function svg(icon, active) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide ' + (active ? activeIconClass : inactiveIconClass) + '" aria-hidden="true">' + (iconPaths[icon] || iconPaths.layout) + "</svg>";
  }

  function money(value) {
    const sign = value < 0 ? "-" : "";
    return sign + "$" + Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function riskTone(risk) {
    const v = String(risk).toLowerCase();
    if (v.indexOf("low") !== -1) return "success";
    if (v.indexOf("high") !== -1) return "danger";
    if (v.indexOf("custom") !== -1) return "default";
    return "warning";
  }

  function statusTone(value) {
    const v = String(value).toLowerCase();
    if (v.indexOf("approved") !== -1 || v.indexOf("active") !== -1 || v.indexOf("completed") !== -1 || v.indexOf("posted") !== -1 || v.indexOf("ready") !== -1 || v.indexOf("credited") !== -1 || v.indexOf("resolved") !== -1 || v.indexOf("filled") !== -1 || v.indexOf("investable") !== -1 || v.indexOf("tradable") !== -1) {
      return "success";
    }
    if (v.indexOf("pending") !== -1 || v.indexOf("review") !== -1 || v.indexOf("upcoming") !== -1 || v.indexOf("scheduled") !== -1 || v.indexOf("open") !== -1 || v.indexOf("suggested") !== -1) {
      return "warning";
    }
    if (v.indexOf("restricted") !== -1 || v.indexOf("high") !== -1 || v.indexOf("required") !== -1) {
      return "danger";
    }
    return "default";
  }

  function badge(text, tone) {
    const tones = {
      success: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
      warning: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
      danger: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
      info: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
      default: "bg-primary/10 text-primary"
    };
    return '<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ' + (tones[tone] || tones.default) + '">' + text + "</span>";
  }

  function card(title, value, meta, accent) {
    return '<div class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-medium text-muted-foreground">' + title + '</p><p class="mt-3 text-2xl font-semibold tracking-tight">' + value + '</p><p class="mt-2 text-xs text-muted-foreground">' + meta + '</p></div><div class="rounded-lg px-2.5 py-1.5 text-xs font-semibold ' + accent + '">' + title.split(" ")[0] + "</div></div></div>";
  }

  function section(title, subtitle, body) {
    return '<section class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="mb-4 flex items-start justify-between gap-4"><div><h2 class="text-lg font-semibold tracking-tight">' + title + '</h2><p class="mt-1 text-sm text-muted-foreground">' + subtitle + "</p></div></div>" + body + "</section>";
  }

  function progressBar(value) {
    return '<div class="mt-3 h-2.5 rounded-full bg-muted"><div class="h-2.5 rounded-full bg-primary" style="width:' + value + '%"></div></div>';
  }

  function keyValueRows(rows) {
    return '<div class="grid gap-3 sm:grid-cols-2">' + rows.map(function (row) {
      return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">' + row.label + '</p><p class="mt-2 text-sm font-semibold">' + row.value + "</p></div>";
    }).join("") + "</div>";
  }

  function table(headers, rows) {
    return '<div class="overflow-x-auto rounded-xl border border-border/70"><table class="w-full min-w-[720px] text-sm"><thead class="bg-muted/40 text-left text-muted-foreground"><tr>' + headers.map(function (h) {
      return '<th class="px-4 py-3 font-medium">' + h + "</th>";
    }).join("") + '</tr></thead><tbody>' + rows.map(function (cells, index) {
      return '<tr class="' + (index !== rows.length - 1 ? "border-t border-border/70" : "") + '">' + cells.map(function (c) {
        return '<td class="px-4 py-3 align-top">' + c + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody></table></div>";
  }

  function miniList(items, mapper) {
    return '<div class="space-y-3">' + items.map(function (item) {
      return mapper(item);
    }).join("") + "</div>";
  }

  function bars(data, key, max) {
    return '<div class="space-y-4">' + data.map(function (item) {
      const value = item[key];
      const pct = Math.max(8, Math.round((value / max) * 100));
      return '<div><div class="mb-1.5 flex items-center justify-between gap-3 text-sm"><span class="font-medium">' + item.label + '</span><span class="text-muted-foreground">' + (item.amount ? money(item.amount) : value + "%") + '</span></div><div class="h-2.5 rounded-full bg-muted"><div class="h-2.5 rounded-full bg-primary" style="width:' + pct + '%"></div></div></div>';
    }).join("") + "</div>";
  }

  function lineChart(series, key) {
    const max = Math.max.apply(Math, series.map(function (d) { return d[key]; }));
    const min = Math.min.apply(Math, series.map(function (d) { return d[key]; }));
    const points = series.map(function (item, index) {
      const x = 30 + (index * 98);
      const normalized = (item[key] - min) / ((max - min) || 1);
      const y = 150 - (normalized * 110);
      return x + "," + y;
    }).join(" ");
    const labels = series.map(function (item, index) {
      const x = 30 + (index * 98);
      return '<text x="' + x + '" y="180" text-anchor="middle" class="broker-axis-label">' + item.month + "</text>";
    }).join("");
    return '<div class="rounded-xl border border-border/70 bg-background/60 p-4"><svg viewBox="0 0 560 190" class="w-full"><defs><linearGradient id="brokerLineFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="currentColor" stop-opacity="0.22"></stop><stop offset="100%" stop-color="currentColor" stop-opacity="0"></stop></linearGradient></defs><polyline fill="none" stroke="currentColor" stroke-width="3" class="text-primary" points="' + points + '"></polyline><polygon fill="url(#brokerLineFill)" class="text-primary" points="' + points + ' 520,170 30,170"></polygon>' + labels + "</svg></div>";
  }

  function currentMeta() {
    const cur = currentFile();
    return PAGE_META[cur] || PAGE_META["dashboard.html"];
  }

  function getState() {
    try {
      const raw = sessionStorage.getItem(STATE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      return Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_STATE)), JSON.parse(raw));
    } catch (error) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function saveState(state) {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function cloneList(rows) {
    return Array.isArray(rows) ? rows.slice() : [];
  }

  function replaceList(target, rows) {
    if (!Array.isArray(target)) return;
    target.splice.apply(target, [0, target.length].concat(rows || []));
  }

  function labelize(value) {
    return String(value || "")
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
      .join(" ");
  }

  function numberValue(value) {
    const next = Number(value);
    return Number.isFinite(next) ? next : 0;
  }

  function signedMoney(value) {
    const amount = numberValue(value);
    return (amount > 0 ? "+" : "") + money(amount);
  }

  function formatDate(value) {
    if (!value) return "Not scheduled";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, " ");
  }

  function relativeTime(value) {
    if (!value) return "Recently";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";
    const diff = Date.now() - date.getTime();
    const minutes = Math.max(1, Math.round(diff / 60000));
    if (minutes < 60) return minutes + " min ago";
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + " hr ago";
    return formatDate(value);
  }

  function derivedPrice(row, index) {
    const seed = String(row.symbol || row.name || "").split("").reduce(function (sum, char) {
      return sum + char.charCodeAt(0);
    }, 0);
    if (String(row.category).toLowerCase().indexOf("bond") !== -1) return (96 + (index * 0.42)).toFixed(2);
    if (String(row.category).toLowerCase().indexOf("commod") !== -1) return (2300 + seed).toLocaleString("en-US", { maximumFractionDigits: 0 });
    return (42 + (seed % 180) + (index * 1.35)).toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function productAssets(name) {
    const value = String(name).toLowerCase();
    if (value.indexOf("conservative") !== -1) return "Treasury bills, bonds, money market";
    if (value.indexOf("commodity") !== -1) return "Gold, energy, commodity ETFs";
    if (value.indexOf("dividend") !== -1) return "Dividend stocks, ETFs, REITs";
    if (value.indexOf("equity") !== -1) return "Growth stocks, indices, ETFs";
    if (value.indexOf("premium") !== -1) return "Managed multi-asset mandates";
    return "Stocks, bonds, ETFs and income assets";
  }

  function productInvestor(name, risk) {
    const value = String(name).toLowerCase();
    if (value.indexOf("premium") !== -1) return "High-value clients needing managed allocation";
    if (value.indexOf("conservative") !== -1) return "Capital preservation and income-focused clients";
    if (value.indexOf("commodity") !== -1) return "Experienced investors accepting higher volatility";
    if (value.indexOf("dividend") !== -1) return "Clients seeking recurring income";
    if (String(risk).toLowerCase().indexOf("high") !== -1) return "Growth-focused investors with higher risk tolerance";
    return "Balanced investors building diversified exposure";
  }

  function mapPlan(product) {
    const risk = labelize(product.riskLevel);
    return {
      id: product.id,
      name: product.name,
      risk: risk,
      investor: productInvestor(product.name, risk),
      strategy: product.description || (product.name + " broker-managed portfolio product."),
      assets: productAssets(product.name),
      projected: "Projected market-based performance; returns are not guaranteed.",
      minimum: money(numberValue(product.minimum)),
      payout: (product.payoutRule || "Scheduled") + " payout rule",
      button: "Review plan"
    };
  }

  function mapInstrument(row, index) {
    const category = row.category || "Market";
    const risk = labelize(row.riskLevel || "Moderate");
    const status = row.status || "Watch";
    const tradable = /tradable/i.test(status) ? "Yes" : (/access/i.test(status) ? "Approval required" : "No");
    const investable = /investable|tradable/i.test(status) ? "Yes" : (/access/i.test(status) ? "Gated" : "Watch only");
    return {
      symbol: row.symbol,
      name: row.name,
      category: category,
      market: row.market || "Global",
      currency: "USD",
      price: "$" + derivedPrice(row, index),
      risk: risk,
      dividend: /stocks|etfs|bonds|reits/i.test(category) ? "Eligible" : "No",
      tradable: tradable,
      investable: investable,
      status: status
    };
  }

  function syncBackendData(data) {
    if (!data || !data.client) return;
    const metrics = data.metrics || {};
    const client = data.client || {};
    const wallet = data.wallet || {};
    const transactions = cloneList(data.transactions);
    const products = cloneList(data.products);
    const investments = cloneList(data.investments);
    const instruments = cloneList(data.instruments);
    const payouts = cloneList(data.payouts);
    const notifications = cloneList(data.notifications);
    const reports = cloneList(data.reports);
    const tickets = cloneList(data.supportTickets);
    const kycReviews = cloneList(data.kycReviews);

    DEMO.client.name = client.name || DEMO.client.name;
    DEMO.client.email = client.email || DEMO.client.email;
    DEMO.client.phone = client.phone || DEMO.client.phone;
    DEMO.client.accountNo = client.accountNumber || DEMO.client.accountNo;
    DEMO.client.tier = client.tier || DEMO.client.tier;
    DEMO.client.riskProfile = client.riskLevel || DEMO.client.riskProfile;
    DEMO.client.kycStatus = client.kycStatus || DEMO.client.kycStatus;
    DEMO.client.walletBalance = numberValue(metrics.walletBalance);
    DEMO.client.totalPortfolioValue = numberValue(metrics.totalPortfolioValue);
    DEMO.client.activeInvestments = numberValue(metrics.activeInvestments);
    DEMO.client.totalDividends = numberValue(metrics.totalDividends);
    DEMO.client.totalProfits = numberValue(metrics.totalProfits);
    DEMO.client.profitLoss = numberValue(metrics.profitLoss);
    DEMO.client.pendingWithdrawals = numberValue(metrics.pendingWithdrawals);
    DEMO.client.profileCompletion = numberValue(metrics.profileCompletion || 86);
    DEMO.client.nextPayout = formatDate(metrics.nextPayoutDate);

    DEMO.wallet.available = numberValue(wallet.available ?? metrics.walletBalance);
    DEMO.wallet.reserved = numberValue(metrics.walletReserved);
    DEMO.wallet.pendingDeposit = numberValue(metrics.pendingDeposits);
    DEMO.wallet.pendingWithdrawal = numberValue(metrics.pendingWithdrawals);
    DEMO.wallet.monthlyInflow = transactions.filter(function (row) { return numberValue(row.amount) > 0; }).reduce(function (sum, row) { return sum + numberValue(row.amount); }, 0);
    DEMO.wallet.monthlyOutflow = Math.abs(transactions.filter(function (row) { return numberValue(row.amount) < 0; }).reduce(function (sum, row) { return sum + numberValue(row.amount); }, 0));

    replaceList(DEMO.plans, products.map(mapPlan));
    replaceList(DEMO.instruments, instruments.map(mapInstrument));
    replaceList(DEMO.watchlist, DEMO.instruments.slice(0, 6).map(function (row, index) {
      return {
        symbol: row.symbol,
        theme: row.name,
        price: row.price,
        move: index % 3 === 0 ? "-0.4%" : "+" + (0.8 + index * 0.35).toFixed(1) + "%",
        note: row.category + " exposure monitored from " + row.market + "."
      };
    }));
    replaceList(DEMO.investments, investments.map(function (row) {
      return {
        name: row.product ? row.product.name : "Portfolio mandate",
        invested: numberValue(row.investedAmount),
        current: numberValue(row.currentValue),
        projected: "Projected / market-based",
        payout: row.nextAction || DEMO.client.nextPayout,
        status: labelize(row.status),
        action: row.status === "ACTIVE" ? "Review" : "Continue"
      };
    }));
    replaceList(DEMO.holdings, DEMO.instruments.slice(0, 7).map(function (row, index) {
      return {
        asset: row.name,
        category: row.category,
        allocation: (18 - index * 2) + "%",
        price: row.price,
        change: index % 2 === 0 ? "+1." + index + "%" : "-0." + index + "%",
        risk: row.risk,
        status: row.status
      };
    }));
    replaceList(DEMO.payouts, payouts.map(function (row) {
      return {
        source: row.source,
        date: formatDate(row.payoutDate),
        type: row.mode || "Payout",
        amount: money(numberValue(row.amount)),
        mode: row.mode || "Wallet credit",
        status: labelize(row.status)
      };
    }));
    replaceList(DEMO.reports, reports.map(function (row) {
      return {
        name: row.name,
        type: row.type,
        format: row.format,
        period: row.period,
        status: row.status
      };
    }));
    replaceList(DEMO.supportTickets, tickets.map(function (row) {
      return {
        id: row.ticketNo || row.id,
        subject: row.subject,
        channel: row.owner || "Support desk",
        priority: row.priority,
        status: labelize(row.status)
      };
    }));
    replaceList(DEMO.kycChecklist, kycReviews.map(function (row) {
      return {
        item: row.requirement,
        state: labelize(row.status)
      };
    }));
    if (!DEMO.kycChecklist.length) {
      replaceList(DEMO.kycChecklist, [
        { item: "Identity verification", state: "Not Started" },
        { item: "Proof of address", state: "Not Started" },
        { item: "Bank settlement review", state: "Not Started" }
      ]);
    }
    replaceList(DEMO.notifications, notifications.map(function (row) {
      return {
        category: row.category,
        title: row.title,
        time: relativeTime(row.createdAt),
        state: row.readAt ? "Read" : "New"
      };
    }));

    const state = getState();
    state.walletBalance = numberValue(metrics.walletBalance);
    state.pendingDeposit = numberValue(metrics.pendingDeposits);
    state.pendingWithdrawal = numberValue(metrics.pendingWithdrawals);
    state.activeInvestments = numberValue(metrics.activeInvestments);
    state.nextPayout = formatDate(metrics.nextPayoutDate);
    state.kycStatus = client.kycStatus || state.kycStatus;
    state.profileCompletion = numberValue(metrics.profileCompletion || state.profileCompletion);
    state.notifications = DEMO.notifications.slice();
    state.transactions = transactions.map(function (row) {
      return {
        date: formatDate(row.date),
        type: row.type,
        reference: row.reference,
        amount: signedMoney(row.amount),
        status: row.status
      };
    });
    state.payouts = DEMO.payouts.slice();
    saveState(state);
  }

  async function apiRequest(path, options, allowGuest) {
    const controller = window.AbortController ? new AbortController() : null;
    const timeout = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;
    const headers = Object.assign({ "Content-Type": "application/json" }, (options && options.headers) || {});
    if (!allowGuest) {
      const token = localStorage.getItem(CLIENT_TOKEN_KEY);
      if (token) headers.Authorization = "Bearer " + token;
    }

    try {
      const response = await fetch(API_BASE + path, Object.assign({}, options || {}, {
        headers: headers,
        signal: controller ? controller.signal : undefined
      }));
      const payload = await response.json().catch(function () { return {}; });
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error && payload.error.message ? payload.error.message : "Request failed");
      }
      return payload.data;
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  async function ensureDemoClientToken() {
    const existing = localStorage.getItem(CLIENT_TOKEN_KEY);
    if (existing) return existing;
    const data = await apiRequest("/api/auth/client/login", {
      method: "POST",
      body: JSON.stringify({ email: DEMO_CLIENT_EMAIL, password: DEMO_CLIENT_PASSWORD })
    }, true);
    localStorage.setItem(CLIENT_TOKEN_KEY, data.token);
    localStorage.setItem(CLIENT_ID_KEY, data.client.id);
    return data.token;
  }

  async function loadClientBackendData(force) {
    if (!force && appState.apiLoaded) return true;
    if (!force && appState.loadPromise) return appState.loadPromise;
    appState.loadPromise = (async function () {
      try {
        if (!localStorage.getItem(CLIENT_TOKEN_KEY) && !isAuthPage()) {
          await ensureDemoClientToken();
        }
        if (!localStorage.getItem(CLIENT_TOKEN_KEY)) {
          appState.apiOnline = false;
          appState.apiMessage = "Sign in to sync";
          appState.apiLoaded = true;
          return false;
        }
        const data = await apiRequest("/api/client/dashboard", { method: "GET" }, false);
        syncBackendData(data);
        appState.apiOnline = true;
        appState.apiMessage = "API live";
        appState.apiLoaded = true;
        appState.lastSync = new Date();
        return true;
      } catch (error) {
        appState.apiOnline = false;
        appState.apiMessage = error && error.message ? error.message : "Static fallback";
        appState.apiLoaded = true;
        return false;
      } finally {
        appState.loadPromise = null;
      }
    })();
    return appState.loadPromise;
  }

  async function refreshLiveView(message, tone) {
    await loadClientBackendData(true);
    renderPage();
    patchChromeUI();
    bindActions();
    patchApiStatus();
    if (message) toast(message, tone || "success");
  }

  function authFormValues(node) {
    const form = node && node.closest ? node.closest("form") : null;
    const inputs = form ? form.querySelectorAll("input") : [];
    const email = inputs[0] && inputs[0].value ? inputs[0].value.trim() : DEMO_CLIENT_EMAIL;
    const password = inputs[1] && inputs[1].value ? inputs[1].value : DEMO_CLIENT_PASSWORD;
    const country = inputs[2] && inputs[2].value ? inputs[2].value.trim() : "Nigeria";
    const fallbackName = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
    return {
      email: email,
      password: password,
      country: country,
      name: fallbackName || "BullPort Client"
    };
  }

  function patchApiStatus() {
    let node = document.getElementById("broker-api-status");
    if (!node) {
      node = document.createElement("div");
      node.id = "broker-api-status";
      document.body.appendChild(node);
    }
    node.className = "broker-api-status " + (appState.apiOnline ? "is-live" : "is-static");
    node.innerHTML = '<span></span><strong>' + (appState.apiOnline ? "API live" : "Static mode") + '</strong><em>' + (appState.apiOnline && appState.lastSync ? "Synced " + appState.lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : appState.apiMessage) + "</em>";
  }

  function pushNotification(state, category, title, status) {
    state.notifications.unshift({
      category: category,
      title: title,
      time: "Just now",
      state: status
    });
    state.notifications = state.notifications.slice(0, 8);
  }

  function pushTransaction(state, type, reference, amount, status) {
    const now = new Date();
    const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, " ");
    state.transactions.unshift({
      date: date,
      type: type,
      reference: reference,
      amount: amount,
      status: status
    });
    state.transactions = state.transactions.slice(0, 10);
  }

  function buildNav() {
    const cur = currentFile();
    return NAV_GROUPS.map(function (group) {
      return '<div><button class="' + groupButtonClass + '"><span class="flex-1 text-start">' + group.group + '</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-3 transition-transform duration-200 rotate-90" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg></button><div class="' + groupWrapClass + '"><div class="overflow-hidden"><div class="mt-1 space-y-0.5">' + group.items.map(function (item) {
        const label = item[0];
        const href = item[1];
        const icon = item[2];
        const active = (cur === href) || (cur === "index.html" && href === "dashboard.html");
        return '<a ' + (active ? 'aria-current="page"' : "") + ' class="' + (active ? activeItemClass : inactiveItemClass) + '" href="' + href + '">' + svg(icon, active) + '<span class="flex-1">' + label + "</span></a>";
      }).join("") + "</div></div></div></div>";
    }).join("");
  }

  function findMain() {
    return document.querySelector("main") || document.querySelector("#main-content");
  }

  function shell(title, subtitle, body) {
    const state = getState();
    return '<div id="main-content" class="space-y-6">' +
      '<section class="rounded-xl border border-border bg-card p-6 shadow-sm"><div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">BullPort client portal</div><h1 class="mt-3 text-3xl font-semibold tracking-tight">' + title + '</h1><p class="mt-2 max-w-3xl text-sm text-muted-foreground">' + subtitle + '</p><div class="mt-4 flex flex-wrap gap-3"><button type="button" data-broker-action="goto-deposit" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Fund wallet</button><button type="button" data-broker-action="goto-kyc" class="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">Review KYC</button><button type="button" data-broker-action="goto-reports" class="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">Open reports</button></div></div><div class="grid gap-3 sm:grid-cols-3 xl:w-[440px]"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Client</p><p class="mt-2 text-sm font-semibold">' + DEMO.client.name + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk profile</p><p class="mt-2 text-sm font-semibold">' + DEMO.client.riskProfile + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Next payout</p><p class="mt-2 text-sm font-semibold" data-broker-next-payout>' + state.nextPayout + '</p></div></div></div></section>' +
      '<section class="lg:hidden rounded-xl border border-border bg-card p-4 shadow-sm"><div class="flex gap-2 overflow-x-auto pb-1"><a class="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium" href="dashboard.html">Dashboard</a><a class="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium" href="wallet.html">Wallet</a><a class="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium" href="investment-plans.html">Portfolios</a><a class="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium" href="active-investments.html">Investments</a><a class="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium" href="market.html">Markets</a><a class="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium" href="reports.html">Reports</a></div></section>' +
      body +
      "</div>";
  }

  function dashboardBody() {
    const state = getState();
    return '' +
      '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      card("Wallet Balance", money(state.walletBalance), "Available for new subscriptions and withdrawals.", "bg-primary/10 text-primary") +
      card("Portfolio Value", money(DEMO.client.totalPortfolioValue), "Across all managed and trading positions.", "bg-sky-500/10 text-sky-600 dark:text-sky-300") +
      card("Active Investments", String(state.activeInvestments), "Live subscriptions across portfolio models.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Current Profit / Loss", money(DEMO.client.profitLoss), "Net unrealized and realized movement year to date.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      '</div>' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-8">' + section("Portfolio value trend", "Market-based portfolio progression across the current reporting period.", lineChart(DEMO.portfolioSeries, "value")) + "</div>" +
      '<div class="xl:col-span-4">' + section("Next actions", "Keep the account operational and ready for new allocations.", miniList([
        { title: "Complete bank account confirmation", meta: "Needed before unrestricted withdrawals." },
        { title: "Approve proof of address", meta: "KYC remains in final review until this clears." },
        { title: "Finish options suitability questionnaire", meta: "Required before advanced options access." }
      ], function (item) {
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-sm font-semibold">' + item.title + '</p><p class="mt-1 text-sm text-muted-foreground">' + item.meta + "</p></div>";
      })) + "</div>" +
      "</div>" +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section("Asset allocation", "Current concentration by portfolio asset class.", bars(DEMO.allocation, "value", 32)) + "</div>" +
      '<div class="xl:col-span-5">' + section("Income and control summary", "The client dashboard should surface income, risk and pending cash movement at a glance.", keyValueRows([
        { label: "Total dividends received", value: money(DEMO.client.totalDividends) },
        { label: "Total profits received", value: money(DEMO.client.totalProfits) },
        { label: "Pending withdrawals", value: money(state.pendingWithdrawal) },
        { label: "KYC status", value: state.kycStatus },
        { label: "Options status", value: DEMO.client.optionsStatus },
        { label: "Profile completion", value: state.profileCompletion + "%" }
      ])) + "</div>" +
      "</div>" +
      section("Recent transactions", "Recent account movement, income postings and pending requests.", table(
        ["Date", "Type", "Reference", "Amount", "Status"],
        state.transactions.slice(0, 5).map(function (row) {
          return [row.date, row.type, row.reference, '<span class="font-semibold">' + row.amount + '</span>', badge(row.status, statusTone(row.status))];
        })
      ));
  }

  function walletBody() {
    const state = getState();
    return '' +
      '<div class="grid grid-cols-1 gap-4 lg:grid-cols-4">' +
      card("Available Balance", money(state.walletBalance), "Immediately deployable into portfolios or trading.", "bg-primary/10 text-primary") +
      card("Reserved Balance", money(DEMO.wallet.reserved), "Committed to open instructions and pending settlements.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Monthly Inflow", money(DEMO.wallet.monthlyInflow), "Deposits, credits and income over the current month.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      card("Pending Withdrawal", money(state.pendingWithdrawal), "Requested and awaiting operational review.", "bg-rose-500/10 text-rose-600 dark:text-rose-300") +
      "</div>" +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section("Wallet funding summary", "Understand how much is free, reserved or awaiting settlement.", keyValueRows([
        { label: "Pending deposit", value: money(state.pendingDeposit) },
        { label: "Processing fees", value: money(DEMO.wallet.fees) },
        { label: "Linked bank", value: DEMO.wallet.linkedBank },
        { label: "Base currency", value: DEMO.client.currency }
      ])) + "</div>" +
      '<div class="xl:col-span-5">' + section("Recent wallet activity", "Movement affecting available funds and cash access.", miniList(state.transactions.slice(0, 4), function (row) {
        return '<div class="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div><p class="text-sm font-semibold">' + row.type + '</p><p class="mt-1 text-sm text-muted-foreground">' + row.reference + '</p></div><div class="text-right"><p class="text-sm font-semibold">' + row.amount + '</p><p class="mt-1 text-xs text-muted-foreground">' + row.date + "</p></div></div>";
      })) + "</div>" +
      "</div>";
  }

  function fundingBody(mode) {
    const isDeposit = mode === "deposit";
    const state = getState();
    const title = isDeposit ? "Funding route summary" : "Withdrawal controls";
    const subtitle = isDeposit ? "Use these funding routes to top up the wallet before portfolio subscriptions or trading." : "Withdraw cleared wallet balance while keeping KYC, bank and review controls visible.";
    const methods = isDeposit
      ? '<div class="grid gap-4 lg:grid-cols-3">'
        + '<div class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><h3 class="text-base font-semibold tracking-tight">Bank transfer</h3><p class="mt-2 text-sm text-muted-foreground">Use your BullPort account reference for direct wallet funding.</p></div>' + badge("Available", "success") + '</div><div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reference</p><p class="mt-1 font-semibold">' + DEMO.client.accountNo + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Expected posting</p><p class="mt-1 font-semibold">Within 1 business day after confirmation</p></div></div><button type="button" data-broker-action="deposit-bank" class="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Use bank transfer</button></div>'
        + '<div class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><h3 class="text-base font-semibold tracking-tight">Pay with card</h3><p class="mt-2 text-sm text-muted-foreground">Card funding is reserved for the next product release.</p></div>' + badge("Coming soon", "warning") + '</div><div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="font-medium">Instant funding</p><p class="mt-1 text-muted-foreground">Debit and credit card funding will be enabled later.</p></div></div><button type="button" data-broker-action="deposit-card" class="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground">Coming soon</button></div>'
        + '<div class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><h3 class="text-base font-semibold tracking-tight">Fund with crypto</h3><p class="mt-2 text-sm text-muted-foreground">Send supported digital assets to the broker wallet and await confirmation.</p></div>' + badge("Review required", "info") + '</div><div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supported rails</p><p class="mt-1 font-semibold">USDT (TRC20), BTC, ETH</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Posting rule</p><p class="mt-1 font-semibold">Credit after compliance review and chain confirmation</p></div></div><button type="button" data-broker-action="deposit-crypto" class="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">View crypto instructions</button></div>'
        + "</div>"
      : '<div class="grid gap-4 lg:grid-cols-2">'
        + '<div class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><h3 class="text-base font-semibold tracking-tight">Withdraw to bank</h3><p class="mt-2 text-sm text-muted-foreground">Send cleared funds to your verified settlement account.</p></div>' + badge("Primary route", "success") + '</div><div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Verified destination</p><p class="mt-1 font-semibold">' + DEMO.wallet.linkedBank + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Review timing</p><p class="mt-1 font-semibold">Same day after compliance checks</p></div></div><button type="button" data-broker-action="withdraw-bank" class="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Continue to bank withdrawal</button></div>'
        + '<div class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><h3 class="text-base font-semibold tracking-tight">Withdraw to crypto</h3><p class="mt-2 text-sm text-muted-foreground">Transfer approved balances to a reviewed wallet destination.</p></div>' + badge("Enhanced review", "warning") + '</div><div class="mt-4 space-y-3 text-sm"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Eligibility</p><p class="mt-1 font-semibold">Available after full KYC and wallet screening</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supported assets</p><p class="mt-1 font-semibold">USDT, BTC and ETH withdrawals</p></div></div><button type="button" data-broker-action="withdraw-crypto" class="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">Review crypto withdrawal</button></div>'
        + "</div>";
    const formCard = isDeposit
      ? section("Deposit request details", "A clean static form surface for bank or crypto funding requests.", keyValueRows([
          { label: "Preferred route", value: "Bank transfer or approved crypto funding" },
          { label: "Suggested deposit size", value: "$2,500 to $10,000" },
          { label: "Account reference", value: DEMO.client.accountNo },
          { label: "Wallet status", value: "Ready to receive funds" }
        ]))
      : section("Withdrawal request summary", "Show controls and gating before a withdrawal instruction is approved.", keyValueRows([
          { label: "Available to withdraw", value: money(state.walletBalance - state.pendingWithdrawal) },
          { label: "Pending request", value: money(state.pendingWithdrawal) },
          { label: "Settlement route", value: "Verified bank or approved crypto wallet" },
          { label: "Security hold", value: "24-hour verification hold on new devices" }
        ]));
    const kycPanel = section("KYC and compliance status", "Funding and withdrawals should surface verification state before money movement.", '<div class="space-y-4"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-semibold">Verification status</p><p class="mt-1 text-sm text-muted-foreground">Current account review state for funding and settlement.</p></div>' + badge(state.kycStatus, statusTone(state.kycStatus)) + '</div></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-semibold">Blocked action if incomplete</p><p class="mt-1 text-sm text-muted-foreground">' + (isDeposit ? "Large deposits and crypto funding may pause for manual review." : "Withdrawals remain restricted until address and bank confirmation are complete.") + '</p></div>' + badge("Compliance aware", "info") + '</div></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Checklist progress</p><div class="mt-3 space-y-2">' + DEMO.kycChecklist.map(function (item) { return '<div class="flex items-center justify-between gap-3 text-sm"><span>' + item.item + '</span>' + badge(item.state, statusTone(item.state)) + '</div>'; }).join("") + '</div></div></div>');
    return '' +
      methods +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section(title, subtitle, keyValueRows(isDeposit ? [
        { label: "Preferred funding rail", value: "Bank transfer" },
        { label: "Pending confirmation", value: money(state.pendingDeposit) },
        { label: "Expected posting window", value: "Within 1 business day after confirmation" },
        { label: "Reference rules", value: "Use account number " + DEMO.client.accountNo }
      ] : [
        { label: "Available for withdrawal", value: money(state.walletBalance - state.pendingWithdrawal) },
        { label: "Current pending request", value: money(state.pendingWithdrawal) },
        { label: "Withdrawal hold policy", value: "24-hour verification hold for new devices" },
        { label: "Destination bank", value: DEMO.wallet.linkedBank }
      ])) + "</div>" +
      '<div class="xl:col-span-5">' + section("Workflow note", "This screen remains UI-only, but the content now reflects the intended broker journey.", '<div class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-sm text-muted-foreground">' + (isDeposit ? "Deposits should move from pending submission to confirmed wallet credit, then become available for portfolio subscriptions or trading." : "Withdrawals should only be available from cleared wallet balance and should respect KYC, linked bank and verification controls.") + "</div>") + "</div>" +
      "</div>" +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + formCard + "</div>" +
      '<div class="xl:col-span-5">' + kycPanel + "</div>" +
      "</div>" +
      section("Related activity", "Recent items that affect funding and settlement.", table(
        ["Date", "Type", "Reference", "Amount", "Status"],
        state.transactions.map(function (row) {
          return [row.date, row.type, row.reference, row.amount, badge(row.status, statusTone(row.status))];
        })
      ));
  }

  function plansBody() {
    return '<div class="grid grid-cols-1 gap-6 xl:grid-cols-2">' + DEMO.plans.map(function (plan) {
      return '<section class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><h2 class="text-lg font-semibold tracking-tight">' + plan.name + '</h2><p class="mt-2 text-sm text-muted-foreground">' + plan.strategy + '</p></div>' + badge(plan.risk + " risk", riskTone(plan.risk)) + '</div><div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Best for</p><p class="mt-2 text-sm font-semibold">' + plan.investor + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Projected performance</p><p class="mt-2 text-sm font-semibold">' + plan.projected + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supported assets</p><p class="mt-2 text-sm font-semibold">' + plan.assets + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Minimum ticket</p><p class="mt-2 text-sm font-semibold">' + plan.minimum + '</p></div></div><div class="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4"><p class="text-sm text-muted-foreground">' + plan.payout + '</p><button type="button" data-broker-action="subscribe-plan" data-broker-plan="' + plan.name + '" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">' + plan.button + "</button></div></section>";
    }).join("") + "</div>";
  }

  function investmentsBody() {
    const state = getState();
    return '' +
      '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      card("Active Mandates", String(state.activeInvestments), "Live managed portfolio subscriptions.", "bg-primary/10 text-primary") +
      card("Projected Income", "$1,570", "Upcoming scheduled income across subscribed portfolios.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      card("Next Payout Date", state.nextPayout, "Earliest next scheduled distribution.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Avg. Portfolio Risk", DEMO.client.riskProfile, "Combined account suitability profile.", "bg-sky-500/10 text-sky-600 dark:text-sky-300") +
      "</div>" +
      section("Subscribed portfolio positions", "Track invested capital, current value and the next action on each mandate.", table(
        ["Portfolio", "Invested", "Current value", "Projected", "Next payout", "Status", "Action"],
        DEMO.investments.map(function (row) {
          return [row.name, money(row.invested), money(row.current), row.projected, row.payout, badge(row.status, statusTone(row.status)), '<button type="button" data-broker-action="investment-action" data-broker-investment="' + row.name + '" data-broker-label="' + row.action + '" class="font-semibold text-primary">' + row.action + "</button>"];
        })
      ));
  }

  function portfolioBody() {
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-5">' + section("Allocation summary", "Current concentration across the underlying portfolio mix.", bars(DEMO.allocation, "value", 32)) + "</div>" +
      '<div class="xl:col-span-7">' + section("Underlying holdings", "Instrument composition for the current broker-managed allocation.", table(
        ["Asset", "Category", "Allocation", "Price", "Change", "Risk", "Status"],
        DEMO.holdings.map(function (row) {
          return [row.asset, row.category, row.allocation, row.price, row.change, badge(row.risk, riskTone(row.risk)), badge(row.status, statusTone(row.status))];
        })
      )) + "</div>" +
      "</div>";
  }

  function marketBody() {
    return '' +
      section("Supported instrument coverage", "The market page now reflects the broker's multi-asset instrument universe.", table(
        ["Symbol", "Instrument", "Category", "Market", "Currency", "Current price", "Risk", "Dividend eligible", "Tradable", "Investable", "Status"],
        DEMO.instruments.map(function (row) {
          return [row.symbol, row.name, row.category, row.market, row.currency, row.price, badge(row.risk, riskTone(row.risk)), row.dividend, row.tradable, row.investable, badge(row.status, statusTone(row.status))];
        })
      )) +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-6">' + section("Watch themes", "Priority watch areas for the current client account.", miniList(DEMO.watchlist, function (row) {
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold">' + row.symbol + " - " + row.theme + '</p><span class="text-sm font-semibold">' + row.price + '</span></div><p class="mt-1 text-sm text-muted-foreground">' + row.note + '</p><p class="mt-2 text-xs text-emerald-600 dark:text-emerald-300">' + row.move + "</p></div>";
      })) + "</div>" +
      '<div class="xl:col-span-6">' + section("Market disclosures", "Returns remain projected, simulated or market-based; nothing is framed as guaranteed.", '<div class="space-y-3 text-sm text-muted-foreground"><p>Instrument prices and expected portfolio outcomes in this UI are sample market values.</p><p>Options, commodities and sector concentration carry higher volatility and are surfaced with higher risk labels and access controls.</p><p>Users should move through KYC, wallet funding, portfolio selection and risk review before taking advanced actions.</p></div>') + "</div>" +
      "</div>";
  }

  function tradingBody() {
    const selected = DEMO.instruments[0];
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-8">' + section(selected.name + " (" + selected.symbol + ")", "Broker trading workspace for research, order prep and instrument context.", lineChart(DEMO.portfolioSeries, "profit")) + "</div>" +
      '<div class="xl:col-span-4">' + section("Trade setup summary", "Static trading panel aligned to broker terminology.", keyValueRows([
        { label: "Category", value: selected.category },
        { label: "Market", value: selected.market },
        { label: "Current price", value: selected.price },
        { label: "Risk", value: selected.risk },
        { label: "Tradable", value: selected.tradable },
        { label: "Investable", value: selected.investable }
      ])) + "</div>" +
      "</div>" +
      section("Recent order activity", "Trade status, execution outcome and approvals.", table(
        ["Instrument", "Side", "Order type", "Quantity", "Price", "Status"],
        DEMO.orderActivity.map(function (row) {
          return [row.instrument, row.side, row.type, row.quantity, row.price, badge(row.status, statusTone(row.status))];
        })
      ));
  }

  function watchlistBody() {
    return '<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">' + DEMO.watchlist.map(function (row) {
      const moveTone = row.move.indexOf("-") === 0 ? "danger" : "success";
      return '<section class="rounded-xl border border-border bg-card p-5 shadow-sm">'
        + '<div class="flex items-start justify-between gap-3"><div><div class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">' + row.symbol + '</div><h2 class="mt-3 text-lg font-semibold tracking-tight">' + row.theme + '</h2><p class="mt-2 text-sm text-muted-foreground">' + row.note + '</p></div>' + badge(row.move, moveTone) + '</div>'
        + '<div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current price</p><p class="mt-2 text-sm font-semibold">' + row.price + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Watch status</p><p class="mt-2 text-sm font-semibold">Tracked for market review</p></div></div>'
        + '<div class="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4"><a href="trading.html" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open instrument</a><a href="market.html" class="text-sm font-semibold text-primary">View market</a></div>'
        + '</section>';
    }).join("") + "</div>";
  }

  function ordersBody() {
    return section("Order history and approvals", "Open, filled and approval-gated trade instructions.", table(
      ["Instrument", "Side", "Order type", "Quantity", "Price", "Status"],
      DEMO.orderActivity.map(function (row) {
        return [row.instrument, row.side, row.type, row.quantity, row.price, badge(row.status, statusTone(row.status))];
      })
    ));
  }

  function componentsBody() {
    return '' +
      section("Component index", "This page names the reusable UI blocks already used across the BullPort dashboard.", table(
        ["Component", "Purpose", "Current use", "Reference"],
        [
          ["Hero Shell", "Page heading, quick actions and account snapshot.", "All signed-in pages", badge("shell()", "info")],
          ["KPI Card", "Top-line metrics with accent chips.", "Dashboard, wallet, dividends, risk", badge("card()", "info")],
          ["Section Frame", "Rounded content surface with title and subtitle.", "All content pages", badge("section()", "info")],
          ["Key-Value Grid", "Compact facts and status summary.", "Wallet, KYC, funding, profile", badge("keyValueRows()", "info")],
          ["Data Table", "Scrollable records and report listings.", "Reports, transactions, markets", badge("table()", "info")],
          ["Status Badge", "Status, risk and workflow state labels.", "All pages", badge("badge()", "info")],
          ["Progress Strip", "Completion and workflow progress.", "KYC verification", badge("progressBar()", "info")],
          ["Mini List", "Compact list of actions, alerts or activity.", "Dashboard, notifications, support", badge("miniList()", "info")],
          ["Watchlist Card", "Instrument overview card with actions.", "Watchlist", badge("watchlistBody()", "info")],
          ["Funding Method Tile", "Deposit/withdraw method block.", "Deposit, withdraw", badge("fundingBody()", "info")]
        ]
      )) +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section("Metric surfaces", "Core cards used to communicate balance, value, income and risk at a glance.", '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">' +
        card("Wallet Balance", money(getState().walletBalance), "Available for subscriptions and withdrawals.", "bg-primary/10 text-primary") +
        card("Current Profit / Loss", money(DEMO.client.profitLoss), "Net unrealized and realized movement year to date.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
        card("Risk Score", DEMO.risk.score, "Combined client suitability and portfolio exposure score.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
        card("Active Investments", String(getState().activeInvestments), "Live managed portfolio subscriptions.", "bg-sky-500/10 text-sky-600 dark:text-sky-300") +
        '</div>') + "</div>" +
      '<div class="xl:col-span-5">' + section("Named status chips", "Use these status treatments consistently in future admin and backend-connected pages.", '<div class="flex flex-wrap gap-3">' +
        badge("Approved", "success") +
        badge("Pending review", "warning") +
        badge("Restricted", "danger") +
        badge("Reference", "info") +
        badge("Default", "default") +
        '</div><div class="mt-5 space-y-3">' +
        '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-sm font-semibold">Progress Strip</p><p class="mt-1 text-sm text-muted-foreground">Use for KYC, onboarding, approval and setup flows.</p>' + progressBar(getState().profileCompletion) + '</div>' +
        '</div>') + "</div>" +
      "</div>" +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section("Reference table", "Primary table pattern for reports, wallet records, investment listings and admin-ready records.", table(
        ["Pattern", "Sample value", "State", "Action"],
        [
          ["Transaction row", "+$3,500", badge("Pending", "warning"), '<button type="button" class="font-semibold text-primary">Open</button>'],
          ["Report row", "PDF / XLSX", badge("Ready", "success"), '<button type="button" class="font-semibold text-primary">Download</button>'],
          ["Restricted instrument", "Option", badge("Restricted", "danger"), '<button type="button" class="font-semibold text-primary">Review</button>']
        ]
      )) + "</div>" +
      '<div class="xl:col-span-5">' + section("Activity and action tiles", "Reusable compact blocks for alerts, quick actions and support prompts.", miniList([
        { title: "Workflow tile", meta: "Use for next steps, guidance and blocked-action notices." },
        { title: "Support tile", meta: "Use for escalation routes, contact methods and help prompts." },
        { title: "Alert tile", meta: "Use for risk, compliance or funding exceptions." }
      ], function (item) {
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold">' + item.title + '</p><p class="mt-1 text-sm text-muted-foreground">' + item.meta + '</p></div><button type="button" class="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">Use pattern</button></div></div>';
      })) + "</div>" +
      "</div>" +
      section("Watchlist card sample", "Card-based instrument pattern retained for the watchlist and future admin instrument previews.", watchlistBody().split('</section>').slice(0, 1).join('</section>'));
  }

  function optionsBody() {
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section("Eligibility and approval", "Options are treated as an advanced feature, not a default investment plan.", keyValueRows([
        { label: "Current access level", value: DEMO.client.optionsStatus },
        { label: "Suitability profile", value: "Balanced investor - level 2 pending" },
        { label: "Required action", value: "Complete options questionnaire and acknowledgment" },
        { label: "Risk note", value: "Advanced strategies may involve losses beyond premium depending on structure" }
      ])) + "</div>" +
      '<div class="xl:col-span-5">' + section("Risk controls", "Options access is gated and linked to KYC, wallet health and questionnaire review.", '<div class="space-y-3 text-sm text-muted-foreground"><p>Only approved users should see tradable options positions beyond educational previews.</p><p>Higher-risk labels and explicit approval states remain visible in the client portal.</p><p>Approval-required positions should never look identical to regular long-only portfolio products.</p></div>') + "</div>" +
      "</div>" +
      section("Current options-related activity", "Existing activity remains visible, but access-controlled.", table(
        ["Instrument", "Side", "Order type", "Quantity", "Price", "Status"],
        DEMO.orderActivity.filter(function (row) { return row.type.indexOf("Option") !== -1 || row.status.indexOf("Approval") !== -1; }).map(function (row) {
          return [row.instrument, row.side, row.type, row.quantity, row.price, badge(row.status, statusTone(row.status))];
        })
      ));
  }

  function dividendsBody() {
    return '' +
      '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      card("Total Dividends", money(DEMO.client.totalDividends), "Paid to date across income-generating holdings.", "bg-primary/10 text-primary") +
      card("Total Profits", money(DEMO.client.totalProfits), "Posted profit credits and realized gains.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      card("Next Scheduled Payout", DEMO.client.nextPayout, "Earliest upcoming distribution window.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Reinvestment Preference", "Auto for 2 mandates", "Remaining mandates still pay to wallet.", "bg-sky-500/10 text-sky-600 dark:text-sky-300") +
      "</div>" +
      section("Dividend and profit history", "Income and profit posting records aligned to the client plan.", table(
        ["Source", "Date", "Type", "Amount", "Settlement", "Status"],
        DEMO.payouts.map(function (row) {
          return [row.source, row.date, row.type, row.amount, row.mode, badge(row.status, statusTone(row.status))];
        })
      ));
  }

  function riskBody() {
    return '' +
      '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      card("Risk Score", DEMO.risk.score, "Combined client suitability and portfolio exposure score.", "bg-primary/10 text-primary") +
      card("Concentration", DEMO.risk.concentration, "Largest concentration monitored at portfolio level.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Options Access", "Controlled", "Access remains gated until level 2 is approved.", "bg-rose-500/10 text-rose-600 dark:text-rose-300") +
      card("Liquidity Cover", "6.2 months", "Available liquidity versus expected withdrawals.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      "</div>" +
      section("Client-facing risk alerts", "Risk visibility should make the platform feel like a serious broker system, not a passive ROI app.", miniList([
        { title: "Commodity allocation above preferred range", state: "Review suggested", note: "Commodity exposure reached 18% of total value." },
        { title: "Options questionnaire incomplete", state: "Action required", note: "Advanced trading remains restricted until suitability review is complete." },
        { title: "Proof of address pending", state: "In review", note: "Full withdrawal flexibility depends on final KYC clearance." }
      ], function (row) {
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold">' + row.title + '</p>' + badge(row.state, statusTone(row.state)) + '</div><p class="mt-2 text-sm text-muted-foreground">' + row.note + "</p></div>";
      }));
  }

  function reportsBody() {
    return section("Statements and downloads", "Download-ready client records, account statements and performance summaries.", table(
      ["Report", "Type", "Format", "Period", "Status", "Action"],
      DEMO.reports.map(function (row) {
        return [row.name, row.type, row.format, row.period, badge(row.status, statusTone(row.status)), '<button type="button" data-broker-action="download-report" data-broker-report="' + row.name + '" class="font-semibold text-primary">Download</button>'];
      })
    ));
  }

  function notificationsBody() {
    const state = getState();
    return section("Notification feed", "A single stream for KYC, wallet, investments, income and risk messages.", miniList(state.notifications, function (row) {
      return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-semibold">' + row.title + '</p><p class="mt-1 text-sm text-muted-foreground">' + row.category + "</p></div>" + badge(row.state, statusTone(row.state)) + '</div><p class="mt-2 text-xs text-muted-foreground">' + row.time + "</p></div>";
    }));
  }

  function supportBody() {
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-5">' + section("Support channels", "Broker support should look operational and reachable.", keyValueRows([
        { label: "Relationship desk", value: "+234 800 BULLPORT" },
        { label: "Email support", value: "support@bullport.com" },
        { label: "Ticket SLA", value: "Within 1 business day" },
        { label: "Call scheduling", value: "Available for premium managed clients" }
      ])) + "</div>" +
      '<div class="xl:col-span-7">' + section("Open and recent tickets", "Track resolution and escalations from within the portal.", table(
        ["Ticket", "Subject", "Channel", "Priority", "Status"],
        DEMO.supportTickets.map(function (row) {
          return [row.id, row.subject, row.channel, row.priority, badge(row.status, statusTone(row.status))];
        })
      )) + "</div>" +
      "</div>";
  }

  function kycBody() {
    const state = getState();
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-5">' + section("Verification progress", "Broker workflows should make verification state and blockers obvious.", '<p class="text-sm text-muted-foreground">Current status: <span class="font-semibold text-foreground">' + state.kycStatus + '</span></p>' + progressBar(state.profileCompletion) + '<p class="mt-3 text-xs text-muted-foreground">Profile and verification completion: ' + state.profileCompletion + '%</p><div class="mt-4 flex flex-wrap gap-3"><button type="button" data-broker-action="kyc-upload" class="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">Upload document</button><button type="button" data-broker-action="kyc-submit" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Submit for approval</button></div>') + "</div>" +
      '<div class="xl:col-span-7">' + section("Document checklist", "Actions blocked until all required checks are complete.", table(
        ["Requirement", "Status"],
        DEMO.kycChecklist.map(function (row) {
          return [row.item, badge(row.state, statusTone(row.state))];
        })
      )) + "</div>" +
      "</div>";
  }

  function profileBody() {
    return section("Client profile summary", "Identity and contact information used across the client journey.", keyValueRows([
      { label: "Client name", value: DEMO.client.name },
      { label: "Account number", value: DEMO.client.accountNo },
      { label: "Primary email", value: DEMO.client.email },
      { label: "Phone", value: DEMO.client.phone },
      { label: "Country", value: DEMO.client.country },
      { label: "Last login", value: DEMO.client.lastLogin }
    ]));
  }

  function settingsBody() {
    return section("Security and account controls", "Portal preferences aligned to broker account management.", table(
      ["Setting", "Current value"],
      DEMO.settings.map(function (row) {
        return [row.label, row.value];
      })
    ));
  }

  function authLayout(kind) {
    const config = {
      login: {
        title: "Access your BullPort dashboard",
        subtitle: "Monitor portfolios, wallet activity, reports and risk controls from one broker portal.",
        cta: "Sign in to dashboard",
        foot: 'New to BullPort? <a class="font-medium text-primary hover:underline" href="register.html">Create an account</a>'
      },
      register: {
        title: "Open a broker client account",
        subtitle: "Create your profile, complete KYC and unlock portfolio investing, market access and reporting.",
        cta: "Create account",
        foot: 'Already registered? <a class="font-medium text-primary hover:underline" href="login.html">Sign in</a>'
      },
      forgot: {
        title: "Recover secure access",
        subtitle: "Reset account credentials and continue through KYC, wallet funding and portfolio management.",
        cta: "Send reset instructions",
        foot: 'Remembered your password? <a class="font-medium text-primary hover:underline" href="login.html">Return to sign in</a>'
      }
    }[kind];

    return '' +
      '<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">' +
      '<div class="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">' +
      '<section class="rounded-2xl border border-border bg-card p-8 shadow-sm"><div class="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">$</span> BullPort client portal</div><h1 class="mt-6 text-4xl font-semibold tracking-tight">' + config.title + '</h1><p class="mt-3 max-w-xl text-base text-muted-foreground">' + config.subtitle + '</p><div class="mt-8 grid gap-4 sm:grid-cols-2"><div class="rounded-xl border border-border/70 bg-background/60 p-4"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Managed portfolios</p><p class="mt-2 text-sm font-semibold">6 portfolio models across income, balanced, growth and commodities.</p></div><div class="rounded-xl border border-border/70 bg-background/60 p-4"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Investor controls</p><p class="mt-2 text-sm font-semibold">Wallet funding, KYC, reports, dividends and risk tracking from one portal.</p></div><div class="rounded-xl border border-border/70 bg-background/60 p-4"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Markets</p><p class="mt-2 text-sm font-semibold">Stocks, commodities, ETFs, bonds, REITs, indices and access-controlled options.</p></div><div class="rounded-xl border border-border/70 bg-background/60 p-4"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Workflow</p><p class="mt-2 text-sm font-semibold">Register, verify, fund, allocate, monitor and download account reports.</p></div></div></section>' +
      '<section class="rounded-2xl border border-border bg-card p-8 shadow-sm"><div class="mb-6"><h2 class="text-2xl font-semibold tracking-tight">' + config.cta + '</h2><p class="mt-2 text-sm text-muted-foreground">Secure access aligned to the BullPort broker journey.</p></div><form class="space-y-4"><div class="space-y-2"><label class="text-sm font-medium">Email address</label><input class="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none" placeholder="name@example.com"></div>' + (kind === "forgot" ? "" : '<div class="space-y-2"><label class="text-sm font-medium">Password</label><input class="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none" placeholder="' + (kind === "register" ? "Create a password" : "Enter your password") + '" type="password"></div>') + (kind === "register" ? '<div class="space-y-2"><label class="text-sm font-medium">Country of residence</label><input class="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none" value="Nigeria"></div>' : "") + '<button class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" data-broker-action="' + (kind === "login" ? "auth-login" : (kind === "register" ? "auth-register" : "auth-reset")) + '" type="button">' + config.cta + '</button></form><div class="mt-6 rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">' + config.foot + '</div></section>' +
      "</div></div>";
  }

  function renderPage() {
    const cur = currentFile();
    const main = findMain();

    if (cur === "login.html" || cur === "register.html" || cur === "forgot-password.html") {
      const bodyRoot = document.body;
      const wrapper = bodyRoot && bodyRoot.querySelector(".flex.min-h-screen.items-center.justify-center");
      if (!wrapper) return;
      wrapper.outerHTML = authLayout(cur === "login.html" ? "login" : (cur === "register.html" ? "register" : "forgot"));
      return;
    }

    if (!main) return;

    const meta = currentMeta();
    let body = "";
    switch (cur) {
      case "index.html":
      case "dashboard.html":
        body = dashboardBody();
        break;
      case "wallet.html":
        body = walletBody();
        break;
      case "deposit.html":
        body = fundingBody("deposit");
        break;
      case "withdraw.html":
        body = fundingBody("withdraw");
        break;
      case "transactions.html":
        const txState = getState();
        body = section("Cash movement history", "Funding, withdrawals, fees and income movement across the wallet.", table(
          ["Date", "Type", "Reference", "Amount", "Status"],
          txState.transactions.map(function (row) {
            return [row.date, row.type, row.reference, row.amount, badge(row.status, statusTone(row.status))];
          })
        ));
        break;
      case "investment-plans.html":
        body = plansBody();
        break;
      case "active-investments.html":
        body = investmentsBody();
        break;
      case "portfolio.html":
      case "analytics.html":
        body = portfolioBody();
        break;
      case "market.html":
      case "screener.html":
      case "movers.html":
      case "earnings.html":
        body = marketBody();
        break;
      case "trading.html":
        body = tradingBody();
        break;
      case "watchlist.html":
        body = watchlistBody();
        break;
      case "orders.html":
        body = ordersBody();
        break;
      case "options-access.html":
        body = optionsBody();
        break;
      case "dividends.html":
        body = dividendsBody();
        break;
      case "risk.html":
        body = riskBody();
        break;
      case "reports.html":
      case "tax.html":
      case "charts.html":
        body = reportsBody();
        break;
      case "notifications.html":
      case "alerts.html":
        body = notificationsBody();
        break;
      case "support.html":
      case "users.html":
        body = supportBody();
        break;
      case "kyc.html":
        body = kycBody();
        break;
      case "profile.html":
        body = profileBody();
        break;
      case "settings.html":
        body = settingsBody();
        break;
      case "components.html":
      case "docs.html":
        body = componentsBody();
        break;
      default:
        body = section("Portal workspace", "This screen has been normalized to the BullPort portal naming layer.", '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-4 text-sm text-muted-foreground">This page remains available for coverage, but it is not part of the primary client navigation.</div>');
    }

    main.innerHTML = shell(meta.title, meta.subtitle, body);
  }

  function patchNav() {
    document.querySelectorAll('nav[aria-label="Main navigation"]').forEach(function (nav) {
      nav.innerHTML = buildNav();
    });
  }

  function patchBranding() {
    document.querySelectorAll("meta[name='description']").forEach(function (meta) {
      meta.setAttribute("content", "BullPort client portal for wallets, broker-managed portfolios, markets, dividends, reports, notifications and risk monitoring.");
    });

    document.querySelectorAll("title").forEach(function (title) {
      title.textContent = currentMeta().title + " | BullPort Client Portal";
    });

    const brandStack = document.querySelector("aside .flex.flex-col");
    if (brandStack) {
      const spans = brandStack.querySelectorAll("span");
      if (spans[0]) spans[0].textContent = "BullPort";
      if (spans[1]) spans[1].textContent = "Client Portal";
    }
  }

  function patchLinks() {
    const redirects = {
      "screener.html": "market.html",
      "movers.html": "market.html",
      "earnings.html": "market.html",
      "alerts.html": "notifications.html",
      "tax.html": "reports.html",
      "charts.html": "reports.html",
      "users.html": "support.html",
      "docs.html": "components.html"
    };

    document.querySelectorAll("a[href]").forEach(function (a) {
      const href = a.getAttribute("href");
      if (!href) return;
      if (redirects[href]) a.setAttribute("href", redirects[href]);
      if (href.indexOf("stock/") === 0) a.setAttribute("href", "trading.html");
      if (href === "/") a.setAttribute("href", "dashboard.html");
      if (href === "/support") a.setAttribute("href", "support.html");
    });
  }

  function patchHeaderAndText() {
    const skip = document.querySelector('a[href="#main-content"]');
    if (skip) skip.setAttribute("href", "#main-content");

    document.querySelectorAll("p, span, div, h1, h2, h3, a, button").forEach(function (el) {
      if (!el.childElementCount && el.textContent) {
        const text = el.textContent;
        if (text.indexOf("Tax Center") !== -1) el.textContent = text.replace(/Tax Center/g, "Reports & Statements");
        if (text.indexOf("Analytics") !== -1 && currentFile() !== "analytics.html") el.textContent = text.replace(/Analytics/g, "Portfolio Insight");
      }
    });
  }

  function replaceExactText(selector, from, to) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (!el.childElementCount && el.textContent && el.textContent.trim() === from) {
        el.textContent = to;
      }
    });
  }

  function patchChromeUI() {
    replaceExactText("span,div,p,h1,h2,h3,a,button", "Aigars S.", DEMO.client.name);
    replaceExactText("span,div,p,h1,h2,h3,a,button", "Admin", "Client");
    replaceExactText("span,div,p,h1,h2,h3,a,button", "Command Palette", "Quick Actions");
    replaceExactText("span,div,p,h1,h2,h3,a,button", "New Transaction", "New Allocation");
    replaceExactText("span,div,p,h1,h2,h3,a,button", "New Trade", "New Allocation");
    replaceExactText("span,div,p,h1,h2,h3,a,button", "Portfolio", "Portfolio Details");
    replaceExactText("span,div,p,h1,h2,h3,a,button", "Search anything...", "Search pages, markets, reports...");

    document.querySelectorAll("input, textarea").forEach(function (input) {
      const placeholder = input.getAttribute("placeholder");
      if (!placeholder) return;
      if (placeholder === "Search anything...") input.setAttribute("placeholder", "Search pages, markets, reports...");
      if (placeholder === "Enter your password") input.setAttribute("placeholder", "Enter your password");
    });

    document.querySelectorAll("button, div, span").forEach(function (el) {
      if (!el.childElementCount && el.textContent && el.textContent.trim() === "AS") {
        el.textContent = "TA";
      }
    });
  }

  function ensureToastRoot() {
    let root = document.getElementById("broker-toast-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "broker-toast-root";
    root.className = "broker-toast-root";
    document.body.appendChild(root);
    return root;
  }

  function toast(message, tone) {
    const root = ensureToastRoot();
    const node = document.createElement("div");
    node.className = "broker-toast broker-toast-" + (tone || "default");
    node.textContent = message;
    root.appendChild(node);
    requestAnimationFrame(function () {
      node.classList.add("is-visible");
    });
    setTimeout(function () {
      node.classList.remove("is-visible");
      setTimeout(function () {
        node.remove();
      }, 220);
    }, 2600);
  }

  function closeModal() {
    const modal = document.getElementById("broker-modal");
    if (modal) modal.remove();
  }

  function showModal(title, body, actions) {
    closeModal();
    const modal = document.createElement("div");
    modal.id = "broker-modal";
    modal.className = "broker-modal";
    modal.innerHTML = '<div class="broker-modal-backdrop" data-broker-close-modal="true"></div><div class="broker-modal-panel"><div class="broker-modal-header"><h3>' + title + '</h3><button type="button" class="broker-modal-close" data-broker-close-modal="true">x</button></div><div class="broker-modal-body">' + body + '</div><div class="broker-modal-actions">' + (actions || '<button type="button" class="broker-modal-button is-primary" data-broker-close-modal="true">Close</button>') + "</div></div>";
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-broker-close-modal]").forEach(function (node) {
      node.addEventListener("click", closeModal);
    });
  }

  function navigateTo(page) {
    location.href = page;
  }

  function normalizeResponsiveChrome() {
    const sticky = document.querySelector(".sticky.top-0.z-30");
    if (sticky) {
      sticky.style.maxWidth = "100%";
      sticky.style.overflowX = "clip";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.maxWidth = "100%";
      header.style.overflowX = "clip";
      header.style.flexWrap = "wrap";
      header.style.rowGap = "0.75rem";
    }

    const contentWrap = document.querySelector(".flex.flex-1.flex-col.transition-all.duration-300");
    if (contentWrap) {
      contentWrap.style.maxWidth = "100%";
      contentWrap.style.overflowX = "clip";
      contentWrap.style.minWidth = "0";
    }

    const main = findMain();
    if (main) {
      main.style.minWidth = "0";
      main.style.maxWidth = "100%";
    }
  }

  async function handleAction(action, node) {
    const state = getState();
    switch (action) {
      case "auth-login":
        try {
          const form = authFormValues(node);
          const data = await apiRequest("/api/auth/client/login", {
            method: "POST",
            body: JSON.stringify({ email: form.email, password: form.password })
          }, true);
          localStorage.setItem(CLIENT_TOKEN_KEY, data.token);
          localStorage.setItem(CLIENT_ID_KEY, data.client.id);
          await loadClientBackendData(true);
          patchApiStatus();
          toast("Signed in. Redirecting to the dashboard.", "success");
          setTimeout(function () { navigateTo("dashboard.html"); }, 250);
        } catch (error) {
          toast((error && error.message) || "Could not sign in. Check the API and credentials.", "warning");
        }
        return;
      case "auth-register":
        try {
          const form = authFormValues(node);
          const data = await apiRequest("/api/auth/client/register", {
            method: "POST",
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              password: form.password,
              country: form.country
            })
          }, true);
          localStorage.setItem(CLIENT_TOKEN_KEY, data.token);
          localStorage.setItem(CLIENT_ID_KEY, data.client.id);
          await loadClientBackendData(true);
          patchApiStatus();
          toast("Account created. Continue with KYC verification.", "success");
          setTimeout(function () { navigateTo("kyc.html"); }, 250);
        } catch (error) {
          toast((error && error.message) || "Could not create account.", "warning");
        }
        return;
      case "auth-reset":
        toast("Password reset instructions sent.", "info");
        return;
      case "goto-deposit":
        navigateTo("deposit.html");
        return;
      case "goto-kyc":
        navigateTo("kyc.html");
        return;
      case "goto-reports":
        navigateTo("reports.html");
        return;
      case "deposit-card":
        toast("Card funding is coming soon.", "warning");
        return;
      case "deposit-bank":
        try {
          await ensureDemoClientToken();
          await apiRequest("/api/client/deposits", {
            method: "POST",
            body: JSON.stringify({ amount: 3500, method: "Bank transfer", rail: "Manual transfer" })
          }, false);
          await refreshLiveView("Bank transfer request logged for operations review.", "success");
        } catch (error) {
          state.walletBalance += 3500;
          state.pendingDeposit += 3500;
          pushTransaction(state, "Deposit", "Bank transfer funding", "+$3,500", "Pending");
          pushNotification(state, "Wallet", "Bank transfer deposit submitted", "Pending confirmation");
          saveState(state);
          renderPage();
          patchChromeUI();
          bindActions();
          patchApiStatus();
          toast("API unavailable. Bank transfer request logged in static mode.", "warning");
        }
        return;
      case "deposit-crypto":
        showModal("Crypto funding instructions", '<p>Send only supported assets to the reviewed broker wallet route.</p><div class="broker-modal-grid"><div><span>Supported assets</span><strong>USDT (TRC20), BTC, ETH</strong></div><div><span>Posting rule</span><strong>Credit after compliance and chain confirmation</strong></div><div><span>Reference</span><strong>' + DEMO.client.accountNo + '</strong></div></div>', '<button type="button" class="broker-modal-button is-primary" data-broker-close-modal="true">Close</button>');
        return;
      case "withdraw-bank":
        try {
          await ensureDemoClientToken();
          await apiRequest("/api/client/withdrawals", {
            method: "POST",
            body: JSON.stringify({ amount: 1200, destination: DEMO.wallet.linkedBank || "Verified bank account" })
          }, false);
          await refreshLiveView("Withdrawal request submitted for finance review.", "success");
        } catch (error) {
          if (error && error.message) {
            toast(error.message, "warning");
            return;
          }
          if (state.kycStatus !== "Approved") {
            toast("Withdrawal remains blocked until KYC is approved.", "warning");
            return;
          }
          state.walletBalance -= 1200;
          state.pendingWithdrawal += 1200;
          pushTransaction(state, "Withdrawal request", "Wallet withdrawal to bank", "-$1,200", "Under review");
          pushNotification(state, "Wallet", "Bank withdrawal submitted", "Under review");
          saveState(state);
          renderPage();
          patchChromeUI();
          bindActions();
          patchApiStatus();
          toast("Withdrawal request submitted in static mode.", "warning");
        }
        return;
      case "withdraw-crypto":
        toast("Crypto withdrawal needs enhanced review and wallet screening.", "warning");
        return;
      case "subscribe-plan":
        try {
          await ensureDemoClientToken();
          await apiRequest("/api/client/investments", {
            method: "POST",
            body: JSON.stringify({
              productName: node.getAttribute("data-broker-plan") || "Balanced Growth",
              amount: 2500
            })
          }, false);
          await refreshLiveView("Portfolio subscription created and reflected in My Investments.", "success");
        } catch (error) {
          if (error && error.message) {
            toast(error.message, "warning");
            return;
          }
          state.activeInvestments += 1;
          pushTransaction(state, "Portfolio subscription", node.getAttribute("data-broker-plan") || "Portfolio plan", "-$2,500", "Completed");
          pushNotification(state, "Portfolio", (node.getAttribute("data-broker-plan") || "Portfolio plan") + " added to subscriptions", "Completed");
          saveState(state);
          toast("Plan added to the static subscription flow.", "warning");
        }
        return;
      case "investment-action":
        toast((node.getAttribute("data-broker-label") || "Action") + " queued for " + (node.getAttribute("data-broker-investment") || "investment") + ".", "info");
        return;
      case "download-report":
        pushNotification(state, "Reports", (node.getAttribute("data-broker-report") || "Report") + " download prepared", "Ready");
        saveState(state);
        toast("Report prepared for download.", "success");
        return;
      case "kyc-upload":
        toast("Document upload panel is represented in this prototype flow.", "info");
        return;
      case "kyc-submit":
        try {
          await ensureDemoClientToken();
          await apiRequest("/api/client/kyc/submit", {
            method: "POST",
            body: JSON.stringify({ requirement: "Proof of address", documentRef: "dashboard-upload.pdf" })
          }, false);
          await refreshLiveView("KYC documents submitted for compliance review.", "success");
        } catch (error) {
          state.kycStatus = "Approved";
          state.profileCompletion = 100;
          pushNotification(state, "KYC", "Verification completed and approved", "Approved");
          saveState(state);
          renderPage();
          patchChromeUI();
          bindActions();
          patchApiStatus();
          toast("KYC status updated in static mode.", "warning");
        }
        return;
      default:
        return;
    }
  }

  function bindActions() {
    document.querySelectorAll("[data-broker-action]").forEach(function (node) {
      if (node.dataset.brokerBound === "true") return;
      node.dataset.brokerBound = "true";
      node.addEventListener("click", function () {
        handleAction(node.getAttribute("data-broker-action"), node);
      });
    });
  }

  function injectStyles() {
    if (document.getElementById("broker-portal-styles")) return;
    const style = document.createElement("style");
    style.id = "broker-portal-styles";
    style.textContent = ""
      + "html,body{max-width:100%;overflow-x:hidden}"
      + ".broker-axis-label{fill:currentColor;opacity:.65;font-size:11px}"
      + " main table{table-layout:auto}"
      + " main a{text-decoration:none}"
      + " main h1,main h2,main h3{letter-spacing:0}"
      + " main .rounded-xl{border-radius:12px}"
      + " main .rounded-2xl{border-radius:18px}"
      + " .broker-toast-root{position:fixed;right:16px;bottom:16px;z-index:120;display:grid;gap:10px;max-width:min(360px,calc(100vw - 32px))}"
      + " .broker-toast{transform:translateY(8px);opacity:0;border-radius:12px;padding:12px 14px;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.16);transition:opacity .2s ease,transform .2s ease}"
      + " .broker-toast.is-visible{transform:translateY(0);opacity:1}"
      + " .broker-toast-default,.broker-toast-info{background:#0f172a}"
      + " .broker-toast-success{background:#15803d}"
      + " .broker-toast-warning{background:#b45309}"
      + " .broker-modal{position:fixed;inset:0;z-index:140;display:flex;align-items:center;justify-content:center;padding:20px}"
      + " .broker-modal-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.48)}"
      + " .broker-modal-panel{position:relative;z-index:1;width:min(560px,100%);border-radius:18px;background:#fff;color:#0f172a;padding:20px;box-shadow:0 24px 60px rgba(15,23,42,.22)}"
      + " .broker-modal-header{display:flex;align-items:center;justify-content:space-between;gap:12px}"
      + " .broker-modal-header h3{margin:0;font-size:1.125rem;font-weight:700}"
      + " .broker-modal-close{border:0;background:transparent;font-size:1rem;cursor:pointer;color:#475569}"
      + " .broker-modal-body{margin-top:16px;color:#475569;font-size:.95rem;line-height:1.6}"
      + " .broker-modal-actions{margin-top:18px;display:flex;justify-content:flex-end;gap:10px}"
      + " .broker-modal-button{border:1px solid #cbd5e1;background:#fff;border-radius:10px;padding:10px 14px;font-size:.92rem;font-weight:600;cursor:pointer}"
      + " .broker-modal-button.is-primary{background:#22c55e;border-color:#22c55e;color:#fff}"
      + " .broker-modal-grid{display:grid;gap:12px;margin-top:14px}"
      + " .broker-modal-grid div{border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;background:#f8fafc}"
      + " .broker-modal-grid span{display:block;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#64748b;margin-bottom:4px}"
      + " .broker-modal-grid strong{display:block;color:#0f172a}"
      + " .broker-api-status{position:fixed;left:16px;bottom:16px;z-index:110;display:flex;align-items:center;gap:8px;border:1px solid rgba(148,163,184,.35);border-radius:999px;background:rgba(255,255,255,.94);color:#0f172a;padding:8px 11px;box-shadow:0 12px 30px rgba(15,23,42,.12);font-size:12px;backdrop-filter:blur(10px)}"
      + " .broker-api-status span{width:8px;height:8px;border-radius:999px;background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.16)}"
      + " .broker-api-status strong{font-weight:700}"
      + " .broker-api-status em{font-style:normal;color:#64748b}"
      + " .broker-api-status.is-live span{background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.16)}"
      + " .broker-api-status.is-static span{background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.16)}"
      + " @media (max-width:1023px){body .min-h-screen,body header,body .sticky.top-0.z-30,body .flex.flex-1.flex-col.transition-all.duration-300{max-width:100vw!important;overflow-x:hidden}body main{padding-left:1rem!important;padding-right:1rem!important}}";
    document.head.appendChild(style);
  }

  async function apply() {
    injectStyles();
    normalizeResponsiveChrome();
    patchBranding();
    patchLinks();
    patchNav();
    patchHeaderAndText();
    renderPage();
    patchChromeUI();
    bindActions();
    patchApiStatus();
    if (!appState.apiLoaded && !appState.loadPromise) {
      loadClientBackendData(false).then(function (updated) {
        if (!updated) {
          patchApiStatus();
          return;
        }
        renderPage();
        patchChromeUI();
        bindActions();
        patchApiStatus();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  window.addEventListener("load", function () {
    setTimeout(apply, 30);
    setTimeout(apply, 200);
    setTimeout(apply, 600);
  });
})();
