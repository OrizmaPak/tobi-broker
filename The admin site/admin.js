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
    "settings.html": ["Platform Settings", "Rules, limits, approval thresholds, fee settings, and system defaults."],
    "client-detail.html": ["Client Detail", "Single investor operating record with wallet, KYC, investments, restrictions, notes, and recent actions."],
    "kyc-review.html": ["KYC Review", "Compliance decision workspace for document checks, risk notes, blocked actions, and audit-ready outcomes."],
    "deposit-review.html": ["Deposit Review", "Funding review workspace for bank and crypto deposits, source checks, proof, and reconciliation decisions."],
    "withdrawal-review.html": ["Withdrawal Review", "Withdrawal approval workspace for KYC, destination, risk, balance, and payout controls."],
    "portfolio-product-detail.html": ["Portfolio Product Detail", "Portfolio product controls for publishing, risk labels, minimums, projected returns, and client availability."],
    "support-ticket-detail.html": ["Support Ticket Detail", "Ticket response workspace with assignment, timeline, client context, and resolution controls."]
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
    ],
    clientProfile: {
      account: "BP-447215",
      name: "Tobi Adeyemi",
      email: "tobi.adeyemi@example.com",
      phone: "+234 801 000 4472",
      tier: "Premium Managed",
      wallet: "$18,420",
      portfolioValue: "$164,380",
      kyc: "Under final review",
      risk: "Balanced",
      status: "Active",
      restrictions: ["Withdrawals limited until proof of address is approved", "Large crypto funding requires compliance review"],
      notes: [
        ["Compliance", "Proof of address uploaded and awaiting date confirmation."],
        ["Portfolio Desk", "Client requested Premium Managed allocation review."],
        ["Finance", "Recent USDT deposit held for source-of-funds check."]
      ]
    },
    kycReview: {
      account: "BP-447215",
      client: "Tobi Adeyemi",
      requirement: "Proof of address",
      document: "Utility bill - June 2026",
      uploaded: "08 Jul 2026, 10:14 AM",
      checks: [["Name match", "Passed"], ["Address match", "Passed"], ["Document date", "Needs review"], ["Fraud screen", "Clear"]],
      blocked: "Withdrawals and large crypto funding",
      recommendation: "Request staff confirmation of document date before final approval."
    },
    depositReview: {
      reference: "DEP-9013",
      client: "Tobi Adeyemi",
      method: "Crypto USDT",
      rail: "TRC20",
      amount: "$3,500",
      received: "3,500 USDT",
      source: "External wallet ending 8F41",
      status: "Compliance review",
      checks: [["Wallet screening", "Clear"], ["Network confirmations", "42 confirmations"], ["Source of funds", "Needs note"], ["Client KYC", "Address pending"]]
    },
    withdrawalReview: {
      reference: "WDR-3381",
      client: "Nosa Bello",
      amount: "$2,400",
      destination: "Verified bank account",
      available: "$7,920",
      kyc: "Approved",
      status: "Under review",
      checks: [["Available balance", "Passed"], ["Bank destination", "Verified"], ["Recent deposit hold", "Clear"], ["Risk pattern", "Normal"]]
    },
    productDetail: {
      name: "Premium Managed",
      risk: "Custom",
      minimum: "$25,000",
      payout: "Custom",
      visibility: "Published",
      audience: "High-value clients with completed suitability checks",
      rules: [["Projected return label", "Required"], ["Manager review", "Required before subscription"], ["Options exposure", "Disabled by default"], ["Client dashboard visibility", "Published"]]
    },
    supportDetail: {
      ticket: "#BP-1208",
      client: "Nosa Bello",
      subject: "Withdrawal timing clarification",
      owner: "Finance",
      status: "Awaiting broker response",
      timeline: [
        ["Client", "Asked when withdrawal WDR-3381 will be settled."],
        ["Support", "Confirmed the request is in finance review."],
        ["Finance", "Needs final destination confirmation before release."]
      ]
    }
  };

  const appState = {
    audit: data.audit.slice(),
    decisions: {},
    apiOnline: false,
    apiBase: localStorage.getItem("bullport_api_base") || "http://127.0.0.1:4000"
  };

  const ADMIN_TOKEN_KEY = "bullport_admin_token";
  const DEMO_ADMIN_EMAIL = "admin@bullport.local";
  const DEMO_ADMIN_PASSWORD = "AdminPass123!";

  const liveRefs = {};

  const actionLabels = {
    approveKyc: "Approve KYC",
    rejectKyc: "Reject KYC",
    requestKycResubmission: "Request KYC resubmission",
    creditDeposit: "Credit deposit",
    flagDeposit: "Flag deposit",
    requestDepositProof: "Request deposit proof",
    approveWithdrawal: "Approve withdrawal",
    holdWithdrawal: "Place withdrawal on hold",
    requestWithdrawalInfo: "Request withdrawal information",
    saveProduct: "Save product changes",
    reviewProduct: "Send product to review",
    hideProduct: "Hide product",
    sendSupportReply: "Send support reply",
    escalateSupport: "Escalate support ticket",
    resolveSupport: "Resolve support ticket"
  };

  function formatMoney(value) {
    const amount = Number(value || 0);
    return "$" + amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function label(value) {
    return String(value || "").toLowerCase().split("_").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  }

  function unwrap(result) {
    if (!result || result.ok === false) return null;
    return result.data || null;
  }

  async function api(path, options) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(appState.apiBase + path, {
      ...options,
      headers: { ...headers, ...(options && options.headers ? options.headers : {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error?.message || "API request failed");
    }
    return payload.data;
  }

  async function ensureAdminToken() {
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) return true;
    try {
      const data = await api("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ email: DEMO_ADMIN_EMAIL, password: DEMO_ADMIN_PASSWORD })
      });
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      return true;
    } catch {
      return false;
    }
  }

  async function tryApi(path) {
    try {
      return await api(path);
    } catch {
      return null;
    }
  }

  async function loadBackendData() {
    await ensureAdminToken();
    const overview = await tryApi("/api/admin/overview");
    if (!overview) {
      appState.apiOnline = false;
      return;
    }

    appState.apiOnline = true;
    const [clients, kyc, deposits, withdrawals, products, investments, payouts, instruments, tickets, auditLogs] = await Promise.all([
      tryApi("/api/clients"),
      tryApi("/api/kyc/reviews"),
      tryApi("/api/money/deposits"),
      tryApi("/api/money/withdrawals"),
      tryApi("/api/portfolio-products"),
      tryApi("/api/client-investments"),
      tryApi("/api/payouts"),
      tryApi("/api/instruments"),
      tryApi("/api/support/tickets"),
      tryApi("/api/admin/audit-logs")
    ]);

    data.metrics = [
      ["Pending KYC", String(overview.metrics.pendingKyc || 0), "Reviews awaiting compliance.", "Review"],
      ["Deposits to Confirm", String(overview.metrics.depositsToReview || 0), "Funding requests in review.", "Pending"],
      ["Withdrawals in Review", String(overview.metrics.withdrawalsToReview || 0), "Requests needing finance action.", "Hold"],
      ["Open Support Tickets", String(overview.metrics.openTickets || 0), "Client cases awaiting response.", "Open"]
    ];

    if (Array.isArray(auditLogs)) {
      appState.audit = auditLogs.map((log) => [
        new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        log.actorName || "System",
        label(log.action),
        log.entityType || "System"
      ]);
    }

    if (Array.isArray(clients)) {
      data.clients = clients.map((client) => {
        const investmentValue = Array.isArray(client.investments)
          ? client.investments.reduce((sum, item) => sum + Number(item.currentValue || 0), 0)
          : Number(client.wallet?.balance || 0);
        const kycStatus = Array.isArray(client.kycReviews) && client.kycReviews[0] ? label(client.kycReviews[0].status) : "Not started";
        return [client.accountNumber, client.name, client.tier, formatMoney(investmentValue), kycStatus, label(client.riskLevel), label(client.status)];
      });

      const profileClient = clients.find((client) => client.accountNumber === "BP-447215") || clients[0];
      if (profileClient) {
        liveRefs.clientId = profileClient.id;
        data.clientProfile = {
          account: profileClient.accountNumber,
          name: profileClient.name,
          email: profileClient.email,
          phone: profileClient.phone || "Not recorded",
          tier: profileClient.tier,
          wallet: formatMoney(profileClient.wallet?.balance || 0),
          portfolioValue: formatMoney(Array.isArray(profileClient.investments) ? profileClient.investments.reduce((sum, item) => sum + Number(item.currentValue || 0), 0) : 0),
          kyc: Array.isArray(profileClient.kycReviews) && profileClient.kycReviews[0] ? label(profileClient.kycReviews[0].status) : "Not started",
          risk: label(profileClient.riskLevel),
          status: label(profileClient.status),
          restrictions: ["Backend-connected profile. Restrictions will be derived from KYC, wallet, and risk rules."],
          notes: Array.isArray(profileClient.notes) && profileClient.notes.length
            ? profileClient.notes.map((note) => [note.category, note.body])
            : [["System", "No backend notes recorded yet."]]
        };
      }
    }

    if (Array.isArray(kyc)) {
      data.kyc = kyc.map((row) => [row.client?.accountNumber || "-", row.client?.name || "-", row.requirement, row.reviewer || "Compliance", row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-", label(row.status)]);
      const first = kyc[0];
      if (first) {
        liveRefs.kycReviewId = first.id;
        data.kycReview = {
          id: first.id,
          account: first.client?.accountNumber || "-",
          client: first.client?.name || "-",
          requirement: first.requirement,
          document: first.documentRef || "Document pending",
          uploaded: first.createdAt ? new Date(first.createdAt).toLocaleString() : "-",
          blocked: "Withdrawals and large funding until approved",
          recommendation: first.decisionNote || "Review document details before final decision.",
          checks: [["Current status", label(first.status)], ["Reviewer", first.reviewer || "Compliance"], ["Client risk", label(first.client?.riskLevel)], ["Account status", label(first.client?.status)]]
        };
      }
    }

    if (Array.isArray(deposits)) {
      data.deposits = deposits.map((row) => [row.reference, row.client?.name || "-", row.method, formatMoney(row.amount), row.rail, label(row.status)]);
      const first = deposits[0];
      if (first) {
        liveRefs.depositId = first.id;
        data.depositReview = {
          id: first.id,
          reference: first.reference,
          client: first.client?.name || "-",
          method: first.method,
          rail: first.rail,
          amount: formatMoney(first.amount),
          received: first.received ? formatMoney(first.received) : "Pending",
          source: first.rail,
          status: label(first.status),
          checks: [["Current status", label(first.status)], ["Client", first.client?.accountNumber || "-"], ["Method", first.method], ["Review note", first.reviewNote || "No note yet"]]
        };
      }
    }

    if (Array.isArray(withdrawals)) {
      data.withdrawals = withdrawals.map((row) => [row.reference, row.client?.name || "-", formatMoney(row.amount), row.destination, label(row.client?.status), label(row.status)]);
      const first = withdrawals[0];
      if (first) {
        liveRefs.withdrawalId = first.id;
        data.withdrawalReview = {
          id: first.id,
          reference: first.reference,
          client: first.client?.name || "-",
          amount: formatMoney(first.amount),
          destination: first.destination,
          available: "Check wallet ledger",
          kyc: label(first.client?.status),
          status: label(first.status),
          checks: [["Current status", label(first.status)], ["Client", first.client?.accountNumber || "-"], ["Destination", first.destination], ["Review note", first.reviewNote || "No note yet"]]
        };
      }
    }

    if (Array.isArray(products)) {
      data.products = products.map((row) => [row.name, label(row.riskLevel), formatMoney(row.minimum), row.payoutRule, label(row.status)]);
      const premium = products.find((row) => row.name === "Premium Managed") || products[0];
      if (premium) {
        liveRefs.productId = premium.id;
        data.productDetail = {
          id: premium.id,
          name: premium.name,
          risk: label(premium.riskLevel),
          minimum: formatMoney(premium.minimum),
          payout: premium.payoutRule,
          visibility: label(premium.status),
          audience: premium.description || "Eligible clients with completed suitability checks",
          rules: [["Projected return label", "Required"], ["Manager review", "Required before subscription"], ["Options exposure", "Disabled by default"], ["Client dashboard visibility", label(premium.status)]]
        };
      }
    }

    if (Array.isArray(investments)) {
      data.investments = investments.map((row) => [row.client?.name || "-", row.product?.name || "-", formatMoney(row.investedAmount), formatMoney(row.currentValue), row.nextAction || "Monitor", label(row.status)]);
    }

    if (Array.isArray(payouts)) {
      data.payouts = payouts.map((row) => [row.reference, row.source, formatMoney(row.amount), row.mode, row.payoutDate ? new Date(row.payoutDate).toLocaleDateString() : "-", label(row.status)]);
    }

    if (Array.isArray(instruments)) {
      data.instruments = instruments.map((row) => [row.symbol, row.name, row.category, row.market, label(row.riskLevel), row.status]);
    }

    if (Array.isArray(tickets)) {
      data.tickets = tickets.map((row) => [row.ticketNo, row.subject, row.client?.name || "-", row.owner || "Unassigned", label(row.status)]);
      const first = tickets[0];
      if (first) {
        liveRefs.ticketId = first.id;
        data.supportDetail = {
          id: first.id,
          ticket: first.ticketNo,
          client: first.client?.name || "-",
          subject: first.subject,
          owner: first.owner || "Unassigned",
          status: label(first.status),
          timeline: [
            ["Client", first.subject],
            ["Support", "Ticket loaded from backend."],
            [first.owner || "Operations", "Awaiting next admin action."]
          ]
        };
      }
    }

    data.queues = [
      ...(Array.isArray(kyc) ? kyc.slice(0, 3).map((row) => ({ title: row.requirement, owner: row.reviewer || "Compliance", client: row.client?.name || "-", age: "Backend", state: label(row.status) })) : []),
      ...(Array.isArray(deposits) ? deposits.slice(0, 2).map((row) => ({ title: "Deposit " + row.reference, owner: "Finance", client: row.client?.name || "-", age: "Backend", state: label(row.status) })) : []),
      ...(Array.isArray(withdrawals) ? withdrawals.slice(0, 2).map((row) => ({ title: "Withdrawal " + row.reference, owner: "Finance", client: row.client?.name || "-", age: "Backend", state: label(row.status) })) : [])
    ];
  }

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

  function linkButton(label, href, kind) {
    return '<a class="btn ' + (kind || "") + '" href="' + href + '">' + label + "</a>";
  }

  function modalButton(label, modal, kind) {
    return '<button type="button" class="btn ' + (kind || "") + '" data-action="open-modal" data-modal="' + modal + '">' + label + "</button>";
  }

  function decisionButton(label, kind, result, apiAction) {
    return '<button type="button" class="btn ' + (kind || "") + '" data-action="decision" data-result="' + result + '" data-api-action="' + apiAction + '">' + label + "</button>";
  }

  function metric(label, value, meta, state) {
    return '<article class="card"><p class="metric-label">' + label + '</p><p class="metric-value">' + value + '</p><p class="metric-meta">' + meta + '</p><div style="margin-top:12px">' + badge(state) + "</div></article>";
  }

  function section(title, subtitle, body, action) {
    return '<section class="section"><div class="section-header"><div><h2>' + title + '</h2><p>' + subtitle + '</p></div>' + (action || "") + '</div><div class="section-body">' + body + "</div></section>";
  }

  function table(headers, rows) {
    return '<div class="table-wrap"><table data-filter-table><thead><tr>' + headers.map((h) => "<th>" + h + "</th>").join("") + "</tr></thead><tbody>" + rows.map((row) => '<tr data-search="' + stripHtml(row.join(" ")) + '">' + row.map((cell) => "<td>" + cell + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
  }

  function stripHtml(value) {
    return String(value).replace(/<[^>]*>/g, " ").replace(/"/g, "&quot;").toLowerCase();
  }

  function filters(placeholder) {
    return '<div class="filter-bar"><label class="filter-search">' + svg("grid") + '<input data-table-search placeholder="' + placeholder + '" /></label><select data-table-status><option value="">All statuses</option><option value="pending">Pending</option><option value="review">Review</option><option value="approved">Approved</option><option value="active">Active</option><option value="hold">Hold</option><option value="blocked">Blocked</option><option value="restricted">Restricted</option><option value="ready">Ready</option><option value="open">Open</option></select></div>';
  }

  function filterableTable(placeholder, headers, rows) {
    return filters(placeholder) + table(headers, rows) + '<div class="empty-state" data-empty-state>No matching records. Adjust the search or status filter.</div>';
  }

  function details(rows) {
    return '<div class="detail-grid">' + rows.map((row) => '<div class="detail"><span>' + row[0] + '</span><strong>' + row[1] + "</strong></div>").join("") + "</div>";
  }

  function queueList(items) {
    return '<div class="queue-list">' + items.map((item) => '<article class="queue-item" data-search="' + stripHtml(item.title + " " + item.client + " " + item.owner + " " + item.state) + '"><div><h3>' + item.title + '</h3><p>' + item.client + ' - ' + item.owner + ' - ' + item.age + '</p></div><div class="action-row">' + badge(item.state) + linkButton("Open", routeForQueue(item)) + "</div></article>").join("") + '</div><div class="empty-state" data-empty-state>No matching queue items.</div>';
  }

  function routeForQueue(item) {
    const text = (item.title + " " + item.owner).toLowerCase();
    if (text.indexOf("address") !== -1 || text.indexOf("kyc") !== -1 || text.indexOf("suitability") !== -1) return "kyc-review.html";
    if (text.indexOf("deposit") !== -1 || text.indexOf("transfer") !== -1 || text.indexOf("funding") !== -1) return "deposit-review.html";
    if (text.indexOf("withdrawal") !== -1) return "withdrawal-review.html";
    if (text.indexOf("portfolio") !== -1 || text.indexOf("top-up") !== -1) return "portfolio-product-detail.html";
    return "support-ticket-detail.html";
  }

  function workflowSteps(steps, currentIndex) {
    return '<div class="workflow">' + steps.map((step, index) => '<div class="workflow-step ' + (index <= currentIndex ? "is-done" : "") + '"><span>' + String(index + 1).padStart(2, "0") + '</span><strong>' + step + "</strong></div>").join("") + "</div>";
  }

  function checklist(rows) {
    return '<div class="checklist">' + rows.map((row) => '<div class="check-item"><div><strong>' + row[0] + '</strong><p>' + row[1] + '</p></div>' + badge(row[1]) + "</div>").join("") + "</div>";
  }

  function noteList(rows) {
    return '<div class="note-list">' + rows.map((row) => '<article class="note"><strong>' + row[0] + '</strong><p>' + row[1] + "</p></article>").join("") + "</div>";
  }

  function reviewPanel(title, subtitle, actions) {
    return '<aside class="review-panel"><h2>' + title + '</h2><p>' + subtitle + '</p><div class="decision-state" data-decision-state>No decision saved in this prototype session.</div><label>Internal decision note<textarea placeholder="Add a clear audit note before saving a decision."></textarea></label><div class="action-row">' + actions + "</div></aside>";
  }

  function auditPanel() {
    return section("Live audit trail", "Prototype-only log of admin actions. These map to future backend audit events.", timeline(appState.audit.slice(0, 6)));
  }

  function overview() {
    return '<div class="grid metrics">' + data.metrics.map((m) => metric(m[0], m[1], m[2], m[3])).join("") + "</div>" +
      '<div class="grid two">' +
      section("Priority queues", "Highest-impact operations requiring staff attention.", queueList(data.queues.slice(0, 4)), button("Open queues", "primary", "goto-queues")) +
      section("Recent admin activity", "Latest decisions and operational actions across the desk.", timeline(appState.audit)) +
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
    ].join("") + "</div>" + section("Unified operations queue", "All pending work across teams, sorted by operational priority.", filters("Search queue, client, owner...") + queueList(data.queues), modalButton("Assign selected", "assign-task", "primary"));
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
    ].join("") + "</div>" + section("Client directory", "Searchable operational view of client accounts and account state.", filterableTable("Search account, client, tier...", ["Account", "Client", "Tier", "Portfolio value", "KYC", "Risk", "Status", "Action"], data.clients.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), row[5], badge(row[6]), linkButton("Open", "client-detail.html")])), modalButton("Create client note", "client-note", "primary"));
  }

  function kycPage() {
    return '<div class="grid two">' +
      section("KYC decision queue", "Document reviews awaiting compliance action.", filterableTable("Search account, client, requirement...", ["Account", "Client", "Requirement", "Owner", "Age", "State", "Action"], data.kyc.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), linkButton("Review", "kyc-review.html")])), modalButton("Approve selected", "bulk-kyc", "primary")) +
      section("Review detail sample", "The detail panel the admin will use before approving or rejecting verification.", details([["Client", "Tobi Adeyemi"], ["Requirement", "Proof of address"], ["Uploaded", "Utility bill - June 2026"], ["Decision", "Review before approval"], ["Blocked actions", "Withdrawals and large crypto funding"], ["Audit note", "Address matches bank city but needs date confirmation"]]) + '<div class="action-row" style="margin-top:14px">' + linkButton("Open review", "kyc-review.html", "primary") + modalButton("Request resubmission", "bulk-kyc") + "</div>") +
      "</div>";
  }

  function depositsPage() {
    return section("Deposit confirmation queue", "Finance operations can confirm, flag, or escalate wallet funding requests.", filterableTable("Search reference, client, rail...", ["Reference", "Client", "Method", "Amount", "Rail", "Status", "Action"], data.deposits.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), linkButton("Review", "deposit-review.html")])), modalButton("Confirm selected", "bulk-deposit", "primary")) +
      section("Reconciliation checklist", "Controls to keep funding behavior aligned with real settlement workflow.", details([["Reference check", "Required"], ["Source name match", "Required"], ["Crypto confirmations", "Required for crypto"], ["Large funding review", "Compliance threshold applies"]]));
  }

  function withdrawalsPage() {
    return section("Withdrawal review queue", "Approve only after cleared balance, KYC, destination, and risk checks pass.", filterableTable("Search request, client, destination...", ["Request", "Client", "Amount", "Destination", "Eligibility", "Status", "Action"], data.withdrawals.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), linkButton("Review", "withdrawal-review.html")])), modalButton("Approve selected", "bulk-withdrawal", "primary")) +
      section("Approval controls", "Withdrawal decisions should be auditable and role-gated.", details([["KYC dependency", "Full approval required"], ["Destination check", "Verified bank or screened wallet"], ["Risk review", "Enhanced review for crypto and high value"], ["Audit", "Decision, staff user and timestamp"]]));
  }

  function productsPage() {
    return section("Portfolio product catalog", "Manage portfolio visibility, risk, minimums, payout schedule, and published wording.", filterableTable("Search product, risk, payout...", ["Product", "Risk", "Minimum", "Payout", "Status", "Action"], data.products.map((row) => [row[0], badge(row[1]), row[2], row[3], badge(row[4]), linkButton("Edit", "portfolio-product-detail.html")])), modalButton("New product", "product", "primary")) +
      section("Product publishing rules", "Published products can appear in the client dashboard and selected public-site areas.", details([["Projected returns", "Must be labelled projected or market-based"], ["Options", "Never default access"], ["Risk labels", "Required"], ["Visibility", "Draft, review, published, hidden"]]));
  }

  function investmentsPage() {
    return section("Client investment mandates", "Monitor subscribed portfolios, value, requested actions, and mandate state.", filterableTable("Search client, portfolio, action...", ["Client", "Portfolio", "Invested", "Current value", "Next action", "Status"], data.investments.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5])])), modalButton("Create allocation note", "allocation-note", "primary"));
  }

  function payoutsPage() {
    return section("Payout operations", "Post dividends, profit credits, reinvestments, and scheduled distributions.", filterableTable("Search payout, source, mode...", ["Reference", "Source", "Amount", "Mode", "Date", "Status", "Action"], data.payouts.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), modalButton("Open", "payout")])), modalButton("Post payout", "payout", "primary"));
  }

  function instrumentsPage() {
    return section("Instrument universe", "Control visibility, tradability, investability, and restrictions across supported asset classes.", filterableTable("Search symbol, market, category...", ["Symbol", "Name", "Category", "Market", "Risk", "Status", "Action"], data.instruments.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), badge(row[5]), modalButton("Edit", "instrument")])), modalButton("Add instrument", "instrument", "primary"));
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
    return section("Reports and exports", "Statements, audit logs, exports, and operational records.", filterableTable("Search report, type, period...", ["Report", "Type", "Format", "Period", "Status", "Action"], data.reports.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), modalButton("Download", "report-download")])), modalButton("Generate report", "report", "primary"));
  }

  function notificationsPage() {
    return section("Notification composer", "Send account, KYC, funding, investment, payout, support, and risk messages.", details([["Audience", "Single client, segment or all active clients"], ["Templates", "KYC, deposit, withdrawal, payout, risk, support"], ["Delivery", "Dashboard notification now, email later"], ["Approval", "Compliance approval for risk-sensitive notices"]]) + '<div class="action-row" style="margin-top:14px">' + modalButton("Create notice", "notification", "primary") + modalButton("Preview template", "notification-preview") + "</div>") +
      section("Recent notification activity", "Messages currently represented in the client portal notification feed.", queueList([
        { title: "Proof of address received", owner: "Compliance", client: "Tobi Adeyemi", age: "20 min", state: "In review" },
        { title: "Bank transfer deposit submitted", owner: "Finance", client: "Amara Okafor", age: "2 hr", state: "Pending" },
        { title: "Dividend Income payout posted", owner: "Finance", client: "Nosa Bello", age: "2 days", state: "Posted" }
      ]));
  }

  function supportPage() {
    return section("Support ticket queue", "Assign, escalate, resolve, and document client support cases.", filterableTable("Search ticket, client, owner...", ["Ticket", "Subject", "Client", "Owner", "Status", "Action"], data.tickets.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), linkButton("Open", "support-ticket-detail.html")])), modalButton("Assign ticket", "assign-ticket", "primary"));
  }

  function clientDetailPage() {
    const c = data.clientProfile;
    return '<div class="grid metrics">' + [
      metric("Wallet balance", c.wallet, "Available operating balance.", "Active"),
      metric("Portfolio value", c.portfolioValue, "Current simulated portfolio value.", "Active"),
      metric("KYC status", c.kyc, "Controls withdrawal and funding limits.", c.kyc),
      metric("Risk profile", c.risk, "Used for suitability and product access.", "Info")
    ].join("") + "</div>" +
      '<div class="grid two">' +
      section("Client operating profile", "Identity, tier, account status, and active restrictions.", details([["Account", c.account], ["Client", c.name], ["Email", c.email], ["Phone", c.phone], ["Tier", c.tier], ["Status", badge(c.status)]]) + '<div class="restriction-list">' + c.restrictions.map((r) => '<div class="restriction">' + r + "</div>").join("") + "</div>", '<div class="action-row">' + linkButton("Review KYC", "kyc-review.html", "primary") + linkButton("Open withdrawal", "withdrawal-review.html") + "</div>") +
      section("Recent client notes", "Internal audit notes and operational context.", noteList(c.notes), modalButton("Add note", "client-note", "primary")) +
      "</div>" +
      section("Client-linked activity", "A single place to move from the client profile into money movement, investments, and support.", table(["Area", "Reference", "Summary", "Status", "Action"], [
        ["Deposit", "DEP-9013", "USDT funding under compliance review", badge("Compliance review"), linkButton("Open", "deposit-review.html")],
        ["Withdrawal", "WDR-3384", "Withdrawal blocked by address review", badge("Blocked"), linkButton("Open", "withdrawal-review.html")],
        ["Portfolio", "Premium Managed", "Allocation review requested", badge("Review"), linkButton("Open", "portfolio-product-detail.html")],
        ["Support", "#BP-1208", "Withdrawal timing clarification", badge("Awaiting broker response"), linkButton("Open", "support-ticket-detail.html")]
      ]));
  }

  function kycReviewPage() {
    const r = data.kycReview;
    return workflowSteps(["Submitted", "Screened", "Staff review", "Decision"], 2) +
      '<div class="grid two">' +
      section("Document review", "Validate the uploaded document before changing client permissions.", details([["Account", r.account], ["Client", r.client], ["Requirement", r.requirement], ["Document", r.document], ["Uploaded", r.uploaded], ["Blocked actions", r.blocked]]) + "<h3>Verification checks</h3>" + checklist(r.checks)) +
      reviewPanel("Compliance decision", r.recommendation, decisionButton("Approve KYC", "primary", "KYC approved", "approveKyc") + decisionButton("Reject", "danger", "KYC rejected", "rejectKyc") + decisionButton("Request resubmission", "", "Resubmission requested", "requestKycResubmission")) +
      "</div>";
  }

  function depositReviewPage() {
    const r = data.depositReview;
    return workflowSteps(["Submitted", "Funds detected", "Reconciliation", "Wallet credit"], 2) +
      '<div class="grid two">' +
      section("Funding request", "Confirm the funding rail, amount, source, and client status before crediting wallet balance.", details([["Reference", r.reference], ["Client", r.client], ["Method", r.method], ["Rail", r.rail], ["Amount", r.amount], ["Received", r.received], ["Source", r.source], ["Status", badge(r.status)]]) + "<h3>Funding checks</h3>" + checklist(r.checks)) +
      reviewPanel("Finance decision", "Confirm only when the source, reference, and compliance checks are acceptable.", decisionButton("Credit wallet", "primary", "Deposit credited", "creditDeposit") + decisionButton("Flag mismatch", "danger", "Deposit flagged", "flagDeposit") + decisionButton("Request proof", "", "Proof requested", "requestDepositProof")) +
      "</div>";
  }

  function withdrawalReviewPage() {
    const r = data.withdrawalReview;
    return workflowSteps(["Requested", "Eligibility checked", "Admin approval", "Released"], 1) +
      '<div class="grid two">' +
      section("Withdrawal request", "Review cleared balance, destination, risk checks, and KYC status before release.", details([["Reference", r.reference], ["Client", r.client], ["Amount", r.amount], ["Destination", r.destination], ["Available balance", r.available], ["KYC", badge(r.kyc)], ["Status", badge(r.status)]]) + "<h3>Approval checks</h3>" + checklist(r.checks)) +
      reviewPanel("Withdrawal decision", "Every withdrawal approval should capture the operational reason and approver.", decisionButton("Approve release", "primary", "Withdrawal approved", "approveWithdrawal") + decisionButton("Place hold", "danger", "Withdrawal placed on hold", "holdWithdrawal") + decisionButton("Ask client for info", "", "Client information requested", "requestWithdrawalInfo")) +
      "</div>";
  }

  function productDetailPage() {
    const p = data.productDetail;
    return '<div class="grid two">' +
      section("Product controls", "Control how this managed portfolio appears to eligible clients.", details([["Product", p.name], ["Risk", badge(p.risk)], ["Minimum", p.minimum], ["Payout", p.payout], ["Visibility", badge(p.visibility)], ["Audience", p.audience]]) + "<h3>Publishing rules</h3>" + checklist(p.rules)) +
      reviewPanel("Publishing action", "Changes here should later require versioned product terms and manager approval.", decisionButton("Save changes", "primary", "Product changes saved", "saveProduct") + decisionButton("Send to review", "", "Product sent to review", "reviewProduct") + decisionButton("Hide product", "danger", "Product hidden", "hideProduct")) +
      "</div>" +
      section("Client impact preview", "Shows how the product will be framed before backend-managed publishing is added.", table(["Field", "Client-facing value", "Admin note"], [
        ["Strategy", "Premium managed allocation across eligible instruments", "Must stay neutral and non-guaranteed"],
        ["Return wording", "Projected and market-based only", "Never guaranteed"],
        ["Eligibility", "Completed KYC and portfolio desk approval", "Required"],
        ["Risk disclosure", "Custom mandate with market and liquidity risk", "Required"]
      ]));
  }

  function supportTicketDetailPage() {
    const t = data.supportDetail;
    return '<div class="grid two">' +
      section("Ticket context", "Support staff can resolve simple cases or escalate finance/compliance-linked requests.", details([["Ticket", t.ticket], ["Client", t.client], ["Subject", t.subject], ["Owner", t.owner], ["Status", badge(t.status)]]) + "<h3>Timeline</h3>" + timeline(t.timeline.map((row, i) => ["Step " + (i + 1), row[0], row[1], t.client]))) +
      reviewPanel("Response action", "Keep ticket responses short, specific, and tied to the client request.", decisionButton("Send reply", "primary", "Reply sent", "sendSupportReply") + decisionButton("Escalate", "", "Ticket escalated", "escalateSupport") + decisionButton("Resolve", "", "Ticket resolved", "resolveSupport")) +
      "</div>";
  }

  function rolesPage() {
    return section("Admin roles", "Role boundaries for the future backend permission model.", table(["Role", "Primary permissions", "Restrictions", "Status"], [
      ["Super Admin", "Full access, roles, settings, overrides", "None", badge("Active")],
      ["Compliance Officer", "KYC, risk, options suitability, restrictions", "No payout posting", badge("Active")],
      ["Finance Operations", "Deposits, withdrawals, fees, payouts", "No role management", badge("Active")],
      ["Portfolio Manager", "Portfolio products, allocations, mandate notes", "No money movement approval", badge("Active")],
      ["Support Agent", "Tickets and client communication", "No financial approvals", badge("Active")],
      ["Read-only Auditor", "Reports and audit trail", "No write access", badge("Active")]
    ]), modalButton("Invite admin", "admin-user", "primary"));
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
      case "client-detail.html": return clientDetailPage();
      case "kyc-review.html": return kycReviewPage();
      case "deposit-review.html": return depositReviewPage();
      case "withdrawal-review.html": return withdrawalReviewPage();
      case "portfolio-product-detail.html": return productDetailPage();
      case "support-ticket-detail.html": return supportTicketDetailPage();
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
    const apiState = appState.apiOnline ? '<span class="api-status live">API Live</span>' : '<span class="api-status fallback">Static fallback</span>';
    document.getElementById("admin-root").innerHTML = '<div class="app"><aside class="sidebar"><div class="brand"><div class="brand-mark">BP</div><div><p class="brand-title">BullPort Admin</p><p class="brand-subtitle">Broker operations console</p></div></div><nav aria-label="Admin navigation">' + buildNav() + '</nav></aside><div class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:12px;min-width:0"><button class="menu-button" type="button" data-action="toast" aria-label="Open menu">' + svg("list") + '</button><div class="top-title"><p class="eyebrow">Internal operations</p><p class="name">' + meta[0] + '</p></div></div><div class="top-actions">' + apiState + '<label class="search">' + svg("grid") + '<input data-global-search placeholder="Search clients, tickets, references..." /></label><button class="btn" type="button" data-action="open-modal" data-modal="quick-action">Quick action</button><div class="avatar">OA</div></div></header><main class="content">' + mobileTabs() + '<div class="page-head"><div><h1>' + meta[0] + '</h1><p>' + meta[1] + '</p></div><div class="action-row">' + modalButton("Export", "export") + modalButton("New task", "task", "primary") + '</div></div>' + bodyFor(file) + auditPanel() + '</main></div></div><div class="toast-root" aria-live="polite"></div><div class="modal-root" data-modal-root></div>';
    bindActions();
    bindFilters();
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
      node.addEventListener("click", async () => {
        const action = node.getAttribute("data-action");
        if (action === "goto-queues") location.href = "queues.html";
        else if (action === "goto-clients") location.href = "clients.html";
        else if (action === "open-modal") openModal(node.dataset.modal || "task");
        else if (action === "decision") {
          node.classList.add("is-confirmed");
          const apiAction = node.dataset.apiAction || "prototypeDecision";
          const result = node.dataset.result || node.textContent.trim();
          const stateNode = node.closest(".review-panel")?.querySelector("[data-decision-state]");
          try {
            await executeBackendAction(apiAction);
            if (stateNode) stateNode.innerHTML = badge(result) + '<span> Action: ' + apiAction + " saved to backend</span>";
            addAudit("Now", "Admin", (actionLabels[apiAction] || result) + " completed", pageContext());
            toast(result + ". Backend action completed.");
          } catch (error) {
            if (stateNode) stateNode.innerHTML = badge(result) + '<span> Action: ' + apiAction + " stored locally</span>";
            addAudit("Now", "Admin", (actionLabels[apiAction] || result) + " captured locally", pageContext());
            toast((error && error.message ? error.message : "Backend unavailable") + ". Stored locally for prototype continuity.");
          }
        }
        else toast(node.textContent.trim() + " captured for the admin prototype.");
      });
    });
    document.querySelectorAll("[data-close-modal]").forEach((node) => {
      if (node.dataset.bound === "true") return;
      node.dataset.bound = "true";
      node.addEventListener("click", closeModal);
    });
    document.querySelectorAll("[data-submit-modal]").forEach((node) => {
      if (node.dataset.bound === "true") return;
      node.dataset.bound = "true";
      node.addEventListener("click", () => submitModal(node.dataset.submitModal));
    });
  }

  async function executeBackendAction(apiAction) {
    const note = document.querySelector(".review-panel textarea")?.value || "Updated from BullPort admin UI.";
    const routes = {
      approveKyc: ["/api/kyc/reviews/" + liveRefs.kycReviewId + "/approve", { note }],
      rejectKyc: ["/api/kyc/reviews/" + liveRefs.kycReviewId + "/reject", { note }],
      requestKycResubmission: ["/api/kyc/reviews/" + liveRefs.kycReviewId + "/request-resubmission", { note }],
      creditDeposit: ["/api/money/deposits/" + liveRefs.depositId + "/credit", { note }],
      flagDeposit: ["/api/money/deposits/" + liveRefs.depositId + "/flag", { note }],
      approveWithdrawal: ["/api/money/withdrawals/" + liveRefs.withdrawalId + "/approve", { note }],
      holdWithdrawal: ["/api/money/withdrawals/" + liveRefs.withdrawalId + "/hold", { note }],
      resolveSupport: ["/api/support/tickets/" + liveRefs.ticketId + "/resolve", {}],
      escalateSupport: ["/api/support/tickets/" + liveRefs.ticketId + "/assign", { owner: "Compliance", priority: "High" }],
      sendSupportReply: ["/api/support/tickets/" + liveRefs.ticketId + "/assign", { owner: "Support", priority: "Normal" }]
    };
    const route = routes[apiAction];
    if (!route || route[0].indexOf("undefined") !== -1) throw new Error("No backend route is available for this action yet");
    await api(route[0], { method: "POST", body: JSON.stringify(route[1]) });
    await loadBackendData();
  }

  function pageContext() {
    const h1 = document.querySelector("h1");
    return h1 ? h1.textContent.trim() : "Admin";
  }

  function addAudit(time, owner, action, subject) {
    appState.audit.unshift([time, owner, action, subject]);
    const sections = Array.from(document.querySelectorAll(".section"));
    const audit = sections.find((node) => node.textContent.indexOf("Live audit trail") !== -1);
    if (audit) audit.outerHTML = auditPanel();
  }

  function modalContent(type) {
    const copy = {
      "client-note": ["Create client note", "createClientNote", [["Client", "Tobi Adeyemi"], ["Note type", "Compliance / finance / portfolio"], ["Note", "Proof of address reviewed; awaiting confirmation."]]],
      "assign-task": ["Assign queue item", "assignQueueTask", [["Queue item", "Proof of address review"], ["Owner", "Compliance Officer"], ["Priority", "High"]]],
      "bulk-kyc": ["Bulk KYC action", "bulkKycDecision", [["Action", "Approve selected eligible reviews"], ["Reviewer", "Compliance"], ["Audit reason", "Documents passed verification checks."]]],
      "bulk-deposit": ["Bulk deposit confirmation", "bulkCreditDeposits", [["Action", "Credit selected deposits"], ["Rail", "Bank and crypto"], ["Audit reason", "References reconciled."]]],
      "bulk-withdrawal": ["Bulk withdrawal approval", "bulkApproveWithdrawals", [["Action", "Approve selected withdrawals"], ["Approver", "Finance Operations"], ["Audit reason", "KYC, destination and balance checks passed."]]],
      product: ["Create portfolio product", "createPortfolioProduct", [["Name", "Income Builder"], ["Risk", "Moderate"], ["Minimum", "$2,500"]]],
      "allocation-note": ["Create allocation note", "createAllocationNote", [["Client", "Musa Danladi"], ["Portfolio", "Premium Managed"], ["Note", "Top-up request routed to portfolio desk."]]],
      payout: ["Post payout", "postPayout", [["Source", "Dividend Income Portfolio"], ["Amount", "$620"], ["Mode", "Wallet credit"]]],
      instrument: ["Instrument setup", "upsertInstrument", [["Symbol", "MSFT"], ["Category", "Stock"], ["Status", "Tradable"]]],
      report: ["Generate report", "generateReport", [["Report", "Wallet Activity Export"], ["Period", "Last 90 days"], ["Format", "CSV"]]],
      "report-download": ["Download report", "downloadReport", [["Report", "June 2026 Account Statement"], ["Format", "PDF"], ["Access", "Audited download"]]],
      notification: ["Create notification", "createNotification", [["Audience", "Clients with pending KYC"], ["Template", "KYC update"], ["Channel", "Dashboard notification"]]],
      "notification-preview": ["Preview notification", "previewNotification", [["Template", "KYC update"], ["Audience", "Single client"], ["Status", "Preview only"]]],
      "assign-ticket": ["Assign support ticket", "assignSupportTicket", [["Ticket", "#BP-1208"], ["Owner", "Finance"], ["Priority", "High"]]],
      "admin-user": ["Invite admin user", "inviteAdminUser", [["Email", "operations@example.com"], ["Role", "Finance Operations"], ["Access", "Money movement only"]]],
      export: ["Export current view", "exportCurrentView", [["Format", "CSV"], ["Scope", pageContext()], ["Audit", "Required"]]],
      task: ["Create admin task", "createAdminTask", [["Title", "Follow up pending review"], ["Owner", "Operations"], ["Due", "Today"]]],
      "quick-action": ["Quick action", "createAdminTask", [["Action", "Create follow-up task"], ["Owner", "Operations"], ["Priority", "Normal"]]]
    };
    return copy[type] || copy.task;
  }

  function openModal(type) {
    const root = document.querySelector("[data-modal-root]");
    if (!root) return;
    const modal = modalContent(type);
    root.innerHTML = '<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">Backend action: ' + modal[1] + '</p><h2>' + modal[0] + '</h2></div><button class="icon-btn" type="button" data-close-modal aria-label="Close">x</button></div><div class="modal-body">' + modal[2].map((row) => '<label>' + row[0] + '<input value="' + row[1] + '" /></label>').join("") + '<label>Internal note<textarea>Prepared for backend endpoint ' + modal[1] + '.</textarea></label></div><div class="modal-actions"><button class="btn" type="button" data-close-modal>Cancel</button><button class="btn primary" type="button" data-submit-modal="' + modal[1] + '">Save prototype action</button></div></section></div>';
    bindActions();
  }

  function closeModal() {
    const root = document.querySelector("[data-modal-root]");
    if (root) root.innerHTML = "";
  }

  async function submitModal(apiAction) {
    try {
      if (apiAction === "createClientNote" && liveRefs.clientId) {
        await api("/api/clients/" + liveRefs.clientId + "/notes", {
          method: "POST",
          body: JSON.stringify({ category: "Admin note", body: "Created from BullPort admin UI.", createdBy: "Admin" })
        });
      } else if (apiAction === "assignSupportTicket" && liveRefs.ticketId) {
        await api("/api/support/tickets/" + liveRefs.ticketId + "/assign", {
          method: "POST",
          body: JSON.stringify({ owner: "Finance", priority: "High" })
        });
      }
      await loadBackendData();
      addAudit("Now", "Admin", "Submitted " + apiAction, pageContext());
      closeModal();
      toast(apiAction + " saved to backend.");
    } catch (error) {
      addAudit("Now", "Admin", "Submitted " + apiAction + " locally", pageContext());
      closeModal();
      toast((error && error.message ? error.message : "Backend unavailable") + ". Stored locally.");
    }
  }

  function bindFilters() {
    document.querySelectorAll(".filter-bar").forEach((bar) => {
      const search = bar.querySelector("[data-table-search]");
      const status = bar.querySelector("[data-table-status]");
      const sectionNode = bar.closest(".section");
      const apply = () => applyFilter(sectionNode, search ? search.value : "", status ? status.value : "");
      if (search && search.dataset.bound !== "true") {
        search.dataset.bound = "true";
        search.addEventListener("input", apply);
      }
      if (status && status.dataset.bound !== "true") {
        status.dataset.bound = "true";
        status.addEventListener("change", apply);
      }
    });
    const globalSearch = document.querySelector("[data-global-search]");
    if (globalSearch && globalSearch.dataset.bound !== "true") {
      globalSearch.dataset.bound = "true";
      globalSearch.addEventListener("input", () => {
        const firstSearch = document.querySelector("[data-table-search]");
        if (firstSearch) {
          firstSearch.value = globalSearch.value;
          firstSearch.dispatchEvent(new Event("input"));
        }
      });
    }
  }

  function applyFilter(sectionNode, query, status) {
    if (!sectionNode) return;
    const q = String(query || "").toLowerCase();
    const s = String(status || "").toLowerCase();
    const rows = Array.from(sectionNode.querySelectorAll("[data-search]"));
    let visible = 0;
    rows.forEach((row) => {
      const text = row.getAttribute("data-search") || row.textContent.toLowerCase();
      const show = (!q || text.indexOf(q) !== -1) && (!s || text.indexOf(s) !== -1);
      row.hidden = !show;
      if (show) visible += 1;
    });
    const empty = sectionNode.querySelector("[data-empty-state]");
    if (empty) empty.style.display = visible ? "none" : "block";
  }

  async function boot() {
    render();
    loadBackendData().then(() => {
      render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
