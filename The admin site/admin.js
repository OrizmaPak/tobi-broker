(function () {
  const pages = {
    "index.html": ["Overview", "Live broker operations snapshot across KYC, money movement, investments, risk, support, and admin actions."],
    "queues.html": ["Operations Queues", "Work queues for the internal team to review and clear in priority order."],
    "clients.html": ["Clients", "Investor records, account state, wallet context, KYC progress, and operational restrictions."],
    "kyc.html": ["KYC Queue", "Identity, address, liveness, bank, and compliance checks awaiting staff decisions."],
    "deposits.html": ["Deposits", "Bank and crypto funding requests awaiting confirmation and reconciliation."],
    "withdrawals.html": ["Withdrawals", "Withdrawal requests requiring balance, KYC, destination, and risk review."],
    "portfolio-products.html": ["Portfolio Products", "Broker-managed portfolio products, risk labels, visibility, minimums, and payout rules."],
    "client-investments.html": ["Client Investments", "Active subscriptions, mandate status, top-ups, exits, and reinvestment instructions."],
    "payouts.html": ["Payouts", "Dividend and profit posting, reinvestment handling, schedules, and settlement state."],
    "instruments.html": ["Markets & Instruments", "Supported instruments and trading availability across asset classes."],
    "risk.html": ["Risk & Compliance", "Suitability, concentration, options access, restrictions, and compliance alerts."],
    "reports.html": ["Reports", "Statements, exports, audit records, and operational reporting."],
    "notifications.html": ["Notifications", "Account messages, funding alerts, KYC updates, payout notices, and support communication."],
    "support.html": ["Support Tickets", "Support cases, assignments, escalations, and service status."],
    "roles.html": ["Admin Users & Roles", "Staff access, role boundaries, approvals, and audit visibility."],
    "settings.html": ["Platform Settings", "Rules, limits, approval thresholds, fee settings, and system defaults."]
  };

  const navGroups = [
    ["Operations", [["Overview", "index.html", "grid"], ["Queues", "queues.html", "list"], ["Clients", "clients.html", "users"], ["KYC Queue", "kyc.html", "shield"]]],
    ["Money Movement", [["Deposits", "deposits.html", "down"], ["Withdrawals", "withdrawals.html", "up"], ["Payouts", "payouts.html", "coins"]]],
    ["Investments", [["Portfolio Products", "portfolio-products.html", "briefcase"], ["Client Investments", "client-investments.html", "chart"], ["Markets & Instruments", "instruments.html", "trend"], ["Risk & Compliance", "risk.html", "alert"]]],
    ["Comms & Records", [["Reports", "reports.html", "file"], ["Notifications", "notifications.html", "bell"], ["Support Tickets", "support.html", "help"]]],
    ["System", [["Admin Users & Roles", "roles.html", "lock"], ["Platform Settings", "settings.html", "settings"], ["IA Draft", "admin-info-architecture.html", "map"]]]
  ];

  const data = {
    metrics: [
      ["Pending KYC", "18", "+4 today", "warning"],
      ["Deposits to Confirm", "$42,800", "11 open requests", "success"],
      ["Withdrawals in Review", "$19,600", "6 requests", "danger"],
      ["Open Support Tickets", "27", "5 high priority", "info"]
    ],
    queues: [
      { title: "Proof of address review", owner: "Compliance", client: "Tobi Adeyemi", age: "24 min", state: "Review" },
      { title: "Bank transfer confirmation", owner: "Finance", client: "Amara Okafor", age: "42 min", state: "Pending" },
      { title: "Withdrawal enhanced review", owner: "Finance", client: "Nosa Bello", age: "1 hr", state: "Hold" },
      { title: "Options suitability questionnaire", owner: "Compliance", client: "Ife Martins", age: "3 hr", state: "Restricted" },
      { title: "Premium Managed top-up request", owner: "Portfolio Desk", client: "Musa Danladi", age: "4 hr", state: "Open" }
    ],
    clients: [
      ["BP-447215", "Tobi Adeyemi", "Premium Managed", "$164,380", "Under final review", "Balanced", "Active"],
      ["BP-447216", "Amara Okafor", "Balanced Growth", "$82,900", "Approved", "Moderate", "Active"],
      ["BP-447217", "Nosa Bello", "Dividend Income", "$48,120", "Approved", "Conservative", "Withdrawal hold"],
      ["BP-447218", "Ife Martins", "Equity Growth", "$96,400", "Approved", "High", "Options restricted"],
      ["BP-447219", "Musa Danladi", "Premium Managed", "$248,700", "Approved", "Custom", "Active"]
    ],
    kyc: [
      ["BP-447215", "Tobi Adeyemi", "Proof of address", "Compliance", "24 min", "Review"],
      ["BP-447220", "Chika Eze", "Bank confirmation", "Finance", "51 min", "Pending"],
      ["BP-447221", "Ada Hassan", "Liveness check", "Compliance", "2 hr", "Escalated"],
      ["BP-447222", "Femi Cole", "Government ID", "Compliance", "5 hr", "Rejected draft"]
    ],
    deposits: [
      ["DEP-9012", "Amara Okafor", "Bank transfer", "$7,500", "Zenith Bank", "Pending"],
      ["DEP-9013", "Tobi Adeyemi", "Crypto USDT", "$3,500", "TRC20", "Compliance review"],
      ["DEP-9014", "Musa Danladi", "Bank transfer", "$25,000", "GTBank", "Confirmed"],
      ["DEP-9015", "Ada Hassan", "Bank transfer", "$2,000", "UBA", "Reference mismatch"]
    ],
    withdrawals: [
      ["WDR-3381", "Nosa Bello", "$2,400", "Verified bank", "KYC approved", "Under review"],
      ["WDR-3382", "Ife Martins", "$5,000", "Crypto wallet", "Enhanced review", "Hold"],
      ["WDR-3383", "Musa Danladi", "$12,200", "Verified bank", "Approved", "Ready"],
      ["WDR-3384", "Tobi Adeyemi", "$1,200", "Verified bank", "Address pending", "Blocked"]
    ],
    products: [
      ["Conservative Income", "Low", "$1,000", "Monthly", "Published"],
      ["Balanced Growth", "Moderate", "$2,500", "Quarterly", "Published"],
      ["Commodity Opportunity", "Moderate / High", "$5,000", "Quarterly", "Review"],
      ["Dividend Income", "Moderate", "$3,500", "Monthly / quarterly", "Published"],
      ["Equity Growth", "High", "$4,000", "Optional", "Published"],
      ["Premium Managed", "Custom", "$25,000", "Custom", "Published"]
    ],
    investments: [
      ["Tobi Adeyemi", "Balanced Growth", "$42,000", "$47,180", "Top-up requested", "Active"],
      ["Nosa Bello", "Dividend Income", "$31,000", "$33,810", "Income paid", "Active"],
      ["Musa Danladi", "Premium Managed", "$180,000", "$196,440", "Desk review", "Active"],
      ["Ife Martins", "Equity Growth", "$18,000", "$20,160", "Risk alert", "Review"]
    ],
    payouts: [
      ["PAY-881", "Dividend Income Portfolio", "$620", "Wallet credit", "25 Jun 2026", "Posted"],
      ["PAY-882", "Commodity Opportunity", "$810", "Reinvested", "18 Jun 2026", "Posted"],
      ["PAY-883", "Balanced Growth", "$740", "Pending selection", "12 Jul 2026", "Scheduled"],
      ["PAY-884", "Conservative Income", "$210", "Wallet credit", "02 Jul 2026", "Ready"]
    ],
    instruments: [
      ["AAPL", "Apple Inc.", "Stock", "NASDAQ", "Moderate", "Tradable"],
      ["GLD", "SPDR Gold Shares", "Commodity ETF", "NYSE Arca", "Moderate", "Tradable"],
      ["US5Y", "US Treasury 5 Year", "Bond", "OTC", "Low", "Investable"],
      ["XOM C115", "Exxon Jul Call 115", "Option", "OPRA", "High", "Restricted"],
      ["NGX30", "NGX 30 Index Tracker", "Index Fund", "NGX", "Moderate", "Active"]
    ],
    reports: [
      ["June 2026 Account Statement", "Statement", "PDF", "Monthly", "Ready"],
      ["Wallet Activity Export", "Transaction export", "CSV", "Last 90 days", "Ready"],
      ["Admin Audit Log", "Audit", "CSV", "Today", "Ready"],
      ["Payout Posting Summary", "Operations", "PDF", "Q2 2026", "Draft"]
    ],
    tickets: [
      ["#BP-1208", "Withdrawal timing clarification", "Nosa Bello", "Finance", "Awaiting broker response"],
      ["#BP-1191", "Options access questionnaire", "Ife Martins", "Compliance", "Resolved"],
      ["#BP-1188", "Deposit reference mismatch", "Ada Hassan", "Finance", "Open"],
      ["#BP-1174", "Bank account verification", "Chika Eze", "Support", "Resolved"]
    ],
    audit: [
      ["10:42 AM", "Finance", "Confirmed deposit DEP-9014", "Musa Danladi"],
      ["10:18 AM", "Compliance", "Requested address resubmission", "Tobi Adeyemi"],
      ["09:54 AM", "Portfolio Desk", "Updated Commodity Opportunity notes", "Portfolio Products"],
      ["09:15 AM", "Support", "Assigned ticket #BP-1208", "Nosa Bello"]
    ]
  };

  const iconPaths = {
    grid: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
    list: '<path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"></path>',
    down: '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>',
    up: '<path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path>',
    coins: '<circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
    chart: '<path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path>',
    trend: '<path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>',
    help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    settings: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path><path d="M15 5.764v15"></path><path d="M9 3.236v15"></path>'
  };

  function currentFile() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function svg(name) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (iconPaths[name] || iconPaths.grid) + "</svg>";
  }

  function tone(value) {
    const v = String(value).toLowerCase();
    if (v.indexOf("approved") !== -1 || v.indexOf("active") !== -1 || v.indexOf("confirmed") !== -1 || v.indexOf("posted") !== -1 || v.indexOf("ready") !== -1 || v.indexOf("published") !== -1 || v.indexOf("resolved") !== -1) return "success";
    if (v.indexOf("hold") !== -1 || v.indexOf("blocked") !== -1 || v.indexOf("rejected") !== -1 || v.indexOf("restricted") !== -1 || v.indexOf("mismatch") !== -1 || v.indexOf("high") !== -1) return "danger";
    if (v.indexOf("pending") !== -1 || v.indexOf("review") !== -1 || v.indexOf("scheduled") !== -1 || v.indexOf("draft") !== -1 || v.indexOf("open") !== -1 || v.indexOf("escalated") !== -1) return "warning";
    return "info";
  }

  function badge(value) {
    return '<span class="badge ' + tone(value) + '">' + value + "</span>";
  }

  function button(label, kind, action) {
    return '<button type="button" class="btn ' + (kind || "") + '" data-action="' + (action || "toast") + '">' + label + "</button>";
  }

  function metric(label, value, meta, state) {
    return '<article class="card"><p class="metric-label">' + label + '</p><p class="metric-value">' + value + '</p><p class="metric-meta">' + meta + '</p><div style="margin-top:12px">' + badge(state) + "</div></article>";
  }

  function section(title, subtitle, body, action) {
    return '<section class="section"><div class="section-header"><div><h2>' + title + '</h2><p>' + subtitle + '</p></div>' + (action || "") + '</div><div class="section-body">' + body + "</div></section>";
  }

  function table(headers, rows) {
    return '<div class="table-wrap"><table><thead><tr>' + headers.map((h) => "<th>" + h + "</th>").join("") + "</tr></thead><tbody>" + rows.map((row) => "<tr>" + row.map((cell) => "<td>" + cell + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
  }

  function details(rows) {
    return '<div class="detail-grid">' + rows.map((row) => '<div class="detail"><span>' + row[0] + '</span><strong>' + row[1] + "</strong></div>").join("") + "</div>";
  }

  function queueList(items) {
    return '<div class="queue-list">' + items.map((item) => '<article class="queue-item"><div><h3>' + item.title + '</h3><p>' + item.client + ' - ' + item.owner + ' - ' + item.age + '</p></div><div class="action-row">' + badge(item.state) + button("Open", "", "toast") + "</div></article>").join("") + "</div>";
  }

  function overview() {
    return '<div class="grid metrics">' + data.metrics.map((m) => metric(m[0], m[1], m[2], m[3])).join("") + "</div>" +
      '<div class="grid two">' +
      section("Priority queues", "Highest-impact operations requiring staff attention.", queueList(data.queues.slice(0, 4)), button("Open queues", "primary", "goto-queues")) +
      section("Recent admin activity", "Latest decisions and operational actions across the desk.", timeline(data.audit)) +
      "</div>" +
      section("Client operations snapshot", "A compact cross-section of investor records, status, value, and restrictions.", clientTable(data.clients.slice(0, 4)), button("View clients", "", "goto-clients"));
  }

  function timeline(items) {
    return '<div class="timeline">' + items.map((row, index) => '<div class="timeline-item"><div class="dot">' + String(index + 1).padStart(2, "0") + '</div><div><h3>' + row[2] + '</h3><p>' + row[0] + ' - ' + row[1] + ' - ' + row[3] + "</p></div></div>").join("") + "</div>";
  }

  function queuesPage() {
    return '<div class="grid metrics">' + [
      metric("Compliance queue", "9", "KYC, risk, options and exceptions.", "Review"),
      metric("Finance queue", "17", "Deposits, withdrawals and payouts.", "Pending"),
      metric("Portfolio desk", "6", "Product edits and mandate actions.", "Open"),
      metric("Support escalations", "5", "Ticket issues requiring manager input.", "Escalated")
    ].join("") + "</div>" + section("Unified operations queue", "All pending work across teams, sorted by operational priority.", queueList(data.queues), button("Assign selected", "primary"));
  }

  function clientTable(rows) {
    return table(["Account", "Client", "Tier", "Portfolio value", "KYC", "Risk", "Status"], rows.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), row[5], badge(row[6])]));
  }

  function clientsPage() {
    return '<div class="grid metrics">' + [
      metric("Total clients", "1,248", "Active investor records.", "Active"),
      metric("Restricted accounts", "14", "Funding, withdrawal or trading limits.", "Hold"),
      metric("Premium managed", "83", "High-touch mandates.", "Active"),
      metric("Pending onboarding", "31", "Registration and KYC in progress.", "Pending")
    ].join("") + "</div>" + section("Client directory", "Searchable operational view of client accounts and account state.", clientTable(data.clients), button("Create client note", "primary"));
  }

  function kycPage() {
    return '<div class="grid two">' +
      section("KYC decision queue", "Document reviews awaiting compliance action.", table(["Account", "Client", "Requirement", "Owner", "Age", "State"], data.kyc.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5])])), button("Approve selected", "primary")) +
      section("Review detail sample", "The detail panel the admin will use before approving or rejecting verification.", details([["Client", "Tobi Adeyemi"], ["Requirement", "Proof of address"], ["Uploaded", "Utility bill - June 2026"], ["Decision", "Review before approval"], ["Blocked actions", "Withdrawals and large crypto funding"], ["Audit note", "Address matches bank city but needs date confirmation"]]) + '<div class="action-row" style="margin-top:14px">' + button("Approve", "primary") + button("Reject", "danger") + button("Request resubmission") + "</div>") +
      "</div>";
  }

  function depositsPage() {
    return section("Deposit confirmation queue", "Finance operations can confirm, flag, or escalate wallet funding requests.", table(["Reference", "Client", "Method", "Amount", "Rail", "Status", "Action"], data.deposits.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), button("Review")])), button("Confirm selected", "primary")) +
      section("Reconciliation checklist", "Controls to keep demo behavior aligned with real settlement workflow.", details([["Reference check", "Required"], ["Source name match", "Required"], ["Crypto confirmations", "Required for crypto"], ["Large funding review", "Compliance threshold applies"]]));
  }

  function withdrawalsPage() {
    return section("Withdrawal review queue", "Approve only after cleared balance, KYC, destination, and risk checks pass.", table(["Request", "Client", "Amount", "Destination", "Eligibility", "Status", "Action"], data.withdrawals.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), button("Review")])), button("Approve selected", "primary")) +
      section("Approval controls", "Withdrawal decisions should be auditable and role-gated.", details([["KYC dependency", "Full approval required"], ["Destination check", "Verified bank or screened wallet"], ["Risk review", "Enhanced review for crypto and high value"], ["Audit", "Decision, staff user and timestamp"]]));
  }

  function productsPage() {
    return section("Portfolio product catalog", "Manage portfolio visibility, risk, minimums, payout schedule, and published wording.", table(["Product", "Risk", "Minimum", "Payout", "Status", "Action"], data.products.map((row) => [row[0], badge(row[1]), row[2], row[3], badge(row[4]), button("Edit")])), button("New product", "primary")) +
      section("Product publishing rules", "Published products can appear in the client dashboard and selected public-site areas.", details([["Projected returns", "Must be labelled projected or market-based"], ["Options", "Never default access"], ["Risk labels", "Required"], ["Visibility", "Draft, review, published, hidden"]]));
  }

  function investmentsPage() {
    return section("Client investment mandates", "Monitor subscribed portfolios, value, requested actions, and mandate state.", table(["Client", "Portfolio", "Invested", "Current value", "Next action", "Status"], data.investments.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5])])), button("Create allocation note", "primary"));
  }

  function payoutsPage() {
    return section("Payout operations", "Post dividends, profit credits, reinvestments, and scheduled distributions.", table(["Reference", "Source", "Amount", "Mode", "Date", "Status", "Action"], data.payouts.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), button("Open")])), button("Post payout", "primary"));
  }

  function instrumentsPage() {
    return section("Instrument universe", "Control visibility, tradability, investability, and restrictions across supported asset classes.", table(["Symbol", "Name", "Category", "Market", "Risk", "Status", "Action"], data.instruments.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), badge(row[5]), button("Edit")])), button("Add instrument", "primary"));
  }

  function riskPage() {
    return '<div class="grid metrics">' + [
      metric("High-risk accounts", "22", "Concentration, suitability or options alerts.", "High"),
      metric("Options requests", "8", "Awaiting compliance decision.", "Review"),
      metric("Restricted accounts", "14", "Operational limitations active.", "Restricted"),
      metric("Risk exceptions", "5", "Require manager sign-off.", "Escalated")
    ].join("") + "</div>" +
      section("Risk and compliance alerts", "Client-facing restrictions and internal exceptions that need action.", queueList([
        { title: "Commodity exposure above range", owner: "Compliance", client: "Tobi Adeyemi", age: "3 hr", state: "Review" },
        { title: "Options suitability incomplete", owner: "Compliance", client: "Ife Martins", age: "1 day", state: "Restricted" },
        { title: "Withdrawal pattern review", owner: "Finance", client: "Nosa Bello", age: "2 hr", state: "Hold" }
      ]));
  }

  function reportsPage() {
    return section("Reports and exports", "Statements, audit logs, exports, and operational records.", table(["Report", "Type", "Format", "Period", "Status", "Action"], data.reports.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), button("Download")])), button("Generate report", "primary"));
  }

  function notificationsPage() {
    return section("Notification composer", "Send account, KYC, funding, investment, payout, support, and risk messages.", details([["Audience", "Single client, segment or all active clients"], ["Templates", "KYC, deposit, withdrawal, payout, risk, support"], ["Delivery", "Dashboard notification now, email later"], ["Approval", "Compliance approval for risk-sensitive notices"]]) + '<div class="action-row" style="margin-top:14px">' + button("Create notice", "primary") + button("Preview template") + "</div>") +
      section("Recent notification activity", "Messages currently represented in the client portal notification feed.", queueList([
        { title: "Proof of address received", owner: "Compliance", client: "Tobi Adeyemi", age: "20 min", state: "In review" },
        { title: "Bank transfer deposit submitted", owner: "Finance", client: "Amara Okafor", age: "2 hr", state: "Pending" },
        { title: "Dividend Income payout posted", owner: "Finance", client: "Nosa Bello", age: "2 days", state: "Posted" }
      ]));
  }

  function supportPage() {
    return section("Support ticket queue", "Assign, escalate, resolve, and document client support cases.", table(["Ticket", "Subject", "Client", "Owner", "Status", "Action"], data.tickets.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), button("Open")])), button("Assign ticket", "primary"));
  }

  function rolesPage() {
    return section("Admin roles", "Role boundaries for the future backend permission model.", table(["Role", "Primary permissions", "Restrictions", "Status"], [
      ["Super Admin", "Full access, roles, settings, overrides", "None", badge("Active")],
      ["Compliance Officer", "KYC, risk, options suitability, restrictions", "No payout posting", badge("Active")],
      ["Finance Operations", "Deposits, withdrawals, fees, payouts", "No role management", badge("Active")],
      ["Portfolio Manager", "Portfolio products, allocations, mandate notes", "No money movement approval", badge("Active")],
      ["Support Agent", "Tickets and client communication", "No financial approvals", badge("Active")],
      ["Read-only Auditor", "Reports and audit trail", "No write access", badge("Active")]
    ]), button("Invite admin", "primary"));
  }

  function settingsPage() {
    return '<div class="grid two">' +
      section("Approval rules", "Operational settings that should later become backend-controlled.", details([["Withdrawal review limit", "$1,000+"], ["Large deposit threshold", "$10,000+"], ["Crypto funding", "Compliance review required"], ["Options access", "Suitability approval required"]])) +
      section("Platform defaults", "Shared settings that affect the client dashboard and admin workflows.", details([["Base currency", "USD"], ["Report cadence", "Monthly"], ["KYC required for withdrawal", "Yes"], ["Notification approval", "Required for risk notices"]])) +
      "</div>";
  }

  function bodyFor(file) {
    switch (file) {
      case "queues.html": return queuesPage();
      case "clients.html": return clientsPage();
      case "kyc.html": return kycPage();
      case "deposits.html": return depositsPage();
      case "withdrawals.html": return withdrawalsPage();
      case "portfolio-products.html": return productsPage();
      case "client-investments.html": return investmentsPage();
      case "payouts.html": return payoutsPage();
      case "instruments.html": return instrumentsPage();
      case "risk.html": return riskPage();
      case "reports.html": return reportsPage();
      case "notifications.html": return notificationsPage();
      case "support.html": return supportPage();
      case "roles.html": return rolesPage();
      case "settings.html": return settingsPage();
      default: return overview();
    }
  }

  function buildNav() {
    const file = currentFile();
    return navGroups.map((group) => '<div class="nav-group"><p class="nav-label">' + group[0] + '</p>' + group[1].map((item) => {
      const active = file === item[1] || (file === "" && item[1] === "index.html");
      return '<a class="nav-link ' + (active ? "is-active" : "") + '" href="' + item[1] + '"><span class="nav-icon">' + svg(item[2]) + '</span><span>' + item[0] + "</span></a>";
    }).join("") + "</div>").join("");
  }

  function mobileTabs() {
    return '<div class="mobile-tabs"><a href="index.html">Overview</a><a href="queues.html">Queues</a><a href="clients.html">Clients</a><a href="kyc.html">KYC</a><a href="deposits.html">Deposits</a><a href="withdrawals.html">Withdrawals</a><a href="portfolio-products.html">Products</a><a href="risk.html">Risk</a></div>';
  }

  function render() {
    const file = currentFile();
    if (file === "admin-info-architecture.html") return;
    const meta = pages[file] || pages["index.html"];
    document.title = meta[0] + " | BullPort Admin";
    document.getElementById("admin-root").innerHTML = '<div class="app"><aside class="sidebar"><div class="brand"><div class="brand-mark">BP</div><div><p class="brand-title">BullPort Admin</p><p class="brand-subtitle">Broker operations console</p></div></div><nav aria-label="Admin navigation">' + buildNav() + '</nav></aside><div class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:12px;min-width:0"><button class="menu-button" type="button" data-action="toast" aria-label="Open menu">' + svg("list") + '</button><div class="top-title"><p class="eyebrow">Internal operations</p><p class="name">' + meta[0] + '</p></div></div><div class="top-actions"><label class="search">' + svg("grid") + '<input placeholder="Search clients, tickets, references..." /></label><button class="btn" type="button" data-action="toast">Quick action</button><div class="avatar">OA</div></div></header><main class="content">' + mobileTabs() + '<div class="page-head"><div><h1>' + meta[0] + '</h1><p>' + meta[1] + '</p></div><div class="action-row">' + button("Export", "", "toast") + button("New task", "primary", "toast") + '</div></div>' + bodyFor(file) + '</main></div></div><div class="toast-root" aria-live="polite"></div>';
    bindActions();
  }

  function toast(message) {
    const root = document.querySelector(".toast-root");
    if (!root) return;
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message || "Prototype action captured.";
    root.appendChild(node);
    requestAnimationFrame(() => node.classList.add("is-visible"));
    setTimeout(() => {
      node.classList.remove("is-visible");
      setTimeout(() => node.remove(), 220);
    }, 2400);
  }

  function bindActions() {
    document.querySelectorAll("[data-action]").forEach((node) => {
      if (node.dataset.bound === "true") return;
      node.dataset.bound = "true";
      node.addEventListener("click", () => {
        const action = node.getAttribute("data-action");
        if (action === "goto-queues") location.href = "queues.html";
        else if (action === "goto-clients") location.href = "clients.html";
        else toast(node.textContent.trim() + " captured for the admin prototype.");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
