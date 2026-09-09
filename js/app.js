// Zapa CRM Inc — demo app shell, routing, and rendering.

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- Icons ---------------- */
const ICONS = {
  home: `<path fill="currentColor" d="M10 2 2 9h2v9h5v-6h2v6h5V9h2L10 2Z"/>`,
  account: `<path fill="currentColor" d="M3 3h8v14H3V3Zm10 5h6v9h-6V8ZM5 6h2M5 9h2M5 12h2M9 6h2M9 9h2M9 12h2M15 11h2M15 14h2"/>`,
  contact: `<path fill="currentColor" d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2-7 4.5V18h14v-1.5c0-2.5-3.1-4.5-7-4.5Z"/>`,
  lead: `<path fill="currentColor" d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2-7 4.5V18h9v-2.6c0-1.4.5-2.6 1.3-3.6A10.6 10.6 0 0 0 10 12Zm6.5 0-1.1 1.1L17 14.6H12v1.6h5l-1.6 1.6L16.5 19l4-3.5-4-3.5Z"/>`,
  opportunity: `<path fill="currentColor" d="M10 1 3 10l7 9 7-9-7-9Zm0 3.1L14.9 10 10 15.9 5.1 10 10 4.1Z"/>`,
  report: `<path fill="currentColor" d="M3 13h3v5H3v-5Zm5-6h3v11H8V7Zm5-4h3v15h-3V3Z"/>`,
  task: `<path fill="currentColor" d="M8.5 13.5 5 10l-1.5 1.5L8.5 16.5 17 8l-1.5-1.5L8.5 13.5Z"/>`,
  search: `<path fill="currentColor" d="M13.6 12.2h-.7l-.6-.5a5.4 5.4 0 1 0-1.3 1.3l.5.6v.7L16 18.6 17.6 17l-4-4Zm-8.6 0a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6Z"/>`,
  chevronDown: `<path fill="currentColor" d="M5 7l5 5 5-5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
};
function iconSvg(name, size = 16) {
  return `<svg viewBox="0 0 20 20" width="${size}" height="${size}">${ICONS[name] || ""}</svg>`;
}
function objIcon(type, size = 32) {
  return `<span class="obj-icon ${type}" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.55)}px">${iconSvg(type, Math.round(size * 0.6))}</span>`;
}

/* ---------------- App state ---------------- */
const APPS = [
  { key: "sales", label: "Sales", color: "#0176d3" },
  { key: "service", label: "Service Console", color: "#4fb3a9" },
  { key: "marketing", label: "Marketing", color: "#f4bc44" },
  { key: "analytics", label: "Analytics", color: "#7f8de1" },
  { key: "commerce", label: "Commerce", color: "#f0824c" },
  { key: "platform", label: "Platform", color: "#6d9eeb" },
];

const TABS = [
  { key: "home", label: "Home", icon: "home" },
  { key: "accounts", label: "Accounts", icon: "account" },
  { key: "contacts", label: "Contacts", icon: "contact" },
  { key: "leads", label: "Leads", icon: "lead" },
  { key: "opportunities", label: "Opportunities", icon: "opportunity" },
  { key: "reports", label: "Reports", icon: "report" },
];

let oppView = "kanban"; // or 'list'

/* ---------------- Toast ---------------- */
function showToast(message, type = "success") {
  const region = document.getElementById("toast-region");
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " error" : "");
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------------- Router ---------------- */
function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  return { page: parts[0] || "home", id: parts[1] || null };
}

function navigate(route) {
  location.hash = "#/" + route;
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  renderTabBar();
  renderLauncher();
  render();
  wireGlobalUI();
});

function renderTabBar() {
  const { page } = currentRoute();
  const bar = document.getElementById("tab-bar");
  bar.innerHTML = TABS.map(t => `
    <div class="tab-item ${page === t.key ? "active" : ""}" data-nav="${t.key}">
      ${iconSvg(t.icon, 16)}<span>${t.label}</span>
    </div>`).join("");
  bar.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });
}

function render() {
  renderTabBar();
  const { page, id } = currentRoute();
  const main = document.getElementById("main-content");
  main.scrollTop = 0;
  switch (page) {
    case "home": main.innerHTML = renderHome(); wireHome(); break;
    case "accounts": id ? renderAccountDetail(id) : renderAccountsList(); break;
    case "contacts": id ? renderContactDetail(id) : renderContactsList(); break;
    case "leads": id ? renderLeadDetail(id) : renderLeadsList(); break;
    case "opportunities": id ? renderOpportunityDetail(id) : renderOpportunitiesPage(); break;
    case "reports": renderReports(); break;
    default: main.innerHTML = `<div class="empty-state">Page not found.</div>`;
  }
}

/* ---------------- Global header UI ---------------- */
function wireGlobalUI() {
  document.getElementById("btn-launcher").addEventListener("click", () => {
    document.getElementById("launcher-overlay").classList.add("open");
  });
  document.getElementById("launcher-overlay").addEventListener("click", e => {
    if (e.target.id === "launcher-overlay") e.currentTarget.classList.remove("open");
  });
  document.getElementById("btn-notif").addEventListener("click", () => showToast("You have 3 unread notifications."));
  document.getElementById("btn-new").addEventListener("click", () => openNewMenu());
  document.getElementById("btn-genesys").addEventListener("click", () => toggleGenesysPanel());
  document.getElementById("genesys-panel-close").addEventListener("click", () => closeGenesysPanel());
  window.addEventListener("resize", () => {
    if (document.getElementById("genesys-panel").classList.contains("open")) positionGenesysPanel();
  });
  document.getElementById("btn-avatar").addEventListener("click", () => showToast("Signed in as Thomas Prendergast"));

  const searchInput = document.getElementById("global-search-input");
  searchInput.addEventListener("input", () => renderGlobalSearchResults(searchInput.value));
  searchInput.addEventListener("blur", () => setTimeout(() => {
    const r = document.getElementById("global-search-results");
    if (r) r.remove();
  }, 150));

  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target.id === "modal-overlay") closeModal();
  });
}

function renderLauncher() {
  document.getElementById("launcher-grid").innerHTML = APPS.map(a => `
    <div class="launcher-item">
      <div class="launcher-icon" style="background:${a.color}">${a.label[0]}</div>
      <span class="label">${a.label}</span>
    </div>`).join("");
}

function renderGlobalSearchResults(query) {
  let existing = document.getElementById("global-search-results");
  if (existing) existing.remove();
  if (!query || query.trim().length < 2) return;
  const q = query.toLowerCase();
  const results = [
    ...ACCOUNTS.filter(a => a.name.toLowerCase().includes(q)).slice(0, 4).map(a => ({ type: "account", id: a.id, label: a.name, sub: a.industry })),
    ...CONTACTS.filter(c => c.name.toLowerCase().includes(q)).slice(0, 4).map(c => ({ type: "contact", id: c.id, label: c.name, sub: c.accountName })),
    ...LEADS.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)).slice(0, 4).map(l => ({ type: "lead", id: l.id, label: l.name, sub: l.company })),
    ...OPPORTUNITIES.filter(o => o.name.toLowerCase().includes(q)).slice(0, 4).map(o => ({ type: "opportunity", id: o.id, label: o.name, sub: fmtMoney(o.amount) })),
  ];
  const box = document.createElement("div");
  box.id = "global-search-results";
  box.style.position = "absolute";
  box.style.top = "48px";
  box.style.left = "0";
  box.style.width = "560px";
  box.style.maxWidth = "92vw";
  box.style.background = "#fff";
  box.style.borderRadius = "6px";
  box.style.boxShadow = "0 4px 14px rgba(0,0,0,.25)";
  box.style.zIndex = "60";
  box.style.overflow = "hidden";
  box.style.color = "#181818";

  const searchBoxParent = document.getElementById("global-search-input").closest(".global-search");
  searchBoxParent.style.position = "relative";

  if (results.length === 0) {
    box.innerHTML = `<div style="padding:14px;color:#706e6b;font-size:12px;">No results for "${esc(query)}"</div>`;
  } else {
    box.innerHTML = results.map(r => `
      <div class="search-result-row" data-type="${r.type}" data-id="${r.id}" style="display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;">
        ${objIcon(r.type, 26)}
        <div><div style="font-weight:600;font-size:12.5px;">${esc(r.label)}</div><div style="font-size:11px;color:#706e6b;">${esc(r.sub || "")}</div></div>
      </div>`).join("");
  }
  searchBoxParent.appendChild(box);
  box.querySelectorAll(".search-result-row").forEach(row => {
    row.addEventListener("mousedown", () => {
      navigate(`${row.dataset.type === "account" ? "accounts" : row.dataset.type === "contact" ? "contacts" : row.dataset.type === "lead" ? "leads" : "opportunities"}/${row.dataset.id}`);
      document.getElementById("global-search-input").value = "";
      box.remove();
    });
    row.addEventListener("mouseenter", () => row.style.background = "#f3f6fa");
    row.addEventListener("mouseleave", () => row.style.background = "");
  });
}

function openNewMenu() {
  openModal(`
    <div class="modal-header"><h2>Create New</h2><button class="modal-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body" style="display:flex;flex-direction:column;gap:8px;">
      <button class="btn btn-neutral btn-icon" onclick="openLeadForm()">${objIcon("lead", 22)} New Lead</button>
      <button class="btn btn-neutral btn-icon" onclick="openAccountForm()">${objIcon("account", 22)} New Account</button>
      <button class="btn btn-neutral btn-icon" onclick="openContactForm()">${objIcon("contact", 22)} New Contact</button>
      <button class="btn btn-neutral btn-icon" onclick="openOpportunityForm()">${objIcon("opportunity", 22)} New Opportunity</button>
    </div>
  `);
}

/* ---------------- Modal ---------------- */
function openModal(innerHtml, size) {
  const panel = document.getElementById("modal-panel");
  panel.innerHTML = innerHtml;
  if (size) {
    panel.style.width = size.width;
    panel.style.height = size.height;
  } else {
    panel.style.width = "";
    panel.style.height = "";
  }
  document.getElementById("modal-overlay").classList.add("open");
}
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  const panel = document.getElementById("modal-panel");
  panel.innerHTML = "";
  panel.style.width = "";
  panel.style.height = "";
}

/* ---------------- Genesys Cloud embed ---------------- */
// Private Embeddable Framework deployment — served directly by Genesys Cloud,
// not by this app. See: https://developer.genesys.cloud/platform/embeddable-framework/
const GENESYS_EMBEDDABLE_FRAMEWORK_URL = "https://apps.inindca.com/crm/index.html?&crm=embeddableframework&dedicatedLoginWindow=true&enableFrameworkClientId=true";

function toggleGenesysPanel() {
  const panel = document.getElementById("genesys-panel");
  if (panel.classList.contains("open")) closeGenesysPanel();
  else openGenesysPanel();
}

function openGenesysPanel() {
  const panel = document.getElementById("genesys-panel");
  const body = document.getElementById("genesys-panel-body");
  if (!body.querySelector("iframe")) {
    const iframe = document.createElement("iframe");
    iframe.src = GENESYS_EMBEDDABLE_FRAMEWORK_URL;
    iframe.title = "Genesys Cloud Embeddable Framework";
    iframe.setAttribute("allow", "camera *; microphone *; autoplay *; hid *; local-network-access *");
    body.appendChild(iframe);
  }
  positionGenesysPanel();
  panel.classList.add("open");
}

function closeGenesysPanel() {
  document.getElementById("genesys-panel").classList.remove("open");
}

function positionGenesysPanel() {
  const btn = document.getElementById("btn-genesys");
  const panel = document.getElementById("genesys-panel");
  const arrow = document.getElementById("genesys-panel-arrow");
  const rect = btn.getBoundingClientRect();
  const panelWidth = panel.offsetWidth || 200;
  let left = rect.left + rect.width / 2 - panelWidth / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));
  panel.style.left = left + "px";
  panel.style.top = (rect.bottom + 8) + "px";
  arrow.style.left = (rect.left + rect.width / 2 - left - 7) + "px";
}

/* ================= HOME ================= */
function renderHome() {
  const pipelineByStage = STAGES.filter(s => !s.startsWith("Closed")).map((s, i) => ({
    label: s.split(" ")[0],
    value: OPPORTUNITIES.filter(o => o.stage === s).reduce((sum, o) => sum + o.amount, 0),
    color: ["#c9e3fb", "#8fc4f5", "#5aa7ee", "#2f86dd", "#0176d3"][i],
  }));
  const leadsBySource = LEAD_SOURCES.map((s, i) => ({
    label: s,
    value: LEADS.filter(l => l.source === s).length,
    color: ["#0176d3", "#4fb3a9", "#f4bc44", "#f0824c", "#7f8de1", "#ba0517"][i % 6],
  }));

  const openOppTotal = OPPORTUNITIES.filter(o => !o.stage.startsWith("Closed")).reduce((s, o) => s + o.amount, 0);
  const wonTotal = OPPORTUNITIES.filter(o => o.stage === "Closed Won").reduce((s, o) => s + o.amount, 0);
  const wonCount = OPPORTUNITIES.filter(o => o.stage === "Closed Won").length;
  const lostCount = OPPORTUNITIES.filter(o => o.stage === "Closed Lost").length;
  const winRate = wonCount + lostCount === 0 ? 0 : Math.round((wonCount / (wonCount + lostCount)) * 100);
  const newLeadsCount = LEADS.filter(l => l.status === "New").length;

  return `
    <div class="page-title-row">
      <div class="page-title"><h1>Good afternoon, Thomas</h1></div>
      <div class="page-subtitle">Wednesday, September 9, 2026</div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card"><div class="kpi-label">Open Pipeline</div><div class="kpi-value">${fmtMoney(openOppTotal)}</div><div class="kpi-trend up">▲ 8.2% vs last month</div></div>
      <div class="kpi-card"><div class="kpi-label">Closed Won (this quarter)</div><div class="kpi-value">${fmtMoney(wonTotal)}</div><div class="kpi-trend up">▲ 12.4%</div></div>
      <div class="kpi-card"><div class="kpi-label">Win Rate</div><div class="kpi-value">${winRate}%</div><div class="kpi-trend ${winRate >= 50 ? "up" : "down"}">${winRate >= 50 ? "▲" : "▼"} vs 41% target</div></div>
      <div class="kpi-card"><div class="kpi-label">New Leads</div><div class="kpi-value">${newLeadsCount}</div><div class="kpi-trend up">▲ 5 today</div></div>
    </div>

    <div class="dashboard-grid">
      <div>
        <div class="card">
          <div class="card-header"><h2>Pipeline by Stage</h2><a data-nav="opportunities">View Opportunities</a></div>
          <div class="card-body">${svgBarChart(pipelineByStage, { width: 520, height: 220 })}</div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Recent Activity</h2></div>
          <div class="card-body">
            <ul class="task-list">
              ${ACTIVITY_FEED.map(a => `<li class="task-item">${objIcon(a.icon, 26)}<div class="task-main"><div class="task-subject">${esc(a.text)}</div><div class="task-meta">${a.time}</div></div></li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-header"><h2>My Tasks</h2><a data-nav="reports">View All</a></div>
          <div class="card-body">
            <ul class="task-list">
              ${TASKS.map(t => `
                <li class="task-item">
                  <span class="task-checkbox"></span>
                  <div class="task-main">
                    <div class="task-subject">${esc(t.subject)} ${t.priority === "High" ? '<span class="task-priority-high">●</span>' : ""}</div>
                    <div class="task-meta">${esc(t.relatedTo)} • Due ${t.due}</div>
                  </div>
                </li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Leads by Source</h2></div>
          <div class="card-body" style="display:flex;align-items:center;gap:16px;">
            ${svgDonutChart(leadsBySource, { size: 130 })}
            <div class="chart-legend" style="flex-direction:column;">
              ${leadsBySource.map(d => `<div class="legend-item"><span class="legend-swatch" style="background:${d.color}"></span>${d.label} (${d.value})</div>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function wireHome() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    if (!el.closest(".tab-bar")) el.addEventListener("click", () => navigate(el.dataset.nav));
  });
}

/* ================= GENERIC LIST HELPERS ================= */
function listToolbar(title, iconType, count, newLabel, onNew, searchId) {
  return `
    <div class="page-title-row">
      <div class="page-title">${objIcon(iconType, 32)}<h1>${title}</h1></div>
      <div><button class="btn btn-primary" onclick="${onNew}">New ${newLabel}</button></div>
    </div>
    <div class="list-toolbar">
      <div class="search-mini">${iconSvg("search", 14)}<input type="text" id="${searchId}" placeholder="Search this list..."/></div>
      <div class="count-chip">${count} items • Sorted by Name</div>
    </div>
  `;
}

function wireListSearch(inputId, rowSelector, matchFn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll(rowSelector).forEach(row => {
      row.style.display = matchFn(row, q) ? "" : "none";
    });
  });
}

function ratingStars(rating) {
  const map = { Hot: 3, Warm: 2, Cold: 1 };
  const n = map[rating] || 0;
  return `<span class="rating-star">${"★".repeat(n)}</span><span style="color:#c9c7c5">${"★".repeat(3 - n)}</span>`;
}

/* ================= ACCOUNTS ================= */
function renderAccountsList() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    ${listToolbar("Accounts", "account", ACCOUNTS.length, "Account", "openAccountForm()", "acct-search")}
    <div class="card">
      <table class="data-table" id="accounts-table">
        <thead><tr><th>Account Name</th><th>Industry</th><th>Type</th><th>Rating</th><th>Phone</th><th>Billing City</th><th>Owner</th></tr></thead>
        <tbody>
          ${ACCOUNTS.map(a => `
            <tr data-row>
              <td><div class="row-name-cell">${objIcon("account", 24)}<a data-nav="accounts/${a.id}">${esc(a.name)}</a></div></td>
              <td>${esc(a.industry)}</td>
              <td>${esc(a.type)}</td>
              <td>${ratingStars(a.rating)}</td>
              <td>${esc(a.phone)}</td>
              <td>${esc(a.billingCity)}</td>
              <td>${esc(a.owner)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  wireRowNav();
  wireListSearch("acct-search", "#accounts-table tbody tr", (row, q) => row.textContent.toLowerCase().includes(q));
}

function wireRowNav() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", e => { e.preventDefault(); navigate(el.dataset.nav); });
  });
}

function renderAccountDetail(id) {
  const a = getAccount(id);
  const main = document.getElementById("main-content");
  if (!a) { main.innerHTML = `<div class="empty-state">Account not found.</div>`; return; }
  const contacts = getContactsForAccount(id);
  const opps = getOppsForAccount(id);
  main.innerHTML = `
    <div class="breadcrumb"><a data-nav="accounts">Accounts</a> &rsaquo; ${esc(a.name)}</div>
    <div class="record-header">
      <div class="record-header-top">
        ${objIcon("account", 42)}
        <div class="record-title-block">
          <div class="eyebrow">Account</div>
          <h1>${esc(a.name)}</h1>
        </div>
        <div class="record-actions">
          <button class="btn btn-neutral btn-sm">Edit</button>
          <button class="btn btn-primary btn-sm" onclick="openOpportunityForm('${a.id}')">New Opportunity</button>
        </div>
      </div>
      <div class="record-fields-grid">
        <div class="field-block"><div class="field-label">Industry</div><div class="field-value">${esc(a.industry)}</div></div>
        <div class="field-block"><div class="field-label">Type</div><div class="field-value">${esc(a.type)}</div></div>
        <div class="field-block"><div class="field-label">Phone</div><div class="field-value">${esc(a.phone)}</div></div>
        <div class="field-block"><div class="field-label">Website</div><div class="field-value">${esc(a.website)}</div></div>
        <div class="field-block"><div class="field-label">Billing City</div><div class="field-value">${esc(a.billingCity)}</div></div>
        <div class="field-block"><div class="field-label">Employees</div><div class="field-value">${a.employees.toLocaleString()}</div></div>
        <div class="field-block"><div class="field-label">Annual Revenue</div><div class="field-value">${fmtMoney(a.revenue)}</div></div>
        <div class="field-block"><div class="field-label">Account Owner</div><div class="field-value">${esc(a.owner)}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Related Contacts (${contacts.length})</h2><button class="btn btn-sm btn-neutral" onclick="openContactForm('${a.id}')">New</button></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Title</th><th>Email</th><th>Phone</th></tr></thead>
        <tbody>
          ${contacts.length ? contacts.map(c => `
            <tr data-row><td><a data-nav="contacts/${c.id}">${esc(c.name)}</a></td><td>${esc(c.title)}</td><td>${esc(c.email)}</td><td>${esc(c.phone)}</td></tr>
          `).join("") : `<tr><td colspan="4" class="empty-state">No related contacts.</td></tr>`}
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header"><h2>Related Opportunities (${opps.length})</h2></div>
      <table class="data-table">
        <thead><tr><th>Opportunity Name</th><th>Stage</th><th>Amount</th><th>Close Date</th></tr></thead>
        <tbody>
          ${opps.length ? opps.map(o => `
            <tr data-row><td><a data-nav="opportunities/${o.id}">${esc(o.name)}</a></td><td>${stageBadge(o.stage)}</td><td>${fmtMoney(o.amount)}</td><td>${fmtDate(o.closeDate)}</td></tr>
          `).join("") : `<tr><td colspan="4" class="empty-state">No related opportunities.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  wireRowNav();
}

/* ================= CONTACTS ================= */
function renderContactsList() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    ${listToolbar("Contacts", "contact", CONTACTS.length, "Contact", "openContactForm()", "contact-search")}
    <div class="card">
      <table class="data-table" id="contacts-table">
        <thead><tr><th>Name</th><th>Title</th><th>Account</th><th>Email</th><th>Phone</th></tr></thead>
        <tbody>
          ${CONTACTS.map(c => `
            <tr data-row>
              <td><div class="row-name-cell">${objIcon("contact", 24)}<a data-nav="contacts/${c.id}">${esc(c.name)}</a></div></td>
              <td>${esc(c.title)}</td>
              <td><a data-nav="accounts/${c.accountId}">${esc(c.accountName)}</a></td>
              <td>${esc(c.email)}</td>
              <td>${esc(c.phone)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  wireRowNav();
  wireListSearch("contact-search", "#contacts-table tbody tr", (row, q) => row.textContent.toLowerCase().includes(q));
}

function renderContactDetail(id) {
  const c = CONTACTS.find(x => x.id === id);
  const main = document.getElementById("main-content");
  if (!c) { main.innerHTML = `<div class="empty-state">Contact not found.</div>`; return; }
  const acct = getAccount(c.accountId);
  main.innerHTML = `
    <div class="breadcrumb"><a data-nav="contacts">Contacts</a> &rsaquo; ${esc(c.name)}</div>
    <div class="record-header">
      <div class="record-header-top">
        ${objIcon("contact", 42)}
        <div class="record-title-block">
          <div class="eyebrow">Contact</div>
          <h1>${esc(c.name)}</h1>
        </div>
        <div class="record-actions"><button class="btn btn-neutral btn-sm">Edit</button></div>
      </div>
      <div class="record-fields-grid">
        <div class="field-block"><div class="field-label">Title</div><div class="field-value">${esc(c.title)}</div></div>
        <div class="field-block"><div class="field-label">Account</div><div class="field-value"><a data-nav="accounts/${c.accountId}">${esc(c.accountName)}</a></div></div>
        <div class="field-block"><div class="field-label">Email</div><div class="field-value">${esc(c.email)}</div></div>
        <div class="field-block"><div class="field-label">Phone</div><div class="field-value">${esc(c.phone)}</div></div>
        <div class="field-block"><div class="field-label">Owner</div><div class="field-value">${esc(c.owner)}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h2>Account Overview</h2></div>
      <div class="card-body">
        ${acct ? `${esc(acct.name)} — ${esc(acct.industry)} — ${esc(acct.billingCity)}` : "No account linked."}
      </div>
    </div>
  `;
  wireRowNav();
}

/* ================= LEADS ================= */
function statusBadge(status) {
  const cls = { New: "badge-new", Working: "badge-working", Qualified: "badge-qualified", Unqualified: "badge-unqualified" }[status] || "badge-new";
  return `<span class="badge ${cls}">${esc(status)}</span>`;
}
function stageBadge(stage) {
  if (stage === "Closed Won") return `<span class="badge badge-won">Closed Won</span>`;
  if (stage === "Closed Lost") return `<span class="badge badge-lost">Closed Lost</span>`;
  return `<span class="badge badge-open">${esc(stage)}</span>`;
}

function renderLeadsList() {
  const main = document.getElementById("main-content");
  const activeLeads = LEADS.filter(l => !l.converted);
  main.innerHTML = `
    ${listToolbar("Leads", "lead", activeLeads.length, "Lead", "openLeadForm()", "lead-search")}
    <div class="card">
      <table class="data-table" id="leads-table">
        <thead><tr><th>Name</th><th>Company</th><th>Status</th><th>Lead Source</th><th>Rating</th><th>Owner</th><th></th></tr></thead>
        <tbody>
          ${activeLeads.map(l => `
            <tr data-row>
              <td><div class="row-name-cell">${objIcon("lead", 24)}<a data-nav="leads/${l.id}">${esc(l.name)}</a></div></td>
              <td>${esc(l.company)}</td>
              <td>${statusBadge(l.status)}</td>
              <td>${esc(l.source)}</td>
              <td>${ratingStars(l.rating)}</td>
              <td>${esc(l.owner)}</td>
              <td><button class="btn btn-sm btn-neutral" onclick="convertLead('${l.id}')">Convert</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  wireRowNav();
  wireListSearch("lead-search", "#leads-table tbody tr", (row, q) => row.textContent.toLowerCase().includes(q));
}

function renderLeadDetail(id) {
  const l = LEADS.find(x => x.id === id);
  const main = document.getElementById("main-content");
  if (!l) { main.innerHTML = `<div class="empty-state">Lead not found.</div>`; return; }
  main.innerHTML = `
    <div class="breadcrumb"><a data-nav="leads">Leads</a> &rsaquo; ${esc(l.name)}</div>
    <div class="record-header">
      <div class="record-header-top">
        ${objIcon("lead", 42)}
        <div class="record-title-block">
          <div class="eyebrow">Lead ${l.converted ? "• Converted" : ""}</div>
          <h1>${esc(l.name)}</h1>
        </div>
        <div class="record-actions">
          <button class="btn btn-neutral btn-sm">Edit</button>
          ${l.converted ? "" : `<button class="btn btn-primary btn-sm" onclick="convertLead('${l.id}')">Convert</button>`}
        </div>
      </div>
      <div class="record-fields-grid">
        <div class="field-block"><div class="field-label">Company</div><div class="field-value">${esc(l.company)}</div></div>
        <div class="field-block"><div class="field-label">Title</div><div class="field-value">${esc(l.title)}</div></div>
        <div class="field-block"><div class="field-label">Status</div><div class="field-value">${statusBadge(l.status)}</div></div>
        <div class="field-block"><div class="field-label">Lead Source</div><div class="field-value">${esc(l.source)}</div></div>
        <div class="field-block"><div class="field-label">Email</div><div class="field-value">${esc(l.email)}</div></div>
        <div class="field-block"><div class="field-label">Phone</div><div class="field-value">${esc(l.phone)}</div></div>
        <div class="field-block"><div class="field-label">Rating</div><div class="field-value">${ratingStars(l.rating)}</div></div>
        <div class="field-block"><div class="field-label">Owner</div><div class="field-value">${esc(l.owner)}</div></div>
      </div>
    </div>
  `;
  wireRowNav();
}

function convertLead(id) {
  const l = LEADS.find(x => x.id === id);
  if (!l || l.converted) return;
  const acctId = `A-${1000 + ACCOUNTS.length + 1}`;
  const contactId = `C-${2000 + CONTACTS.length + 1}`;
  const oppId = `O-${4000 + OPPORTUNITIES.length + 1}`;
  const account = { id: acctId, name: l.company, industry: "Unknown", type: "Prospect", rating: l.rating, phone: l.phone, website: "-", billingCity: "-", employees: 0, revenue: 0, owner: l.owner };
  ACCOUNTS.push(account);
  CONTACTS.push({ id: contactId, name: l.name, title: l.title, accountId: acctId, accountName: account.name, email: l.email, phone: l.phone, owner: l.owner });
  OPPORTUNITIES.push({ id: oppId, name: `${l.company} – New Business`, accountId: acctId, accountName: account.name, stage: "Prospecting", amount: 25000, probability: 20, closeDate: new Date(Date.now() + 30 * 86400000).toISOString(), owner: l.owner, type: "New Business" });
  l.converted = true;
  showToast(`Lead converted: ${l.name} → Account, Contact & Opportunity created.`);
  navigate(`accounts/${acctId}`);
}

/* ================= OPPORTUNITIES ================= */
function renderOpportunitiesPage() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <div class="page-title-row">
      <div class="page-title">${objIcon("opportunity", 32)}<h1>Opportunities</h1></div>
      <div style="display:flex;gap:10px;">
        <div class="view-toggle">
          <button id="view-kanban" class="${oppView === "kanban" ? "active" : ""}">Kanban</button>
          <button id="view-list" class="${oppView === "list" ? "active" : ""}">List</button>
        </div>
        <button class="btn btn-primary" onclick="openOpportunityForm()">New Opportunity</button>
      </div>
    </div>
    <div id="opp-view-container"></div>
  `;
  document.getElementById("view-kanban").addEventListener("click", () => { oppView = "kanban"; renderOpportunitiesPage(); });
  document.getElementById("view-list").addEventListener("click", () => { oppView = "list"; renderOpportunitiesPage(); });
  document.getElementById("opp-view-container").innerHTML = oppView === "kanban" ? renderOppKanban() : renderOppList();
  wireRowNav();
  document.querySelectorAll(".kanban-card").forEach(card => {
    card.addEventListener("click", () => navigate(`opportunities/${card.dataset.id}`));
  });
}

function renderOppKanban() {
  const cols = STAGES.map(stage => {
    const opps = OPPORTUNITIES.filter(o => o.stage === stage);
    const sum = opps.reduce((s, o) => s + o.amount, 0);
    return `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="kanban-col-title">${esc(stage)} <span>${opps.length}</span></div>
          <div class="kanban-col-sum">${fmtMoney(sum)}</div>
          <div class="kanban-col-bar" style="width:${Math.min(100, opps.length * 12)}%"></div>
        </div>
        ${opps.map(o => `
          <div class="kanban-card" data-id="${o.id}">
            <div class="kc-name">${esc(o.name)}</div>
            <div class="kc-account">${esc(o.accountName)}</div>
            <div class="kc-amount">${fmtMoney(o.amount)}</div>
            <div class="kc-meta"><span>${fmtDate(o.closeDate)}</span><span title="${esc(o.owner)}">${initials(o.owner)}</span></div>
          </div>`).join("") || `<div class="empty-state" style="padding:16px 4px;">No opportunities</div>`}
      </div>`;
  }).join("");
  return `<div class="kanban-wrap"><div class="kanban-board">${cols}</div></div>`;
}

function renderOppList() {
  return `
    <div class="card">
      <table class="data-table">
        <thead><tr><th>Opportunity Name</th><th>Account</th><th>Stage</th><th>Amount</th><th>Close Date</th><th>Owner</th></tr></thead>
        <tbody>
          ${OPPORTUNITIES.map(o => `
            <tr data-row>
              <td><div class="row-name-cell">${objIcon("opportunity", 24)}<a data-nav="opportunities/${o.id}">${esc(o.name)}</a></div></td>
              <td><a data-nav="accounts/${o.accountId}">${esc(o.accountName)}</a></td>
              <td>${stageBadge(o.stage)}</td>
              <td>${fmtMoney(o.amount)}</td>
              <td>${fmtDate(o.closeDate)}</td>
              <td>${esc(o.owner)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderOpportunityDetail(id) {
  const o = OPPORTUNITIES.find(x => x.id === id);
  const main = document.getElementById("main-content");
  if (!o) { main.innerHTML = `<div class="empty-state">Opportunity not found.</div>`; return; }
  const isLost = o.stage === "Closed Lost";
  const activeStages = STAGES.filter(s => !s.startsWith("Closed"));
  const currentIdx = activeStages.indexOf(o.stage);
  main.innerHTML = `
    <div class="breadcrumb"><a data-nav="opportunities">Opportunities</a> &rsaquo; ${esc(o.name)}</div>
    <div class="record-header">
      <div class="record-header-top">
        ${objIcon("opportunity", 42)}
        <div class="record-title-block">
          <div class="eyebrow">Opportunity</div>
          <h1>${esc(o.name)}</h1>
        </div>
        <div class="record-actions"><button class="btn btn-neutral btn-sm">Edit</button></div>
      </div>
      <div class="record-fields-grid">
        <div class="field-block"><div class="field-label">Account</div><div class="field-value"><a data-nav="accounts/${o.accountId}">${esc(o.accountName)}</a></div></div>
        <div class="field-block"><div class="field-label">Amount</div><div class="field-value">${fmtMoney(o.amount)}</div></div>
        <div class="field-block"><div class="field-label">Close Date</div><div class="field-value">${fmtDate(o.closeDate)}</div></div>
        <div class="field-block"><div class="field-label">Probability</div><div class="field-value">${o.probability}%</div></div>
        <div class="field-block"><div class="field-label">Type</div><div class="field-value">${esc(o.type)}</div></div>
        <div class="field-block"><div class="field-label">Owner</div><div class="field-value">${esc(o.owner)}</div></div>
      </div>
      ${isLost ? `<div class="path-bar"><div class="path-step lost">Closed Lost</div></div>` : `
        <div class="path-bar">
          ${activeStages.map((s, i) => `<div class="path-step ${i < currentIdx ? "done" : i === currentIdx ? "current" : ""}">${esc(s)}</div>`).join("")}
          <div class="path-step ${o.stage === "Closed Won" ? "done" : ""}">Closed Won</div>
        </div>`}
    </div>
    <div class="card">
      <div class="card-header"><h2>Related Contacts</h2></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Title</th><th>Email</th></tr></thead>
        <tbody>
          ${getContactsForAccount(o.accountId).map(c => `<tr data-row><td><a data-nav="contacts/${c.id}">${esc(c.name)}</a></td><td>${esc(c.title)}</td><td>${esc(c.email)}</td></tr>`).join("") || `<tr><td colspan="3" class="empty-state">No related contacts.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  wireRowNav();
}

/* ================= REPORTS ================= */
function renderReports() {
  const main = document.getElementById("main-content");
  const byOwner = OWNERS.map((owner, i) => ({
    label: owner.split(" ")[0],
    value: OPPORTUNITIES.filter(o => o.owner === owner && !o.stage.startsWith("Closed")).reduce((s, o) => s + o.amount, 0),
    color: ["#0176d3", "#4fb3a9", "#f4bc44", "#f0824c", "#7f8de1"][i % 5],
  }));
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const revenueTrend = months.map((m, i) => ({ label: m, value: 60000 + i * 22000 + Math.round(Math.random() * 15000) }));
  const leadStatusCounts = LEAD_STATUSES.map((s, i) => ({ label: s, value: LEADS.filter(l => l.status === s).length, color: ["#0176d3", "#f4bc44", "#2e844a", "#706e6b"][i] }));

  main.innerHTML = `
    <div class="page-title-row"><div class="page-title">${objIcon("report", 32)}<h1>Reports &amp; Dashboards</h1></div></div>
    <div class="dashboard-grid">
      <div>
        <div class="card">
          <div class="card-header"><h2>Revenue Trend (Closed Won, by Month)</h2></div>
          <div class="card-body">${svgLineChart(revenueTrend, { width: 520, height: 200 })}</div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Open Pipeline by Owner</h2></div>
          <div class="card-body">${svgBarChart(byOwner, { width: 520, height: 220 })}</div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-header"><h2>Leads by Status</h2></div>
          <div class="card-body" style="display:flex;align-items:center;gap:16px;">
            ${svgDonutChart(leadStatusCounts, { size: 130 })}
            <div class="chart-legend" style="flex-direction:column;">
              ${leadStatusCounts.map(d => `<div class="legend-item"><span class="legend-swatch" style="background:${d.color}"></span>${d.label} (${d.value})</div>`).join("")}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Summary</h2></div>
          <div class="card-body">
            <div class="task-list">
              <div class="task-item"><div class="task-main"><div class="task-subject">Total Accounts</div></div><div>${ACCOUNTS.length}</div></div>
              <div class="task-item"><div class="task-main"><div class="task-subject">Total Contacts</div></div><div>${CONTACTS.length}</div></div>
              <div class="task-item"><div class="task-main"><div class="task-subject">Open Opportunities</div></div><div>${OPPORTUNITIES.filter(o => !o.stage.startsWith("Closed")).length}</div></div>
              <div class="task-item"><div class="task-main"><div class="task-subject">Active Leads</div></div><div>${LEADS.filter(l => !l.converted).length}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ================= FORMS ================= */
function openLeadForm() {
  openModal(`
    <div class="modal-header"><h2>New Lead</h2><button class="modal-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="form-row"><label>First &amp; Last Name*</label><input id="f-name" placeholder="Jane Doe"/></div>
      <div class="form-row"><label>Company*</label><input id="f-company" placeholder="Acme Corp"/></div>
      <div class="form-row"><label>Title</label><input id="f-title" placeholder="VP of Sales"/></div>
      <div class="form-row"><label>Email</label><input id="f-email" placeholder="jane@acme.com"/></div>
      <div class="form-row"><label>Phone</label><input id="f-phone" placeholder="(555) 555-0100"/></div>
      <div class="form-row"><label>Lead Source</label>
        <select id="f-source">${LEAD_SOURCES.map(s => `<option>${s}</option>`).join("")}</select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-neutral" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitLeadForm()">Save</button>
    </div>
  `);
}
function submitLeadForm() {
  const name = document.getElementById("f-name").value.trim();
  const company = document.getElementById("f-company").value.trim();
  if (!name || !company) { showToast("Name and Company are required.", "error"); return; }
  const id = `L-${3000 + LEADS.length + 1}`;
  LEADS.unshift({
    id, name, company,
    title: document.getElementById("f-title").value.trim() || "-",
    email: document.getElementById("f-email").value.trim() || "-",
    phone: document.getElementById("f-phone").value.trim() || "-",
    status: "New", source: document.getElementById("f-source").value,
    rating: "Warm", owner: "Thomas Prendergast", createdDate: new Date().toISOString(), converted: false,
  });
  closeModal();
  showToast(`Lead "${name}" created.`);
  navigate(`leads/${id}`);
}

function openAccountForm() {
  openModal(`
    <div class="modal-header"><h2>New Account</h2><button class="modal-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="form-row"><label>Account Name*</label><input id="f-acctname" placeholder="Acme Corp"/></div>
      <div class="form-row"><label>Industry</label><input id="f-industry" placeholder="Technology"/></div>
      <div class="form-row"><label>Phone</label><input id="f-acctphone" placeholder="(555) 555-0100"/></div>
      <div class="form-row"><label>Website</label><input id="f-website" placeholder="acme.com"/></div>
      <div class="form-row"><label>Billing City</label><input id="f-city" placeholder="San Francisco, CA"/></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-neutral" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitAccountForm()">Save</button>
    </div>
  `);
}
function submitAccountForm() {
  const name = document.getElementById("f-acctname").value.trim();
  if (!name) { showToast("Account Name is required.", "error"); return; }
  const id = `A-${1000 + ACCOUNTS.length + 1}`;
  ACCOUNTS.push({
    id, name, industry: document.getElementById("f-industry").value.trim() || "-",
    type: "Prospect", rating: "Warm",
    phone: document.getElementById("f-acctphone").value.trim() || "-",
    website: document.getElementById("f-website").value.trim() || "-",
    billingCity: document.getElementById("f-city").value.trim() || "-",
    employees: 0, revenue: 0, owner: "Thomas Prendergast",
  });
  closeModal();
  showToast(`Account "${name}" created.`);
  navigate(`accounts/${id}`);
}

function openContactForm(accountId) {
  openModal(`
    <div class="modal-header"><h2>New Contact</h2><button class="modal-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="form-row"><label>Full Name*</label><input id="f-cname" placeholder="Jane Doe"/></div>
      <div class="form-row"><label>Title</label><input id="f-ctitle" placeholder="VP of Sales"/></div>
      <div class="form-row"><label>Account*</label>
        <select id="f-caccount">${ACCOUNTS.map(a => `<option value="${a.id}" ${a.id === accountId ? "selected" : ""}>${esc(a.name)}</option>`).join("")}</select>
      </div>
      <div class="form-row"><label>Email</label><input id="f-cemail" placeholder="jane@acme.com"/></div>
      <div class="form-row"><label>Phone</label><input id="f-cphone" placeholder="(555) 555-0100"/></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-neutral" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitContactForm()">Save</button>
    </div>
  `);
}
function submitContactForm() {
  const name = document.getElementById("f-cname").value.trim();
  const accountId = document.getElementById("f-caccount").value;
  if (!name || !accountId) { showToast("Name and Account are required.", "error"); return; }
  const acct = getAccount(accountId);
  const id = `C-${2000 + CONTACTS.length + 1}`;
  CONTACTS.push({
    id, name, title: document.getElementById("f-ctitle").value.trim() || "-",
    accountId, accountName: acct.name,
    email: document.getElementById("f-cemail").value.trim() || "-",
    phone: document.getElementById("f-cphone").value.trim() || "-",
    owner: "Thomas Prendergast",
  });
  closeModal();
  showToast(`Contact "${name}" created.`);
  navigate(`contacts/${id}`);
}

function openOpportunityForm(accountId) {
  openModal(`
    <div class="modal-header"><h2>New Opportunity</h2><button class="modal-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="form-row"><label>Opportunity Name*</label><input id="f-oname" placeholder="Acme Corp – Platform Rollout"/></div>
      <div class="form-row"><label>Account*</label>
        <select id="f-oaccount">${ACCOUNTS.map(a => `<option value="${a.id}" ${a.id === accountId ? "selected" : ""}>${esc(a.name)}</option>`).join("")}</select>
      </div>
      <div class="form-row"><label>Stage</label>
        <select id="f-ostage">${STAGES.map(s => `<option>${s}</option>`).join("")}</select>
      </div>
      <div class="form-row"><label>Amount</label><input id="f-oamount" type="number" placeholder="50000"/></div>
      <div class="form-row"><label>Close Date</label><input id="f-oclose" type="date"/></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-neutral" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitOpportunityForm()">Save</button>
    </div>
  `);
}
function submitOpportunityForm() {
  const name = document.getElementById("f-oname").value.trim();
  const accountId = document.getElementById("f-oaccount").value;
  if (!name || !accountId) { showToast("Name and Account are required.", "error"); return; }
  const acct = getAccount(accountId);
  const id = `O-${4000 + OPPORTUNITIES.length + 1}`;
  const stage = document.getElementById("f-ostage").value;
  const closeVal = document.getElementById("f-oclose").value;
  OPPORTUNITIES.push({
    id, name, accountId, accountName: acct.name, stage,
    amount: Number(document.getElementById("f-oamount").value) || 10000,
    probability: 20,
    closeDate: closeVal ? new Date(closeVal).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
    owner: "Thomas Prendergast", type: "New Business",
  });
  closeModal();
  showToast(`Opportunity "${name}" created.`);
  navigate(`opportunities/${id}`);
}
