(function () {
  const pages = {
    "index.html": ["Overview", "Live broker operations snapshot across KYC, money movement, investments, risk, support, and admin actions."],
    "queues.html": ["Operations Queues", "Work queues for the internal team to review and clear in priority order."],
    "clients.html": ["Clients", "Investor records, account state, wallet context, KYC progress, and operational restrictions."],
    "kyc.html": ["KYC Queue", "Identity, address, liveness, bank, and compliance checks awaiting staff decisions."],
    "deposits.html": ["Deposits", "Bank and crypto funding requests awaiting confirmation and reconciliation."],
    "withdrawals.html": ["Withdrawals", "Withdrawal requests requiring balance, KYC, destination, and risk review."],
    "approvals.html": ["Approvals", "Maker-checker decisions for deposits, withdrawals, product publication, and distributions."],
    "portfolio-products.html": ["Portfolio Products", "Broker-managed portfolio products, risk labels, visibility, minimums, and payout rules."],
    "client-investments.html": ["Client Investments", "Active subscriptions, mandate status, top-ups, exits, and reinvestment instructions."],
    "orders.html": ["Trading Orders", "Internal order-desk requests, approvals, fills, settlement, and client positions."],
    "options.html": ["Options Access", "Suitability applications, approval levels, restrictions, and options access decisions."],
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
    ["Money Movement", [["Deposits", "deposits.html", "down"], ["Withdrawals", "withdrawals.html", "up"], ["Approvals", "approvals.html", "shield"], ["Payouts", "payouts.html", "coins"]]],
    ["Investments", [["Portfolio Products", "portfolio-products.html", "briefcase"], ["Client Investments", "client-investments.html", "chart"], ["Trading Orders", "orders.html", "list"], ["Options Access", "options.html", "shield"], ["Markets & Instruments", "instruments.html", "trend"], ["Risk & Compliance", "risk.html", "alert"]]],
    ["Comms & Records", [["Reports", "reports.html", "file"], ["Notifications", "notifications.html", "bell"], ["Support Tickets", "support.html", "help"]]],
    ["System", [["Admin Users & Roles", "roles.html", "lock"], ["Platform Settings", "settings.html", "settings"], ["System Map", "admin-info-architecture.html", "map"]]]
  ];

  const emptyDetailMessage = "No backend record selected.";

  const data = {
    metrics: [],
    queues: [],
    clients: [],
    kyc: [],
    deposits: [],
    withdrawals: [],
    products: [],
    investments: [],
    payouts: [],
    approvals: [],
    orders: [],
    positions: [],
    options: [],
    riskAlerts: [],
    notifications: [],
    adminUsers: [],
    settingsRows: [],
    tasks: [],
    instruments: [],
    reports: [],
    tickets: [],
    audit: [],
    clientProfile: {
      account: "-",
      name: emptyDetailMessage,
      email: "-",
      phone: "-",
      tier: "-",
      wallet: "$0",
      portfolioValue: "$0",
      kyc: "Not loaded",
      risk: "-",
      status: "No record",
      restrictions: ["Connect to the operational API and select a backend client record."],
      notes: [["System", "No backend notes loaded."]]
    },
    kycReview: {
      account: "-",
      client: emptyDetailMessage,
      requirement: "-",
      document: "-",
      uploaded: "-",
      status: "No record",
      checks: [["Status", "No backend KYC record loaded"]],
      blocked: "-",
      recommendation: "Select a live KYC case from the backend queue."
    },
    depositReview: {
      reference: "-",
      client: emptyDetailMessage,
      method: "-",
      rail: "-",
      amount: "$0",
      received: "-",
      source: "-",
      status: "No record",
      checks: [["Status", "No backend deposit loaded"]]
    },
    withdrawalReview: {
      reference: "-",
      client: emptyDetailMessage,
      amount: "$0",
      destination: "-",
      available: "-",
      kyc: "-",
      status: "No record",
      checks: [["Status", "No backend withdrawal loaded"]]
    },
    productDetail: {
      name: emptyDetailMessage,
      risk: "-",
      minimum: "$0",
      payout: "-",
      visibility: "No record",
      audience: "Select a live portfolio product from the backend catalog.",
      rules: [["Status", "No backend product loaded"]]
    },
    supportDetail: {
      ticket: "-",
      client: emptyDetailMessage,
      subject: "-",
      owner: "-",
      status: "No record",
      timeline: [["System", "No backend support ticket loaded."]]
    }
  };
  const appState = {
    audit: data.audit.slice(),
    decisions: {},
    apiOnline: false,
    apiBase: localStorage.getItem("bullport_api_base") || (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? "http://127.0.0.1:4000" : ""),
    admin: null,
    apiMessage: "Checking secure session",
    pendingLogin: null,
    mfaSetup: null,
    pendingApproval: null,
    pendingRecord: null
  };

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

  function escapeHtml(value) {
    return String(value ?? "")
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
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, safeData(item)]));
    }
    return value;
  }

  function unwrap(result) {
    if (!result || result.ok === false) return null;
    return result.data || null;
  }

  function cookieValue(name) {
    const pair = document.cookie.split("; ").find((item) => item.indexOf(name + "=") === 0);
    return pair ? decodeURIComponent(pair.slice(name.length + 1)) : "";
  }

  async function api(path, options, retried) {
    const requestOptions = options || {};
    const { skipRefresh: _skipRefresh, ...fetchOptions } = requestOptions;
    const headers = { "Content-Type": "application/json" };
    const method = String(requestOptions.method || "GET").toUpperCase();
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const csrf = cookieValue("bp_csrf");
      if (csrf) headers["x-csrf-token"] = csrf;
    }
    const response = await fetch(appState.apiBase + path, {
      ...fetchOptions,
      credentials: "include",
      headers: { ...headers, ...(requestOptions.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401 && !options?.skipRefresh && !retried && path !== "/api/v1/auth/refresh" && path !== "/api/v1/auth/admin/login") {
      try {
        await api("/api/v1/auth/refresh", { method: "POST", body: "{}", skipRefresh: true }, true);
        return api(path, options, true);
      } catch {}
    }
    if (!response.ok || payload.ok === false) {
      const error = new Error(payload.error?.message || "API request failed");
      error.code = payload.error?.code || "REQUEST_FAILED";
      error.status = response.status;
      error.fields = payload.error?.fields || null;
      throw error;
    }
    return safeData(payload.data);
  }

  async function tryApi(path) {
    try {
      return await api(path);
    } catch (error) {
      appState.apiMessage = error?.message || "A role-restricted dataset could not be loaded.";
      return null;
    }
  }

  async function loadBackendData() {
    const requestedRecordId = new URLSearchParams(location.search).get("id");
    const overview = await tryApi("/api/v1/admin/overview");
    if (!overview) {
      appState.apiOnline = false;
      throw new Error("The operational API could not be loaded for this admin session.");
    }

    appState.apiOnline = true;
    data.clients = [];
    data.kyc = [];
    data.deposits = [];
    data.withdrawals = [];
    data.products = [];
    data.investments = [];
    data.payouts = [];
    data.instruments = [];
    data.tickets = [];
    data.approvals = [];
    data.orders = [];
    data.positions = [];
    data.options = [];
    data.riskAlerts = [];
    data.reports = [];
    data.notifications = [];
    data.adminUsers = [];
    data.settingsRows = [];
    data.tasks = [];
    const [clients, kyc, deposits, withdrawals, products, investments, payouts, instruments, tickets, auditLogs, approvals, orders, positions, optionsApplications, riskAlerts, reports, notifications, adminUsers, settingsRows, tasks] = await Promise.all([
      tryApi("/api/v1/admin/clients?limit=100"),
      tryApi("/api/v1/admin/kyc?limit=100"),
      tryApi("/api/v1/admin/money/deposits?limit=100"),
      tryApi("/api/v1/admin/money/withdrawals?limit=100"),
      tryApi("/api/v1/admin/portfolio-products"),
      tryApi("/api/v1/admin/investments?limit=100"),
      tryApi("/api/v1/admin/distributions"),
      tryApi("/api/v1/admin/instruments"),
      tryApi("/api/v1/admin/support/tickets?limit=100"),
      tryApi("/api/v1/admin/audit-logs?limit=100"),
      tryApi("/api/v1/admin/approvals?status=PENDING"),
      tryApi("/api/v1/admin/orders"),
      tryApi("/api/v1/admin/positions"),
      tryApi("/api/v1/admin/options/applications"),
      tryApi("/api/v1/admin/risk/alerts"),
      tryApi("/api/v1/admin/reports"),
      tryApi("/api/v1/admin/notifications"),
      tryApi("/api/v1/admin/admin-users"),
      tryApi("/api/v1/admin/settings"),
      tryApi("/api/v1/admin/tasks")
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
        const kycStatus = Array.isArray(client.kycCases) && client.kycCases[0] ? label(client.kycCases[0].status) : "Not started";
        return [client.accountNumber, client.name, client.tier, formatMoney(investmentValue), kycStatus, label(client.riskLevel), label(client.status), client.id];
      });

      const profileClient = clients.find((client) => client.id === requestedRecordId) || clients[0];
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
          kyc: Array.isArray(profileClient.kycCases) && profileClient.kycCases[0] ? label(profileClient.kycCases[0].status) : "Not started",
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
      data.kyc = kyc.map((row) => [row.client?.accountNumber || "-", row.client?.name || "-", row.level + " identity verification", row.assignedReviewer || "Unassigned", row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-", label(row.status), row.id]);
      const first = kyc.find((row) => row.id === requestedRecordId) || kyc[0];
      if (first) {
        liveRefs.kycReviewId = first.id;
        data.kycReview = {
          id: first.id,
          account: first.client?.accountNumber || "-",
          client: first.client?.name || "-",
          requirement: first.level + " identity verification",
          document: first.documents?.[0]?.fileName || "Document pending",
          uploaded: first.submittedAt ? new Date(first.submittedAt).toLocaleString() : "-",
          status: label(first.status),
          blocked: "Withdrawals and large funding until approved",
          recommendation: first.decisions?.[0]?.note || "Review document details before final decision.",
          checks: [["Current status", label(first.status)], ["Reviewer", first.assignedReviewer || "Unassigned"], ["Client risk", label(first.client?.riskLevel)], ["Account status", label(first.client?.status)]]
        };
      }
    }

    if (Array.isArray(deposits)) {
      data.deposits = deposits.map((row) => [row.reference, row.client?.name || "-", row.method, formatMoney(row.amount), row.rail, label(row.status), row.id]);
      const first = deposits.find((row) => row.id === requestedRecordId) || deposits[0];
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
      data.withdrawals = withdrawals.map((row) => [row.reference, row.client?.name || "-", formatMoney(row.amount), row.destination, label(row.client?.status), label(row.status), row.id]);
      const first = withdrawals.find((row) => row.id === requestedRecordId) || withdrawals[0];
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
      data.products = products.map((row) => [row.name, label(row.riskLevel), formatMoney(row.minimum), row.payoutRule, label(row.status), row.id]);
      const premium = products.find((row) => row.id === requestedRecordId) || products[0];
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
      data.payouts = payouts.map((row) => [row.reference, row.product?.name || row.type, formatMoney(row.netAmount), row.type, row.periodEnd ? new Date(row.periodEnd).toLocaleDateString() : "-", label(row.status)]);
    }

    if (Array.isArray(instruments)) {
      data.instruments = instruments.map((row) => [row.symbol, row.name, row.category, row.market, label(row.riskLevel), row.status]);
    }

    if (Array.isArray(tickets)) {
      data.tickets = tickets.map((row) => [row.ticketNo, row.subject, row.client?.name || "-", row.owner || "Unassigned", label(row.status), row.id]);
      const first = tickets.find((row) => row.id === requestedRecordId) || tickets[0];
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

    if (Array.isArray(approvals)) {
      data.approvals = approvals.map((row) => ({
        id: row.id,
        action: label(row.actionType),
        entity: row.entityType,
        entityId: row.entityId,
        maker: row.initiatedBy?.name || "Unknown admin",
        makerRole: label(row.initiatedBy?.role),
        createdAt: row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
        expiresAt: row.expiresAt ? new Date(row.expiresAt).toLocaleString() : "-",
        status: label(row.status)
      }));
    }

    if (Array.isArray(orders)) data.orders = orders;
    if (Array.isArray(positions)) data.positions = positions;
    if (Array.isArray(optionsApplications)) data.options = optionsApplications;
    if (Array.isArray(riskAlerts)) data.riskAlerts = riskAlerts;
    if (Array.isArray(reports)) data.reports = reports.map((row) => [row.name, label(row.type), row.format, row.period, label(row.status), row.id]);
    if (Array.isArray(notifications)) data.notifications = notifications;
    if (Array.isArray(adminUsers)) data.adminUsers = adminUsers;
    if (Array.isArray(settingsRows)) data.settingsRows = settingsRows;
    if (Array.isArray(tasks)) data.tasks = tasks;

    data.queues = [
      ...(Array.isArray(kyc) ? kyc.slice(0, 3).map((row) => ({ title: row.level + " identity verification", owner: row.assignedReviewer || "Unassigned", client: row.client?.name || "-", age: "Live queue", state: label(row.status) })) : []),
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
    return '<aside class="review-panel"><h2>' + title + '</h2><p>' + subtitle + '</p><div class="decision-state" data-decision-state>No decision submitted in this session.</div><label>Internal decision note<textarea placeholder="Add a clear audit note before saving a decision."></textarea></label><div class="action-row">' + actions + "</div></aside>";
  }

  function auditPanel() {
    return section("Live audit trail", "Append-only operational events loaded from the backend audit record.", timeline(appState.audit.slice(0, 6)));
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
      metric("Compliance queue", String(data.kyc.length + data.options.filter((row) => row.status === "PENDING").length), "KYC, risk, options and exceptions.", "Review"),
      metric("Finance queue", String(data.deposits.filter((row) => !/credited|rejected/i.test(row[5])).length + data.withdrawals.filter((row) => !/settled|rejected|cancelled/i.test(row[5])).length), "Deposits and withdrawals requiring action.", "Pending"),
      metric("Pending approvals", String(data.approvals.length), "Maker-checker requests requiring a second admin.", "Open"),
      metric("Open tasks", String(data.tasks.filter((row) => row.status !== "COMPLETED").length), "Assigned operational follow-ups.", "Open")
    ].join("") + "</div>" + section("Unified operations queue", "All pending work across teams, sorted by operational priority.", filters("Search queue, client, owner...") + queueList(data.queues), modalButton("Assign selected", "assign-task", "primary"));
  }

  function clientTable(rows) {
    return table(["Account", "Client", "Tier", "Portfolio value", "KYC", "Risk", "Status"], rows.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), row[5], badge(row[6])]));
  }

  function clientsPage() {
    return '<div class="grid metrics">' + [
      metric("Total clients", String(data.clients.length), "Loaded investor records.", "Active"),
      metric("Restricted accounts", String(data.clients.filter((row) => /restricted|suspended|hold/i.test(row[6])).length), "Funding, withdrawal or trading limits.", "Hold"),
      metric("Premium managed", String(data.clients.filter((row) => /premium/i.test(row[2])).length), "High-touch mandates.", "Active"),
      metric("Pending onboarding", String(data.clients.filter((row) => /pending|not started|draft|submitted|review/i.test(row[4] + row[6])).length), "Registration and KYC in progress.", "Pending")
    ].join("") + "</div>" + section("Client directory", "Searchable operational view of client accounts and account state.", filterableTable("Search account, client, tier...", ["Account", "Client", "Tier", "Portfolio value", "KYC", "Risk", "Status", "Action"], data.clients.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), row[5], badge(row[6]), linkButton("Open", "client-detail.html?id=" + encodeURIComponent(row[7]))])), modalButton("Create client note", "client-note", "primary"));
  }

  function kycPage() {
    return '<div class="grid two">' +
      section("KYC decision queue", "Document reviews awaiting compliance action.", filterableTable("Search account, client, requirement...", ["Account", "Client", "Requirement", "Owner", "Age", "State", "Action"], data.kyc.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), linkButton("Review", "kyc-review.html?id=" + encodeURIComponent(row[6]))])), modalButton("Approve selected", "bulk-kyc", "primary")) +
      section("Review detail workspace", "The detail panel admins use before approving or rejecting backend verification records.", details([["Client", data.kycReview.client], ["Requirement", data.kycReview.requirement], ["Uploaded", data.kycReview.uploaded], ["Decision", data.kycReview.status || "No record"], ["Blocked actions", data.kycReview.blocked], ["Audit note", data.kycReview.recommendation]]) + '<div class="action-row" style="margin-top:14px">' + linkButton("Open review", "kyc-review.html", "primary") + modalButton("Request resubmission", "bulk-kyc") + "</div>") +
      "</div>";
  }

  function depositsPage() {
    return section("Deposit confirmation queue", "Finance operations can confirm, flag, or escalate wallet funding requests.", filterableTable("Search reference, client, rail...", ["Reference", "Client", "Method", "Amount", "Rail", "Status", "Action"], data.deposits.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), linkButton("Review", "deposit-review.html?id=" + encodeURIComponent(row[6]))])), modalButton("Confirm selected", "bulk-deposit", "primary")) +
      section("Reconciliation checklist", "Controls to keep funding behavior aligned with real settlement workflow.", details([["Reference check", "Required"], ["Source name match", "Required"], ["Crypto confirmations", "Required for crypto"], ["Large funding review", "Compliance threshold applies"]]));
  }

  function withdrawalsPage() {
    return section("Withdrawal review queue", "Approve only after cleared balance, KYC, destination, and risk checks pass.", filterableTable("Search request, client, destination...", ["Request", "Client", "Amount", "Destination", "Eligibility", "Status", "Action"], data.withdrawals.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), linkButton("Review", "withdrawal-review.html?id=" + encodeURIComponent(row[6]))])), modalButton("Approve selected", "bulk-withdrawal", "primary")) +
      section("Approval controls", "Withdrawal decisions should be auditable and role-gated.", details([["KYC dependency", "Full approval required"], ["Destination check", "Verified bank or screened wallet"], ["Risk review", "Enhanced review for crypto and high value"], ["Audit", "Decision, staff user and timestamp"]]));
  }

  function approvalsPage() {
    const rows = data.approvals.map((row) => [row.action, row.entity, row.entityId, row.maker + " (" + row.makerRole + ")", row.createdAt, row.expiresAt, badge(row.status), '<div class="action-row"><button class="btn primary" type="button" data-action="approval-decision" data-approval-id="' + row.id + '" data-approval-decision="approve">Approve</button><button class="btn" type="button" data-action="approval-decision" data-approval-id="' + row.id + '" data-approval-decision="reject">Reject</button></div>']);
    return section("Pending maker-checker requests", "The initiating admin cannot decide their own request. Role boundaries are enforced again by the API.", filterableTable("Search action, maker, entity...", ["Action", "Entity", "Record ID", "Initiated by", "Created", "Expires", "Status", "Decision"], rows)) + section("Decision controls", "Approval is the second operational signature. Deposit credits, withdrawal release, publication, and distribution posting occur atomically only after this step.", details([["Separation of duties", "Maker cannot be checker"], ["Financial mutation", "Atomic and idempotent"], ["Failed decision", "No ledger change"], ["Audit", "Admin, role, note, request ID, and timestamp"]]));
  }

  function productsPage() {
    return section("Portfolio product catalog", "Manage portfolio visibility, risk, minimums, payout schedule, and published wording.", filterableTable("Search product, risk, payout...", ["Product", "Risk", "Minimum", "Payout", "Status", "Action"], data.products.map((row) => [row[0], badge(row[1]), row[2], row[3], badge(row[4]), linkButton("Edit", "portfolio-product-detail.html?id=" + encodeURIComponent(row[5]))])), modalButton("New product", "product", "primary")) +
      section("Product publishing rules", "Published products can appear in the client dashboard and selected public-site areas.", details([["Projected returns", "Must be labelled projected or market-based"], ["Options", "Never default access"], ["Risk labels", "Required"], ["Visibility", "Draft, review, published, hidden"]]));
  }

  function investmentsPage() {
    return section("Client investment mandates", "Monitor subscribed portfolios, value, requested actions, and mandate state.", filterableTable("Search client, portfolio, action...", ["Client", "Portfolio", "Invested", "Current value", "Next action", "Status"], data.investments.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5])])), modalButton("Create allocation note", "allocation-note", "primary"));
  }

  function ordersPage() {
    const rows = data.orders.map((row) => [row.reference, row.client?.name || "-", row.instrument?.symbol || "-", label(row.side), label(row.type), String(row.quantity), row.limitPrice ? formatMoney(row.limitPrice) : "Market", badge(label(row.status)), row.status === "APPROVED" ? '<button class="btn primary" type="button" data-action="record-decision" data-record-kind="order" data-record-id="' + row.id + '" data-record-quantity="' + row.quantity + '" data-record-price="' + (row.instrument?.currentPrice || row.limitPrice || "") + '" data-record-decision="fill">Record fill</button>' : '<div class="action-row"><button class="btn primary" type="button" data-action="record-decision" data-record-kind="order" data-record-id="' + row.id + '" data-record-decision="approve">Approve</button><button class="btn" type="button" data-action="record-decision" data-record-kind="order" data-record-id="' + row.id + '" data-record-decision="reject">Reject</button></div>']);
    const positionRows = data.positions.map((row) => [row.client?.name || "-", row.instrument?.symbol || "-", String(row.quantity), formatMoney(row.averageCost), formatMoney(row.marketValue), formatMoney(row.realizedPnl), formatMoney(row.unrealizedPnl)]);
    return section("Internal order desk", "Client orders remain requests until the authorized portfolio desk approves or rejects them.", filterableTable("Search reference, client, symbol...", ["Reference", "Client", "Instrument", "Side", "Type", "Quantity", "Limit", "Status", "Decision"], rows)) + section("Client positions", "Positions and profit/loss updated transactionally from recorded fills.", table(["Client", "Instrument", "Quantity", "Average cost", "Market value", "Realized P/L", "Unrealized P/L"], positionRows));
  }

  function optionsPage() {
    const rows = data.options.map((row) => [row.client?.accountNumber || "-", row.client?.name || "-", row.experienceLevel || "Not provided", row.score ?? "-", row.requestedLevel || "Standard", badge(label(row.status)), row.decisionNote || "Awaiting review", '<div class="action-row"><button class="btn primary" type="button" data-action="record-decision" data-record-kind="options" data-record-id="' + row.id + '" data-record-decision="approve">Approve</button><button class="btn" type="button" data-action="record-decision" data-record-kind="options" data-record-id="' + row.id + '" data-record-decision="restrict">Restrict</button></div>']);
    return section("Options suitability applications", "Options remain high risk and inaccessible until compliance records a suitability decision.", filterableTable("Search client, level, status...", ["Account", "Client", "Experience", "Score", "Requested level", "Status", "Decision note", "Action"], rows)) + section("Access policy", "Client-facing options controls must match these backend decisions.", details([["Default access", "Not applied"], ["Required", "Approved KYC, disclosures, and suitability"], ["Risk", "High; capital loss and time-decay warnings"], ["Admin authority", "Compliance or super admin"]]));
  }

  function payoutsPage() {
    return section("Payout operations", "Post dividends, profit credits, reinvestments, and scheduled distributions.", filterableTable("Search payout, source, mode...", ["Reference", "Source", "Amount", "Mode", "Date", "Status", "Action"], data.payouts.map((row) => [row[0], row[1], row[2], row[3], row[4], badge(row[5]), modalButton("Open", "payout")])), modalButton("Post payout", "payout", "primary"));
  }

  function instrumentsPage() {
    return section("Instrument universe", "Control visibility, tradability, investability, and restrictions across supported asset classes.", filterableTable("Search symbol, market, category...", ["Symbol", "Name", "Category", "Market", "Risk", "Status", "Action"], data.instruments.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), badge(row[5]), modalButton("Edit", "instrument")])), modalButton("Add instrument", "instrument", "primary"));
  }

  function riskPage() {
    const open = data.riskAlerts.filter((row) => ["OPEN", "IN_REVIEW"].includes(row.status));
    const critical = open.filter((row) => ["HIGH", "CRITICAL"].includes(row.severity));
    return '<div class="grid metrics">' + [
      metric("Open alerts", String(open.length), "Current risk and compliance exceptions.", "Review"),
      metric("High or critical", String(critical.length), "Require prioritized staff review.", "High"),
      metric("Options requests", String(data.options.filter((row) => row.status === "PENDING").length), "Awaiting suitability decision.", "Review"),
      metric("Resolved alerts", String(data.riskAlerts.filter((row) => row.status === "RESOLVED").length), "Closed with an audit resolution.", "Resolved")
    ].join("") + "</div>" + section("Risk and compliance alerts", "Client restrictions and internal exceptions loaded from active risk rules.", queueList(data.riskAlerts.map((row) => ({ title: row.title, owner: row.category, client: row.client?.name || row.entityType || "Platform", age: row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-", state: label(row.status) }))));
  }

  function reportsPage() {
    return section("Reports and exports", "Statements, audit logs, exports, and operational records.", filterableTable("Search report, type, period...", ["Report", "Type", "Format", "Period", "Status", "Action"], data.reports.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), '<button class="btn" type="button" data-action="report-download" data-report-id="' + row[5] + '">Download</button>'])), modalButton("Generate report", "report", "primary"));
  }

  function notificationsPage() {
    return section("Notification composer", "Send account, KYC, funding, investment, payout, support, and risk messages.", details([["Audience", "Single client, segment or all active clients"], ["Templates", "KYC, deposit, withdrawal, payout, risk, support"], ["Delivery", "Dashboard notification now, email later"], ["Approval", "Compliance approval for risk-sensitive notices"]]) + '<div class="action-row" style="margin-top:14px">' + modalButton("Create notice", "notification", "primary") + modalButton("Preview template", "notification-preview") + "</div>") +
      section("Recent notification activity", "Authoritative in-app messages and their delivery state.", queueList(data.notifications.slice(0, 50).map((row) => ({ title: row.title, owner: row.category, client: row.client?.name || "Platform audience", age: row.createdAt ? new Date(row.createdAt).toLocaleString() : "-", state: row.readAt ? "Read" : "Sent" }))));
  }

  function supportPage() {
    return section("Support ticket queue", "Assign, escalate, resolve, and document client support cases.", filterableTable("Search ticket, client, owner...", ["Ticket", "Subject", "Client", "Owner", "Status", "Action"], data.tickets.map((row) => [row[0], row[1], row[2], row[3], badge(row[4]), linkButton("Open", "support-ticket-detail.html?id=" + encodeURIComponent(row[5]))])), modalButton("Assign ticket", "assign-ticket", "primary"));
  }

  function clientDetailPage() {
    const c = data.clientProfile;
    return '<div class="grid metrics">' + [
      metric("Wallet balance", c.wallet, "Available operating balance.", "Active"),
      metric("Portfolio value", c.portfolioValue, "Current recorded portfolio value.", "Active"),
      metric("KYC status", c.kyc, "Controls withdrawal and funding limits.", c.kyc),
      metric("Risk profile", c.risk, "Used for suitability and product access.", "Info")
    ].join("") + "</div>" +
      '<div class="grid two">' +
      section("Client operating profile", "Identity, tier, account status, and active restrictions.", details([["Account", c.account], ["Client", c.name], ["Email", c.email], ["Phone", c.phone], ["Tier", c.tier], ["Status", badge(c.status)]]) + '<div class="restriction-list">' + c.restrictions.map((r) => '<div class="restriction">' + r + "</div>").join("") + "</div>", '<div class="action-row">' + linkButton("Review KYC", "kyc-review.html", "primary") + linkButton("Open withdrawal", "withdrawal-review.html") + "</div>") +
      section("Recent client notes", "Internal audit notes and operational context.", noteList(c.notes), modalButton("Add note", "client-note", "primary")) +
      "</div>" +
      section("Client-linked activity", "A single place to move from the client profile into money movement, investments, and support.", table(["Area", "Reference", "Summary", "Status", "Action"], [
        ["Deposit", data.depositReview.reference, data.depositReview.status, badge(data.depositReview.status), linkButton("Open", "deposit-review.html")],
        ["Withdrawal", data.withdrawalReview.reference, data.withdrawalReview.status, badge(data.withdrawalReview.status), linkButton("Open", "withdrawal-review.html")],
        ["Portfolio", data.productDetail.name, data.productDetail.visibility, badge(data.productDetail.visibility), linkButton("Open", "portfolio-product-detail.html")],
        ["Support", data.supportDetail.ticket, data.supportDetail.subject, badge(data.supportDetail.status), linkButton("Open", "support-ticket-detail.html")]
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
      reviewPanel("Publishing action", "Product visibility changes and publication requests are recorded in the backend audit trail.", decisionButton("Move to draft", "primary", "Product moved to draft", "saveProduct") + decisionButton("Request publication", "", "Publication approval requested", "reviewProduct") + decisionButton("Hide product", "danger", "Product hidden", "hideProduct")) +
      "</div>" +
      section("Client impact preview", "Shows how the current published product terms are framed for eligible clients.", table(["Field", "Client-facing value", "Admin note"], [
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
    return section("Admin users and roles", "Active staff identities and enforced role boundaries.", table(["Admin", "Email", "Role", "MFA", "Last login", "Status"], data.adminUsers.map((row) => [row.name, row.email, label(row.role), row.mfa?.enabledAt ? "Enabled" : "Enrollment required", row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : "Never", badge(row.isActive ? "Active" : "Inactive")])), modalButton("Invite admin", "admin-user", "primary"));
  }

  function settingsPage() {
    return section("Platform settings", "Shared backend-controlled capability, accounting, approval, and risk configuration.", table(["Key", "Value", "Description", "Updated", "Action"], data.settingsRows.map((row) => [row.key, '<code>' + JSON.stringify(row.value) + '</code>', row.description || "-", row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-", '<button class="btn" type="button" data-action="setting-edit" data-setting-key="' + row.key + '">Edit</button>'])));
  }

  function bodyFor(file) {
    switch (file) {
      case "queues.html": return queuesPage();
      case "clients.html": return clientsPage();
      case "kyc.html": return kycPage();
      case "deposits.html": return depositsPage();
      case "withdrawals.html": return withdrawalsPage();
      case "approvals.html": return approvalsPage();
      case "portfolio-products.html": return productsPage();
      case "client-investments.html": return investmentsPage();
      case "orders.html": return ordersPage();
      case "options.html": return optionsPage();
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

  function renderSessionLoading() {
    document.getElementById("admin-root").innerHTML = '<main class="admin-auth"><section class="admin-auth-card"><div class="brand"><div class="brand-mark">BP</div><div><p class="brand-title">BullPort Admin</p><p class="brand-subtitle">Broker operations console</p></div></div><p class="auth-status">Checking your secure admin session...</p></section></main>';
  }

  function renderAdminLogin(message, requireMfa) {
    document.getElementById("admin-root").innerHTML = '<main class="admin-auth"><section class="admin-auth-card"><div class="brand"><div class="brand-mark">BP</div><div><p class="brand-title">BullPort Admin</p><p class="brand-subtitle">Broker operations console</p></div></div><div class="auth-heading"><p class="eyebrow">Restricted access</p><h1>Sign in to operations</h1><p>Use your assigned admin account. Access is role-controlled, session-audited, and protected by MFA.</p></div>' + (message ? '<p class="auth-error">' + escapeHtml(message) + '</p>' : '') + '<form class="auth-form" data-admin-login-form><label>Email address<input name="email" type="email" autocomplete="username" required value="' + escapeHtml(appState.pendingLogin?.email || "") + '"></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label>' + (requireMfa ? '<label>Authenticator or recovery code<input name="mfaCode" autocomplete="one-time-code" required></label>' : '') + '<button class="btn primary" type="submit">Sign in securely</button></form></section></main>';
    const form = document.querySelector("[data-admin-login-form]");
    form?.addEventListener("submit", submitAdminLogin);
  }

  function renderMfaSetup() {
    const setup = appState.mfaSetup;
    document.getElementById("admin-root").innerHTML = '<main class="admin-auth"><section class="admin-auth-card is-wide"><div class="brand"><div class="brand-mark">BP</div><div><p class="brand-title">BullPort Admin</p><p class="brand-subtitle">MFA enrollment required</p></div></div><div class="auth-heading"><p class="eyebrow">One-time setup</p><h1>Protect this admin account</h1><p>Scan the barcode with Google Authenticator, Microsoft Authenticator, Authy or another TOTP app, store the recovery codes offline, then enter the current six-digit code.</p></div><div class="mfa-setup-grid"><div class="mfa-qr-card"><span>Scan with authenticator</span><canvas data-mfa-qr width="220" height="220" aria-label="Authenticator setup barcode"></canvas><p data-mfa-qr-fallback hidden>Barcode could not be generated. Use the manual secret instead.</p></div><div><div class="mfa-secret"><span>Manual setup secret</span><strong>' + escapeHtml(setup.secret) + '</strong></div><p class="mfa-help">Use this secret only if your authenticator cannot scan the barcode.</p></div></div><div class="recovery-grid">' + setup.recoveryCodes.map((code) => '<code>' + escapeHtml(code) + '</code>').join("") + '</div><form class="auth-form" data-mfa-confirm-form><label>Current six-digit code<input name="code" inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code" required></label><button class="btn primary" type="submit">Enable MFA and continue</button></form></section></main>';
    renderMfaQr();
    document.querySelector("[data-mfa-confirm-form]")?.addEventListener("submit", confirmMfaSetup);
  }

  function renderMfaQr() {
    const canvas = document.querySelector("[data-mfa-qr]");
    const fallback = document.querySelector("[data-mfa-qr-fallback]");
    const otpauthUrl = appState.mfaSetup?.otpauthUrl;
    if (!canvas || !otpauthUrl || !window.QRCode?.toCanvas) {
      if (fallback) fallback.hidden = false;
      return;
    }
    window.QRCode.toCanvas(canvas, otpauthUrl, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#101713", light: "#ffffff" }
    }, function (error) {
      if (!error) return;
      if (fallback) fallback.hidden = false;
    });
  }

  async function submitAdminLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const credentials = {
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
      ...(form.elements.mfaCode ? { mfaCode: form.elements.mfaCode.value.trim() } : {})
    };
    appState.pendingLogin = { email: credentials.email };
    try {
      const result = await api("/api/v1/auth/admin/login", { method: "POST", body: JSON.stringify(credentials), skipRefresh: true });
      if (result.mfaSetupRequired) {
        appState.mfaSetup = result;
        renderMfaSetup();
        return;
      }
      appState.admin = result.admin;
      appState.pendingLogin = null;
      await loadBackendData();
      render();
    } catch (error) {
      renderAdminLogin(error.message || "Sign in failed.", error.code === "MFA_REQUIRED" || Boolean(credentials.mfaCode));
    }
  }

  async function confirmMfaSetup(event) {
    event.preventDefault();
    try {
      const result = await api("/api/v1/auth/admin/mfa/confirm", { method: "POST", body: JSON.stringify({ setupToken: appState.mfaSetup.setupToken, code: event.currentTarget.elements.code.value.trim() }), skipRefresh: true });
      appState.admin = result.admin;
      appState.mfaSetup = null;
      appState.pendingLogin = null;
      await loadBackendData();
      render();
    } catch (error) {
      const node = document.querySelector(".auth-error") || document.createElement("p");
      node.className = "auth-error";
      node.textContent = error.message || "The authenticator code was not accepted.";
      document.querySelector(".auth-heading")?.after(node);
    }
  }

  function render() {
    const file = currentFile();
    if (file === "admin-info-architecture.html") return;
    const meta = pages[file] || pages["index.html"];
    document.title = meta[0] + " | BullPort Admin";
    const apiState = appState.apiOnline ? '<span class="api-status live">API connected</span>' : '<span class="api-status fallback">API unavailable</span>';
    const initials = (appState.admin?.name || "Admin").split(/\s+/).map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase();
    document.getElementById("admin-root").innerHTML = '<div class="app"><aside class="sidebar"><div class="brand"><div class="brand-mark">BP</div><div><p class="brand-title">BullPort Admin</p><p class="brand-subtitle">Broker operations console</p></div></div><nav aria-label="Admin navigation">' + buildNav() + '</nav></aside><div class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:12px;min-width:0"><button class="menu-button" type="button" data-action="toggle-menu" aria-label="Open menu">' + svg("list") + '</button><div class="top-title"><p class="eyebrow">Internal operations</p><p class="name">' + meta[0] + '</p></div></div><div class="top-actions">' + apiState + '<label class="search">' + svg("grid") + '<input data-global-search placeholder="Search clients, tickets, references..." /></label><button class="btn" type="button" data-action="open-modal" data-modal="quick-action">Quick action</button><button class="avatar" type="button" data-action="admin-logout" title="Sign out" aria-label="Sign out">' + initials + '</button></div></header><main class="content">' + mobileTabs() + '<div class="page-head"><div><h1>' + meta[0] + '</h1><p>' + meta[1] + '</p></div><div class="action-row">' + modalButton("Export", "export") + modalButton("New task", "task", "primary") + '</div></div>' + bodyFor(file) + auditPanel() + '</main></div></div><div class="toast-root" aria-live="polite"></div><div class="modal-root" data-modal-root></div>';
    bindActions();
    bindFilters();
  }

  function toast(message) {
    const root = document.querySelector(".toast-root");
    if (!root) return;
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message || "Action could not be completed.";
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
        else if (action === "toggle-menu") document.querySelector(".app")?.classList.toggle("menu-open");
        else if (action === "admin-logout") {
          try { await api("/api/v1/auth/admin/logout", { method: "POST", body: "{}" }); } catch {}
          appState.admin = null;
          appState.apiOnline = false;
          renderAdminLogin("You have signed out.", false);
        }
        else if (action === "approval-decision") openApprovalDecision(node.dataset.approvalId, node.dataset.approvalDecision);
        else if (action === "approval-confirm") submitApprovalDecision();
        else if (action === "record-decision") openRecordDecision(node.dataset);
        else if (action === "record-confirm") submitRecordDecision();
        else if (action === "report-download") downloadAdminReport(node.dataset.reportId);
        else if (action === "setting-edit") openSettingEditor(node.dataset.settingKey);
        else if (action === "setting-save") submitSetting(node.dataset.settingKey);
        else if (action === "open-modal") openModal(node.dataset.modal || "task");
        else if (action === "decision") {
          const apiAction = node.dataset.apiAction || "unsupportedDecision";
          const result = node.dataset.result || node.textContent.trim();
          const stateNode = node.closest(".review-panel")?.querySelector("[data-decision-state]");
          try {
            await executeBackendAction(apiAction);
            node.classList.add("is-confirmed");
            if (stateNode) stateNode.innerHTML = badge(result) + '<span> Action: ' + apiAction + " saved to backend</span>";
            addAudit("Now", appState.admin?.name || "Admin", (actionLabels[apiAction] || result) + " completed", pageContext());
            toast(result + ". Backend action completed.");
          } catch (error) {
            node.classList.remove("is-confirmed");
            if (stateNode) stateNode.innerHTML = badge("Not completed") + '<span>' + (error?.message || "Backend action failed") + "</span>";
            toast(error?.message || "Backend action failed.");
          }
        }
        else toast("This control is not available for the current record or role.");
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
      approveKyc: ["/api/v1/admin/kyc/" + liveRefs.kycReviewId + "/decision", { status: "APPROVED", note }],
      rejectKyc: ["/api/v1/admin/kyc/" + liveRefs.kycReviewId + "/decision", { status: "REJECTED", note }],
      requestKycResubmission: ["/api/v1/admin/kyc/" + liveRefs.kycReviewId + "/decision", { status: "RESUBMISSION_REQUIRED", note }],
      creditDeposit: ["/api/v1/admin/money/deposits/" + liveRefs.depositId + "/request-approval", { note }],
      flagDeposit: ["/api/v1/admin/money/deposits/" + liveRefs.depositId + "/flag", { note }],
      requestDepositProof: ["/api/v1/admin/money/deposits/" + liveRefs.depositId + "/request-proof", { note }],
      approveWithdrawal: ["/api/v1/admin/money/withdrawals/" + liveRefs.withdrawalId + "/request-approval", { note }],
      holdWithdrawal: ["/api/v1/admin/money/withdrawals/" + liveRefs.withdrawalId + "/hold", { note }],
      requestWithdrawalInfo: ["/api/v1/admin/money/withdrawals/" + liveRefs.withdrawalId + "/request-information", { note }],
      saveProduct: ["/api/v1/admin/portfolio-products/" + liveRefs.productId + "/status", { status: "DRAFT", note }],
      reviewProduct: ["/api/v1/admin/portfolio-products/" + liveRefs.productId + "/request-publication", { note }],
      hideProduct: ["/api/v1/admin/portfolio-products/" + liveRefs.productId + "/status", { status: "HIDDEN", note }],
      resolveSupport: ["/api/v1/admin/support/tickets/" + liveRefs.ticketId + "/resolve", { resolution: note }],
      escalateSupport: ["/api/v1/admin/support/tickets/" + liveRefs.ticketId + "/assign", { owner: "Compliance", priority: "High" }],
      sendSupportReply: ["/api/v1/admin/support/tickets/" + liveRefs.ticketId + "/messages", { body: note }]
    };
    const route = routes[apiAction];
    if (!route || route[0].indexOf("undefined") !== -1) throw new Error("No backend route is available for this action yet");
    const method = ["saveProduct", "hideProduct"].includes(apiAction) ? "PATCH" : "POST";
    await api(route[0], { method, body: JSON.stringify(route[1]) });
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
      "client-note": ["Create client note", "createClientNote", [["Client", data.clientProfile.name], ["Note type", "Compliance / finance / portfolio"], ["Note", "Record the operational note for this backend client."]]],
      "assign-task": ["Assign queue item", "assignQueueTask", [["Queue item", "Select a backend queue item"], ["Owner", "Operations"], ["Priority", "Normal"]]],
      "bulk-kyc": ["Bulk KYC action", "bulkKycDecision", [["Action", "Apply to selected backend reviews"], ["Reviewer", "Compliance"], ["Audit reason", "Record the operational decision note."]]],
      "bulk-deposit": ["Bulk deposit confirmation", "bulkCreditDeposits", [["Action", "Apply to selected backend deposits"], ["Rail", "Selected funding rails"], ["Audit reason", "Record the reconciliation note."]]],
      "bulk-withdrawal": ["Bulk withdrawal approval", "bulkApproveWithdrawals", [["Action", "Apply to selected backend withdrawals"], ["Approver", "Finance Operations"], ["Audit reason", "Record the finance review note."]]],
      product: ["Create portfolio product", "createPortfolioProduct", [["Name", "New portfolio product"], ["Risk", "Select risk level"], ["Minimum", "Set minimum amount"]]],
      "allocation-note": ["Create allocation note", "createAllocationNote", [["Client", data.clientProfile.name], ["Portfolio", data.productDetail.name], ["Note", "Record the allocation note for this backend mandate."]]],
      payout: ["Post payout", "postPayout", [["Source", "Select backend distribution source"], ["Amount", "Set payout amount"], ["Mode", "Wallet credit or reinvestment"]]],
      instrument: ["Instrument setup", "upsertInstrument", [["Symbol", "Enter symbol"], ["Category", "Select category"], ["Status", "Select status"]]],
      report: ["Generate report", "generateReport", [["Report", "Select report type"], ["Period", "Select reporting period"], ["Format", "CSV or PDF"]]],
      "report-download": ["Download report", "downloadReport", [["Report", "June 2026 Account Statement"], ["Format", "PDF"], ["Access", "Audited download"]]],
      notification: ["Create notification", "createNotification", [["Audience", "Clients with pending KYC"], ["Template", "KYC update"], ["Channel", "Dashboard notification"]]],
      "notification-preview": ["Preview notification", "previewNotification", [["Template", "KYC update"], ["Audience", "Single client"], ["Status", "Preview only"]]],
      "assign-ticket": ["Assign support ticket", "assignSupportTicket", [["Ticket", data.supportDetail.ticket], ["Owner", "Operations"], ["Priority", "Normal"]]],
      "admin-user": ["Invite admin user", "inviteAdminUser", [["Email", "operations@example.com"], ["Role", "Finance Operations"], ["Access", "Money movement only"]]],
      export: ["Export current view", "exportCurrentView", [["Format", "CSV"], ["Scope", pageContext()], ["Audit", "Required"]]],
      task: ["Create admin task", "createAdminTask", [["Title", "Follow up pending review"], ["Owner", "Operations"], ["Due", "Today"]]],
      "quick-action": ["Quick action", "createAdminTask", [["Action", "Create follow-up task"], ["Owner", "Operations"], ["Priority", "Normal"]]]
    };
    return copy[type] || copy.task;
  }

  function openApprovalDecision(id, decision) {
    const root = document.querySelector("[data-modal-root]");
    if (!root) return;
    appState.pendingApproval = { id, decision };
    root.innerHTML = '<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">Maker-checker decision</p><h2>' + (decision === "approve" ? "Approve request" : "Reject request") + '</h2></div><button class="icon-btn" type="button" data-close-modal aria-label="Close">x</button></div><div class="modal-body"><p>This decision is final for the current approval request and will be recorded in the audit trail.</p><label>Decision note<textarea name="approvalNote" placeholder="Explain the evidence and reason for this decision."></textarea></label></div><div class="modal-actions"><button class="btn" type="button" data-close-modal>Cancel</button><button class="btn ' + (decision === "approve" ? "primary" : "danger") + '" type="button" data-action="approval-confirm">' + (decision === "approve" ? "Approve" : "Reject") + '</button></div></section></div>';
    bindActions();
  }

  async function submitApprovalDecision() {
    const pending = appState.pendingApproval;
    const note = document.querySelector('[name="approvalNote"]')?.value.trim() || "";
    if (!pending || note.length < 5) { toast("Enter a clear decision note of at least five characters."); return; }
    try {
      await api("/api/v1/admin/approvals/" + pending.id + "/" + pending.decision, { method: "POST", body: JSON.stringify({ note }) });
      appState.pendingApproval = null;
      closeModal();
      await loadBackendData();
      render();
      toast("Approval request " + (pending.decision === "approve" ? "approved" : "rejected") + ".");
    } catch (error) {
      toast(error?.message || "The approval decision could not be completed.");
    }
  }

  function openRecordDecision(record) {
    const root = document.querySelector("[data-modal-root]");
    if (!root) return;
    appState.pendingRecord = { kind: record.recordKind, id: record.recordId, decision: record.recordDecision, quantity: record.recordQuantity, price: record.recordPrice };
    const fillFields = record.recordDecision === "fill" ? '<label>Execution price<input name="recordPrice" type="number" min="0.00000001" step="0.00000001" value="' + (record.recordPrice || "") + '"></label><label>Executed quantity<input name="recordQuantity" type="number" min="0.00000001" step="0.00000001" value="' + (record.recordQuantity || "") + '"></label><label>Fee<input name="recordFee" type="number" min="0" step="0.01" value="0"></label>' : "";
    root.innerHTML = '<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">Operational decision</p><h2>' + label(record.recordDecision) + ' ' + label(record.recordKind) + '</h2></div><button class="icon-btn" type="button" data-close-modal aria-label="Close">x</button></div><div class="modal-body">' + fillFields + '<label>Decision note<textarea name="recordNote" placeholder="Record the reason and supporting evidence."></textarea></label></div><div class="modal-actions"><button class="btn" type="button" data-close-modal>Cancel</button><button class="btn primary" type="button" data-action="record-confirm">Submit decision</button></div></section></div>';
    bindActions();
  }

  async function submitRecordDecision() {
    const record = appState.pendingRecord;
    const note = document.querySelector('[name="recordNote"]')?.value.trim() || "";
    if (!record || note.length < 5) { toast("Enter a decision note of at least five characters."); return; }
    try {
      if (record.kind === "order") {
        if (record.decision === "fill") {
          await api("/api/v1/admin/orders/" + record.id + "/fill", { method: "POST", body: JSON.stringify({ price: Number(document.querySelector('[name="recordPrice"]').value), quantity: Number(document.querySelector('[name="recordQuantity"]').value), fee: Number(document.querySelector('[name="recordFee"]').value), note }) });
        } else {
          await api("/api/v1/admin/orders/" + record.id + "/" + record.decision, { method: "POST", body: JSON.stringify(record.decision === "reject" ? { reason: note } : { note }) });
        }
      } else if (record.kind === "options") {
        await api("/api/v1/admin/options/applications/" + record.id + "/decision", { method: "POST", body: JSON.stringify({ status: record.decision === "approve" ? "APPROVED" : "RESTRICTED", note }) });
      }
      appState.pendingRecord = null;
      closeModal();
      await loadBackendData();
      render();
      toast("Operational decision completed.");
    } catch (error) {
      toast(error?.message || "The decision could not be completed.");
    }
  }

  async function downloadAdminReport(id) {
    if (!id) { toast("This report does not have a downloadable record."); return; }
    try {
      const response = await fetch(appState.apiBase + "/api/v1/admin/reports/" + encodeURIComponent(id) + "/download", { credentials: "include" });
      if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload.error?.message || "Report download failed"); }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "bullport-admin-report.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      toast("Report download started.");
    } catch (error) {
      toast(error?.message || "The report could not be downloaded.");
    }
  }

  function openSettingEditor(key) {
    const root = document.querySelector("[data-modal-root]");
    const setting = data.settingsRows.find((row) => row.key === key);
    if (!root || !setting) return;
    root.innerHTML = '<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">Platform setting</p><h2>' + setting.key + '</h2></div><button class="icon-btn" type="button" data-close-modal aria-label="Close">x</button></div><div class="modal-body"><label>JSON value<textarea name="settingValue">' + escapeHtml(JSON.stringify(setting.value, null, 2)) + '</textarea></label><label>Description<textarea name="settingDescription">' + escapeHtml(setting.description || "") + '</textarea></label></div><div class="modal-actions"><button class="btn" type="button" data-close-modal>Cancel</button><button class="btn primary" type="button" data-action="setting-save" data-setting-key="' + setting.key + '">Save setting</button></div></section></div>';
    bindActions();
  }

  async function submitSetting(key) {
    try {
      const root = document.querySelector("[data-modal-root]");
      const raw = root?.querySelector("[name=settingValue]")?.value || "";
      const description = root?.querySelector("[name=settingDescription]")?.value.trim() || undefined;
      let value;
      try { value = JSON.parse(raw); } catch { throw new Error("Setting value must be valid JSON."); }
      await api("/api/v1/admin/settings/" + encodeURIComponent(key), { method: "PUT", body: JSON.stringify({ value, description }) });
      await loadBackendData();
      closeModal();
      render();
      toast("Platform setting updated.");
    } catch (error) {
      toast(error?.message || "The setting could not be updated.");
    }
  }

  function openModal(type) {
    const root = document.querySelector("[data-modal-root]");
    if (!root) return;
    const modal = modalContent(type);
    root.innerHTML = '<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">Operational action</p><h2>' + modal[0] + '</h2></div><button class="icon-btn" type="button" data-close-modal aria-label="Close">x</button></div><div class="modal-body">' + modal[2].map((row, index) => '<label>' + row[0] + '<input name="field' + index + '" data-field-label="' + row[0] + '" value="' + row[1] + '" /></label>').join("") + '<label>Internal note<textarea name="internalNote">Record the reason and any relevant evidence for this operation.</textarea></label></div><div class="modal-actions"><button class="btn" type="button" data-close-modal>Cancel</button><button class="btn primary" type="button" data-submit-modal="' + modal[1] + '">Submit action</button></div></section></div>';
    bindActions();
  }

  function closeModal() {
    const root = document.querySelector("[data-modal-root]");
    if (root) root.innerHTML = "";
  }

  async function submitModal(apiAction) {
    try {
      const modal = document.querySelector(".modal");
      const values = Array.from(modal?.querySelectorAll("input[data-field-label]") || []).map((input) => input.value.trim());
      const note = modal?.querySelector("textarea[name=internalNote]")?.value.trim() || "Submitted through the BullPort admin console.";
      if (apiAction === "createClientNote" && liveRefs.clientId) {
        await api("/api/v1/admin/clients/" + liveRefs.clientId + "/notes", {
          method: "POST",
          body: JSON.stringify({ category: values[1] || "Admin note", body: values[2] || note })
        });
      } else if (apiAction === "assignSupportTicket" && liveRefs.ticketId) {
        await api("/api/v1/admin/support/tickets/" + liveRefs.ticketId + "/assign", {
          method: "POST",
          body: JSON.stringify({ owner: values[1] || "Finance", priority: /urgent/i.test(values[2]) ? "Urgent" : /high/i.test(values[2]) ? "High" : "Normal" })
        });
      } else if (["createAdminTask", "assignQueueTask"].includes(apiAction)) {
        await api("/api/v1/admin/tasks", { method: "POST", body: JSON.stringify({ title: values[0] || "Operational follow-up", description: note, category: pageContext(), priority: values.some((value) => /high|urgent/i.test(value)) ? "High" : "Normal" }) });
      } else if (apiAction === "createPortfolioProduct") {
        const risk = /high/i.test(values[1]) ? "HIGH" : /low/i.test(values[1]) ? "LOW" : /custom/i.test(values[1]) ? "CUSTOM" : "MODERATE";
        await api("/api/v1/admin/portfolio-products", { method: "POST", body: JSON.stringify({ name: values[0], description: note.length >= 10 ? note : "Broker managed portfolio product", riskLevel: risk, minimum: Number(String(values[2]).replace(/[^0-9.]/g, "")), currency: "USD", payoutRule: "Quarterly", disclosure: "Returns are projected and market-based. Capital and income are not guaranteed.", eligibility: {} }) });
      } else if (apiAction === "upsertInstrument") {
        await api("/api/v1/admin/instruments", { method: "POST", body: JSON.stringify({ symbol: values[0], name: values[0] + " instrument", category: values[1] || "Stock", market: "Global", currency: "USD", riskLevel: "MODERATE", tradable: /tradable/i.test(values[2]), investable: true, status: "ACTIVE" }) });
      } else if (["generateReport", "exportCurrentView"].includes(apiAction)) {
        await api("/api/v1/admin/reports", { method: "POST", body: JSON.stringify({ name: values[0] || pageContext() + " export", type: /audit/i.test(pageContext()) ? "AUDIT" : /kyc/i.test(pageContext()) ? "KYC" : /deposit/i.test(pageContext()) ? "DEPOSITS" : /withdraw/i.test(pageContext()) ? "WITHDRAWALS" : /investment/i.test(pageContext()) ? "INVESTMENTS" : "CLIENTS", format: /pdf/i.test(values[2]) ? "PDF" : "CSV", period: values[1] || "Current view", filters: {} }) });
      } else if (apiAction === "createNotification") {
        await api("/api/v1/admin/notifications", { method: "POST", body: JSON.stringify({ audience: /pending kyc/i.test(values[0]) ? "PENDING_KYC" : "ALL", title: values[1] || "BullPort account update", body: note, category: "Account", actionUrl: "notifications.html", email: true }) });
      } else if (apiAction === "inviteAdminUser") {
        const email = values[0];
        const role = /finance/i.test(values[1]) ? "FINANCE" : /compliance/i.test(values[1]) ? "COMPLIANCE" : /portfolio/i.test(values[1]) ? "PORTFOLIO_MANAGER" : /support/i.test(values[1]) ? "SUPPORT" : /audit/i.test(values[1]) ? "AUDITOR" : "SUPPORT";
        const result = await api("/api/v1/admin/admin-users", { method: "POST", body: JSON.stringify({ name: email.split("@")[0].replace(/[._-]/g, " "), email, role }) });
        toast("Admin created. Temporary password: " + result.temporaryPassword);
      } else {
        throw new Error("This action needs a complete operational record before it can be submitted.");
      }
      await loadBackendData();
      addAudit("Now", appState.admin?.name || "Admin", "Submitted " + apiAction, pageContext());
      closeModal();
      toast(apiAction + " saved to backend.");
    } catch (error) {
      toast(error?.message || "The operation could not be completed.");
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
    renderSessionLoading();
    try {
      appState.admin = await api("/api/v1/auth/admin/me", { skipRefresh: false });
      await loadBackendData();
      render();
    } catch (error) {
      appState.admin = null;
      appState.apiOnline = false;
      renderAdminLogin(error?.status === 401 ? "" : (error?.message || "The admin service is unavailable."), false);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
