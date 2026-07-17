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
  const TAB_SESSION_KEY = "bullport-client-tab-session-v1";
  const LIVE_SESSION_KEY = "bullport-client-live-session-v1";
  const LIVE_SESSION_TTL = 12000;
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

  const DEFAULT_API_BASE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? "http://127.0.0.1:4000" : "";
  const API_BASE = (localStorage.getItem("bullport_api_base") || DEFAULT_API_BASE).replace(/\/$/, "");
  const appState = {
    apiOnline: false,
    apiMessage: "Checking secure session",
    apiLoaded: false,
    authRedirecting: false,
    loadPromise: null,
    lastSync: null,
    data: null
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

  function markClientTabSession() {
    try {
      sessionStorage.setItem(TAB_SESSION_KEY, "active");
      localStorage.setItem(LIVE_SESSION_KEY, String(Date.now()));
    } catch (error) {}
  }

  function hasClientTabSession() {
    try {
      if (sessionStorage.getItem(TAB_SESSION_KEY) === "active") return true;
      const liveAt = Number(localStorage.getItem(LIVE_SESSION_KEY) || 0);
      if (liveAt && Date.now() - liveAt < LIVE_SESSION_TTL) {
        sessionStorage.setItem(TAB_SESSION_KEY, "active");
        return true;
      }
    } catch (error) {}
    return false;
  }

  function clearClientTabSession() {
    try {
      sessionStorage.removeItem(TAB_SESSION_KEY);
      localStorage.removeItem(LIVE_SESSION_KEY);
    } catch (error) {}
  }

  function closeCookieSession() {
    const csrf = cookieValue("bp_csrf");
    const headers = { "Content-Type": "application/json" };
    if (csrf) headers["x-csrf-token"] = csrf;
    try {
      fetch(API_BASE + "/api/v1/auth/client/logout", {
        method: "POST",
        headers: headers,
        body: "{}",
        credentials: "include",
        keepalive: true
      }).catch(function () {});
    } catch (error) {}
  }

  function startClientTabHeartbeat() {
    if (isAuthPage() || !hasClientTabSession() || window.__bullportTabHeartbeat) return;
    window.__bullportTabHeartbeat = window.setInterval(function () {
      try {
        if (sessionStorage.getItem(TAB_SESSION_KEY) === "active") {
          localStorage.setItem(LIVE_SESSION_KEY, String(Date.now()));
        }
      } catch (error) {}
    }, 4000);
    try { localStorage.setItem(LIVE_SESSION_KEY, String(Date.now())); } catch (error) {}
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

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeData(value) {
    if (typeof value === "string") return escapeHtml(value);
    if (Array.isArray(value)) return value.map(safeData);
    if (value && typeof value === "object") {
      return Object.keys(value).reduce(function (result, key) {
        result[key] = safeData(value[key]);
        return result;
      }, {});
    }
    return value;
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

  function mapInstrument(row) {
    const category = row.category || "Market";
    const risk = labelize(row.riskLevel || "Moderate");
    const status = labelize(row.status || "Watch");
    return {
      id: row.id,
      symbol: row.symbol,
      name: row.name,
      category: category,
      market: row.market || "Global",
      currency: row.currency || "USD",
      price: row.currentPrice == null ? "Unavailable" : money(numberValue(row.currentPrice)),
      priceSource: row.priceSource || "Admin managed",
      priceAsOf: row.priceAsOf || null,
      risk: risk,
      dividend: row.dividendEligible ? "Eligible" : "No",
      tradable: row.tradable ? "Yes" : "No",
      investable: row.investable ? "Yes" : "No",
      status: status
    };
  }

  function syncBackendData(data) {
    if (!data || !data.client) return;
    appState.data = data;
    const metrics = data.metrics || {};
    const client = data.client || {};
    const wallet = data.wallet || {};
    const transactions = cloneList(data.transactions);
    const products = cloneList(data.products);
    const investments = cloneList(data.investments);
    const instruments = cloneList(data.instruments);
    const payouts = cloneList(data.payouts);
    const distributions = cloneList(data.distributions);
    const notifications = cloneList(data.notifications);
    const reports = cloneList(data.reports);
    const tickets = cloneList(data.supportTickets);
    const kycReviews = cloneList(data.kycReviews);
    const watchlist = cloneList(data.watchlist);
    const orders = cloneList(data.orders);
    const riskAlerts = cloneList(data.riskAlerts);

    DEMO.client.name = client.name || DEMO.client.name;
    DEMO.client.email = client.email || DEMO.client.email;
    DEMO.client.phone = client.phone || DEMO.client.phone;
    DEMO.client.accountNo = client.accountNumber || DEMO.client.accountNo;
    DEMO.client.tier = client.tier || DEMO.client.tier;
    DEMO.client.riskProfile = client.riskLevel || DEMO.client.riskProfile;
    DEMO.client.kycStatus = client.kycStatus || DEMO.client.kycStatus;
    DEMO.client.country = client.country || DEMO.client.country;
    DEMO.client.lastLogin = client.lastLoginAt ? formatDate(client.lastLoginAt) : "Not recorded";
    DEMO.client.emailVerified = Boolean(client.emailVerified);
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
    replaceList(DEMO.watchlist, watchlist.map(function (saved) {
      const row = mapInstrument(saved.instrument || saved);
      return {
        id: saved.id,
        instrumentId: row.id,
        symbol: row.symbol,
        theme: row.name,
        price: row.price,
        move: "Snapshot",
        note: row.priceAsOf ? row.priceSource + " at " + formatDate(row.priceAsOf) : "No market snapshot is currently published."
      };
    }));
    replaceList(DEMO.investments, investments.map(function (row) {
      return {
        id: row.id,
        name: row.product ? row.product.name : "Portfolio mandate",
        invested: numberValue(row.investedAmount),
        current: numberValue(row.currentValue),
        projected: "Projected / market-based",
        payout: row.nextAction || DEMO.client.nextPayout,
        status: labelize(row.status),
        action: row.status === "ACTIVE" ? "Review" : "Continue"
      };
    }));
    const actualHoldings = investments.reduce(function (rows, investment) {
      return rows.concat((investment.holdings || []).map(function (holding) {
        const instrument = mapInstrument(holding.instrument || {});
        return {
          asset: instrument.name || "Holding",
          category: instrument.category || "Portfolio asset",
          allocation: numberValue(investment.currentValue) > 0
            ? ((numberValue(holding.marketValue) / numberValue(investment.currentValue)) * 100).toFixed(2) + "%"
            : "Not calculated",
          price: holding.currentPrice == null ? instrument.price : money(numberValue(holding.currentPrice)),
          change: "Snapshot",
          risk: instrument.risk,
          status: instrument.status
        };
      }));
    }, []);
    replaceList(DEMO.holdings, actualHoldings);
    replaceList(DEMO.orderActivity, orders.map(function (row) {
      return {
        id: row.id,
        instrument: row.instrument ? row.instrument.symbol : "Instrument",
        side: labelize(row.side),
        type: labelize(row.type),
        quantity: String(row.quantity),
        price: row.limitPrice == null ? "Market snapshot" : money(numberValue(row.limitPrice)),
        status: labelize(row.status)
      };
    }));
    DEMO.client.optionsStatus = labelize((data.options && data.options.status) || "NOT_APPLIED");
    DEMO.risk.score = client.suitabilityScore == null ? "Not assessed" : String(client.suitabilityScore);
    DEMO.risk.concentration = actualHoldings.length ? "Holdings monitored" : "Not calculated";
    appState.riskAlerts = riskAlerts;
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
    if (distributions.length) {
      replaceList(DEMO.payouts, distributions.map(function (row) {
        return {
          source: row.investment && row.investment.product ? row.investment.product.name : (row.batch ? labelize(row.batch.type) : "Distribution"),
          date: formatDate(row.createdAt),
          type: row.batch ? labelize(row.batch.type) : "Distribution",
          amount: money(numberValue(row.netAmount)),
          mode: labelize(row.mode || "WALLET"),
          status: labelize(row.status)
        };
      }));
    }
    replaceList(DEMO.reports, reports.map(function (row) {
      return {
        id: row.id,
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
        recordId: row.id,
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
        id: row.id,
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

    if (data.profile) {
      const profile = data.profile;
      DEMO.client.name = profile.name || DEMO.client.name;
      DEMO.client.email = profile.email || DEMO.client.email;
      DEMO.client.phone = profile.phone || "Not recorded";
      DEMO.client.country = profile.country || "Not recorded";
      DEMO.client.lastLogin = profile.lastLoginAt ? formatDate(profile.lastLoginAt) : "Not recorded";
      DEMO.client.emailVerified = Boolean(profile.emailVerifiedAt);
      appState.profile = profile;
      appState.preferences = profile.preferences || {};
    }
  }

  function cookieValue(name) {
    const pair = document.cookie.split("; ").find(function (item) { return item.indexOf(name + "=") === 0; });
    return pair ? decodeURIComponent(pair.slice(name.length + 1)) : "";
  }

  function requestKey(prefix) {
    if (window.crypto && window.crypto.randomUUID) return prefix + "-" + window.crypto.randomUUID();
    return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  async function apiRequest(path, options, allowGuest, retried) {
    const controller = window.AbortController ? new AbortController() : null;
    const timeout = controller ? setTimeout(function () { controller.abort(); }, 45000) : null;
    const headers = Object.assign({ "Content-Type": "application/json" }, (options && options.headers) || {});
    const method = String((options && options.method) || "GET").toUpperCase();
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const csrf = cookieValue("bp_csrf");
      if (csrf) headers["x-csrf-token"] = csrf;
    }

    try {
      const response = await fetch(API_BASE + path, Object.assign({}, options || {}, {
        headers: headers,
        credentials: "include",
        signal: controller ? controller.signal : undefined
      }));
      const payload = await response.json().catch(function () { return {}; });
      if (response.status === 401 && !allowGuest && !retried && path !== "/api/v1/auth/refresh") {
        await apiRequest("/api/v1/auth/refresh", { method: "POST", body: "{}" }, true, true);
        return apiRequest(path, options, allowGuest, true);
      }
      if (!response.ok || payload.ok === false) {
        const error = new Error(payload.error && payload.error.message ? payload.error.message : "Request failed");
        error.code = payload.error && payload.error.code ? payload.error.code : "REQUEST_FAILED";
        error.status = response.status;
        error.fields = payload.error && payload.error.fields ? payload.error.fields : null;
        throw error;
      }
      return safeData(payload.data);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  async function pageSpecificData(data) {
    const cur = currentFile();
    const assignments = [];
    function load(path, key, transform) {
      assignments.push(apiRequest(path, { method: "GET" }, false).then(function (value) {
        data[key] = transform ? transform(value) : value;
      }));
    }
    if (["investment-plans.html"].includes(cur)) load("/api/v1/client/portfolios", "products");
    if (["active-investments.html", "portfolio.html", "analytics.html"].includes(cur)) load("/api/v1/client/investments", "investments");
    if (["portfolio.html", "analytics.html", "market.html", "screener.html", "movers.html", "earnings.html", "trading.html"].includes(cur)) load("/api/v1/client/instruments", "instruments");
    if (cur === "watchlist.html") {
      load("/api/v1/client/instruments", "instruments");
      load("/api/v1/client/watchlist", "watchlist");
    }
    if (cur === "orders.html" || cur === "trading.html") load("/api/v1/client/orders", "orders");
    if (cur === "options-access.html") load("/api/v1/client/options", "options");
    if (cur === "dividends.html") load("/api/v1/client/distributions", "distributions");
    if (cur === "risk.html") load("/api/v1/client/risk", "riskAlerts", function (value) { return value.alerts || value; });
    if (cur === "reports.html") load("/api/v1/client/reports", "reports");
    if (cur === "notifications.html") load("/api/v1/client/notifications", "notifications");
    if (cur === "support.html") load("/api/v1/client/support/tickets", "supportTickets");
    if (cur === "profile.html" || cur === "settings.html") load("/api/v1/client/profile", "profile");
    if (cur === "settings.html") load("/api/v1/auth/client/sessions", "sessions");
    if (cur === "kyc.html") load("/api/v1/client/kyc", "kycReviews", function (rows) {
      return rows.map(function (row) { return { requirement: row.level + " identity verification", status: row.status, updatedAt: row.updatedAt, documents: row.documents || [] }; });
    });
    await Promise.all(assignments);
    return data;
  }

  async function loadClientBackendData(force) {
    if (!force && appState.apiLoaded) return true;
    if (!force && appState.loadPromise) return appState.loadPromise;
    appState.loadPromise = (async function () {
      try {
        if (isAuthPage()) {
          appState.apiMessage = "Sign in required";
          appState.apiLoaded = true;
          return false;
        }
        if (!hasClientTabSession()) {
          appState.authRedirecting = true;
          sessionStorage.setItem("bullport_return_to", currentFile());
          clearClientTabSession();
          closeCookieSession();
          appState.apiMessage = "Sign in required";
          appState.apiLoaded = true;
          setTimeout(function () { location.replace("login.html"); }, 50);
          return false;
        }
        startClientTabHeartbeat();
        const data = await apiRequest("/api/v1/client/dashboard", { method: "GET" }, false);
        await pageSpecificData(data);
        syncBackendData(data);
        appState.apiOnline = true;
        appState.apiMessage = "API live";
        appState.apiLoaded = true;
        appState.lastSync = new Date();
        return true;
      } catch (error) {
        appState.apiOnline = false;
        appState.apiMessage = error && error.message ? error.message : "API unavailable";
        appState.apiLoaded = true;
        if (error && error.status === 401 && !isAuthPage()) {
          appState.authRedirecting = true;
          sessionStorage.setItem("bullport_return_to", currentFile());
          setTimeout(function () { location.replace("login.html"); }, 50);
        }
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

  function authFormFromNode(node) {
    return node && node.closest ? node.closest("form") : null;
  }

  function clearAuthErrors(form) {
    if (!form) return;
    const errorNode = form.querySelector(".bp-auth-error");
    if (errorNode) {
      errorNode.textContent = "";
      errorNode.hidden = true;
    }
    form.querySelectorAll(".bp-auth-field,.bp-auth-terms").forEach(function (field) {
      field.classList.remove("is-invalid");
    });
    form.querySelectorAll("[aria-invalid='true']").forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
  }

  function showAuthError(form, message, fieldName) {
    if (!form) {
      toast(message, "warning");
      return;
    }
    const errorNode = form.querySelector(".bp-auth-error");
    if (errorNode) {
      errorNode.textContent = message;
      errorNode.hidden = false;
    }
    if (fieldName) {
      const field = form.querySelector('[name="' + fieldName + '"]');
      if (field) {
        field.setAttribute("aria-invalid", "true");
        const wrapper = field.closest(".bp-auth-field") || field.closest(".bp-auth-terms");
        if (wrapper) wrapper.classList.add("is-invalid");
        if (field.focus) field.focus();
      }
    }
    toast(message, "warning");
  }

  function passwordRuleError(password) {
    if (!password || password.length < 10) return "Password must be at least 10 characters.";
    if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
    if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
    if (!/[0-9]/.test(password)) return "Password must include a number.";
    if (!/[^a-zA-Z0-9]/.test(password)) return "Password must include a symbol.";
    return "";
  }

  function authFormValues(node) {
    const form = authFormFromNode(node);
    const emailNode = form ? form.querySelector('[name="email"]') : null;
    const passwordNode = form ? form.querySelector('[name="password"]') : null;
    const confirmPasswordNode = form ? form.querySelector('[name="confirmPassword"]') : null;
    const countryNode = form ? form.querySelector('[name="country"]') : null;
    const nameNode = form ? form.querySelector('[name="name"]') : null;
    const phoneNode = form ? form.querySelector('[name="phone"]') : null;
    const phoneLocalNode = form ? form.querySelector('[name="phoneLocal"]') : null;
    const acceptedTermsNode = form ? form.querySelector('[name="acceptedTerms"]') : null;
    const phoneCodeNode = form ? form.querySelector(".bp-phone-country-button") : null;
    const email = emailNode ? emailNode.value.trim() : "";
    const password = passwordNode ? passwordNode.value : "";
    const confirmPassword = confirmPasswordNode ? confirmPasswordNode.value : "";
    const country = countryNode ? countryNode.value.trim() : "";
    const phoneCode = phoneCodeNode ? (phoneCodeNode.getAttribute("data-phone-code") || "").trim() : "";
    let phone = phoneNode ? phoneNode.value.trim() : "";
    const phoneLocal = phoneLocalNode ? phoneLocalNode.value.trim() : "";
    if (!phone && phoneCode && phoneLocal) phone = phoneCode + " " + phoneLocal;
    const fallbackName = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
    return {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      country: country,
      phone: phone,
      phoneLocal: phoneLocal,
      acceptedTerms: acceptedTermsNode ? acceptedTermsNode.checked : false,
      name: nameNode && nameNode.value.trim() ? nameNode.value.trim() : fallbackName
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
    node.innerHTML = '<span></span><strong>' + (appState.apiOnline ? "Connected" : "Not connected") + '</strong><em>' + (appState.apiOnline && appState.lastSync ? "Synced " + appState.lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : appState.apiMessage) + "</em>";
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
    const cur = currentFile();
    const isDashboard = cur === "dashboard.html" || cur === "index.html";
    function heroActionClass(targets, defaultActive) {
      const active = targets.indexOf(cur) !== -1 || defaultActive;
      return active
        ? "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20"
        : "inline-flex items-center rounded-md border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary";
    }
    const fundButtonClass = heroActionClass(["deposit.html", "wallet.html"], isDashboard);
    const kycButtonClass = heroActionClass(["kyc.html"], false);
    const reportsButtonClass = heroActionClass(["reports.html"], false);
    const heroSection = isDashboard
      ? '<section class="broker-dashboard-hero relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:p-7"><div class="broker-dashboard-hero-glow"></div><div class="relative grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] xl:items-stretch"><div class="flex min-w-0 flex-col justify-between gap-6"><div><div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"><span class="h-1.5 w-1.5 rounded-full bg-primary"></span>BullPort command center</div><h1 class="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Your investment control room</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Monitor wallet funds, managed portfolios, payouts and compliance readiness from one focused client workspace.</p></div><div class="flex flex-wrap gap-3"><button type="button" data-broker-action="goto-deposit" class="' + fundButtonClass + '">Fund wallet</button><button type="button" data-broker-action="goto-kyc" class="' + kycButtonClass + '">Review KYC</button><button type="button" data-broker-action="goto-reports" class="' + reportsButtonClass + '">Statements</button></div></div><div class="grid gap-3 sm:grid-cols-2"><div class="broker-dashboard-value-card sm:col-span-2"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total portfolio value</p><div class="mt-3 flex flex-wrap items-end justify-between gap-3"><p class="text-3xl font-semibold tracking-tight sm:text-4xl">' + money(DEMO.client.totalPortfolioValue) + '</p><span class="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">P/L ' + money(DEMO.client.profitLoss) + '</span></div><div class="mt-4 grid gap-2 sm:grid-cols-3"><div><p class="text-xs text-muted-foreground">Wallet</p><p class="mt-1 font-semibold">' + money(state.walletBalance) + '</p></div><div><p class="text-xs text-muted-foreground">Active mandates</p><p class="mt-1 font-semibold">' + state.activeInvestments + '</p></div><div><p class="text-xs text-muted-foreground">Pending withdrawal</p><p class="mt-1 font-semibold">' + money(state.pendingWithdrawal) + '</p></div></div></div><div class="rounded-xl border border-border/70 bg-background/70 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">KYC status</p><div class="mt-3 flex items-center justify-between gap-3"><p class="text-sm font-semibold">' + state.kycStatus + '</p>' + badge(state.kycStatus, statusTone(state.kycStatus)) + '</div></div><div class="rounded-xl border border-border/70 bg-background/70 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk profile</p><p class="mt-3 text-sm font-semibold">' + DEMO.client.riskProfile + '</p><p class="mt-1 text-xs text-muted-foreground">Next payout: <span data-broker-next-payout>' + state.nextPayout + '</span></p></div></div></div></section>'
      : '<section class="broker-dashboard-hero relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:p-7"><div class="broker-dashboard-hero-glow"></div><div class="relative grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] xl:items-stretch"><div class="flex min-w-0 flex-col justify-between gap-6"><div><div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"><span class="h-1.5 w-1.5 rounded-full bg-primary"></span>BullPort command center</div><h1 class="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">' + title + '</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">' + subtitle + '</p></div><div class="flex flex-wrap gap-3"><button type="button" data-broker-action="goto-deposit" class="' + fundButtonClass + '">Fund wallet</button><button type="button" data-broker-action="goto-kyc" class="' + kycButtonClass + '">Review KYC</button><button type="button" data-broker-action="goto-reports" class="' + reportsButtonClass + '">Statements</button></div></div><div class="grid gap-3 sm:grid-cols-2"><div class="broker-dashboard-value-card sm:col-span-2"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total portfolio value</p><div class="mt-3 flex flex-wrap items-end justify-between gap-3"><p class="text-3xl font-semibold tracking-tight sm:text-4xl">' + money(DEMO.client.totalPortfolioValue) + '</p><span class="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">P/L ' + money(DEMO.client.profitLoss) + '</span></div><div class="mt-4 grid gap-2 sm:grid-cols-3"><div><p class="text-xs text-muted-foreground">Wallet</p><p class="mt-1 font-semibold">' + money(state.walletBalance) + '</p></div><div><p class="text-xs text-muted-foreground">Active mandates</p><p class="mt-1 font-semibold">' + state.activeInvestments + '</p></div><div><p class="text-xs text-muted-foreground">Pending withdrawal</p><p class="mt-1 font-semibold">' + money(state.pendingWithdrawal) + '</p></div></div></div><div class="rounded-xl border border-border/70 bg-background/70 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">KYC status</p><div class="mt-3 flex items-center justify-between gap-3"><p class="text-sm font-semibold">' + state.kycStatus + '</p>' + badge(state.kycStatus, statusTone(state.kycStatus)) + '</div></div><div class="rounded-xl border border-border/70 bg-background/70 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk profile</p><p class="mt-3 text-sm font-semibold">' + DEMO.client.riskProfile + '</p><p class="mt-1 text-xs text-muted-foreground">Next payout: <span data-broker-next-payout>' + state.nextPayout + '</span></p></div></div></div></section>';
    return '<div id="main-content" class="space-y-6">' +
      heroSection +
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
      ? section("Deposit request details", "Bank and crypto funding requests remain pending until evidence review and approval.", keyValueRows([
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
      '<div class="xl:col-span-5">' + section("Settlement workflow", "Every money movement follows the same visible review and posting controls.", '<div class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-sm text-muted-foreground">' + (isDeposit ? "Deposits move from submitted evidence to confirmed wallet credit before becoming available for portfolio subscriptions or trading." : "Withdrawals use cleared wallet balance and remain reserved while KYC, beneficiary, risk, and approval checks complete.") + "</div>") + "</div>" +
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
          return [row.name, money(row.invested), money(row.current), row.projected, row.payout, badge(row.status, statusTone(row.status)), '<button type="button" data-broker-action="investment-action" data-broker-investment-id="' + (row.id || "") + '" data-broker-investment="' + row.name + '" data-broker-label="' + row.action + '" class="font-semibold text-primary">' + row.action + "</button>"];
        })
      ));
  }

  function portfolioBody() {
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-5">' + section("Allocation summary", "Current concentration across the underlying portfolio mix.", bars(DEMO.allocation, "value", 32)) + "</div>" +
      '<div class="xl:col-span-7">' + section("Underlying holdings", "Instrument composition for the current broker-managed allocation.", DEMO.holdings.length ? table(
        ["Asset", "Category", "Allocation", "Price", "Change", "Risk", "Status"],
        DEMO.holdings.map(function (row) {
          return [row.asset, row.category, row.allocation, row.price, row.change, badge(row.risk, riskTone(row.risk)), badge(row.status, statusTone(row.status))];
        })
      ) : '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-4 text-sm text-muted-foreground">No underlying holdings have been posted for this account.</div>') + "</div>" +
      "</div>";
  }

  function marketBody() {
    return '' +
      section("Supported instrument coverage", "The market page now reflects the broker's multi-asset instrument universe.", table(
        ["Symbol", "Instrument", "Category", "Market", "Currency", "Current price", "Source", "Risk", "Tradable", "Investable", "Status", "Action"],
        DEMO.instruments.map(function (row) {
          const source = row.priceAsOf ? row.priceSource + " - " + formatDate(row.priceAsOf) : "No snapshot";
          return [row.symbol, row.name, row.category, row.market, row.currency, row.price, source, badge(row.risk, riskTone(row.risk)), row.tradable, row.investable, badge(row.status, statusTone(row.status)), '<button type="button" data-broker-action="watchlist-add" data-broker-instrument-id="' + row.id + '" class="font-semibold text-primary">Save</button>'];
        })
      )) +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-6">' + section("Watch themes", "Priority watch areas for the current client account.", miniList(DEMO.watchlist, function (row) {
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold">' + row.symbol + " - " + row.theme + '</p><span class="text-sm font-semibold">' + row.price + '</span></div><p class="mt-1 text-sm text-muted-foreground">' + row.note + '</p><p class="mt-2 text-xs text-emerald-600 dark:text-emerald-300">' + row.move + "</p></div>";
      })) + "</div>" +
      '<div class="xl:col-span-6">' + section("Market disclosures", "Returns remain projected, estimated or market-based; nothing is framed as guaranteed.", '<div class="space-y-3 text-sm text-muted-foreground"><p>Instrument values are admin-managed snapshots with a named source and timestamp, not a live exchange feed.</p><p>Options, commodities and sector concentration carry higher volatility and are surfaced with higher risk labels and access controls.</p><p>Users must complete KYC, wallet funding and risk review before restricted actions become available.</p></div>') + "</div>" +
      "</div>";
  }

  function tradingBody() {
    const selected = DEMO.instruments[0];
    if (!selected) return section("Trading workspace", "The internal order desk accepts requests only for published instruments.", '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-4 text-sm text-muted-foreground">No instrument is currently available.</div>');
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-8">' + section(selected.name + " (" + selected.symbol + ")", "Submit an instruction for internal desk review. This is not represented as live exchange execution.", keyValueRows([
        { label: "Published price", value: selected.price },
        { label: "Price source", value: selected.priceSource },
        { label: "Snapshot time", value: selected.priceAsOf ? formatDate(selected.priceAsOf) : "Unavailable" },
        { label: "Execution mode", value: "Internal order desk" }
      ]) + '<div class="mt-4"><button type="button" data-broker-action="order-create" data-broker-instrument-id="' + selected.id + '" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create order request</button></div>') + "</div>" +
      '<div class="xl:col-span-4">' + section("Trade setup summary", "Eligibility and instrument controls from the broker API.", keyValueRows([
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
    if (!DEMO.watchlist.length) {
      return section("Saved instruments", "Watchlist cards appear here after an instrument is saved from Markets.", '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-4 text-sm text-muted-foreground">Your watchlist is empty. <a class="font-semibold text-primary" href="market.html">Browse markets</a>.</div>');
    }
    return '<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">' + DEMO.watchlist.map(function (row) {
      const moveTone = "info";
      return '<section class="rounded-xl border border-border bg-card p-5 shadow-sm">'
        + '<div class="flex items-start justify-between gap-3"><div><div class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">' + row.symbol + '</div><h2 class="mt-3 text-lg font-semibold tracking-tight">' + row.theme + '</h2><p class="mt-2 text-sm text-muted-foreground">' + row.note + '</p></div>' + badge(row.move, moveTone) + '</div>'
        + '<div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current price</p><p class="mt-2 text-sm font-semibold">' + row.price + '</p></div><div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Watch status</p><p class="mt-2 text-sm font-semibold">Tracked for market review</p></div></div>'
        + '<div class="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4"><a href="trading.html" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open instrument</a><button type="button" data-broker-action="watchlist-remove" data-broker-instrument-id="' + row.instrumentId + '" class="text-sm font-semibold text-primary">Remove</button></div>'
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
    const optionData = (appState.data && appState.data.options) || {};
    const application = optionData.application || {};
    return '' +
      '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">' +
      '<div class="xl:col-span-7">' + section("Eligibility and approval", "Options are treated as an advanced feature, not a default investment plan.", keyValueRows([
        { label: "Current access level", value: DEMO.client.optionsStatus },
        { label: "Suitability score", value: application.score == null ? "Not assessed" : String(application.score) },
        { label: "Required action", value: DEMO.client.optionsStatus === "Not Applied" ? "Complete the options questionnaire" : "Await the recorded compliance decision" },
        { label: "Risk note", value: "Advanced strategies may involve losses beyond premium depending on structure" }
      ]) + (DEMO.client.optionsStatus === "Not Applied" || DEMO.client.optionsStatus === "Restricted" ? '<div class="mt-4"><button type="button" data-broker-action="options-apply" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Apply for options access</button></div>' : '')) + "</div>" +
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
    const reinvestments = ((appState.data && appState.data.investments) || []).filter(function (row) { return row.reinvestPreference === "REINVEST"; }).length;
    return '' +
      '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      card("Total Dividends", money(DEMO.client.totalDividends), "Paid to date across income-generating holdings.", "bg-primary/10 text-primary") +
      card("Total Profits", money(DEMO.client.totalProfits), "Posted profit credits and realized gains.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      card("Next Scheduled Payout", DEMO.client.nextPayout, "Earliest upcoming distribution window.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Reinvestment Preference", reinvestments ? reinvestments + " mandate" + (reinvestments === 1 ? "" : "s") : "Wallet credit", "Based on current investment instructions.", "bg-sky-500/10 text-sky-600 dark:text-sky-300") +
      "</div>" +
      section("Dividend and profit history", "Income and profit posting records aligned to the client plan.", table(
        ["Source", "Date", "Type", "Amount", "Settlement", "Status"],
        DEMO.payouts.map(function (row) {
          return [row.source, row.date, row.type, row.amount, row.mode, badge(row.status, statusTone(row.status))];
        })
      ));
  }

  function riskBody() {
    const alerts = appState.riskAlerts || [];
    return '' +
      '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      card("Risk Score", DEMO.risk.score, "Combined client suitability and portfolio exposure score.", "bg-primary/10 text-primary") +
      card("Concentration", DEMO.risk.concentration, "Largest concentration monitored at portfolio level.", "bg-amber-500/10 text-amber-600 dark:text-amber-300") +
      card("Options Access", DEMO.client.optionsStatus, "Access remains gated until compliance approval.", "bg-rose-500/10 text-rose-600 dark:text-rose-300") +
      card("Open Alerts", String(alerts.length), "Active risk and compliance notices.", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300") +
      "</div>" +
      section("Client-facing risk alerts", "Risk alerts are generated and resolved through the broker risk workflow.", alerts.length ? miniList(alerts, function (row) {
        const note = row.details && row.details.note ? row.details.note : labelize(row.category || "Risk review");
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold">' + row.title + '</p>' + badge(labelize(row.status), statusTone(row.status)) + '</div><p class="mt-2 text-sm text-muted-foreground">' + note + "</p></div>";
      }) : '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-4 text-sm text-muted-foreground">No open risk alerts.</div>');
  }

  function reportsBody() {
    return section("Statements and downloads", "Download-ready client records, account statements and performance summaries.", table(
      ["Report", "Type", "Format", "Period", "Status", "Action"],
      DEMO.reports.map(function (row) {
        return [row.name, row.type, row.format, row.period, badge(row.status, statusTone(row.status)), '<button type="button" data-broker-action="download-report" data-broker-report-id="' + (row.id || "") + '" data-broker-report="' + row.name + '" class="font-semibold text-primary">Download</button>'];
      })
    ));
  }

  function notificationsBody() {
    const state = getState();
    return section("Notification feed", "A single stream for KYC, wallet, investments, income and risk messages.", miniList(state.notifications, function (row) {
        return '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-3"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-semibold">' + row.title + '</p><p class="mt-1 text-sm text-muted-foreground">' + row.category + "</p></div>" + badge(row.state, statusTone(row.state)) + '</div><div class="mt-2 flex items-center justify-between gap-3"><p class="text-xs text-muted-foreground">' + row.time + '</p>' + (row.state === "New" ? '<button type="button" data-broker-action="notification-read" data-broker-notification-id="' + row.id + '" class="text-xs font-semibold text-primary">Mark read</button>' : '') + "</div></div>";
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
        ["Ticket", "Subject", "Channel", "Priority", "Status", "Action"],
        DEMO.supportTickets.map(function (row) {
          return [row.id, row.subject, row.channel, row.priority, badge(row.status, statusTone(row.status)), '<button type="button" data-broker-action="support-reply" data-broker-ticket-id="' + row.recordId + '" class="font-semibold text-primary">Reply</button>'];
        })
      ) + '<button type="button" data-broker-action="support-create" class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open support ticket</button>') + "</div>" +
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
    const profile = appState.profile || {};
    return section("Client profile summary", "Identity and contact information used across the client journey.", keyValueRows([
      { label: "Client name", value: DEMO.client.name },
      { label: "Account number", value: DEMO.client.accountNo },
      { label: "Primary email", value: DEMO.client.email },
      { label: "Phone", value: DEMO.client.phone },
      { label: "Country", value: DEMO.client.country },
      { label: "Email verification", value: DEMO.client.emailVerified ? "Verified" : "Action required" },
      { label: "Address", value: [profile.addressLine1, profile.city, profile.state, profile.postalCode].filter(Boolean).join(", ") || "Not recorded" },
      { label: "Tax residence", value: profile.taxResidence || "Not recorded" },
      { label: "Last login", value: DEMO.client.lastLogin }
    ]) + '<div class="mt-4 flex flex-wrap gap-3"><button type="button" data-broker-action="profile-edit" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Edit profile</button>' + (DEMO.client.emailVerified ? '' : '<button type="button" data-broker-action="verification-resend" class="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">Resend verification</button>') + '</div>');
  }

  function settingsBody() {
    const preferences = appState.preferences || {};
    const sessions = (appState.data && appState.data.sessions) || [];
    return '<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">'
      + '<div class="xl:col-span-7">' + section("Notification and payout preferences", "These controls update the client account and active investment instructions.", '<div class="broker-form-grid"><label class="broker-form-field"><span><input data-setting="emailNotifications" type="checkbox" ' + (preferences.emailNotifications !== false ? 'checked' : '') + '> Email notifications</span></label><label class="broker-form-field"><span><input data-setting="inAppNotifications" type="checkbox" ' + (preferences.inAppNotifications !== false ? 'checked' : '') + '> In-app notifications</span></label><label class="broker-form-field"><span><input data-setting="marketAlerts" type="checkbox" ' + (preferences.marketAlerts !== false ? 'checked' : '') + '> Market alerts</span></label><label class="broker-form-field"><span>Distribution preference</span><select data-setting="distributionPreference"><option value="WALLET" ' + (preferences.distributionPreference !== 'REINVEST' ? 'selected' : '') + '>Credit wallet</option><option value="REINVEST" ' + (preferences.distributionPreference === 'REINVEST' ? 'selected' : '') + '>Reinvest</option></select></label></div><button type="button" data-broker-action="settings-save" class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save preferences</button>') + '</div>'
      + '<div class="xl:col-span-5">' + section("Password security", "Changing your password revokes every other active session.", '<button type="button" data-broker-action="password-change" class="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">Change password</button>') + '</div>'
      + '</div>'
      + section("Active sessions", "Review and revoke browser sessions connected to this account.", sessions.length ? table(["Browser", "IP address", "Last used", "Expires", "Action"], sessions.map(function (row) { return [row.userAgent || "Unknown browser", row.ipAddress || "Unknown", row.lastUsedAt ? formatDate(row.lastUsedAt) : "Not recorded", formatDate(row.expiresAt), '<button type="button" data-broker-action="session-revoke" data-broker-session-id="' + row.id + '" class="font-semibold text-primary">Revoke</button>']; })) : '<div class="rounded-lg border border-border/70 bg-background/60 px-4 py-4 text-sm text-muted-foreground">No active sessions were returned.</div>');
  }

  const COUNTRY_NAMES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
  ];

  const COUNTRY_DIAL_CODES = {
    "Afghanistan": "+93", "Albania": "+355", "Algeria": "+213", "Andorra": "+376", "Angola": "+244", "Antigua and Barbuda": "+1-268", "Argentina": "+54", "Armenia": "+374", "Australia": "+61", "Austria": "+43", "Azerbaijan": "+994",
    "Bahamas": "+1-242", "Bahrain": "+973", "Bangladesh": "+880", "Barbados": "+1-246", "Belarus": "+375", "Belgium": "+32", "Belize": "+501", "Benin": "+229", "Bhutan": "+975", "Bolivia": "+591", "Bosnia and Herzegovina": "+387", "Botswana": "+267", "Brazil": "+55", "Brunei": "+673", "Bulgaria": "+359", "Burkina Faso": "+226", "Burundi": "+257",
    "Cabo Verde": "+238", "Cambodia": "+855", "Cameroon": "+237", "Canada": "+1", "Central African Republic": "+236", "Chad": "+235", "Chile": "+56", "China": "+86", "Colombia": "+57", "Comoros": "+269", "Congo": "+242", "Costa Rica": "+506", "Cote d'Ivoire": "+225", "Croatia": "+385", "Cuba": "+53", "Cyprus": "+357", "Czechia": "+420",
    "Democratic Republic of the Congo": "+243", "Denmark": "+45", "Djibouti": "+253", "Dominica": "+1-767", "Dominican Republic": "+1-809",
    "Ecuador": "+593", "Egypt": "+20", "El Salvador": "+503", "Equatorial Guinea": "+240", "Eritrea": "+291", "Estonia": "+372", "Eswatini": "+268", "Ethiopia": "+251",
    "Fiji": "+679", "Finland": "+358", "France": "+33",
    "Gabon": "+241", "Gambia": "+220", "Georgia": "+995", "Germany": "+49", "Ghana": "+233", "Greece": "+30", "Grenada": "+1-473", "Guatemala": "+502", "Guinea": "+224", "Guinea-Bissau": "+245", "Guyana": "+592",
    "Haiti": "+509", "Honduras": "+504", "Hungary": "+36",
    "Iceland": "+354", "India": "+91", "Indonesia": "+62", "Iran": "+98", "Iraq": "+964", "Ireland": "+353", "Israel": "+972", "Italy": "+39",
    "Jamaica": "+1-876", "Japan": "+81", "Jordan": "+962",
    "Kazakhstan": "+7", "Kenya": "+254", "Kiribati": "+686", "Kuwait": "+965", "Kyrgyzstan": "+996",
    "Laos": "+856", "Latvia": "+371", "Lebanon": "+961", "Lesotho": "+266", "Liberia": "+231", "Libya": "+218", "Liechtenstein": "+423", "Lithuania": "+370", "Luxembourg": "+352",
    "Madagascar": "+261", "Malawi": "+265", "Malaysia": "+60", "Maldives": "+960", "Mali": "+223", "Malta": "+356", "Marshall Islands": "+692", "Mauritania": "+222", "Mauritius": "+230", "Mexico": "+52", "Micronesia": "+691", "Moldova": "+373", "Monaco": "+377", "Mongolia": "+976", "Montenegro": "+382", "Morocco": "+212", "Mozambique": "+258", "Myanmar": "+95",
    "Namibia": "+264", "Nauru": "+674", "Nepal": "+977", "Netherlands": "+31", "New Zealand": "+64", "Nicaragua": "+505", "Niger": "+227", "Nigeria": "+234", "North Korea": "+850", "North Macedonia": "+389", "Norway": "+47",
    "Oman": "+968",
    "Pakistan": "+92", "Palau": "+680", "Palestine": "+970", "Panama": "+507", "Papua New Guinea": "+675", "Paraguay": "+595", "Peru": "+51", "Philippines": "+63", "Poland": "+48", "Portugal": "+351",
    "Qatar": "+974",
    "Romania": "+40", "Russia": "+7", "Rwanda": "+250",
    "Saint Kitts and Nevis": "+1-869", "Saint Lucia": "+1-758", "Saint Vincent and the Grenadines": "+1-784", "Samoa": "+685", "San Marino": "+378", "Sao Tome and Principe": "+239", "Saudi Arabia": "+966", "Senegal": "+221", "Serbia": "+381", "Seychelles": "+248", "Sierra Leone": "+232", "Singapore": "+65", "Slovakia": "+421", "Slovenia": "+386", "Solomon Islands": "+677", "Somalia": "+252", "South Africa": "+27", "South Korea": "+82", "South Sudan": "+211", "Spain": "+34", "Sri Lanka": "+94", "Sudan": "+249", "Suriname": "+597", "Sweden": "+46", "Switzerland": "+41", "Syria": "+963",
    "Taiwan": "+886", "Tajikistan": "+992", "Tanzania": "+255", "Thailand": "+66", "Timor-Leste": "+670", "Togo": "+228", "Tonga": "+676", "Trinidad and Tobago": "+1-868", "Tunisia": "+216", "Turkey": "+90", "Turkmenistan": "+993", "Tuvalu": "+688",
    "Uganda": "+256", "Ukraine": "+380", "United Arab Emirates": "+971", "United Kingdom": "+44", "United States": "+1", "Uruguay": "+598", "Uzbekistan": "+998",
    "Vanuatu": "+678", "Vatican City": "+379", "Venezuela": "+58", "Vietnam": "+84",
    "Yemen": "+967",
    "Zambia": "+260", "Zimbabwe": "+263"
  };

  function countryOptions() {
    return COUNTRY_NAMES.map(function (country) {
      return '<option value="' + country + '"></option>';
    }).join("");
  }

  function phoneCountryOptions() {
    return COUNTRY_NAMES.map(function (country) {
      const code = COUNTRY_DIAL_CODES[country] || "";
      return '<button type="button" class="bp-phone-country-option" data-broker-action="phone-country-select" data-phone-country="' + country + '" data-phone-code="' + code + '"><span>' + country + '</span><strong>' + code + '</strong></button>';
    }).join("");
  }

  function authLayout(kind) {
    const config = {
      login: {
        title: "Access your BullPort dashboard",
        subtitle: "Monitor portfolios, wallet activity, reports and risk controls from one broker portal.",
        cta: "Sign in to dashboard",
        foot: '<div class="flex flex-wrap items-center justify-between gap-3"><span>New to BullPort? <a class="font-medium text-primary hover:underline" href="register.html">Create an account</a></span><a class="font-medium text-primary hover:underline" href="forgot-password.html">Forgot password?</a></div>'
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
    const action = kind === "login" ? "auth-login" : (kind === "register" ? "auth-register" : "auth-reset");
    const passwordAutocomplete = kind === "register" ? "new-password" : "current-password";
    const passwordPlaceholder = kind === "register" ? "10+ chars, A-z, number, symbol" : "Enter your password";
    const passwordField = '<label class="bp-auth-field" for="auth-password"><span>Password</span><div class="bp-auth-password"><input id="auth-password" name="password" autocomplete="' + passwordAutocomplete + '" required placeholder="' + passwordPlaceholder + '" type="password"><button type="button" data-broker-action="toggle-password" data-password-target="auth-password" aria-label="Show password">Show</button></div></label>';
    const confirmPasswordField = '<label class="bp-auth-field" for="auth-confirm-password"><span>Confirm password</span><div class="bp-auth-password"><input id="auth-confirm-password" name="confirmPassword" autocomplete="new-password" required placeholder="Repeat your password" type="password"><button type="button" data-broker-action="toggle-password" data-password-target="auth-confirm-password" aria-label="Show confirm password">Show</button></div></label>';
    const phoneField = '<label class="bp-auth-field" for="auth-phone-local"><span>Phone number</span><div class="bp-phone-control"><button type="button" class="bp-phone-country-button" data-broker-action="phone-country-toggle" aria-expanded="false"><span id="bp-phone-country-label">United Kingdom</span><strong id="bp-phone-dial-code">+44</strong></button><input id="auth-phone-local" name="phoneLocal" autocomplete="tel-national" inputmode="tel" required placeholder="7700 900000"><input id="auth-phone" name="phone" type="hidden" value=""><div class="bp-phone-country-menu" id="bp-phone-country-menu"><input id="bp-phone-country-search" type="search" placeholder="Search country"><div class="bp-phone-country-list">' + phoneCountryOptions() + '</div></div></div></label>';
    const authFields = ''
      + (kind === "register" ? '<label class="bp-auth-field" for="auth-name"><span>Full name</span><input id="auth-name" name="name" autocomplete="name" required placeholder="Your full name"></label>' : "")
      + (kind === "register" ? phoneField : "")
      + '<label class="bp-auth-field" for="auth-email"><span>Email address</span><input id="auth-email" name="email" autocomplete="email" type="email" required placeholder="name@example.com"></label>'
      + (kind === "forgot" ? "" : passwordField)
      + (kind === "register" ? confirmPasswordField + '<label class="bp-auth-field" for="auth-country"><span>Country of residence</span><input id="auth-country" name="country" list="bp-country-list" autocomplete="country-name" required value="United Kingdom" placeholder="Search country"><datalist id="bp-country-list">' + countryOptions() + '</datalist></label><label class="bp-auth-terms"><input id="auth-terms" name="acceptedTerms" type="checkbox" required><span>I agree to the <a href="terms.html" target="_blank" rel="noopener">terms and conditions</a>.</span></label>' : "");
    const trustStrip = kind === "login"
      ? '<div class="bp-auth-checkline"><span></span><p>Protected by secure session cookies, CSRF controls and rotating refresh sessions.</p></div>'
      : '<div class="bp-auth-checkline"><span></span><p>Account access unlocks KYC, wallet funding, managed portfolios and reporting.</p></div>';

    return '' +
      '<div class="bp-auth-page">' +
      '<div class="bp-auth-backdrop"><span></span><span></span><span></span></div>' +
      '<div class="bp-auth-shell">' +
      '<section class="bp-auth-hero" aria-label="BullPort client portal overview">' +
      '<div class="bp-auth-topbar"><div class="bp-auth-topline"><img class="bp-auth-logo" src="assets/images/bullport-logo.png" alt="BullPort"><strong>Client Portal</strong></div></div>' +
      '<div class="bp-auth-copy"><p class="bp-auth-kicker">Broker investment portal</p><h1>' + config.title + '</h1><p>' + config.subtitle + '</p></div>' +
      '<div class="bp-auth-minimal-list"><span>Managed portfolios</span><span>Wallet funding</span><span>Reports</span><span>Support</span></div>' +
      '</section>' +
      '<section class="bp-auth-card" aria-label="' + config.cta + '">' +
      '<div class="bp-auth-card-brand"><img class="bp-auth-logo" src="assets/images/bullport-logo.png" alt="BullPort"><div><p>Investor access</p></div></div>' +
      '<div class="bp-auth-card-head"><div><span>Secure access</span><h2>' + config.cta + '</h2></div><p>' + (kind === "login" ? "Use your BullPort account credentials to continue." : "Keep your investor profile aligned from the first step.") + '</p></div>' +
      '<form class="bp-auth-form" novalidate>' + authFields + '<div class="bp-auth-error" role="alert" hidden></div><button class="bp-auth-submit" data-broker-action="' + action + '" type="button">' + config.cta + '<span aria-hidden="true">&rarr;</span></button></form>' +
      trustStrip +
      '<div class="bp-auth-foot">' + config.foot + '</div>' +
      '</section>' +
      "</div></div>";
  }

  function bindPhoneCountryPicker() {
    const countryNode = document.getElementById("auth-country");
    const phoneNode = document.getElementById("auth-phone");
    const localNode = document.getElementById("auth-phone-local");
    const button = document.querySelector(".bp-phone-country-button");
    const menu = document.getElementById("bp-phone-country-menu");
    const search = document.getElementById("bp-phone-country-search");
    const label = document.getElementById("bp-phone-country-label");
    const dial = document.getElementById("bp-phone-dial-code");
    if (!phoneNode || !localNode || !button || !menu || button.dataset.phoneBound === "true") return;

    function closeMenu() {
      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }

    function syncPhone() {
      const code = button.getAttribute("data-phone-code") || "+44";
      const local = localNode.value.trim();
      phoneNode.value = local ? code + " " + local : "";
    }

    function setPhoneCountry(country) {
      const code = COUNTRY_DIAL_CODES[country];
      if (!code) return;
      button.setAttribute("data-phone-country", country);
      button.setAttribute("data-phone-code", code);
      if (label) label.textContent = country;
      if (dial) dial.textContent = code;
      syncPhone();
    }

    button.dataset.phoneBound = "true";
    button.setAttribute("data-phone-country", "United Kingdom");
    button.setAttribute("data-phone-code", "+44");
    localNode.addEventListener("input", syncPhone);
    if (countryNode) {
      countryNode.addEventListener("change", function () {
        setPhoneCountry(countryNode.value.trim());
      });
      countryNode.addEventListener("input", function () {
        if (COUNTRY_DIAL_CODES[countryNode.value.trim()]) setPhoneCountry(countryNode.value.trim());
      });
    }
    if (search) {
      search.addEventListener("input", function () {
        const query = search.value.trim().toLowerCase();
        menu.querySelectorAll(".bp-phone-country-option").forEach(function (option) {
          const text = option.textContent.toLowerCase();
          option.hidden = query && text.indexOf(query) === -1;
        });
      });
    }
    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !button.contains(event.target)) closeMenu();
    });
    setPhoneCountry("United Kingdom");
  }

  function renderPortalState(message, failed) {
    const main = findMain();
    if (!main) return;
    const meta = currentMeta();
    main.innerHTML = '' +
      '<div id="main-content" class="space-y-6">' +
      '<section class="broker-dashboard-hero relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">' +
      '<div class="broker-dashboard-hero-glow"></div><div class="relative flex min-h-[320px] flex-col items-center justify-center px-4 text-center">' +
      '<span class="flex h-16 w-28 items-center justify-center rounded-2xl border border-primary/20 bg-white px-3 shadow-sm' + (failed ? '' : ' animate-pulse') + '"><img src="assets/images/bullport-logo.png" alt="BullPort" class="h-auto w-full object-contain"></span>' +
      '<div class="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">BullPort client portal</div>' +
      '<h1 class="mt-4 text-3xl font-semibold tracking-tight">' + (failed ? 'Unable to load ' : 'Loading ') + meta.title + '</h1>' +
      '<p class="mt-2 max-w-xl text-sm text-muted-foreground">' + message + '</p>' +
      (failed ? '<button type="button" data-broker-action="api-retry" class="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>' : '') +
      '</div></section></div>';
    if (failed && !appState.authRedirecting) clearBootScreen();
  }

  function renderPage() {
    const cur = currentFile();
    const main = findMain();

    if (cur === "login.html" || cur === "register.html" || cur === "forgot-password.html") {
      clearBootScreen();
      const bodyRoot = document.body;
      const wrapper = bodyRoot && bodyRoot.querySelector(".flex.min-h-screen.items-center.justify-center");
      if (!wrapper) return;
      wrapper.outerHTML = authLayout(cur === "login.html" ? "login" : (cur === "register.html" ? "register" : "forgot"));
      bindPhoneCountryPicker();
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
    clearBootScreen();
  }

  function clearBootScreen() {
    document.documentElement.classList.remove("bp-booting");
    document.querySelectorAll(".bp-boot-screen").forEach(function (node) {
      node.setAttribute("hidden", "hidden");
    });
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
      const brandRoot = brandStack.parentElement;
      if (brandRoot && !brandRoot.querySelector(".bp-portal-logo")) {
        brandRoot.innerHTML = '<img class="bp-portal-logo" src="assets/images/bullport-logo.png" alt="BullPort"><span class="bp-portal-logo-subtitle">Client Portal</span>';
      }
      const spans = brandStack.querySelectorAll("span");
      if (spans[0]) spans[0].textContent = "BullPort";
      if (spans[1]) spans[1].textContent = "Client Portal";
    }

    const headerBrand = document.querySelector("header .hidden.sm\\:block");
    if (headerBrand && !headerBrand.querySelector(".bp-header-logo") && /BullPort Client Portal|Dashboard workspace/i.test(headerBrand.textContent || "")) {
      headerBrand.innerHTML = '<div class="bp-header-brand"><img class="bp-header-logo" src="assets/images/bullport-logo.png" alt="BullPort"><span>Client Portal</span></div>';
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
        if (el.tagName === "BUTTON") {
          el.setAttribute("data-broker-action", "user-menu-toggle");
          el.setAttribute("aria-label", "Account menu");
          el.setAttribute("aria-haspopup", "menu");
          el.setAttribute("aria-expanded", document.getElementById("broker-user-menu") ? "true" : "false");
          el.setAttribute("title", "Account menu");
        }
      }
    });

    document.querySelectorAll('button[aria-label="Notifications"]').forEach(function (button) {
      button.setAttribute("data-broker-action", "notifications-toggle");
      button.setAttribute("aria-haspopup", "menu");
      button.setAttribute("aria-expanded", document.getElementById("broker-notification-menu") ? "true" : "false");
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

  function closeNotificationMenu() {
    const menu = document.getElementById("broker-notification-menu");
    if (menu) menu.remove();
    document.querySelectorAll('[data-broker-action="notifications-toggle"]').forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function closeUserMenu() {
    const menu = document.getElementById("broker-user-menu");
    if (menu) menu.remove();
    document.querySelectorAll('[data-broker-action="user-menu-toggle"]').forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function showNotificationMenu(button) {
    closeUserMenu();
    const existing = document.getElementById("broker-notification-menu");
    if (existing) {
      closeNotificationMenu();
      return;
    }
    const rows = (getState().notifications || []).slice(0, 5);
    const menu = document.createElement("div");
    const rect = button.getBoundingClientRect();
    menu.id = "broker-notification-menu";
    menu.className = "broker-notification-menu";
    menu.setAttribute("role", "menu");
    menu.style.top = Math.round(rect.bottom + 12 + window.scrollY) + "px";
    menu.style.right = Math.max(16, Math.round(window.innerWidth - rect.right)) + "px";
    menu.innerHTML = '<div class="broker-notification-head"><div><strong>Notifications</strong><span>' + rows.length + ' recent alerts</span></div><a href="notifications.html">View all</a></div>'
      + '<div class="broker-notification-list">' + (rows.length ? rows.map(function (row) {
        return '<button type="button" role="menuitem" data-broker-action="notification-open" data-broker-notification-id="' + (row.id || "") + '" class="broker-notification-item"><span class="broker-notification-dot ' + (row.state === "New" ? "is-new" : "") + '"></span><span><strong>' + row.title + '</strong><em>' + row.category + ' · ' + row.time + '</em></span></button>';
      }).join("") : '<div class="broker-notification-empty">No notifications yet.</div>') + '</div>';
    document.body.appendChild(menu);
    button.setAttribute("aria-expanded", "true");
    bindActions();
    setTimeout(function () {
      document.addEventListener("click", outsideNotificationClick, { once: true });
    }, 0);
  }

  function showUserMenu(button) {
    const existing = document.getElementById("broker-user-menu");
    if (existing) {
      closeUserMenu();
      return;
    }
    closeNotificationMenu();
    const profile = appState.profile || {};
    const name = profile.name || DEMO.client.name;
    const email = profile.email || DEMO.client.email;
    const menu = document.createElement("div");
    const rect = button.getBoundingClientRect();
    menu.id = "broker-user-menu";
    menu.className = "broker-user-menu";
    menu.setAttribute("role", "menu");
    menu.style.top = Math.round(rect.bottom + 12 + window.scrollY) + "px";
    menu.style.right = Math.max(16, Math.round(window.innerWidth - rect.right)) + "px";
    const userIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    const settingsIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.08A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.08A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.36.31.7.6 1 .29.29.64.5 1.1.6H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.52.4Z"></path></svg>';
    const logoutIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M21 19V5a2 2 0 0 0-2-2h-5"></path></svg>';
    menu.innerHTML = '<div class="broker-user-head"><div class="broker-user-avatar">TA</div><div><strong>' + name + '</strong><span>' + email + '</span></div></div>'
      + '<div class="broker-user-list">'
      + '<button type="button" role="menuitem" data-broker-action="goto-profile" class="broker-user-item"><i>' + userIcon + '</i><span><strong>Profile</strong><em>Identity and contact details</em></span></button>'
      + '<button type="button" role="menuitem" data-broker-action="goto-settings" class="broker-user-item"><i>' + settingsIcon + '</i><span><strong>Settings</strong><em>Security and preferences</em></span></button>'
      + '<button type="button" role="menuitem" data-broker-action="auth-logout" class="broker-user-item is-danger"><i>' + logoutIcon + '</i><span><strong>Sign out</strong><em>Close this client session</em></span></button>'
      + '</div>';
    document.body.appendChild(menu);
    button.setAttribute("aria-expanded", "true");
    bindActions();
    setTimeout(function () {
      document.addEventListener("click", outsideUserClick, { once: true });
    }, 0);
  }

  function outsideUserClick(event) {
    const menu = document.getElementById("broker-user-menu");
    const toggle = event.target && event.target.closest ? event.target.closest('[data-broker-action="user-menu-toggle"]') : null;
    if (menu && !menu.contains(event.target) && !toggle) closeUserMenu();
    else if (menu) document.addEventListener("click", outsideUserClick, { once: true });
  }

  function outsideNotificationClick(event) {
    const menu = document.getElementById("broker-notification-menu");
    const toggle = event.target && event.target.closest ? event.target.closest('[data-broker-action="notifications-toggle"]') : null;
    if (menu && !menu.contains(event.target) && !toggle) closeNotificationMenu();
    else if (menu) document.addEventListener("click", outsideNotificationClick, { once: true });
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
    bindActions();
  }

  function modalValue(name) {
    const field = document.querySelector('#broker-modal [name="' + name + '"]');
    return field ? field.value.trim() : "";
  }

  function modalField(label, name, type, value, extra) {
    return '<label class="broker-form-field"><span>' + label + '</span><input name="' + name + '" type="' + (type || "text") + '" value="' + (value || "") + '" ' + (extra || "") + '></label>';
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
      case "toggle-password": {
        const targetId = node ? node.getAttribute("data-password-target") : "";
        const input = targetId ? document.getElementById(targetId) : null;
        if (input) {
          const visible = input.getAttribute("type") === "text";
          input.setAttribute("type", visible ? "password" : "text");
          node.textContent = visible ? "Show" : "Hide";
          node.setAttribute("aria-label", visible ? "Show password" : "Hide password");
        }
        return;
      }
      case "phone-country-toggle": {
        const menu = document.getElementById("bp-phone-country-menu");
        const expanded = node && node.getAttribute("aria-expanded") === "true";
        if (menu && node) {
          menu.classList.toggle("is-open", !expanded);
          node.setAttribute("aria-expanded", expanded ? "false" : "true");
          const search = document.getElementById("bp-phone-country-search");
          if (!expanded && search) {
            search.value = "";
            menu.querySelectorAll(".bp-phone-country-option").forEach(function (option) { option.hidden = false; });
            setTimeout(function () { search.focus(); }, 0);
          }
        }
        return;
      }
      case "phone-country-select": {
        const country = node ? node.getAttribute("data-phone-country") : "";
        const code = node ? node.getAttribute("data-phone-code") : "";
        const button = document.querySelector(".bp-phone-country-button");
        const label = document.getElementById("bp-phone-country-label");
        const dial = document.getElementById("bp-phone-dial-code");
        const localNode = document.getElementById("auth-phone-local");
        const phoneNode = document.getElementById("auth-phone");
        const menu = document.getElementById("bp-phone-country-menu");
        if (button && country && code) {
          button.setAttribute("data-phone-country", country);
          button.setAttribute("data-phone-code", code);
          if (label) label.textContent = country;
          if (dial) dial.textContent = code;
          if (phoneNode) phoneNode.value = localNode && localNode.value.trim() ? code + " " + localNode.value.trim() : "";
          if (menu) menu.classList.remove("is-open");
          button.setAttribute("aria-expanded", "false");
          if (localNode) localNode.focus();
        }
        return;
      }
      case "api-retry":
        appState.apiLoaded = false;
        appState.apiMessage = "Retrying secure account connection";
        renderPortalState(appState.apiMessage, false);
        patchApiStatus();
        if (await loadClientBackendData(true)) {
          renderPage();
          patchChromeUI();
          bindActions();
          patchApiStatus();
        } else {
          renderPortalState(appState.apiMessage, true);
          bindActions();
          patchApiStatus();
        }
        return;
      case "auth-login":
        try {
          const form = authFormValues(node);
          if (!form.email || !form.password) throw new Error("Enter your email address and password.");
          await apiRequest("/api/v1/auth/client/login", {
            method: "POST",
            body: JSON.stringify({ email: form.email, password: form.password })
          }, true);
          markClientTabSession();
          startClientTabHeartbeat();
          toast("Signed in. Redirecting to the dashboard.", "success");
          const returnTo = sessionStorage.getItem("bullport_return_to") || "dashboard.html";
          sessionStorage.removeItem("bullport_return_to");
          setTimeout(function () { navigateTo(returnTo); }, 250);
        } catch (error) {
          toast((error && error.message) || "Could not sign in. Check the API and credentials.", "warning");
        }
        return;
      case "auth-register":
        const registerForm = authFormFromNode(node);
        try {
          clearAuthErrors(registerForm);
          const form = authFormValues(node);
          if (!form.name) throw Object.assign(new Error("Enter your full name."), { fieldName: "name" });
          if (!form.phoneLocal || !form.phone) throw Object.assign(new Error("Enter your phone number."), { fieldName: "phoneLocal" });
          if (!form.email) throw Object.assign(new Error("Enter your email address."), { fieldName: "email" });
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) throw Object.assign(new Error("Enter a valid email address."), { fieldName: "email" });
          const passwordError = passwordRuleError(form.password);
          if (passwordError) throw Object.assign(new Error(passwordError), { fieldName: "password" });
          if (!form.confirmPassword) throw Object.assign(new Error("Confirm your password."), { fieldName: "confirmPassword" });
          if (form.password !== form.confirmPassword) throw Object.assign(new Error("Passwords do not match."), { fieldName: "confirmPassword" });
          if (!form.country || COUNTRY_NAMES.indexOf(form.country) === -1) throw Object.assign(new Error("Select a valid country of residence from the list."), { fieldName: "country" });
          if (!form.acceptedTerms) throw Object.assign(new Error("Accept the terms and conditions before creating an account."), { fieldName: "acceptedTerms" });
          await apiRequest("/api/v1/auth/client/register", {
            method: "POST",
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
              country: form.country,
              acceptedTerms: form.acceptedTerms
            })
          }, true);
          markClientTabSession();
          startClientTabHeartbeat();
          toast("Account created. Continue with KYC verification.", "success");
          setTimeout(function () { navigateTo("kyc.html"); }, 250);
        } catch (error) {
          showAuthError(registerForm, (error && error.message) || "Could not create account.", error && error.fieldName);
        }
        return;
      case "auth-reset":
        try {
          const form = authFormValues(node);
          if (!form.email) throw new Error("Enter your account email address.");
          await apiRequest("/api/v1/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: form.email, actorType: "CLIENT" }) }, true);
          toast("If the account exists, reset instructions have been sent.", "info");
        } catch (error) {
          toast((error && error.message) || "Could not request password recovery.", "warning");
        }
        return;
      case "auth-logout":
        closeUserMenu();
        closeNotificationMenu();
        try {
          await apiRequest("/api/v1/auth/client/logout", { method: "POST", body: "{}" }, false);
        } catch (error) {
          if (!error || error.status !== 401) toast(error.message || "Could not close the session cleanly.", "warning");
        }
        clearClientTabSession();
        sessionStorage.removeItem(STATE_KEY);
        navigateTo("login.html");
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
        showModal("Submit bank deposit", '<p>Enter the amount already sent and the bank transfer reference. Funds remain pending until two-admin review and KYC clearance.</p><div class="broker-form-grid">' + modalField("Amount (USD)", "amount", "number", "2500", 'min="1" step="0.01"') + modalField("Bank transfer reference", "externalReference", "text", "", 'required maxlength="120"') + '</div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="deposit-bank-confirm">Submit deposit</button>');
        return;
      case "deposit-bank-confirm":
        try {
          await apiRequest("/api/v1/client/deposits", { method: "POST", headers: { "Idempotency-Key": requestKey("bank-deposit") }, body: JSON.stringify({ amount: Number(modalValue("amount")), currency: "USD", method: "BANK", rail: "Bank transfer", externalReference: modalValue("externalReference") }) }, false);
          closeModal();
          await refreshLiveView("Bank deposit submitted for operations review.", "success");
        } catch (error) { toast((error && error.message) || "Could not submit the deposit.", "warning"); }
        return;
      case "deposit-crypto":
        showModal("Submit crypto funding", '<p>Submit a transfer only after sending it to BullPort\'s reviewed funding wallet. The transaction is credited after chain, compliance, and finance confirmation.</p><div class="broker-form-grid">' + modalField("Amount (USD equivalent)", "amount", "number", "2500", 'min="1" step="0.01"') + '<label class="broker-form-field"><span>Network</span><select name="rail"><option value="TRC20">USDT (TRC20)</option><option value="Bitcoin">Bitcoin</option><option value="Ethereum">Ethereum</option></select></label>' + modalField("Transaction hash", "transactionHash", "text", "", 'required minlength="8"') + '</div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="deposit-crypto-confirm">Submit transfer</button>');
        return;
      case "deposit-crypto-confirm":
        try {
          await apiRequest("/api/v1/client/deposits", { method: "POST", headers: { "Idempotency-Key": requestKey("crypto-deposit") }, body: JSON.stringify({ amount: Number(modalValue("amount")), currency: "USD", method: "CRYPTO", rail: modalValue("rail"), transactionHash: modalValue("transactionHash") }) }, false);
          closeModal();
          await refreshLiveView("Crypto transfer submitted for confirmation.", "success");
        } catch (error) { toast((error && error.message) || "Could not submit the crypto transfer.", "warning"); }
        return;
      case "withdraw-bank":
        const beneficiaries = ((appState.data && appState.data.beneficiaries) || []).filter(function (item) { return item.type === "BANK" && item.status === "VERIFIED"; });
        if (!beneficiaries.length) { toast("Add and verify a bank beneficiary before withdrawing.", "warning"); return; }
        showModal("Withdraw to bank", '<p>Cleared funds are reserved immediately and remain held until finance, risk, and maker-checker review completes.</p><div class="broker-form-grid">' + modalField("Amount (USD)", "amount", "number", "1200", 'min="1" step="0.01"') + '<label class="broker-form-field"><span>Verified beneficiary</span><select name="beneficiaryId">' + beneficiaries.map(function (item) { return '<option value="' + item.id + '">' + item.label + ' - ' + (item.accountNumberMasked || "verified") + '</option>'; }).join("") + '</select></label></div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="withdraw-confirm">Submit withdrawal</button>');
        return;
      case "withdraw-crypto":
        const cryptoBeneficiaries = ((appState.data && appState.data.beneficiaries) || []).filter(function (item) { return item.type === "CRYPTO" && item.status === "VERIFIED"; });
        if (!cryptoBeneficiaries.length) { toast("Add and verify a crypto beneficiary before withdrawing.", "warning"); return; }
        showModal("Withdraw to crypto", '<p>Crypto withdrawals require approved KYC, a screened beneficiary, and enhanced risk review.</p><div class="broker-form-grid">' + modalField("Amount (USD)", "amount", "number", "1200", 'min="1" step="0.01"') + '<label class="broker-form-field"><span>Verified wallet</span><select name="beneficiaryId">' + cryptoBeneficiaries.map(function (item) { return '<option value="' + item.id + '">' + item.label + ' - ' + (item.walletAddressMasked || item.cryptoNetwork) + '</option>'; }).join("") + '</select></label></div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="withdraw-confirm">Submit withdrawal</button>');
        return;
      case "withdraw-confirm":
        try {
          await apiRequest("/api/v1/client/withdrawals", { method: "POST", headers: { "Idempotency-Key": requestKey("withdrawal") }, body: JSON.stringify({ amount: Number(modalValue("amount")), currency: "USD", beneficiaryId: modalValue("beneficiaryId") }) }, false);
          closeModal();
          await refreshLiveView("Withdrawal submitted for finance and risk review.", "success");
        } catch (error) { toast((error && error.message) || "Could not submit the withdrawal.", "warning"); }
        return;
      case "subscribe-plan":
        const plan = DEMO.plans.find(function (item) { return item.name === node.getAttribute("data-broker-plan"); });
        if (!plan || !plan.id) { toast("This portfolio is not currently open for subscription.", "warning"); return; }
        showModal("Subscribe to " + plan.name, '<p>Subscriptions require approved KYC, suitable risk classification, and cleared wallet funds. Returns remain projected and market-based.</p><div class="broker-form-grid">' + modalField("Investment amount (USD)", "amount", "number", String(Number(String(plan.minimum).replace(/[^0-9.]/g, "")) || 2500), 'min="1" step="0.01"') + '<input type="hidden" name="productId" value="' + plan.id + '"><label class="broker-form-field"><span>Distribution preference</span><select name="reinvestPreference"><option value="WALLET">Credit wallet</option><option value="REINVEST">Reinvest distributions</option></select></label></div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="subscribe-plan-confirm">Confirm subscription</button>');
        return;
      case "subscribe-plan-confirm":
        try {
          await apiRequest("/api/v1/client/investments", { method: "POST", headers: { "Idempotency-Key": requestKey("investment") }, body: JSON.stringify({ productId: modalValue("productId"), amount: Number(modalValue("amount")), reinvestPreference: modalValue("reinvestPreference") }) }, false);
          closeModal();
          await refreshLiveView("Portfolio subscription is active in My Investments.", "success");
        } catch (error) { toast((error && error.message) || "Could not create the subscription.", "warning"); }
        return;
      case "investment-action":
        navigateTo("portfolio.html?investment=" + encodeURIComponent(node.getAttribute("data-broker-investment-id") || ""));
        return;
      case "download-report":
        try {
          const reportId = node.getAttribute("data-broker-report-id");
          if (!reportId) throw new Error("This report is not available for download.");
          const response = await fetch(API_BASE + "/api/v1/client/reports/" + encodeURIComponent(reportId) + "/download", { credentials: "include" });
          if (!response.ok) { const payload = await response.json().catch(function () { return {}; }); throw new Error(payload.error && payload.error.message ? payload.error.message : "Report download failed"); }
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "bullport-report.csv";
          link.click();
          setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
          toast("Report download started.", "success");
        } catch (error) { toast((error && error.message) || "Could not download the report.", "warning"); }
        return;
      case "kyc-upload":
        const currentCase = appState.data && appState.data.kycCases && appState.data.kycCases[0];
        if (!currentCase) { toast("Start the KYC review before uploading documents.", "warning"); return; }
        showModal("Upload KYC document", '<p>Accepted formats are PDF, JPG, and PNG. Files are private and validated before storage.</p><div class="broker-form-grid"><input type="hidden" name="caseId" value="' + currentCase.id + '"><label class="broker-form-field"><span>Document type</span><select name="documentType"><option value="Government ID">Government ID</option><option value="Proof of address">Proof of address</option><option value="Source of funds">Source of funds</option></select></label><label class="broker-form-field"><span>File</span><input name="documentFile" type="file" accept="application/pdf,image/jpeg,image/png" required></label></div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="kyc-upload-confirm">Upload document</button>');
        return;
      case "kyc-upload-confirm":
        try {
          const fileInput = document.querySelector('#broker-modal [name="documentFile"]');
          const file = fileInput && fileInput.files && fileInput.files[0];
          if (!file) throw new Error("Choose a KYC document to upload.");
          const base64 = await new Promise(function (resolve, reject) { const reader = new FileReader(); reader.onload = function () { resolve(String(reader.result).split(",")[1]); }; reader.onerror = reject; reader.readAsDataURL(file); });
          await apiRequest("/api/v1/client/kyc/documents", { method: "POST", body: JSON.stringify({ caseId: modalValue("caseId"), type: modalValue("documentType"), fileName: file.name, mimeType: file.type, base64: base64 }) }, false);
          closeModal();
          await refreshLiveView("KYC document uploaded securely.", "success");
        } catch (error) { toast((error && error.message) || "Could not upload the document.", "warning"); }
        return;
      case "kyc-submit":
        try {
          await apiRequest("/api/v1/client/kyc/submit", {
            method: "POST",
            body: JSON.stringify({ level: "Standard", questionnaire: { objective: "Long-term portfolio growth", experience: "Intermediate", lossTolerance: "Moderate", horizon: "Long term" } })
          }, false);
          await refreshLiveView("KYC documents submitted for compliance review.", "success");
        } catch (error) { toast((error && error.message) || "Could not submit KYC.", "warning"); }
        return;
      case "watchlist-add":
        try {
          await apiRequest("/api/v1/client/watchlist", {
            method: "POST",
            body: JSON.stringify({ instrumentId: node.getAttribute("data-broker-instrument-id") })
          }, false);
          await refreshLiveView("Instrument saved to your watchlist.", "success");
        } catch (error) { toast((error && error.message) || "Could not save the instrument.", "warning"); }
        return;
      case "watchlist-remove":
        try {
          await apiRequest("/api/v1/client/watchlist/" + encodeURIComponent(node.getAttribute("data-broker-instrument-id") || ""), { method: "DELETE", body: "{}" }, false);
          await refreshLiveView("Instrument removed from your watchlist.", "success");
        } catch (error) { toast((error && error.message) || "Could not remove the instrument.", "warning"); }
        return;
      case "order-create":
        showModal("Create order request", '<p>The instruction is submitted to BullPort\'s internal order desk for risk review and approval.</p><div class="broker-form-grid"><input type="hidden" name="instrumentId" value="' + (node.getAttribute("data-broker-instrument-id") || "") + '"><label class="broker-form-field"><span>Side</span><select name="side"><option value="BUY">Buy</option><option value="SELL">Sell</option></select></label><label class="broker-form-field"><span>Order type</span><select name="type"><option value="MARKET">Market snapshot</option><option value="LIMIT">Limit</option></select></label>' + modalField("Quantity", "quantity", "number", "1", 'min="0.00000001" step="0.00000001"') + modalField("Limit price (required for limit)", "limitPrice", "number", "", 'min="0.01" step="0.01"') + '</div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="order-confirm">Submit order request</button>');
        return;
      case "order-confirm":
        try {
          const orderType = modalValue("type");
          const orderBody = {
            instrumentId: modalValue("instrumentId"),
            side: modalValue("side"),
            type: orderType,
            quantity: Number(modalValue("quantity"))
          };
          if (orderType === "LIMIT") orderBody.limitPrice = Number(modalValue("limitPrice"));
          await apiRequest("/api/v1/client/orders", { method: "POST", headers: { "Idempotency-Key": requestKey("order") }, body: JSON.stringify(orderBody) }, false);
          closeModal();
          await refreshLiveView("Order request submitted to the internal desk.", "success");
        } catch (error) { toast((error && error.message) || "Could not submit the order.", "warning"); }
        return;
      case "options-apply":
        showModal("Options suitability application", '<p>Options are high risk and require compliance approval. Answer each question accurately.</p><div class="broker-form-grid"><label class="broker-form-field"><span>Options experience</span><select name="experience"><option value="NONE">None</option><option value="UNDER_2">Under 2 years</option><option value="TWO_TO_FIVE">2 to 5 years</option><option value="OVER_FIVE">Over 5 years</option></select></label><label class="broker-form-field"><span>Knowledge</span><select name="knowledge"><option value="BASIC">Basic</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></label><label class="broker-form-field"><span>Loss tolerance</span><select name="lossTolerance"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label><label class="broker-form-field"><span>Primary objective</span><select name="objective"><option value="INCOME">Income</option><option value="GROWTH">Growth</option><option value="HEDGING">Hedging</option><option value="SPECULATION">Speculation</option></select></label><label class="broker-form-field"><span><input name="disclosureAccepted" type="checkbox" required> I accept the options risk disclosure.</span></label></div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="options-confirm">Submit application</button>');
        return;
      case "options-confirm":
        try {
          const accepted = document.querySelector('#broker-modal [name="disclosureAccepted"]');
          if (!accepted || !accepted.checked) throw new Error("Accept the options risk disclosure to continue.");
          await apiRequest("/api/v1/client/options/apply", { method: "POST", body: JSON.stringify({ questionnaire: { experience: modalValue("experience"), knowledge: modalValue("knowledge"), lossTolerance: modalValue("lossTolerance"), objective: modalValue("objective") }, disclosureAccepted: true }) }, false);
          closeModal();
          await refreshLiveView("Options application submitted for compliance review.", "success");
        } catch (error) { toast((error && error.message) || "Could not submit the options application.", "warning"); }
        return;
      case "profile-edit":
        const profile = appState.profile || {};
        showModal("Edit client profile", '<div class="broker-form-grid">' + modalField("Full name", "name", "text", profile.name || DEMO.client.name, 'required maxlength="120"') + modalField("Phone", "phone", "tel", profile.phone || "", 'required maxlength="30"') + modalField("Country", "country", "text", profile.country || "", 'required maxlength="80"') + modalField("Address line 1", "addressLine1", "text", profile.addressLine1 || "", 'required maxlength="160"') + modalField("Address line 2", "addressLine2", "text", profile.addressLine2 || "", 'maxlength="160"') + modalField("City", "city", "text", profile.city || "", 'required maxlength="80"') + modalField("State / county", "state", "text", profile.state || "", 'maxlength="80"') + modalField("Postal code", "postalCode", "text", profile.postalCode || "", 'maxlength="30"') + modalField("Tax residence", "taxResidence", "text", profile.taxResidence || "", 'maxlength="80"') + modalField("Tax ID", "taxId", "text", profile.taxId || "", 'maxlength="60"') + '</div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="profile-confirm">Save profile</button>');
        return;
      case "profile-confirm":
        try {
          await apiRequest("/api/v1/client/profile", { method: "PUT", body: JSON.stringify({ name: modalValue("name"), phone: modalValue("phone"), country: modalValue("country"), addressLine1: modalValue("addressLine1"), addressLine2: modalValue("addressLine2") || null, city: modalValue("city"), state: modalValue("state") || null, postalCode: modalValue("postalCode") || null, taxResidence: modalValue("taxResidence") || null, taxId: modalValue("taxId") || null }) }, false);
          closeModal();
          await refreshLiveView("Profile updated.", "success");
        } catch (error) { toast((error && error.message) || "Could not update the profile.", "warning"); }
        return;
      case "verification-resend":
        try {
          await apiRequest("/api/v1/auth/client/resend-verification", { method: "POST", body: "{}" }, false);
          toast("Verification instructions were queued for delivery.", "success");
        } catch (error) { toast((error && error.message) || "Could not resend verification.", "warning"); }
        return;
      case "settings-save":
        try {
          const value = function (name) { return document.querySelector('[data-setting="' + name + '"]'); };
          await apiRequest("/api/v1/client/settings", { method: "PUT", body: JSON.stringify({ emailNotifications: value("emailNotifications").checked, inAppNotifications: value("inAppNotifications").checked, marketAlerts: value("marketAlerts").checked, distributionPreference: value("distributionPreference").value }) }, false);
          await refreshLiveView("Account preferences updated.", "success");
        } catch (error) { toast((error && error.message) || "Could not update preferences.", "warning"); }
        return;
      case "password-change":
        showModal("Change password", '<p>Your other active sessions will be revoked after this change.</p><div class="broker-form-grid">' + modalField("Current password", "currentPassword", "password", "", 'required autocomplete="current-password"') + modalField("New password", "newPassword", "password", "", 'required autocomplete="new-password" minlength="10"') + '</div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="password-confirm">Change password</button>');
        return;
      case "password-confirm":
        try {
          await apiRequest("/api/v1/auth/client/change-password", { method: "POST", body: JSON.stringify({ currentPassword: modalValue("currentPassword"), newPassword: modalValue("newPassword") }) }, false);
          closeModal();
          toast("Password changed and other sessions revoked.", "success");
        } catch (error) { toast((error && error.message) || "Could not change the password.", "warning"); }
        return;
      case "session-revoke":
        try {
          const result = await apiRequest("/api/v1/auth/client/sessions/" + encodeURIComponent(node.getAttribute("data-broker-session-id") || ""), { method: "DELETE", body: "{}" }, false);
          if (result.currentSession) {
            sessionStorage.removeItem(STATE_KEY);
            navigateTo("login.html");
            return;
          }
          await refreshLiveView("Session revoked.", "success");
        } catch (error) { toast((error && error.message) || "Could not revoke the session.", "warning"); }
        return;
      case "notification-read":
        try {
          await apiRequest("/api/v1/client/notifications/" + encodeURIComponent(node.getAttribute("data-broker-notification-id") || "") + "/read", { method: "POST", body: "{}" }, false);
          await refreshLiveView("Notification marked as read.", "success");
        } catch (error) { toast((error && error.message) || "Could not update the notification.", "warning"); }
        return;
      case "notifications-toggle":
        showNotificationMenu(node);
        return;
      case "notification-open":
        closeNotificationMenu();
        navigateTo("notifications.html");
        return;
      case "user-menu-toggle":
        showUserMenu(node);
        return;
      case "goto-profile":
        closeUserMenu();
        navigateTo("profile.html");
        return;
      case "goto-settings":
        closeUserMenu();
        navigateTo("settings.html");
        return;
      case "support-create":
        showModal("Open support ticket", '<div class="broker-form-grid">' + modalField("Subject", "subject", "text", "", 'required maxlength="160"') + '<label class="broker-form-field"><span>Category</span><select name="category"><option value="Wallet">Wallet</option><option value="KYC">KYC</option><option value="Investments">Investments</option><option value="Trading">Trading</option><option value="Reports">Reports</option><option value="General">General</option></select></label><label class="broker-form-field"><span>Priority</span><select name="priority"><option value="Normal">Normal</option><option value="Low">Low</option><option value="High">High</option></select></label><label class="broker-form-field"><span>Description</span><textarea name="description" required minlength="5" maxlength="5000"></textarea></label></div>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="support-create-confirm">Submit ticket</button>');
        return;
      case "support-create-confirm":
        try {
          await apiRequest("/api/v1/client/support/tickets", { method: "POST", body: JSON.stringify({ subject: modalValue("subject"), category: modalValue("category"), priority: modalValue("priority"), description: modalValue("description") }) }, false);
          closeModal();
          await refreshLiveView("Support ticket opened.", "success");
        } catch (error) { toast((error && error.message) || "Could not open the support ticket.", "warning"); }
        return;
      case "support-reply":
        showModal("Reply to support ticket", '<input type="hidden" name="ticketId" value="' + (node.getAttribute("data-broker-ticket-id") || "") + '"><label class="broker-form-field"><span>Message</span><textarea name="body" required maxlength="5000"></textarea></label>', '<button type="button" class="broker-modal-button" data-broker-close-modal="true">Cancel</button><button type="button" class="broker-modal-button is-primary" data-broker-action="support-reply-confirm">Send reply</button>');
        return;
      case "support-reply-confirm":
        try {
          await apiRequest("/api/v1/client/support/tickets/" + encodeURIComponent(modalValue("ticketId")) + "/messages", { method: "POST", body: JSON.stringify({ body: modalValue("body") }) }, false);
          closeModal();
          await refreshLiveView("Support reply sent.", "success");
        } catch (error) { toast((error && error.message) || "Could not send the reply.", "warning"); }
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
      + "@font-face{font-family:'Chakra Petch';font-style:normal;font-weight:700;font-display:swap;src:url('assets/fonts/chakrapetch-869a9485.woff2') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}"
      + "html,body{max-width:100%;overflow-x:hidden}"
      + ":root,.dark{--sidebar:oklch(12% .02 142);--sidebar-foreground:oklch(87% .005 142);--sidebar-accent:oklch(18% .025 142);--sidebar-accent-foreground:oklch(95% .005 142);--sidebar-border:oklch(20% .025 142);--sidebar-primary:oklch(60% .195 142);--sidebar-primary-foreground:oklch(98.5% 0 0)}"
      + ".broker-axis-label{fill:currentColor;opacity:.65;font-size:11px}"
      + " main table{table-layout:auto}"
      + " main a{text-decoration:none}"
      + " main h1,main h2,main h3{letter-spacing:0}"
      + " main .rounded-xl{border-radius:12px}"
      + " main .rounded-2xl{border-radius:18px}"
      + " aside.bg-sidebar{background:#111b15!important;color:#dbe7dd;border-right:1px solid rgba(255,255,255,.08)}"
      + " aside>div:first-child{background:#fff!important;color:#101713;border-bottom:1px solid #e2e8f0!important}"
      + " aside nav{background:#111b15}"
      + " .broker-dashboard-hero{background:linear-gradient(135deg,rgba(255,255,255,.96),rgba(241,248,244,.94) 46%,rgba(255,255,255,.98));isolation:isolate}"
      + " .dark .broker-dashboard-hero{background:linear-gradient(135deg,rgba(16,24,20,.96),rgba(17,32,24,.92) 48%,rgba(10,15,12,.98))}"
      + " .broker-dashboard-hero-glow{position:absolute;right:-80px;top:-120px;width:360px;height:360px;border-radius:999px;background:radial-gradient(circle,rgba(34,197,94,.24),transparent 68%);pointer-events:none}"
      + " .broker-dashboard-value-card{border:1px solid rgba(34,197,94,.18);border-radius:16px;background:linear-gradient(135deg,rgba(255,255,255,.88),rgba(240,253,244,.74));padding:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.55)}"
      + " .dark .broker-dashboard-value-card{background:linear-gradient(135deg,rgba(15,23,18,.88),rgba(20,83,45,.18));border-color:rgba(74,222,128,.22)}"
      + " @media (max-width:640px){.broker-dashboard-hero{padding:18px}.broker-dashboard-hero h1{font-size:1.875rem;line-height:2.2rem}.broker-dashboard-value-card{padding:16px}}"
      + " .broker-toast-root{position:fixed;right:16px;bottom:16px;z-index:120;display:grid;gap:10px;max-width:min(360px,calc(100vw - 32px))}"
      + " .broker-toast{transform:translateY(8px);opacity:0;border-radius:12px;padding:12px 14px;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.16);transition:opacity .2s ease,transform .2s ease}"
      + " .broker-toast.is-visible{transform:translateY(0);opacity:1}"
      + " .broker-toast-default,.broker-toast-info{background:#0f172a}"
      + " .broker-toast-success{background:#15803d}"
      + " .broker-toast-warning{background:#b45309}"
      + " .broker-notification-menu{position:absolute;z-index:130;width:min(380px,calc(100vw - 32px));overflow:hidden;border:1px solid rgba(148,163,184,.28);border-radius:18px;background:rgba(255,255,255,.98);color:#101713;box-shadow:0 24px 70px rgba(15,23,42,.18);backdrop-filter:blur(18px)}"
      + " .broker-notification-head{display:flex;align-items:center;justify-content:space-between;gap:14px;border-bottom:1px solid #e2e8f0;padding:15px 16px}.broker-notification-head strong{display:block;font-size:15px;font-weight:850}.broker-notification-head span{display:block;margin-top:2px;color:#64748b;font-size:12px}.broker-notification-head a{color:#16a34a;font-size:12px;font-weight:850;text-transform:uppercase;letter-spacing:.04em;text-decoration:none}"
      + " .broker-notification-list{display:grid;max-height:340px;overflow:auto;padding:6px}.broker-notification-item{display:grid;grid-template-columns:auto 1fr;gap:10px;width:100%;border:0;border-radius:12px;background:transparent;padding:11px 10px;text-align:left;cursor:pointer}.broker-notification-item:hover{background:#f1f8f3}.broker-notification-item strong{display:block;color:#101713;font-size:13px;font-weight:800;line-height:1.35}.broker-notification-item em{display:block;margin-top:4px;color:#64748b;font-size:12px;font-style:normal}.broker-notification-dot{margin-top:5px;height:8px;width:8px;border-radius:999px;background:#cbd5e1}.broker-notification-dot.is-new{background:#19b72f;box-shadow:0 0 0 4px rgba(25,183,47,.12)}.broker-notification-empty{padding:18px;color:#64748b;font-size:13px;text-align:center}"
      + " .broker-user-menu{position:absolute;z-index:130;width:min(320px,calc(100vw - 32px));overflow:hidden;border:1px solid rgba(148,163,184,.28);border-radius:18px;background:rgba(255,255,255,.98);color:#101713;box-shadow:0 24px 70px rgba(15,23,42,.18);backdrop-filter:blur(18px)}"
      + " .broker-user-head{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;border-bottom:1px solid #e2e8f0;padding:15px 16px}.broker-user-avatar{display:flex;height:42px;width:42px;align-items:center;justify-content:center;border-radius:999px;background:#19b72f;color:#fff;font-size:13px;font-weight:900}.broker-user-head strong{display:block;font-size:14px;font-weight:850}.broker-user-head span{display:block;margin-top:2px;overflow:hidden;color:#64748b;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.broker-user-list{display:grid;padding:6px}.broker-user-item{display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:center;width:100%;border:0;border-radius:12px;background:transparent;padding:10px;text-align:left;cursor:pointer}.broker-user-item:hover{background:#f1f8f3}.broker-user-item i{display:flex;height:34px;width:34px;align-items:center;justify-content:center;border-radius:10px;background:#eef8f0;color:#16a34a}.broker-user-item svg{height:17px;width:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.broker-user-item span{display:block}.broker-user-item strong{display:block;color:#101713;font-size:13px;font-weight:850}.broker-user-item em{display:block;margin-top:4px;color:#64748b;font-size:12px;font-style:normal}.broker-user-item.is-danger i{background:#fef2f2;color:#b91c1c}.broker-user-item.is-danger strong{color:#b91c1c}.broker-user-item.is-danger:hover{background:#fef2f2}"
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
      + " .broker-form-grid{display:grid;gap:14px;margin-top:16px}"
      + " .broker-form-field{display:grid;gap:7px;color:#334155;font-size:.85rem;font-weight:600}"
      + " .broker-form-field input,.broker-form-field select{width:100%;min-height:42px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#0f172a;padding:9px 11px;font:inherit;font-weight:500}"
      + " .broker-form-field input[type=file]{padding:7px}"
      + " .broker-api-status{position:fixed;left:16px;bottom:16px;z-index:110;display:flex;align-items:center;gap:8px;border:1px solid rgba(148,163,184,.35);border-radius:999px;background:rgba(255,255,255,.94);color:#0f172a;padding:8px 11px;box-shadow:0 12px 30px rgba(15,23,42,.12);font-size:12px;backdrop-filter:blur(10px)}"
      + " .broker-api-status span{width:8px;height:8px;border-radius:999px;background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.16)}"
      + " .broker-api-status strong{font-weight:700}"
      + " .broker-api-status em{font-style:normal;color:#64748b}"
      + " .broker-api-status.is-live span{background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.16)}"
      + " .broker-api-status.is-static span{background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.16)}"
      + " .bp-portal-logo{display:block;width:142px;height:auto;object-fit:contain}.bp-portal-logo-subtitle{display:block;margin-top:2px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.16em}.bp-header-brand{display:flex;align-items:center;gap:12px}.bp-header-logo{display:block;width:128px;height:auto;object-fit:contain}.bp-header-brand span{border-left:1px solid #dbe3dd;padding-left:12px;color:#64748b;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.14em}"
      + " .bp-auth-page{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px;background:#edf5ef;color:#101713;isolation:isolate}"
      + " .bp-auth-backdrop{position:absolute;inset:0;overflow:hidden;z-index:-1;background:linear-gradient(135deg,#e9f5eb 0%,#f8fafc 42%,#e5f0e8 100%)}.bp-auth-backdrop span{position:absolute;border-radius:999px;filter:blur(10px);opacity:.72}.bp-auth-backdrop span:nth-child(1){width:420px;height:420px;left:-120px;top:-90px;background:radial-gradient(circle,rgba(34,197,94,.28),transparent 68%)}.bp-auth-backdrop span:nth-child(2){width:360px;height:360px;right:-120px;bottom:-80px;background:radial-gradient(circle,rgba(15,23,42,.12),transparent 70%)}.bp-auth-backdrop span:nth-child(3){width:220px;height:220px;right:26%;top:18%;background:radial-gradient(circle,rgba(25,183,47,.18),transparent 70%)}"
      + " .bp-auth-shell{width:min(1040px,100%);display:grid;grid-template-columns:minmax(0,.95fr) minmax(390px,.75fr);gap:22px;align-items:stretch}"
      + " .bp-auth-hero,.bp-auth-card{position:relative;overflow:hidden;border:1px solid rgba(15,23,42,.1);box-shadow:0 28px 80px rgba(15,23,42,.16)}"
      + " .bp-auth-hero{min-height:560px;border-radius:30px;background:linear-gradient(135deg,#08110c 0%,#152219 50%,#0b130e 100%);color:#fff;padding:34px;display:flex;flex-direction:column;justify-content:space-between}"
      + " .bp-auth-hero:before{content:'';position:absolute;inset:auto -12% -30% 20%;height:420px;background:radial-gradient(circle,rgba(34,197,94,.36),transparent 64%);pointer-events:none}"
      + " .bp-auth-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(180deg,rgba(0,0,0,.8),transparent 86%);pointer-events:none}"
      + " .bp-auth-hero>*{position:relative;z-index:1}"
      + " .bp-auth-topbar{display:flex;align-items:center;justify-content:space-between;gap:18px}"
      + " .bp-auth-topline{display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.92);padding:10px 14px;font-size:15px;font-weight:800;letter-spacing:0;color:#101713;box-shadow:0 18px 42px rgba(0,0,0,.12);backdrop-filter:blur(12px)}"
      + " .bp-auth-topline strong{margin-left:4px;border-left:1px solid rgba(255,255,255,.22);padding-left:12px;color:rgba(255,255,255,.72);font-weight:600}"
      + " .bp-auth-logo{display:block;width:138px;height:auto;object-fit:contain}.bp-auth-topline strong{border-left-color:rgba(16,23,19,.14);color:rgba(16,23,19,.58);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em}.bp-auth-card-brand .bp-auth-logo{width:148px}"
      + " .bp-auth-mark{display:inline-flex;height:42px;width:42px;align-items:center;justify-content:center;border-radius:999px;background:#19b72f;color:#fff;font-weight:900;box-shadow:0 0 0 8px rgba(25,183,47,.12)}"
      + " .bp-auth-live{display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);padding:10px 13px;color:rgba(255,255,255,.78);font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.bp-auth-live span{height:9px;width:9px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 5px rgba(34,197,94,.13)}"
      + " .bp-auth-copy{max-width:580px;margin-top:46px}"
      + " .bp-auth-kicker{display:inline-flex;margin:0 0 18px;padding:8px 12px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(255,255,255,.08);color:#9cf4a9;font-size:12px;font-weight:850;text-transform:uppercase;letter-spacing:.08em}"
      + " .bp-auth-copy h1{margin:0;font-family:'Chakra Petch',sans-serif;font-size:clamp(2.65rem,4.3vw,4.65rem);line-height:.92;font-weight:700;letter-spacing:0;color:#fff;text-wrap:balance}"
      + " .bp-auth-copy>p:not(.bp-auth-kicker){margin:22px 0 0;max-width:500px;color:rgba(255,255,255,.76);font-size:17px;line-height:1.7}"
      + " .bp-auth-minimal-list{display:flex;flex-wrap:wrap;gap:10px;margin-top:34px}.bp-auth-minimal-list span{border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);padding:9px 12px;color:rgba(255,255,255,.78);font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}"
      + " .bp-auth-card{border-radius:30px;background:rgba(255,255,255,.96);padding:34px;align-self:stretch;display:flex;flex-direction:column;justify-content:center;backdrop-filter:blur(20px)}"
      + " .bp-auth-card:before{content:'';position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,#19b72f,#86efac,#101713)}.bp-auth-card-brand{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:34px}.bp-auth-card-brand p{margin:0;color:#647164;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}"
      + " .bp-auth-card-head span{display:inline-flex;margin-bottom:10px;color:#16a34a;font-size:12px;font-weight:850;text-transform:uppercase;letter-spacing:.08em}.bp-auth-card-head h2{margin:0;color:#101713;font-size:30px;line-height:1.08;font-weight:850;letter-spacing:0}.bp-auth-card-head p{margin:12px 0 0;color:#647164;font-size:14px;line-height:1.6}"
      + " .bp-auth-form{display:grid;gap:15px;margin-top:28px}.bp-auth-field{display:grid;gap:8px;color:#253127;font-size:13px;font-weight:800}.bp-auth-field span{display:flex;align-items:center;justify-content:space-between}.bp-auth-field input{width:100%;height:52px;border:1px solid #d6dfd8;border-radius:14px;background:#f8fbf8;color:#101713;padding:0 15px;font:inherit;font-weight:650;outline:none;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}.bp-auth-field input:focus{border-color:#19b72f;background:#fff;box-shadow:0 0 0 4px rgba(25,183,47,.14)}"
      + " .bp-auth-password{position:relative;display:flex;align-items:center}.bp-auth-password input{padding-right:72px}.bp-auth-password button{position:absolute;right:8px;height:36px;border:0;border-radius:10px;background:#e8f5ea;color:#128225;padding:0 12px;font-size:12px;font-weight:900;cursor:pointer}.bp-auth-password button:hover{background:#d8f0dc}"
      + " .bp-phone-control{position:relative;display:grid;grid-template-columns:minmax(132px,auto) 1fr;border:1px solid #d6dfd8;border-radius:14px;background:#f8fbf8;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}.bp-phone-control:focus-within{border-color:#19b72f;background:#fff;box-shadow:0 0 0 4px rgba(25,183,47,.14)}.bp-phone-country-button{height:52px;border:0;border-right:1px solid #d6dfd8;border-radius:14px 0 0 14px;background:#eef8f0;color:#101713;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px;font-size:12px;font-weight:850;cursor:pointer}.bp-phone-country-button span{display:block;max-width:82px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bp-phone-country-button strong{color:#128225;font-size:13px}.bp-phone-control>input[name=phoneLocal]{height:52px;border:0!important;background:transparent!important;box-shadow:none!important;border-radius:0 14px 14px 0!important}.bp-phone-country-menu{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:20;display:none;border:1px solid #d6dfd8;border-radius:16px;background:#fff;padding:10px;box-shadow:0 18px 46px rgba(15,23,42,.16)}.bp-phone-country-menu.is-open{display:block}.bp-phone-country-menu input{width:100%;height:42px;border:1px solid #d6dfd8;border-radius:12px;background:#f8fbf8;padding:0 12px;font:inherit;font-size:13px;font-weight:650;outline:none}.bp-phone-country-list{margin-top:8px;max-height:220px;overflow:auto;display:grid;gap:4px}.bp-phone-country-option{width:100%;border:0;border-radius:11px;background:#fff;color:#253127;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 11px;font-size:13px;font-weight:750;text-align:left;cursor:pointer}.bp-phone-country-option:hover{background:#f1f8f2}.bp-phone-country-option strong{color:#128225}"
      + " .bp-auth-terms{display:flex;align-items:flex-start;gap:10px;border:1px solid #dbe7dd;border-radius:16px;background:#f8fbf8;padding:12px 13px;color:#536055;font-size:13px;line-height:1.5}.bp-auth-terms input{margin-top:3px;accent-color:#19b72f}.bp-auth-terms a{color:#128225;font-weight:800;text-decoration:none}.bp-auth-terms a:hover{text-decoration:underline}"
      + " .bp-auth-error{border:1px solid #fecaca;border-radius:14px;background:#fff1f2;color:#991b1b;padding:12px 14px;font-size:13px;font-weight:800;line-height:1.45}.bp-auth-field.is-invalid input,.bp-auth-field.is-invalid .bp-phone-control{border-color:#ef4444!important;box-shadow:0 0 0 4px rgba(239,68,68,.12)!important}.bp-auth-terms.is-invalid{border-color:#ef4444;background:#fff1f2}"
      + " .bp-auth-submit{height:56px;border:0;border-radius:14px;background:#19b72f;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 18px 34px rgba(25,183,47,.28);transition:transform .18s ease,box-shadow .18s ease,background .18s ease}.bp-auth-submit:hover{background:#129d27;transform:translateY(-1px);box-shadow:0 22px 38px rgba(25,183,47,.32)}.bp-auth-submit span{display:inline-flex;height:24px;width:24px;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,.18);font-size:16px;line-height:1}"
      + " .bp-auth-checkline{display:flex;gap:12px;margin-top:18px;border:1px solid #dbe7dd;border-radius:16px;background:#f3faf4;padding:13px 14px;color:#536055;font-size:13px;line-height:1.55}.bp-auth-checkline span{margin-top:5px;height:9px;width:9px;flex:0 0 auto;border-radius:999px;background:#19b72f;box-shadow:0 0 0 4px rgba(25,183,47,.12)}.bp-auth-checkline p{margin:0}"
      + " .bp-auth-foot{margin-top:20px;border-top:1px solid #e3ebe4;padding-top:18px;color:#647164;font-size:14px}.bp-auth-foot a{color:#128225;text-decoration:none}.bp-auth-foot a:hover{text-decoration:underline}"
      + " @media (max-width:1023px){.bp-auth-page{padding:20px}.bp-auth-shell{grid-template-columns:1fr}.bp-auth-hero{min-height:auto}.bp-auth-card{min-height:auto}.bp-auth-copy{margin-top:34px}.bp-auth-card{justify-content:flex-start}}"
      + " @media (max-width:640px){.bp-auth-page{padding:12px;align-items:flex-start}.bp-auth-hero,.bp-auth-card{border-radius:22px;padding:22px}.bp-auth-copy h1{font-size:2.45rem}.bp-auth-copy>p:not(.bp-auth-kicker){font-size:15px}.bp-auth-topline strong{display:none}.bp-auth-card-head h2{font-size:25px}.bp-auth-foot .flex{display:grid!important}.bp-auth-card-brand{margin-bottom:24px}.bp-phone-control{grid-template-columns:1fr}.bp-phone-country-button{border-right:0;border-bottom:1px solid #d6dfd8;border-radius:14px 14px 0 0}.bp-phone-country-button span{max-width:none}.bp-phone-control>input[name=phoneLocal]{border-radius:0 0 14px 14px!important}}"
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
    if (isAuthPage() || (appState.apiLoaded && appState.apiOnline)) {
      renderPage();
    } else {
      renderPortalState(appState.apiLoaded ? appState.apiMessage : "Loading secure account data from BullPort.", appState.apiLoaded);
    }
    patchChromeUI();
    bindActions();
    patchApiStatus();
    if (!appState.apiLoaded && !appState.loadPromise) {
      loadClientBackendData(false).then(function (updated) {
        if (!updated) {
          if (appState.authRedirecting) return;
          if (!isAuthPage()) {
            renderPortalState(appState.apiMessage, true);
            bindActions();
          }
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
