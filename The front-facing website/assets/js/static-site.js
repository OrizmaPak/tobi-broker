(function () {
  const data = window.APP_STATIC_DATA;
  if (!data) return;

  const body = document.body;
  const base = body.dataset.base || "";
  const page = body.dataset.page || detectPage();
  const marketIntervals = [];
  const loaderStartedAt = Date.now();
  let appInitialized = false;
  let loaderReleased = false;

  function detectPage() {
    const file = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
    return file === "index" || file === "" ? "home" : file;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function link(path) {
    if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path || "#";
    if (base === "../") {
      if (path.startsWith("pages/")) return path.replace("pages/", "");
      return "../" + path;
    }
    return path;
  }

  function asset(path) {
    if (!path || /^(https?:|data:)/.test(path)) return path || "";
    return base + path;
  }

  function phoneHref() {
    return String(data.brand.phone || "").replace(/[^\d+]/g, "");
  }

  function appDomain() {
    return data.brand.email.split("@")[1] || "[app-domain].com";
  }

  function currentFile() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function formatPrice(value, assetClass) {
    const safe = Number(value || 0);
    const digits = safe >= 1000 ? 2 : safe >= 100 ? 2 : safe >= 10 ? 2 : 3;
    const prefix = assetClass === "Index" ? "" : "$";
    return `${prefix}${safe.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })}`;
  }

  function formatPercent(value) {
    const safe = Number(value || 0);
    return `${safe >= 0 ? "+" : ""}${safe.toFixed(2)}%`;
  }

  function riskClass(value) {
    const text = String(value || "").toLowerCase();
    if (text.includes("low")) return "low";
    if (text.includes("high") || text.includes("custom")) return "high";
    return "medium";
  }

  const logoAssets = {
    main: "wp-content/uploads/2025/09/logo-1.png",
    light: "wp-content/uploads/2025/09/footer-v1-logo-1.png",
    mobile: "wp-content/uploads/2025/08/mobile-nav-logo-1.png"
  };

  function logo(light, variant = "main") {
    const src = variant === "mobile" ? logoAssets.mobile : light ? logoAssets.light : logoAssets.main;
    return `
      <span class="app-brand-logo ${light ? "app-brand-logo--light" : ""}">
        <img src="${link(src)}" alt="${escapeHtml(data.brand.name)}" loading="eager">
      </span>`;
  }

  function releasePageLoader(force = false) {
    if (loaderReleased || !appInitialized) return;
    if (!force && document.readyState !== "complete") return;

    const minimumVisibleMs = 650;
    const elapsed = Date.now() - loaderStartedAt;
    const delay = force ? 0 : Math.max(0, minimumVisibleMs - elapsed);

    loaderReleased = true;
    window.setTimeout(() => {
      body.classList.add("app-ready");
    }, delay);
  }

  function currentFor(item) {
    const file = currentFile();
    const itemFile = (item.href || "").split("/").pop();
    if (page === "home" && item.href === "index.html") return true;
    if (itemFile === file) return true;
    return Boolean(item.children && item.children.some((child) => child.href.split("/").pop() === file));
  }

  function menuHtml(items, mode) {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length;
      const classes = [
        "menu-item",
        "nav-item",
        hasChildren ? "dropdown" : "",
        currentFor(item) ? "current" : ""
      ].filter(Boolean).join(" ");
      const children = hasChildren
        ? `<ul>${item.children.map((child) => `<li><a href="${link(child.href)}">${escapeHtml(child.label)}</a></li>`).join("")}</ul>`
        : "";
      const toggle = mode === "mobile" && hasChildren ? "<button aria-label=\"Open submenu\" type=\"button\">+</button>" : "";
      return `<li class="${classes}"><a href="${link(item.href)}">${escapeHtml(item.label)}${toggle}</a>${children}</li>`;
    }).join("");
  }

  function staticNavHtml() {
    return data.navigation.map((item) => {
      const hasChildren = item.children && item.children.length;
      const classes = [
        currentFor(item) ? "current" : "",
        hasChildren ? "dropdown" : ""
      ].filter(Boolean).join(" ");
      const children = hasChildren
        ? `<ul>${item.children.map((child) => `<li><a href="${link(child.href)}">${escapeHtml(child.label)}</a></li>`).join("")}</ul>`
        : "";
      return `<li class="${classes}"><a href="${link(item.href)}">${escapeHtml(item.label)}</a>${children}</li>`;
    }).join("");
  }

  function getZonedDateParts(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((part) => [part.type, part.value])
    );
    const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      weekday: weekdayMap[parts.weekday],
      hour: Number(parts.hour),
      minute: Number(parts.minute),
      second: Number(parts.second)
    };
  }

  function formatMarketCountdown(totalSeconds) {
    const safe = Math.max(0, totalSeconds);
    const totalMinutes = Math.floor(safe / 60);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days}d : ${hours}h`;
    if (hours > 0) return `${hours}h : ${String(minutes).padStart(2, "0")}m`;
    return `${minutes}m`;
  }

  function getMarketStatus(now = new Date()) {
    const schedule = data.brand.marketHours;
    if (!schedule) return null;
    const zoned = getZonedDateParts(now, schedule.timeZone);
    const currentSecond = (((zoned.weekday * 24) + zoned.hour) * 60 + zoned.minute) * 60 + zoned.second;
    const openSecond = (((schedule.openDay * 24) + schedule.openHour) * 60 + (schedule.openMinute || 0)) * 60;
    const closeSecond = (((schedule.closeDay * 24) + schedule.closeHour) * 60 + (schedule.closeMinute || 0)) * 60;
    const weekSeconds = 7 * 24 * 60 * 60;
    const isOpen = currentSecond >= openSecond && currentSecond < closeSecond;
    const remainingSeconds = isOpen
      ? closeSecond - currentSecond
      : currentSecond < openSecond
        ? openSecond - currentSecond
        : (weekSeconds - currentSecond) + openSecond;

    return {
      isOpen,
      label: isOpen ? "Market Open" : "Market Closed",
      detail: isOpen
        ? `- Closes in ${formatMarketCountdown(remainingSeconds)}`
        : `- Opens in ${formatMarketCountdown(remainingSeconds)}`
    };
  }

  function updateMarketStatus() {
    const status = getMarketStatus();
    if (!status) return;

    document.querySelectorAll("[data-market-status-label]").forEach((node) => {
      node.textContent = status.label;
    });
    document.querySelectorAll("[data-market-status-detail]").forEach((node) => {
      node.textContent = status.detail;
    });
    document.querySelectorAll(".elementor-element-7572766 .elementor-icon-list-text").forEach((node) => {
      node.textContent = status.label;
    });
    document.querySelectorAll(".elementor-element-31c00f5 .elementor-heading-title").forEach((node) => {
      node.textContent = status.detail;
    });
  }

  function startMarketStatusClock() {
    updateMarketStatus();
    window.setInterval(updateMarketStatus, 30000);
  }

  function replaceBrandText() {
    const replacements = [
      [/\[APP_NAME\]/g, data.brand.name],
      [/BullPort/gi, data.brand.name],
      [/ForTradex/gi, data.brand.name],
      [/support@bullport\.com/gi, data.brand.email],
      [/bullport\.com/gi, appDomain()],
      [/ThemeForest/gi, ""],
      [/\bLorem\b/gi, ""],
      [/Tailstoi Town/gi, data.brand.address],
      [/\bLa city\b/gi, data.brand.address],
      [/\bLA city\b/g, data.brand.address]
    ];

    replacements.forEach(([pattern, value]) => {
      document.title = document.title.replace(pattern, value);
    });

    document.querySelectorAll("[alt], [title], [placeholder]").forEach((node) => {
      replacements.forEach(([pattern, value]) => {
        if (node.alt) node.alt = node.alt.replace(pattern, value);
        if (node.title) node.title = node.title.replace(pattern, value);
        if (node.placeholder) node.placeholder = node.placeholder.replace(pattern, value);
      });
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach(([pattern, replacement]) => {
        value = value.replace(pattern, replacement);
      });
      node.nodeValue = value;
    });
  }

  function replaceLogos() {
    const selectors = [
      ".header-logo-box-style1 a",
      ".main-header-style1__logo a",
      ".mobile-nav__content .logo-box a"
    ];
    document.querySelectorAll(selectors.join(",")).forEach((anchor) => {
      const isMobileLogo = Boolean(anchor.closest(".mobile-nav__content"));
      anchor.href = link("index.html");
      anchor.removeAttribute("title");
      anchor.innerHTML = logo(isMobileLogo, isMobileLogo ? "mobile" : "main");
    });
  }

  function renderThemeMenu() {
    const desktopMenu = document.getElementById("menu-main-menu");
    if (desktopMenu) {
      desktopMenu.className = "main-menu__list navbar-nav d-flex";
      desktopMenu.innerHTML = menuHtml(data.navigation, "desktop");
      desktopMenu.querySelectorAll(".bullport-mega-menu-content, .mega-menu").forEach((menu) => menu.remove());
      desktopMenu.querySelectorAll(".has-mega-menu, .megamenu-link").forEach((node) => {
        node.classList.remove("has-mega-menu", "megamenu-link");
      });
    }

    const mobileMenu = document.querySelector(".mobile-nav__container");
    if (mobileMenu) {
      mobileMenu.innerHTML = `<ul class="main-menu__list">${menuHtml(data.navigation, "mobile")}</ul>`;
    }

    document.querySelectorAll(".main-header-style1__phn-title a").forEach((anchor) => {
      anchor.href = link("pages/contact.html");
      anchor.innerHTML = "Book a Call <i class=\"icon-right-arrow\"></i>";
    });

    document.querySelectorAll(".faq-style1__left-btn a").forEach((anchor) => {
      if (anchor.closest(".elementor-218")) {
        anchor.href = link("pages/faqs.html");
        anchor.textContent = "Read FAQs";
      } else {
        anchor.href = link("pages/login.html");
        anchor.textContent = "Login";
      }
    });
  }

  function updateContactLinks() {
    document.querySelectorAll('a[href^="mailto:"]').forEach((anchor) => {
      anchor.href = `mailto:${data.brand.email}`;
      if (anchor.textContent.trim()) anchor.textContent = data.brand.email;
    });

    document.querySelectorAll('a[href^="tel:"]').forEach((anchor) => {
      anchor.href = `tel:${phoneHref()}`;
      if (anchor.textContent.trim()) anchor.textContent = data.brand.phone;
    });
  }

  function renderStaticHeader() {
    const mount = document.getElementById("static-header");
    if (!mount) return;

    const icons = {
      chat: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M28.862 2.982c-0.298-0.253-0.694-0.363-1.081-0.298l-24 4c-0.353 0.059-0.667 0.256-0.872 0.548-0.204 0.292-0.285 0.654-0.22 1.005l2.667 14.667c0.126 0.696 0.77 1.171 1.477 1.085l3.272-0.409 0.573 4.585c0.061 0.49 0.388 0.905 0.849 1.081 0.154 0.059 0.314 0.087 0.474 0.087 0.318 0 0.63-0.114 0.878-0.33l7.693-6.731 7.595-0.949c0.667-0.083 1.168-0.65 1.168-1.323v-16c0-0.392-0.172-0.764-0.471-1.018zM26.667 18.823l-6.832 0.854c-0.264 0.033-0.512 0.145-0.712 0.32l-6.111 5.346-0.427-3.416c-0.085-0.674-0.659-1.168-1.322-1.168-0.055 0-0.111 0.003-0.167 0.010l-3.344 0.418-2.199-12.095 21.113-3.518zM12.095 16.495c-0.065-0.163-0.095-0.33-0.095-0.495 0-0.529 0.316-1.030 0.839-1.239l6.667-2.667c0.677-0.271 1.46 0.059 1.733 0.743 0.065 0.163 0.095 0.33 0.095 0.495 0 0.529-0.316 1.030-0.839 1.239l-6.667 2.667c-0.161 0.064-0.329 0.096-0.495 0.096-0.529 0-1.030-0.318-1.238-0.839z"></path></svg>`,
      facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M18.125 31.938h-5.125c-0.856 0-1.552-0.696-1.552-1.552v-11.559h-2.99c-0.856 0-1.552-0.697-1.552-1.552v-4.953c0-0.856 0.696-1.552 1.552-1.552h2.99v-2.48c0-2.459 0.772-4.551 2.233-6.050 1.467-1.506 3.518-2.301 5.93-2.301l3.908 0.006c0.855 0.001 1.55 0.698 1.55 1.552v4.599c0 0.856-0.696 1.552-1.552 1.552l-2.631 0.001c-0.802 0-1.007 0.161-1.051 0.21-0.072 0.082-0.158 0.313-0.158 0.951v1.959h3.642c0.274 0 0.54 0.068 0.768 0.195 0.492 0.275 0.799 0.795 0.799 1.358l-0.002 4.953c0 0.855-0.696 1.552-1.552 1.552h-3.654v11.559c0 0.856-0.697 1.552-1.552 1.552z"></path></svg>`,
      x: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M18.979 13.55l11.657-13.55h-2.762l-10.121 11.765-8.084-11.765h-9.324l12.225 17.791-12.225 14.209h2.762l10.688-12.424 8.537 12.424h9.324l-12.678-18.45z"></path></svg>`,
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M23.169 0h-14.338c-4.869 0-8.831 3.962-8.831 8.831v14.338c0 4.869 3.961 8.831 8.831 8.831h14.338c4.87 0 8.831-3.962 8.831-8.831v-14.338c0-4.869-3.961-8.831-8.831-8.831z"></path><path d="M16 7.755c-4.547 0-8.246 3.699-8.246 8.246s3.699 8.245 8.246 8.245 8.246-3.699 8.246-8.245c0-4.547-3.699-8.246-8.246-8.246z"></path></svg>`,
      youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 28.5c-4.072 0-7.645-0.266-9.926-0.489-2.887-0.283-5.188-2.484-5.594-5.354-0.64-4.546-0.64-8.768 0-13.313 0.406-2.87 2.707-5.072 5.594-5.354 2.281-0.223 5.854-0.489 9.926-0.489s7.645 0.266 9.926 0.489c2.887 0.283 5.188 2.484 5.594 5.354 0.64 4.546 0.64 8.768 0 13.313-0.406 2.87-2.707 5.072-5.594 5.354-2.281 0.223-5.854 0.489-9.926 0.489z"></path></svg>`,
      clock: `<svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm61.8 343.6l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>`,
      play: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M29.001 13.719l-23.396-13.374c-0.403-0.23-0.852-0.345-1.301-0.345-0.449 0-0.898 0.115-1.301 0.345-0.81 0.47-1.308 1.335-1.308 2.271v26.747c0 0.936 0.498 1.801 1.308 2.271 0.403 0.23 0.852 0.345 1.301 0.345s0.898-0.115 1.301-0.345l23.396-13.374c0.818-0.468 1.323-1.337 1.323-2.281s-0.505-1.812-1.323-2.28z"></path></svg>`,
      apple: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M24.768 17.937c-0.88-4.43 3.325-7.028 3.325-7.028s-1.638-2.37-4.392-2.98c-2.752-0.611-4.129 0.152-5.504 0.725-1.376 0.574-2.063 0.574-2.063 0.574-1.986 0-3.437-2.102-7.22-1.145-2.606 0.658-5.35 3.667-5.846 7.258-0.496 3.592 0.574 8.176 2.637 11.729 2.063 3.555 4.164 4.891 5.655 4.93 1.491 0.037 2.98-1.068 4.775-1.338 1.796-0.266 2.902 0.651 4.663 1.147 1.755 0.494 2.37 0.036 4.392-1.684 2.027-1.719 3.862-6.651 3.862-6.651s-3.403-1.104-4.283-5.537z"></path></svg>`
    };

    mount.innerHTML = `
      <header class="app-static-header app-template-header">
        <div class="app-template-header__top">
          <div class="static-container app-template-header__top-inner">
            <div class="app-template-header__top-left">
              <a class="app-template-header__chat" href="${link("pages/contact.html")}">
                <span class="app-template-header__icon" aria-hidden="true">${icons.chat}</span>
                <strong>LET'S CHAT -</strong>
                <span>Get Instant Support!</span>
              </a>
              <div class="app-template-header__social" aria-label="Social links">
                <a href="https://www.facebook.com/" aria-label="Facebook">${icons.facebook}</a>
                <a href="https://www.x.com/" aria-label="X">${icons.x}</a>
                <a href="https://www.instagram.com/" aria-label="Instagram">${icons.instagram}</a>
                <a href="https://www.youtube.com/" aria-label="YouTube">${icons.youtube}</a>
              </div>
            </div>
            <div class="app-template-header__top-right">
              <span class="app-template-header__market"><span class="app-template-header__icon" aria-hidden="true">${icons.clock}</span> <span data-market-status-label>Market Open</span> <strong data-market-status-detail>- Closes in 5h : 30m</strong></span>
              <a class="app-template-header__store app-template-header__store--play" href="https://play.google.com/store/" target="_blank" rel="noreferrer"><span class="app-template-header__icon" aria-hidden="true">${icons.play}</span> Play Store</a>
              <a class="app-template-header__store" href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer"><span class="app-template-header__icon" aria-hidden="true">${icons.apple}</span> App Store</a>
            </div>
          </div>
        </div>
        <div class="app-template-header__main">
          <div class="static-container app-static-header__inner">
            <div class="app-static-header__left">
              <a class="app-static-header__logo" href="${link("index.html")}" aria-label="${escapeHtml(data.brand.name)} home">${logo(false)}</a>
              <nav class="app-static-header__nav" aria-label="Primary navigation">
                <ul class="app-static-nav">${staticNavHtml()}</ul>
              </nav>
            </div>
            <div class="app-static-header__right">
              <div class="app-header-tools">
                <a class="app-header-callout" href="${link("pages/contact.html")}">
                  <span class="app-header-callout__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M30.06 22.26L26.04 18.8C25.48 18.28 24.81 18.03 24.12 18.05C22.85 18.11 21.94 19.11 21.86 19.2C21.53 19.55 21.13 19.73 20.61 19.74C19.23 19.78 17.2 18.69 15.2 16.8C13.19 14.95 11.95 13.01 11.9 11.61C11.88 11.1 12.03 10.68 12.34 10.35C12.45 10.24 13.38 9.26 13.35 8C13.34 7.3 13.03 6.66 12.5 6.16L8.74 2.36C8.17 1.82 7.41 1.56 6.63 1.57C5.84 1.6 5.11 1.93 4.58 2.5L2.4 4.84C1.41 5.9 0.94 7.25 1.02 8.83C1.2 12.54 4.56 17.62 9.97 22.38C15.07 27.42 20.31 30.41 24.01 30.41H24.15C25.73 30.38 27.04 29.82 28.03 28.76L30.21 26.42C31.32 25.23 31.25 23.36 30.06 22.26Z" fill="#24B124"></path><path d="M17.95 13.75C18.05 13.85 18.16 13.92 18.27 13.97C18.39 14.02 18.52 14.05 18.65 14.05H24.76C25.31 14.05 25.76 13.6 25.76 13.05C25.76 12.5 25.31 12.05 24.76 12.05H21.07L26.9 6.22C27.29 5.83 27.29 5.2 26.9 4.81C26.51 4.42 25.88 4.42 25.49 4.81L19.66 10.64V6.95C19.66 6.4 19.21 5.95 18.66 5.95C18.11 5.95 17.66 6.4 17.66 6.95V13.06C17.66 13.19 17.69 13.32 17.74 13.44C17.79 13.56 17.86 13.67 17.96 13.76L17.95 13.75Z" fill="#24B124"></path></svg>
                  </span>
                  <span class="app-header-callout__text">
                    <span>Let us discuss investing</span>
                    <strong>Book a Call</strong>
                  </span>
                </a>
                <div class="app-header-actions">
                  <a href="${link("pages/login.html")}">Login</a>
                </div>
                <a class="app-header-search" href="${link("pages/register.html")}" aria-label="Create account">
                  <span>Get Started</span>
                  <span class="app-header-search__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M15.667 9.333C15.667 9.884 15.218 10.333 14.667 10.333C12.278 10.333 10.334 12.277 10.334 14.666C10.334 15.217 9.885 15.666 9.334 15.666C8.783 15.666 8.334 15.217 8.334 14.666C8.334 11.175 11.176 8.333 14.667 8.333C15.218 8.333 15.667 8.782 15.667 9.333ZM28.04 28.04C27.844 28.236 27.589 28.333 27.333 28.333C27.077 28.333 26.822 28.235 26.626 28.04L21.699 23.113C19.79 24.704 17.339 25.666 14.666 25.666C8.602 25.666 3.666 20.73 3.666 14.666C3.666 8.602 8.602 3.666 14.666 3.666C20.73 3.666 25.666 8.602 25.666 14.666C25.666 17.339 24.706 19.79 23.113 21.699L28.04 26.626C28.431 27.017 28.431 27.65 28.04 28.039V28.04ZM14.667 23.667C19.629 23.667 23.667 19.629 23.667 14.667C23.667 9.705 19.629 5.667 14.667 5.667C9.705 5.667 5.667 9.705 5.667 14.667C5.667 19.629 9.705 23.667 14.667 23.667Z" fill="#1F251E"></path></svg>
                  </span>
                </a>
              </div>
              <button class="app-mobile-toggle" type="button" aria-label="Open navigation"><span></span><span></span><span></span></button>
            </div>
          </div>
        </div>
      </header>
      <div class="app-mobile-panel" aria-hidden="true">
        <div class="app-mobile-panel__head">
          <a href="${link("index.html")}" aria-label="${escapeHtml(data.brand.name)} home">${logo(true)}</a>
          <button class="app-mobile-panel__close" type="button" aria-label="Close navigation">X</button>
        </div>
        <ul class="main-menu__list app-mobile-panel__nav">${menuHtml(data.navigation, "mobile")}</ul>
        <div class="app-mobile-panel__actions">
          <a href="${link("pages/login.html")}">Login</a>
          <a href="${link("pages/register.html")}">Get Started</a>
        </div>
      </div>
      <button class="app-mobile-panel-backdrop" type="button" aria-label="Close navigation"></button>`;

    const panel = mount.querySelector(".app-mobile-panel");
    const backdrop = mount.querySelector(".app-mobile-panel-backdrop");
    const openButton = mount.querySelector(".app-mobile-toggle");
    const closeButton = mount.querySelector(".app-mobile-panel__close");

    const setOpen = (open) => {
      panel.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("app-nav-open", open);
    };

    openButton.addEventListener("click", () => setOpen(true));
    closeButton.addEventListener("click", () => setOpen(false));
    backdrop.addEventListener("click", () => setOpen(false));
    panel.querySelectorAll(".dropdown > a > button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        button.closest(".dropdown").classList.toggle("expanded");
      });
    });
  }

  function footerHtml() {
    return `
      <footer class="app-footer">
        <div class="static-container">
          <div class="app-footer__grid">
            <div>
              <a href="${link("index.html")}" aria-label="${escapeHtml(data.brand.name)} home">${logo(true)}</a>
              <p style="margin-top:22px;">A public-facing multi-asset investment website for portfolios, market discovery, risk education, fee visibility and future client onboarding.</p>
              <p class="app-footer__risk">${escapeHtml(data.brand.risk)}</p>
            </div>
            <div>
              <h2>Navigation</h2>
              <ul class="app-footer__links">
                ${data.footerNavigation.map((item) => `<li><a href="${link(item.href)}">${escapeHtml(item.label)}</a></li>`).join("")}
              </ul>
            </div>
            <div>
              <h2>Support</h2>
              <ul>
                <li><a href="mailto:${escapeHtml(data.brand.email)}">${escapeHtml(data.brand.email)}</a></li>
                <li><a href="tel:${escapeHtml(phoneHref())}">${escapeHtml(data.brand.phone)}</a></li>
                <li>${escapeHtml(data.brand.address)}</li>
                <li>${escapeHtml(data.brand.supportHours)}</li>
              </ul>
              <p style="margin-top:18px;"><a class="static-button" href="${link("pages/contact.html")}">Speak to Support</a></p>
            </div>
          </div>
          <div class="app-footer__bottom">
            <span>&copy; 2026 ${escapeHtml(data.brand.name)}. All Rights Reserved.</span>
            <span>Static frontend only. Regulatory and jurisdiction-specific disclosures should be verified before launch.</span>
          </div>
        </div>
      </footer>`;
  }

  function renderFooter() {
    const mount = document.getElementById("static-footer");
    if (mount) {
      mount.innerHTML = footerHtml();
      return;
    }

    if (page === "home" && document.querySelector(".elementor-218")) {
      document.querySelectorAll(".app-footer").forEach((footer) => footer.remove());
      enhanceTemplateFooter();
      return;
    }

    const footerLogo = document.querySelector("img[src*='footer-v1-logo']");
    const oldFooter = footerLogo ? footerLogo.closest(".elementor-element.e-parent") : null;
    if (oldFooter) oldFooter.classList.add("static-hidden");
    if (!document.querySelector(".app-footer")) document.body.insertAdjacentHTML("beforeend", footerHtml());
  }

  function remapLegacyLinks() {
    const legacyMap = {
      "all-markets/index.html": "pages/markets.html",
      "all-markets/stocks/index.html": "pages/stocks-etfs.html",
      "all-markets/commodities/index.html": "pages/commodities.html",
      "our-accounts/index.html": "pages/portfolios.html",
      "education/index.html": "pages/education.html",
      "faqs/index.html": "pages/faqs.html",
      "contact/index.html": "pages/contact.html",
      "about-company/index.html": "pages/about.html",
      "platform/index.html": "pages/how-it-works.html",
      "wp-login.html": "pages/login.html",
      "register/index.html": "pages/register.html"
    };

    document.querySelectorAll("a[href]").forEach((anchor) => {
      const raw = anchor.getAttribute("href");
      if (!raw || /^(https?:|mailto:|tel:|#)/.test(raw)) return;
      const clean = raw.replace(/^\.\//, "");
      if (legacyMap[clean]) anchor.setAttribute("href", link(legacyMap[clean]));
    });
  }

  function setLinkedText(anchor, href, text) {
    if (!anchor) return;
    anchor.href = link(href);
    anchor.textContent = text;
  }

  function setIconButton(anchor, href, text, iconClass) {
    if (!anchor) return;
    anchor.href = link(href);
    anchor.innerHTML = `<i class="${iconClass || "icon-right-arrow"}"></i>${escapeHtml(text)}`;
  }

  function setSplitLink(anchor, href, first, second) {
    if (!anchor) return;
    anchor.href = link(href);
    anchor.innerHTML = `${escapeHtml(first)} <br> ${escapeHtml(second)}`;
  }

  function replaceTextNodes(replacements) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach(([from, to]) => {
        if (value.includes(from)) value = value.replaceAll(from, to);
      });
      node.nodeValue = value;
    });
  }

  function updateHero() {
    document.querySelectorAll(".main-slider-style1 .swiper-slide").forEach((slide, index) => {
      const item = data.heroSlides[index % data.heroSlides.length];
      const eyebrow = slide.querySelector(".main-slider-style1__content-sub-title h6");
      const title = slide.querySelector(".main-slider-style1__content-big-title h2");
      const text = slide.querySelector(".main-slider-style1__content-text p");
      const cta = slide.querySelector(".main-slider-style1__content-btn a");
      if (eyebrow) eyebrow.textContent = item.eyebrow;
      if (title) title.textContent = item.title;
      if (text) text.textContent = item.text;
      if (cta) {
        cta.href = link(item.href);
        cta.innerHTML = `<i class="icon-right-arrow"></i>${escapeHtml(item.cta)}`;
      }
    });
  }

  function updateTemplateTradingCards() {
    const items = [
      {
        title: "Managed Portfolios",
        eyebrow: "Portfolio",
        text: "Income, balanced, commodity, dividend, growth and premium mandates with clear risk language.",
        href: "pages/portfolios.html"
      },
      {
        title: "Multi-Asset Markets",
        eyebrow: "Markets",
        text: "Stocks, ETFs, bonds, commodities, indices and options education organized for investor discovery.",
        href: "pages/markets.html"
      },
      {
        title: "Pricing and Risk",
        eyebrow: "Disclosure",
        text: "Fees, reporting, risk disclosures and account-readiness information before any portal activity begins.",
        href: "pages/pricing-fees.html"
      }
    ];

    document.querySelectorAll(".trading-style1__single").forEach((card, index) => {
      const item = items[index % items.length];
      setLinkedText(card.querySelector(".trading-style1__content-title a"), item.href, item.title);
      const text = card.querySelector(".trading-style1__content-text p");
      const eyebrow = card.querySelector(".trading-style1__content-text-overlay h2");
      if (text) text.textContent = item.text;
      if (eyebrow) eyebrow.textContent = item.eyebrow;
      setIconButton(card.querySelector(".trading-style1__content-btn a"), item.href, "Learn More");
    });
  }

  function updateTemplateFacts() {
    const facts = [
      { label: "Active Investors", text: "Investor benefits across markets.", value: "3.9", unit: "m" },
      { label: "Assets Monitored", text: "Illustrative platform assets reviewed.", value: "86.4", unit: "m" },
      { label: "Instruments", text: "Stocks, ETFs, bonds, commodities and options education.", value: "50", unit: "+" },
      { label: "Client Success", text: "Suitability-first onboarding and support.", value: "95", unit: "%" }
    ];

    document.querySelectorAll(".single-about-style1__fact").forEach((fact, index) => {
      const item = facts[index % facts.length];
      const label = fact.querySelector(".about-style1__fact-category h6");
      const text = fact.querySelector(".about-style1__fact-text p");
      const count = fact.querySelector(".about-style1__fact-odometer .odometer");
      const unit = fact.querySelector(".about-style1__fact-odometer .m-percent");
      if (label) label.textContent = item.label;
      if (text) text.textContent = item.text;
      if (count) {
        count.dataset.count = item.value;
        count.textContent = item.value;
      }
      if (unit) unit.textContent = item.unit;
    });
  }

  function updatePortfolioCardsFromTemplate() {
    const grid = document.querySelector('[data-id="f10acd0"]');
    if (!grid) return;

    let widgets = Array.from(grid.children).filter((child) => child.classList.contains("elementor-widget-bullport_account_card"));
    if (!widgets.length) return;

    data.portfolios.forEach((portfolio, index) => {
      if (!widgets[index]) {
        const clone = widgets[index % widgets.length].cloneNode(true);
        clone.dataset.id = `portfolio-${index + 1}`;
        clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        grid.appendChild(clone);
        widgets = Array.from(grid.children).filter((child) => child.classList.contains("elementor-widget-bullport_account_card"));
      }

      const widget = widgets[index];
      const href = `pages/portfolio-${portfolio.slug}.html`;
      const shortName = portfolio.title.replace(/\s*Portfolio$/, "");
      const image = widget.querySelector(".account-style1__img-inner img");
      const title = widget.querySelector(".account-style1__img-content-text h3 a");
      const text = widget.querySelector(".account-style1__img-content-text p");
      const button = widget.querySelector(".account-style1__img-content-btn a");

      if (image) {
        image.src = asset(portfolio.image);
        image.alt = portfolio.title;
      }
      setLinkedText(title, href, shortName);
      if (text) text.textContent = portfolio.description;
      setIconButton(button, href, "Learn More");
    });
  }

  function updatePlatformTemplate() {
    const tabLabels = [["Client", "Portal"], ["Market", "Desk"]];
    document.querySelectorAll(".platform-style1__tab-btn .tab-btn-item h4").forEach((heading, index) => {
      const label = tabLabels[index % tabLabels.length];
      heading.innerHTML = `${escapeHtml(label[0])} <br>${escapeHtml(label[1])}`;
    });

    const panels = [
      {
        text: "Review onboarding, KYC, wallet funding, reporting and statements in one future client flow.",
        bullets: ["Secure account access", "Portfolio reporting visibility", "Investor education and risk disclosures", "Wallet funding readiness"]
      },
      {
        text: "Explore instruments, market snapshots, education and pricing notes before making a decision.",
        bullets: ["Stocks, ETFs, bonds and commodities", "Options education and suitability notes", "Illustrative market movement", "Pricing and fee transparency"]
      }
    ];

    document.querySelectorAll(".tab-content-box-item .single-platform-style1").forEach((panel, index) => {
      const item = panels[index % panels.length];
      const text = panel.querySelector(".single-platform-style1__content-text p");
      if (text) text.textContent = item.text;
      panel.querySelectorAll(".single-platform-style1__content-list p").forEach((bullet, bulletIndex) => {
        bullet.textContent = item.bullets[bulletIndex % item.bullets.length];
      });
    });

    const userCards = [
      { title: "Client Portal", text: "Prepared for mobile account review.", buttons: [["Get Started", "pages/register.html"], ["Login", "pages/login.html"]] },
      { title: "Portfolio Desk", text: "Prepared for desktop review and reporting.", buttons: [["Portfolios", "pages/portfolios.html"], ["Fees", "pages/pricing-fees.html"]] },
      { title: "Web Access", text: "Review markets and portfolio materials directly online.", buttons: [["How It Works", "pages/how-it-works.html"]] }
    ];

    document.querySelectorAll(".single-users-style1").forEach((card, index) => {
      const item = userCards[index % userCards.length];
      const title = card.querySelector(".single-users-style1__content-text h3");
      const text = card.querySelector(".single-users-style1__content-text p");
      if (title) title.textContent = item.title;
      if (text) text.textContent = item.text;
      card.querySelectorAll(".single-users-style1__content-btn a").forEach((anchor, buttonIndex) => {
        const button = item.buttons[buttonIndex] || item.buttons[item.buttons.length - 1];
        anchor.href = link(button[1]);
        const image = anchor.querySelector("img, svg");
        anchor.textContent = "";
        if (image) anchor.appendChild(image);
        anchor.append(document.createTextNode(button[0]));
      });
    });
  }

  function updateMarketCardsFromTemplate() {
    document.querySelectorAll(".e-n-tab-title-text").forEach((tab, index) => {
      tab.textContent = index === 0 ? "Core Markets" : "Portfolio Watchlist";
    });

    document.querySelectorAll(".single-market-style1").forEach((card, index) => {
      const item = data.instruments[index % data.instruments.length];
      const sections = card.querySelectorAll("li");
      const first = sections[0];
      const second = sections[1];
      if (first) {
        const title = first.querySelector(".title-box h4");
        const name = first.querySelector(".title-box p");
        const value = first.querySelector(".doller-box h4");
        const label = first.querySelector(".bottom-box > p");
        if (title) title.textContent = item.symbol;
        if (name) name.textContent = item.name;
        if (value) value.textContent = formatPrice(item.price, item.assetClass);
        if (label) label.textContent = item.assetClass;
      }

      if (second) {
        const title = second.querySelector(".title-box h4");
        const name = second.querySelector(".title-box p");
        const value = second.querySelector(".doller-box h4");
        const label = second.querySelector(".bottom-box > p");
        if (title) title.textContent = item.riskLevel;
        if (name) name.textContent = "Risk Profile";
        if (value) value.textContent = formatPercent(item.changePercent);
        if (label) label.textContent = item.changePercent >= 0 ? "Move Up" : "Move Down";
      }

      const changeBox = card.querySelector(".single-market-style1__content-btn1 h4");
      if (changeBox) {
        changeBox.innerHTML = `<a href="${link(item.href)}"><i class="icon-top-right"></i>Move</a>${escapeHtml(formatPercent(item.changePercent))}`;
      }
      setIconButton(card.querySelector(".single-market-style1__content-btn2 a"), item.href, "View Details");
    });
  }

  function updateProcessTemplate() {
    const steps = [
      { first: "Create", second: "Account", text: "Start the onboarding flow.", overlay: "Create your public profile, then move to secure account setup when the portal is connected.", href: "pages/register.html" },
      { first: "Complete", second: "KYC", text: "Verify identity and suitability.", overlay: "KYC helps support investor protection, suitability review and compliant onboarding.", href: "pages/how-it-works.html" },
      { first: "Fund", second: "Wallet", text: "Prepare secure deposits.", overlay: "Funding and withdrawals should happen inside authenticated client workflows after launch.", href: "pages/how-it-works.html" },
      { first: "Choose", second: "Portfolio", text: "Review allocation and risk.", overlay: "Compare portfolios, markets, fees and disclosures before making an investment decision.", href: "pages/portfolios.html" }
    ];

    document.querySelectorAll(".single-process-style1").forEach((card, index) => {
      const item = steps[index % steps.length];
      const count = card.querySelector(".single-process-style1__count");
      const text = card.querySelector(".single-process-style1__text");
      const overlayText = card.querySelector(".single-process-style1__inner-overly-text");
      if (count) count.textContent = String(index + 1).padStart(2, "0");
      card.querySelectorAll(".single-process-style1__title a, .single-process-style1__inner-overly-title a").forEach((anchor) => {
        setSplitLink(anchor, item.href, item.first, item.second);
      });
      if (text) text.textContent = item.text;
      if (overlayText) overlayText.textContent = item.overlay;
    });
  }

  function updateChooseUsTemplate() {
    document.querySelectorAll(".single-choose-style1").forEach((card, index) => {
      const item = data.trust[index % data.trust.length];
      const count = card.querySelector(".single-choose-style1__content-count h4");
      const title = card.querySelector(".single-choose-style1__content-text h3 a");
      const text = card.querySelector(".single-choose-style1__content-text p");
      if (count) count.textContent = `${String(index + 1).padStart(2, "0")}.`;
      setLinkedText(title, "pages/about.html", item.title);
      if (text) text.textContent = item.text;
    });
  }

  function updateBlogTemplate() {
    document.querySelectorAll(".single-blog-style1").forEach((card, index) => {
      const post = data.educationPosts[index % data.educationPosts.length];
      const href = `pages/education-detail.html?slug=${encodeURIComponent(post.slug)}`;
      const image = card.querySelector(".single-blog-style1__img img");
      const title = card.querySelector(".single-blog-style1__content-title a");
      const category = card.querySelector(".single-blog-style1__img-category a, .single-blog-style1__img-category h4, .single-blog-style1__img-category span");
      if (image) {
        image.src = asset(post.image);
        image.alt = post.title;
      }
      setLinkedText(title, href, post.title);
      if (category) category.textContent = post.category;
      card.querySelectorAll("a[href]").forEach((anchor) => {
        if (!anchor.closest(".single-blog-style1__content-meta")) anchor.href = link(href);
      });
    });
  }

  function injectHomeDisclaimer() {
    if (document.querySelector(".app-home-disclaimer")) return;
    const footer = document.querySelector(".elementor-218");
    const target = footer?.previousElementSibling || document.querySelector(".elementor-21");
    if (!target) return;
    target.insertAdjacentHTML("afterend", `
      <section class="static-section static-section--soft app-home-disclaimer">
        <div class="static-container">
          <p class="static-notice">${escapeHtml(data.brand.risk)}</p>
        </div>
      </section>`);
  }

  function enhanceTemplateFooter() {
    const footer = document.querySelector(".elementor-218");
    if (!footer) return;
    footer.classList.add("app-template-footer");

    const intro = footer.querySelector('[data-id="ae92dca"] .te-text');
    const email = footer.querySelector('a[href^="mailto:"]');
    const phone = footer.querySelector('a[href^="tel:"]');
    const faq = footer.querySelector(".faq-style1__left-btn a");
    if (intro) intro.textContent = "Transparent multi-asset platform. Structured portfolio access, market education and risk-aware onboarding.";
    if (email) {
      email.href = `mailto:${data.brand.email}`;
      email.textContent = data.brand.email;
    }
    if (phone) {
      phone.href = `tel:${phoneHref()}`;
      phone.textContent = data.brand.phone;
    }
    if (faq) {
      faq.href = link("pages/faqs.html");
      faq.textContent = "Read FAQs";
    }

    const footerLinks = footer.querySelectorAll(".footer-widget-links-list a");
    data.footerNavigation.slice(0, footerLinks.length).forEach((item, index) => {
      const anchor = footerLinks[index];
      const icon = anchor.querySelector("i");
      anchor.href = link(item.href);
      anchor.textContent = "";
      if (icon) anchor.appendChild(icon);
      anchor.append(document.createTextNode(item.label));
    });

    const courses = footer.querySelectorAll(".single-footer-widget__courses");
    courses.forEach((course, index) => {
      const post = data.educationPosts[index % data.educationPosts.length];
      const title = course.querySelector("h4 a");
      const label = course.querySelector("h6");
      const lessons = course.querySelector("h5 a");
      const image = course.querySelector("img");
      if (label) label.textContent = post.category;
      setLinkedText(title, `pages/education-detail.html?slug=${encodeURIComponent(post.slug)}`, post.title);
      setLinkedText(lessons, "pages/education.html", post.readTime);
      if (image) {
        image.src = asset(post.image);
        image.alt = post.title;
      }
    });
  }

  function setHomeAccessTitle() {
    const accessTitle = document.querySelector('[data-id="d847830"] h2');
    if (accessTitle) accessTitle.innerHTML = "Master the Markets <br>with Structure";
  }

  function enhanceTemplateHome() {
    document.querySelectorAll(".elementor-21 > .static-hidden").forEach((child) => child.classList.remove("static-hidden"));
    document.querySelectorAll(".elementor-21 .e-con.e-parent, .elementor-218 .e-con.e-parent").forEach((section) => {
      section.classList.add("e-lazyloaded");
    });
    document.querySelectorAll(".elementor-21 .elementor-invisible, .elementor-21 .wow").forEach((node) => {
      node.classList.remove("elementor-invisible");
      node.style.visibility = "visible";
      node.style.opacity = "1";
    });

    setHomeAccessTitle();
    window.setTimeout(setHomeAccessTitle, 800);
    window.setTimeout(setHomeAccessTitle, 1800);

    replaceTextNodes([
      ["Trade Over 50+ Currency Pairs.", "Track stocks, ETFs, bonds, commodities, indices and options education."],
      ["View All Pairs", "View All Markets"],
      ["How itâ€™s Work", "How It Works"],
      ["Trade in Just a Few Clicks", "Invest in Just a Few Steps"],
      ["Donâ€™t Just Watch, Act Now.", "Review risk, then move with intent."],
      ["Start Earning", "Create Account"],
      ["Margin Calculator", "Margin Calculator"],
      ["Technical Indicators", "Technical Indicators"],
      ["Economic Calendar", "Economic Calendar"],
      ["Sentiment Analysis", "Sentiment Analysis"],
      ["Explore the Calculator", "Explore the Calculator"],
      ["Major Pairs", "Core Markets"],
      ["Minor Pairs", "Portfolio Watchlist"],
      ["Currency Pairs", "Instruments"],
      ["Total Revenue", "Assets Monitored"],
      ["Overall Earnings Generated.", "Illustrative platform assets reviewed."],
      ["Trade global currency pairs.", "Review diversified market categories for investor discovery."],
      ["Top 5 Currency Pairs to Trade This Month.", "Understanding Investment Risk"],
      ["Read Faqâ€™s", "Read FAQs"],
      ["Forex Trading", "Market Discovery"],
      ["Inside Forex Trading", "Inside Market Coverage"]
    ]);

    updateTemplateTradingCards();
    updateTemplateFacts();
    updatePortfolioCardsFromTemplate();
    updatePlatformTemplate();
    updateMarketCardsFromTemplate();
    updateProcessTemplate();
    updateChooseUsTemplate();
    updateBlogTemplate();
    injectHomeDisclaimer();
  }

  function sparkline(points, positive) {
    const safePoints = Array.isArray(points) && points.length ? points : [1, 2, 3, 2, 4];
    const min = Math.min(...safePoints);
    const max = Math.max(...safePoints);
    const range = max - min || 1;
    const coords = safePoints.map((point, index) => {
      const x = (index / Math.max(safePoints.length - 1, 1)) * 100;
      const y = 34 - (((point - min) / range) * 28);
      return `${x},${y}`;
    }).join(" ");
    return `
      <svg class="static-sparkline ${positive ? "static-sparkline--up" : "static-sparkline--down"}" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
        <polyline fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${coords}"></polyline>
      </svg>`;
  }

  function instrumentRow(item) {
    const positive = Number(item.changePercent) >= 0;
    return `
      <tr data-market-symbol="${escapeHtml(item.symbol)}">
        <td>
          <div class="static-instrument">
            <strong>${escapeHtml(item.symbol)}</strong>
            <small>${escapeHtml(item.name)}</small>
          </div>
        </td>
        <td>${escapeHtml(item.assetClass)}</td>
        <td data-market-price>${escapeHtml(formatPrice(item.price, item.assetClass))}</td>
        <td data-market-change class="${positive ? "change-up" : "change-down"}">${escapeHtml(formatPercent(item.changePercent))}</td>
        <td><span class="static-badge static-badge--risk static-badge--${riskClass(item.riskLevel)}">${escapeHtml(item.riskLevel)}</span></td>
        <td data-market-chart>${sparkline(item.chartData, positive)}</td>
        <td><a class="static-link" href="${link(item.href)}">View Details</a></td>
      </tr>`;
  }

  function marketTable(filter) {
    const items = filter ? data.instruments.filter(filter) : data.instruments;
    return `
      <div class="static-market-table-block" data-market-table>
        <p class="static-market-table__note">Market feed is informational and not financial advice.</p>
        <div class="static-market-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Asset Class</th>
                <th>Last Price</th>
                <th>24h Change</th>
                <th>Risk Level</th>
                <th>Mini Chart</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>${items.map(instrumentRow).join("")}</tbody>
          </table>
        </div>
      </div>`;
  }

  function allocation(portfolio) {
    return `
      <div class="portfolio-allocation">
        ${portfolio.allocation.map((item) => `
          <div class="portfolio-allocation__row">
            <span>${escapeHtml(item.label)}</span>
            <span class="portfolio-allocation__bar"><span style="width:${item.value}%"></span></span>
            <span>${item.value}%</span>
          </div>`).join("")}
      </div>`;
  }

  function portfolioCards(limit) {
    return data.portfolios.slice(0, limit || data.portfolios.length).map((portfolio) => `
      <article class="static-card">
        <img src="${asset(portfolio.image)}" alt="${escapeHtml(portfolio.title)}">
        <div class="static-card__body">
          <div class="static-card__meta">
            <span class="static-badge">${escapeHtml(portfolio.riskLevel)} risk</span>
            <span class="static-badge">${escapeHtml(portfolio.minimumInvestment)} minimum</span>
          </div>
          <h3>${escapeHtml(portfolio.title)}</h3>
          <p>${escapeHtml(portfolio.description)}</p>
          <a class="static-link" href="${link(`pages/portfolio-${portfolio.slug}.html`)}">View Portfolio</a>
        </div>
      </article>`).join("");
  }

  function categoryCards(filter) {
    const categories = filter ? data.categories.filter(filter) : data.categories;
    return categories.map((category) => `
      <article class="static-card">
        <img src="${asset(category.image)}" alt="${escapeHtml(category.name)}">
        <div class="static-card__body">
          <h3>${escapeHtml(category.name)}</h3>
          <p>${escapeHtml(category.description)}</p>
          <a class="static-link" href="${link(category.href)}">Explore</a>
        </div>
      </article>`).join("");
  }

  function educationCards(limit) {
    return data.educationPosts.slice(0, limit || data.educationPosts.length).map((post) => `
      <article class="static-card">
        <img src="${asset(post.image)}" alt="${escapeHtml(post.title)}">
        <div class="static-card__body">
          <div class="static-card__meta">
            <span class="static-badge">${escapeHtml(post.category)}</span>
            <span class="static-badge">${escapeHtml(post.readTime)}</span>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.summary)}</p>
          <a class="static-link" href="${link(`pages/education-detail.html?slug=${encodeURIComponent(post.slug)}`)}">Read Guide</a>
        </div>
      </article>`).join("");
  }

  function signalStrip(items) {
    return `
      <div class="static-signal-strip">
        ${items.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("")}
      </div>`;
  }

  function stepsHtml() {
    return `
      <div class="static-grid static-grid--3 static-steps">
        ${data.howItWorks.map((step) => `
          <article class="static-step">
            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.text)}</p>
          </article>`).join("")}
      </div>`;
  }

  function trustHtml() {
    return data.trust.map((item) => `
      <article class="static-dark-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>`).join("");
  }

  function infoCards(items) {
    return items.map((item) => `
      <article class="static-card static-info-card">
        <div class="static-card__body">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </div>
      </article>`).join("");
  }

  function bulletList(items) {
    return `<ul class="static-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function statusGrid(items) {
    return `
      <div class="static-grid static-grid--3">
        ${items.map((item) => `
          <article class="static-card static-status-card">
            <div class="static-card__body">
              <span class="static-badge">${escapeHtml(item.status)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </div>
          </article>`).join("")}
      </div>`;
  }

  function feeTable() {
    return `
      <div class="static-market-table">
        <table>
          <thead>
            <tr><th>Fee</th><th>Value</th><th>Note</th></tr>
          </thead>
          <tbody>
            ${data.fees.map((fee) => `<tr><td>${escapeHtml(fee.label)}</td><td>${escapeHtml(fee.value)}</td><td>${escapeHtml(fee.note)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function pageHero(title, text) {
    return `
      <section class="static-page-hero">
        <div class="static-container">
          <span class="static-kicker">${escapeHtml(data.brand.name)}</span>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(text)}</p>
        </div>
      </section>`;
  }

  function pageWrap(title, text, sections) {
    return pageHero(title, text) + sections;
  }

  function renderPortfolios() {
    return pageWrap(
      "Managed Portfolios",
      "Review six structured portfolio models with risk levels, minimums, allocation mix, reporting notes and suitability-first language.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-grid--3">${portfolioCards()}</div>
          </div>
        </section>
        <section class="static-section static-section--dark">
          <div class="static-container">
            <div class="static-heading">
              <div><span class="static-kicker">Portfolio standards</span><h2>Every allocation should be reviewed through risk, duration and suitability.</h2></div>
              <p>Estimated return ranges are illustrative only. Investors should compare fees, liquidity expectations and rebalancing policy before selecting a mandate.</p>
            </div>
            <div class="static-grid static-grid--3">${trustHtml()}</div>
          </div>
        </section>`
    );
  }

  function renderPortfolioDetail(slug) {
    const portfolio = data.portfolios.find((item) => item.slug === slug) || data.portfolios[0];
    return pageWrap(
      portfolio.title,
      portfolio.description,
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-two-col">
              <img class="static-card static-detail-image" src="${asset(portfolio.image)}" alt="${escapeHtml(portfolio.title)}">
              <div>
                <div class="static-card__meta">
                  <span class="static-badge">${escapeHtml(portfolio.riskLevel)} risk</span>
                  <span class="static-badge">${escapeHtml(portfolio.minimumInvestment)} minimum</span>
                  <span class="static-badge">${escapeHtml(portfolio.suggestedDuration)}</span>
                </div>
                <h2 class="static-section-title">${escapeHtml(portfolio.focus)}</h2>
                <p class="static-lead">Best for ${escapeHtml(portfolio.bestFor)}.</p>
                <div class="static-inline-note">
                  <strong>Asset mix</strong>
                  <p>${escapeHtml(portfolio.assetMix)}</p>
                </div>
                ${allocation(portfolio)}
              </div>
            </div>
          </div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            <div class="static-grid static-grid--2">
              ${infoCards([
                { title: "Estimated Return Range", text: portfolio.estimatedReturnRange },
                { title: "Fee Summary", text: portfolio.feeSummary },
                { title: "Dividend / Profit Structure", text: portfolio.dividendProfitStructure },
                { title: "Rebalancing Information", text: portfolio.rebalancingInfo }
              ])}
            </div>
            <p class="static-notice" style="margin-top:28px;">${escapeHtml(portfolio.disclaimer)}</p>
            <div class="static-cta" style="margin-top:28px;">
              <div>
                <h2>Need help choosing this portfolio?</h2>
                <p>Use the registration or support flow to continue with suitability review, account setup and portfolio guidance.</p>
              </div>
              <div class="static-cta__actions">
                <a class="static-button" href="${link("pages/register.html")}">Create Account</a>
                <a class="static-button static-button--secondary" href="${link("pages/contact.html")}">Contact Support</a>
              </div>
            </div>
          </div>
        </section>`
    );
  }

  function renderMarkets() {
    return pageWrap(
      "Markets",
      "Explore market coverage across stocks, ETFs, bonds, commodities, indices and options education from one public-facing website.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-grid--3">${categoryCards()}</div>
          </div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            <div class="static-heading">
              <div><span class="static-kicker">Market table</span><h2>Instrument monitoring for investor discovery.</h2></div>
              <p>This table uses small simulated updates only. It does not connect to any real financial API and should not be used as live pricing.</p>
            </div>
            ${marketTable()}
          </div>
        </section>`
    );
  }

  function renderStocksEtfs() {
    const filter = (item) => item.assetClass === "Stock" || item.assetClass === "ETF";
    return pageWrap(
      "Stocks & ETFs",
      "Understand listed shares and exchange-traded funds before using them for growth, income or diversification.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-grid--3">
              ${infoCards([
                { title: "What stocks are", text: "Stocks represent ownership in listed companies and can support capital growth, dividend income or sector exposure." },
                { title: "What ETFs are", text: "ETFs package multiple securities into one traded instrument for diversified or thematic access." },
                { title: "Main risks", text: "Equity risk, valuation risk, sector concentration, liquidity shifts and market-wide drawdowns all matter." },
                { title: "Blue-chip stocks", text: "Large established companies often offer stability relative to smaller issuers, but they still carry market risk." },
                { title: "Growth stocks", text: "Growth names can offer stronger upside potential, though drawdowns and volatility can be meaningfully higher." },
                { title: "Dividend stocks and sector ETFs", text: "Income-oriented equities and sector funds can support portfolio targeting, but payouts and sector trends can change quickly." }
              ])}
            </div>
          </div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            <div class="static-heading">
              <div><span class="static-kicker">ETF themes</span><h2>International ETFs and sector ETFs can broaden portfolio exposure.</h2></div>
              <p>They can help investors access regions, industries and market factors without buying every underlying security directly.</p>
            </div>
            ${marketTable(filter)}
            <div class="static-cta" style="margin-top:28px;">
              <div>
                <h2>Want a managed route into stocks and ETFs?</h2>
                <p>Explore the balanced, dividend and equity growth portfolios for structured exposure with defined risk language.</p>
              </div>
              <a class="static-button" href="${link("pages/portfolios.html")}">Explore Portfolios</a>
            </div>
          </div>
        </section>`
    );
  }

  function renderCommodities() {
    const filter = (item) => item.assetClass.includes("Commodity");
    return pageWrap(
      "Commodities",
      "Understand how commodity investing can support diversification, inflation sensitivity and real-asset exposure.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-grid--3">
              ${infoCards([
                { title: "What commodity investing means", text: "Commodity exposure links investor outcomes to materials such as metals, energy and agriculture products." },
                { title: "Supported commodities", text: "Gold, oil-linked instruments, cocoa, maize, soybean, rice and commodity ETFs appear in the current content model." },
                { title: "Why investors use commodities", text: "They are often used for diversification, inflation awareness and exposure to supply-demand cycles." },
                { title: "Commodity risks", text: "Policy, weather, transportation, storage, futures structure and liquidity can all affect outcomes sharply." },
                { title: "Commodity ETFs", text: "Commodity-linked ETFs can simplify access but may behave differently from spot prices because of fund structure and roll costs." },
                { title: "Portfolio use", text: "Commodity allocations often work best as part of a broader portfolio rather than as a stand-alone concentration." }
              ])}
            </div>
          </div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            ${marketTable(filter)}
            <div class="static-cta" style="margin-top:28px;">
              <div>
                <h2>Looking for a commodity-focused allocation?</h2>
                <p>Review the Commodity Opportunity Portfolio for a structured, suitability-aware approach to commodity exposure.</p>
              </div>
              <a class="static-button" href="${link("pages/portfolio-commodity-opportunity.html")}">View Portfolio</a>
            </div>
          </div>
        </section>`
    );
  }

  function renderOptions() {
    const filter = (item) => item.assetClass === "Option";
    const statuses = [
      { status: "Not Applied", title: "No active request", text: "The investor has not yet requested options access." },
      { status: "Pending Approval", title: "Under review", text: "Suitability, product knowledge and account profile are being reviewed." },
      { status: "Approved", title: "Access enabled", text: "Options trading access is available within the approved scope and permissions." },
      { status: "Restricted", title: "Limited access", text: "The account may be limited by product type, strategy scope or compliance review." },
      { status: "Suspended", title: "Temporarily disabled", text: "Access can be suspended because of inactivity, compliance issues or risk controls." }
    ];

    return pageWrap(
      "Options",
      "Options are advanced instruments and may not be suitable for all investors.",
      `
        <section class="static-section">
          <div class="static-container">
            <p class="static-notice">Options involve significant risk and are not suitable for all investors. Access may require approval.</p>
            <div class="static-grid static-grid--3" style="margin-top:28px;">
              ${infoCards([
                { title: "Call Options", text: "A call option gives the holder the right, but not the obligation, to buy an asset at a stated strike price before expiry." },
                { title: "Put Options", text: "A put option gives the holder the right, but not the obligation, to sell an asset at a stated strike price before expiry." },
                { title: "Strike Price", text: "The strike price is the reference level at which the option contract can be exercised." },
                { title: "Expiry Date", text: "Options have a fixed lifetime. As expiry approaches, time value can erode quickly." },
                { title: "Premium", text: "The premium is the price paid or received for the option contract and can change with volatility, time and asset movement." },
                { title: "Why options are high-risk", text: "Leverage, time decay, volatility shifts and low liquidity can create rapid losses, including a total loss of premium." }
              ])}
            </div>
          </div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            <div class="static-heading">
              <div><span class="static-kicker">Eligibility</span><h2>Options access should be status-driven and suitability-based.</h2></div>
              <p>Approval should consider investor knowledge, account type, risk tolerance, local rules and product scope.</p>
            </div>
            ${statusGrid(statuses)}
            <div class="static-grid static-two-col" style="margin-top:28px;">
              <div class="static-card">
                <div class="static-card__body">
                  <h3>Risk warning</h3>
                  ${bulletList([
                    "Options can expire worthless.",
                    "Small price moves can have large impact on option value.",
                    "Liquidity may be limited in some contracts.",
                    "Approval does not remove suitability or loss risk."
                  ])}
                </div>
              </div>
              <div>
                <h3 class="static-section-title" style="font-size:30px;margin-bottom:10px;">Options watchlist</h3>
                <p class="static-lead" style="margin-bottom:18px;">These instruments are informational and should be reviewed with full risk context.</p>
                ${marketTable(filter)}
              </div>
            </div>
            <div class="static-cta" style="margin-top:28px;">
              <div>
                <h2>Need options access?</h2>
                <p>Options approval should happen after registration, KYC and suitability review.</p>
              </div>
              <a class="static-button" href="${link("pages/register.html")}">Apply for Options Access</a>
            </div>
          </div>
        </section>`
    );
  }

  function renderPricing() {
    return pageWrap(
      "Pricing & Fees",
      "Review illustrative management, execution, withdrawal, options and advisory fee categories before onboarding.",
      `
        <section class="static-section">
          <div class="static-container">
            ${feeTable()}
            <p class="static-notice" style="margin-top:26px;">Fees shown are for presentation purposes and may change based on portfolio, jurisdiction and account type.</p>
          </div>
        </section>`
    );
  }

  function renderEducation() {
    return pageWrap(
      "Investor Education",
      "Risk-aware learning across portfolios, stocks, ETFs, commodities, dividends, options and portfolio reporting.",
      `
        <section class="static-section static-section--soft">
          <div class="static-container">
            ${signalStrip(data.educationCategories.slice(0, 3).map((item, index) => ({
              label: `Guide ${index + 1}`,
              value: item
            })))}
          </div>
        </section>
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-grid--3">${educationCards()}</div>
          </div>
        </section>`
    );
  }

  function renderEducationDetail() {
    const slug = new URLSearchParams(location.search).get("slug");
    const post = data.educationPosts.find((item) => item.slug === slug);

    if (!post) {
      return pageWrap(
        "Education Detail",
        "Select an education topic to continue.",
        `
          <section class="static-section">
            <div class="static-container">
              <p class="static-notice">The requested guide could not be found. Choose one of the available education topics below.</p>
              <div class="static-grid static-grid--3" style="margin-top:28px;">${educationCards()}</div>
            </div>
          </section>`
      );
    }

    return pageWrap(
      post.title,
      post.summary,
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-two-col">
              <img class="static-card static-detail-image" src="${asset(post.image)}" alt="${escapeHtml(post.title)}">
              <div>
                <div class="static-card__meta">
                  <span class="static-badge">${escapeHtml(post.category)}</span>
                  <span class="static-badge">${escapeHtml(post.readTime)}</span>
                </div>
                ${post.body.map((paragraph) => `<p class="static-lead static-detail-copy">${escapeHtml(paragraph)}</p>`).join("")}
                <p class="static-notice">Educational content only. It is not personalized financial advice.</p>
              </div>
            </div>
          </div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            <div class="static-heading">
              <div><span class="static-kicker">Continue learning</span><h2>More investor education topics.</h2></div>
              <p>Use the education library to compare topics around markets, risk and portfolio reporting.</p>
            </div>
            <div class="static-grid static-grid--3">${educationCards(3)}</div>
          </div>
        </section>`
    );
  }

  function renderHowItWorks() {
    return pageWrap(
      "How It Works",
      "A public explanation of future account creation, KYC, wallet funding, portfolio selection and reporting.",
      `
        <section class="static-section">
          <div class="static-container">${stepsHtml()}</div>
        </section>
        <section class="static-section static-section--soft">
          <div class="static-container">
            <p class="static-notice">${escapeHtml(data.brand.risk)} Funding and withdrawals should happen only inside authenticated client modules.</p>
          </div>
        </section>`
    );
  }

  function renderRisk() {
    return pageWrap(
      "Risk Disclosure",
      "Clear public-facing disclosure for portfolios, instruments, education content and future onboarding.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-grid--3">
              ${data.riskDisclosures.map((item) => `
                <article class="static-card">
                  <div class="static-card__body">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
                  </div>
                </article>`).join("")}
            </div>
          </div>
        </section>`
    );
  }

  function renderFaqs() {
    return pageWrap(
      "FAQs",
      "Answers for account creation, KYC, funding, portfolios, dividends, fees, risks, options approval and support.",
      `
        <section class="static-section">
          <div class="static-container static-legal">
            ${data.faqs.map((item) => `
              <article class="static-faq">
                <h3>${escapeHtml(item.question)}</h3>
                <p>${escapeHtml(item.answer)}</p>
              </article>`).join("")}
          </div>
        </section>`
    );
  }

  function renderAbout() {
    return pageWrap(
      "About",
      "A multi-asset investment website prepared for managed portfolios, market discovery and future client onboarding.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-heading">
              <div><span class="static-kicker">Positioning</span><h2>Built for clear portfolio access and disclosure-first investor education.</h2></div>
              <p>${escapeHtml(data.brand.name)} presents portfolios, market categories, risk language, pricing and onboarding context before any secured portal activity begins.</p>
            </div>
            <div class="static-grid static-grid--3">${trustHtml()}</div>
          </div>
        </section>`
    );
  }

  function contactForm() {
    return `
      <form class="static-form" data-static-form data-reset="true">
        <div class="static-form__grid">
          <label>Name<input name="name" required></label>
          <label>Email<input type="email" name="email" required></label>
        </div>
        <div class="static-form__grid">
          <label>Phone (optional)<input name="phone" inputmode="tel"></label>
          <label>Subject<input name="subject" required></label>
        </div>
        <label>Message<textarea name="message" required></textarea></label>
        <button class="static-button" type="submit">Send Message</button>
        <p class="static-notice static-hidden" data-form-note>Thank you. This form is not connected to a backend yet.</p>
      </form>`;
  }

  function renderContact() {
    return pageWrap(
      "Contact",
      "Speak with support about onboarding, portfolios, markets, pricing, risk disclosures or portal readiness.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-grid static-two-col">
              <div class="static-card">
                <div class="static-card__body">
                  <h3>Support Details</h3>
                  <p>Email: <a href="mailto:${escapeHtml(data.brand.email)}">${escapeHtml(data.brand.email)}</a></p>
                  <p>Phone: <a href="tel:${escapeHtml(phoneHref())}">${escapeHtml(data.brand.phone)}</a></p>
                  <p>Address: ${escapeHtml(data.brand.address)}</p>
                  <p>Hours: ${escapeHtml(data.brand.supportHours)}</p>
                  <p class="static-notice">${escapeHtml(data.brand.risk)}</p>
                </div>
              </div>
              ${contactForm()}
            </div>
          </div>
        </section>`
    );
  }

  function renderLegal(kind) {
    const isPrivacy = kind === "privacy";
    return pageWrap(
      isPrivacy ? "Privacy Policy" : "Terms of Use",
      isPrivacy ? "Public website privacy language prepared for later legal review." : "Website terms prepared for later legal review.",
      `
        <section class="static-section">
          <div class="static-container static-legal">
            <h2>Informational website</h2>
            <p>This static website explains platform concepts, portfolios, instruments, pricing and education. It does not create a client relationship by itself.</p>
            <h2>No guarantee</h2>
            <p>${escapeHtml(data.brand.risk)}</p>
            <h2>Portal separation</h2>
            <p>Funding, withdrawals, KYC, account statements and investment activity should be completed only inside authenticated portal workflows after launch.</p>
            <h2>Review required</h2>
            <p>Legal, regulatory, privacy and jurisdiction-specific language should be verified before public launch.</p>
          </div>
        </section>`
    );
  }

  function renderPortal(kind) {
    const isLogin = kind === "login";
    const title = isLogin ? "Login" : "Get Started";
    const text = isLogin
      ? "Client portal access for future portfolio review, reporting and account activity."
      : "Registration placeholder for account creation, KYC and suitability review.";
    const fields = isLogin
      ? `
        <label>Email<input type="email" name="email" required></label>
        <label>Password<input type="password" name="password" required></label>`
      : `
        <div class="static-form__grid">
          <label>Full Name<input name="name" required></label>
          <label>Email<input type="email" name="email" required></label>
        </div>
        <div class="static-form__grid">
          <label>Phone (optional)<input name="phone"></label>
          <label>Primary Interest
            <select name="interest">
              <option>Managed Portfolios</option>
              <option>Stocks & ETFs</option>
              <option>Commodities</option>
              <option>Options Access</option>
            </select>
          </label>
        </div>
        <label>Password<input type="password" name="password" required></label>`;

    return pageWrap(
      title,
      text,
      `
        <section class="static-section">
          <div class="static-container">
            <form class="static-form" data-static-form data-reset="${isLogin ? "false" : "true"}" style="max-width:560px;margin:auto;">
              ${fields}
              <button class="static-button" type="submit">${escapeHtml(title)}</button>
              <p class="static-notice static-hidden" data-form-note>${isLogin ? "Secure authentication is not connected yet. This is a static placeholder." : "Account creation is a static placeholder. Backend onboarding is not connected yet."}</p>
            </form>
          </div>
        </section>`
    );
  }

  function renderNotFound() {
    return pageWrap(
      "Page Not Found",
      "The requested page is not available in the static front-facing site.",
      `
        <section class="static-section">
          <div class="static-container">
            <div class="static-cta">
              <div>
                <h2>Return to the main website.</h2>
                <p>Use the navigation to review portfolios, markets, education, pricing, risk disclosure or support.</p>
              </div>
              <a class="static-button" href="${link("index.html")}">Go Home</a>
            </div>
          </div>
        </section>`
    );
  }

  function renderPage() {
    const mount = document.getElementById("static-page");
    if (!mount) return;

    const pageMap = {
      portfolios: renderPortfolios,
      markets: renderMarkets,
      "stocks-etfs": renderStocksEtfs,
      commodities: renderCommodities,
      options: renderOptions,
      "how-it-works": renderHowItWorks,
      "pricing-fees": renderPricing,
      education: renderEducation,
      "education-detail": renderEducationDetail,
      "risk-disclosure": renderRisk,
      faqs: renderFaqs,
      about: renderAbout,
      contact: renderContact,
      terms: () => renderLegal("terms"),
      privacy: () => renderLegal("privacy"),
      login: () => renderPortal("login"),
      register: () => renderPortal("register"),
      "404": renderNotFound
    };
    data.portfolios.forEach((portfolio) => {
      pageMap[`portfolio-${portfolio.slug}`] = () => renderPortfolioDetail(portfolio.slug);
    });

    mount.innerHTML = (pageMap[page] || renderAbout)();
  }

  function bindForms() {
    document.querySelectorAll("[data-static-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const note = form.querySelector("[data-form-note]");
        if (note) note.classList.remove("static-hidden");
        if (form.dataset.reset === "true") form.reset();
      });
    });
  }

  function applySeo() {
    const seo = {
      home: {
        title: `${data.brand.name} | Multi-Asset Investment Platform`,
        description: "Managed portfolios, stocks, commodities, ETFs, bonds and options education from one front-facing investment platform."
      },
      portfolios: {
        title: `Managed Portfolios | ${data.brand.name}`,
        description: "Review six portfolio models with risk levels, minimums, rebalancing notes, fee summaries and investor suitability context."
      },
      markets: {
        title: `Markets | ${data.brand.name}`,
        description: "Explore market coverage across stocks, ETFs, bonds, commodities, indices and options education."
      },
      "stocks-etfs": {
        title: `Stocks & ETFs | ${data.brand.name}`,
        description: "Understand blue-chip stocks, growth stocks, dividend stocks, sector ETFs and international ETF exposure."
      },
      commodities: {
        title: `Commodities | ${data.brand.name}`,
        description: "Learn about gold, oil-linked products, agriculture exposure and commodity risk in a public-facing market guide."
      },
      options: {
        title: `Options | ${data.brand.name}`,
        description: "Advanced options education covering calls, puts, strike price, expiry, premium and approval status guidance."
      },
      education: {
        title: `Investor Education | ${data.brand.name}`,
        description: "Risk-aware investor education across markets, dividends, options and portfolio reporting."
      },
      "how-it-works": {
        title: `How It Works | ${data.brand.name}`,
        description: "Public onboarding flow for registration, KYC, funding readiness and portfolio selection."
      },
      "pricing-fees": {
        title: `Pricing & Fees | ${data.brand.name}`,
        description: "Illustrative management, execution, withdrawal, options and advisory fee categories."
      },
      "risk-disclosure": {
        title: `Risk Disclosure | ${data.brand.name}`,
        description: "Public-facing investment risk, market risk, commodity risk, options risk and no-guarantee disclosure."
      },
      faqs: {
        title: `FAQs | ${data.brand.name}`,
        description: "Answers for account creation, KYC, fees, portfolio selection, risks and support."
      },
      about: {
        title: `About | ${data.brand.name}`,
        description: "About the front-facing multi-asset investment website and its disclosure-first positioning."
      },
      contact: {
        title: `Contact | ${data.brand.name}`,
        description: "Support contact details and contact form for onboarding, portfolios, pricing and market questions."
      },
      login: {
        title: `Login | ${data.brand.name}`,
        description: "Static placeholder login page for future client portal access."
      },
      register: {
        title: `Get Started | ${data.brand.name}`,
        description: "Static placeholder registration page for future account creation and KYC onboarding."
      }
    };

    let meta = seo[page];
    if (!meta && page.startsWith("portfolio-")) {
      const portfolio = data.portfolios.find((item) => `portfolio-${item.slug}` === page);
      if (portfolio) {
        meta = {
          title: `${portfolio.title} | ${data.brand.name}`,
          description: portfolio.description
        };
      }
    }
    if (!meta && page === "education-detail") {
      const slug = new URLSearchParams(location.search).get("slug");
      const post = data.educationPosts.find((item) => item.slug === slug);
      if (post) {
        meta = {
          title: `${post.title} | ${data.brand.name}`,
          description: post.summary
        };
      }
    }
    if (!meta) return;

    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = meta.description;
  }

  function startMarketFeed() {
    const table = document.querySelector("[data-market-table]");
    if (!table) return;

    const symbolMap = new Map(data.instruments.map((item) => [item.symbol, item]));
    const updateRows = () => {
      table.querySelectorAll("tbody tr[data-market-symbol]").forEach((row) => {
        const symbol = row.getAttribute("data-market-symbol");
        const item = symbolMap.get(symbol);
        if (!item) return;

        const priceShift = item.price * ((Math.random() * 0.0036) - 0.0018);
        const nextPrice = Math.max(0.01, item.price + priceShift);
        const changeShift = (Math.random() * 0.5) - 0.25;
        const nextChange = Math.max(-9.99, Math.min(9.99, item.changePercent + changeShift));
        const nextSeries = item.chartData.slice(-4);
        nextSeries.push(Number(nextPrice.toFixed(2)));

        item.price = Number(nextPrice.toFixed(3));
        item.changePercent = Number(nextChange.toFixed(2));
        item.chartData = nextSeries;

        const priceNode = row.querySelector("[data-market-price]");
        const changeNode = row.querySelector("[data-market-change]");
        const chartNode = row.querySelector("[data-market-chart]");
        const positive = item.changePercent >= 0;

        if (priceNode) priceNode.textContent = formatPrice(item.price, item.assetClass);
        if (changeNode) {
          changeNode.textContent = formatPercent(item.changePercent);
          changeNode.classList.toggle("change-up", positive);
          changeNode.classList.toggle("change-down", !positive);
        }
        if (chartNode) chartNode.innerHTML = sparkline(item.chartData, positive);
      });
    };

    updateRows();
    marketIntervals.push(window.setInterval(updateRows, 7000));
  }

  function enhanceHome() {
    updateHero();
    enhanceTemplateHome();
  }

  function init() {
    replaceBrandText();
    replaceLogos();
    renderThemeMenu();
    renderStaticHeader();
    if (page === "home") enhanceHome();
    renderPage();
    renderFooter();
    remapLegacyLinks();
    bindForms();
    replaceBrandText();
    replaceLogos();
    updateContactLinks();
    applySeo();
    startMarketStatusClock();
    startMarketFeed();
    appInitialized = true;
    releasePageLoader();
    window.setTimeout(() => releasePageLoader(true), 3500);
  }

  window.addEventListener("beforeunload", () => {
    marketIntervals.forEach((interval) => window.clearInterval(interval));
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", () => releasePageLoader());
})();
