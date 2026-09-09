// Zapa CRM Inc — in-memory demo data. Resets on reload.

const OWNERS = ["Thomas Prendergast", "Ava Chen", "Marcus Diallo", "Priya Nair", "Jonas Weber"];

function initials(name) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fmtMoney(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const ACCOUNTS = [
  { id: "A-1001", name: "Northwind Traders", industry: "Retail", type: "Customer", rating: "Hot", phone: "(415) 555-0142", website: "northwindtraders.com", billingCity: "San Francisco, CA", employees: 1200, revenue: 84000000, owner: "Thomas Prendergast" },
  { id: "A-1002", name: "Globex Manufacturing", industry: "Manufacturing", type: "Customer", rating: "Warm", phone: "(312) 555-0110", website: "globexmfg.com", billingCity: "Chicago, IL", employees: 4300, revenue: 210000000, owner: "Ava Chen" },
  { id: "A-1003", name: "Initech Solutions", industry: "Technology", type: "Prospect", rating: "Hot", phone: "(512) 555-0199", website: "initech-sol.com", billingCity: "Austin, TX", employees: 650, revenue: 42000000, owner: "Marcus Diallo" },
  { id: "A-1004", name: "Cascade Health Group", industry: "Healthcare", type: "Customer", rating: "Warm", phone: "(206) 555-0177", website: "cascadehealthgrp.com", billingCity: "Seattle, WA", employees: 8200, revenue: 560000000, owner: "Priya Nair" },
  { id: "A-1005", name: "Umbrella Logistics", industry: "Transportation", type: "Prospect", rating: "Cold", phone: "(305) 555-0133", website: "umbrellalogix.com", billingCity: "Miami, FL", employees: 980, revenue: 71000000, owner: "Jonas Weber" },
  { id: "A-1006", name: "Stark Financial Group", industry: "Finance", type: "Customer", rating: "Hot", phone: "(212) 555-0166", website: "starkfg.com", billingCity: "New York, NY", employees: 3100, revenue: 390000000, owner: "Thomas Prendergast" },
  { id: "A-1007", name: "Wayfarer Media", industry: "Media", type: "Prospect", rating: "Warm", phone: "(213) 555-0155", website: "wayfarermedia.com", billingCity: "Los Angeles, CA", employees: 420, revenue: 22000000, owner: "Ava Chen" },
  { id: "A-1008", name: "Hooli Energy", industry: "Energy", type: "Customer", rating: "Warm", phone: "(720) 555-0121", website: "hoolienergy.com", billingCity: "Denver, CO", employees: 5600, revenue: 780000000, owner: "Marcus Diallo" },
  { id: "A-1009", name: "Pinnacle Insurance Co.", industry: "Insurance", type: "Customer", rating: "Hot", phone: "(617) 555-0188", website: "pinnacleinsure.com", billingCity: "Boston, MA", employees: 2700, revenue: 265000000, owner: "Priya Nair" },
  { id: "A-1010", name: "BlueRiver Foods", industry: "Food & Beverage", type: "Prospect", rating: "Cold", phone: "(414) 555-0144", website: "blueriverfoods.com", billingCity: "Milwaukee, WI", employees: 1100, revenue: 96000000, owner: "Jonas Weber" },
  { id: "A-1011", name: "Solace Biotech", industry: "Biotechnology", type: "Prospect", rating: "Warm", phone: "(858) 555-0112", website: "solacebiotech.com", billingCity: "San Diego, CA", employees: 340, revenue: 18000000, owner: "Thomas Prendergast" },
  { id: "A-1012", name: "Ironclad Construction", industry: "Construction", type: "Customer", rating: "Warm", phone: "(602) 555-0177", website: "ironcladconstruction.com", billingCity: "Phoenix, AZ", employees: 1560, revenue: 133000000, owner: "Ava Chen" },
];

const CONTACT_TITLES = ["VP of Sales", "Chief Technology Officer", "Procurement Manager", "Director of Operations", "IT Director", "Chief Financial Officer", "Head of Marketing", "VP of Engineering", "Business Analyst", "Chief Executive Officer"];
const FIRST = ["Sarah","James","Emily","Michael","Olivia","David","Sophia","Daniel","Grace","Ryan","Natalie","Kevin","Laura","Brian","Chloe","Andrew","Megan","Tyler","Rachel","Justin"];
const LAST = ["Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Wilson","Anderson","Taylor","Thomas","Moore","Jackson","Martin","Lee","Perez","Thompson","White"];

const CONTACTS = [];
for (let i = 0; i < 24; i++) {
  const acct = ACCOUNTS[i % ACCOUNTS.length];
  const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`;
  CONTACTS.push({
    id: `C-${2001 + i}`,
    name,
    title: rand(CONTACT_TITLES),
    accountId: acct.id,
    accountName: acct.name,
    email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}@${acct.website}`,
    phone: `(${400 + i}) 555-0${100 + i}`,
    owner: acct.owner,
  });
}

const LEAD_SOURCES = ["Web", "Referral", "Trade Show", "Cold Call", "Partner", "Advertisement"];
const LEAD_STATUSES = ["New", "Working", "Qualified", "Unqualified"];
const LEAD_COMPANIES = ["Acme Robotics", "BrightPath Learning", "Cedarwood Realty", "Delta Freight", "Everest Consulting", "Falcon Security", "Granite Capital", "Harbor Point Systems", "Ivory Coast Apparel", "Juniper Wellness", "Keystone Analytics", "Lumen Software", "Meridian Foods", "Novak Steel", "Orbit Telecom", "Palisade Legal", "Quantum Retail", "Riverside Motors", "Summit Health", "Trailhead Media", "Union Square Bank", "Vanguard Aero", "Westfield Goods", "Yonder Travel", "Zenith Robotics"];

const LEADS = LEAD_COMPANIES.map((company, i) => {
  const name = `${FIRST[(i + 5) % FIRST.length]} ${LAST[(i * 5 + 2) % LAST.length]}`;
  return {
    id: `L-${3001 + i}`,
    name,
    company,
    title: rand(CONTACT_TITLES),
    email: `${name.split(" ")[0].toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone: `(${500 + i}) 555-0${200 + i}`,
    status: LEAD_STATUSES[i % LEAD_STATUSES.length],
    source: rand(LEAD_SOURCES),
    rating: rand(["Hot", "Warm", "Cold"]),
    owner: rand(OWNERS),
    createdDate: new Date(2026, 7, (i % 27) + 1).toISOString(),
    converted: false,
  };
});

const STAGES = ["Prospecting", "Qualification", "Needs Analysis", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
const OPP_TYPES = ["New Business", "Existing Business - Upgrade", "Existing Business - Renewal"];

const OPP_NAME_SUFFIX = ["Platform Rollout", "Enterprise License", "Annual Renewal", "Cloud Migration", "Support Expansion", "Q4 Upsell", "Implementation Project", "Managed Services Deal", "Site License", "Growth Package"];

const OPPORTUNITIES = [];
for (let i = 0; i < 20; i++) {
  const acct = ACCOUNTS[i % ACCOUNTS.length];
  const stage = STAGES[i % STAGES.length];
  const amount = 15000 + Math.round(Math.random() * 240000);
  const closeOffset = stage.startsWith("Closed") ? -((i % 20) + 1) : (i % 45) + 3;
  OPPORTUNITIES.push({
    id: `O-${4001 + i}`,
    name: `${acct.name} – ${rand(OPP_NAME_SUFFIX)}`,
    accountId: acct.id,
    accountName: acct.name,
    stage,
    amount,
    probability: stage === "Closed Won" ? 100 : stage === "Closed Lost" ? 0 : [20, 40, 60, 75, 90][STAGES.indexOf(stage)] || 50,
    closeDate: new Date(Date.now() + closeOffset * 86400000).toISOString(),
    owner: acct.owner,
    type: rand(OPP_TYPES),
  });
}

const TASKS = [
  { id: "T-1", subject: "Follow up on proposal", relatedTo: "Globex Manufacturing", due: "Today", priority: "High" },
  { id: "T-2", subject: "Send contract redline", relatedTo: "Stark Financial Group", due: "Today", priority: "High" },
  { id: "T-3", subject: "Schedule demo call", relatedTo: "Initech Solutions", due: "Tomorrow", priority: "Normal" },
  { id: "T-4", subject: "Check in post-implementation", relatedTo: "Cascade Health Group", due: "Sep 11", priority: "Normal" },
  { id: "T-5", subject: "Renewal discussion", relatedTo: "Pinnacle Insurance Co.", due: "Sep 12", priority: "High" },
  { id: "T-6", subject: "Qualify inbound lead", relatedTo: "Keystone Analytics", due: "Sep 13", priority: "Normal" },
];

const ACTIVITY_FEED = [
  { icon: "opportunity", text: "Ava Chen moved Globex Manufacturing – Cloud Migration to Negotiation", time: "2h ago" },
  { icon: "lead", text: "New lead Riverside Motors captured from Web", time: "3h ago" },
  { icon: "account", text: "Thomas Prendergast updated Stark Financial Group billing address", time: "5h ago" },
  { icon: "contact", text: "Priya Nair added contact Laura Davis to Pinnacle Insurance Co.", time: "1d ago" },
  { icon: "opportunity", text: "Closed Won: Ironclad Construction – Site License ($" + (61000).toLocaleString() + ")", time: "1d ago" },
];

function getAccount(id) { return ACCOUNTS.find(a => a.id === id); }
function getContactsForAccount(id) { return CONTACTS.filter(c => c.accountId === id); }
function getOppsForAccount(id) { return OPPORTUNITIES.filter(o => o.accountId === id); }
