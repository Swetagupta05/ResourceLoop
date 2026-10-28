import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";

const navItems = [
  ["/dashboard", "▦", "Dashboard"], ["/products", "▣", "My Products"],
  ["/maintenance", "⚙", "Maintenance"], ["/repairs", "🛠", "Repair Center"],
  ["/resale", "♡", "Resale & Donation"], ["/recycling", "♻", "Recycling"],
  ["/analytics", "▥", "Analytics"], ["/community", "♧", "Community"], ["/settings", "⚙", "Settings"]
];
const initialProducts = [
  { id: 1, name: "MacBook Air", icon: "💻", category: "Laptop", date: "12 Jan 2024", condition: "Good", action: "Continue use" },
  { id: 2, name: "iPhone 13", icon: "📱", category: "Smartphone", date: "20 Aug 2023", condition: "Needs Service", action: "Book repair" },
  { id: 3, name: "Sony WH-1000XM4", icon: "🎧", category: "Audio", date: "02 Feb 2024", condition: "Good", action: "Keep using" },
  { id: 4, name: "HP DeskJet 2720", icon: "🖨️", category: "Printer", date: "14 Mar 2022", condition: "End of Life", action: "Find recycling" },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [impactPeriod, setImpactPeriod] = useState("This Year");
  const toastTimer = useRef(null);
  const location = useLocation();
  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  const addProduct = () => {
    const name = window.prompt("Enter the product name:");
    if (!name?.trim()) return;
    const category = window.prompt("Enter product category (e.g. Laptop, Phone, Audio):") || "Other";
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setProducts((old) => [{ id: Date.now(), name: name.trim(), icon: "📦", category: category.trim() || "Other", date, condition: "Good", action: "Continue use" }, ...old]);
    notify(`${name.trim()} added to your product list!`);
  };
  const visibleProducts = useMemo(() => products.filter(p => `${p.name} ${p.category} ${p.condition}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const exportSummary = () => {
    const csv = "Metric,Value\nEstimated CO2 saved,48 kg\nWater saved,1200 L\nTrees equivalent,15\n";
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "resourceloop-impact-summary.csv";
    link.click(); URL.revokeObjectURL(link.href); notify("Impact summary exported");
  };
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon">♻</div><div><div className="brand-name">ResourceLoop</div><div className="brand-tag">Track · Maintain · Reuse · Repeat</div></div></div>
      <nav className="nav" aria-label="Main navigation">
        {navItems.map(([to, icon, label]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? "active" : ""}><span className="ico">{icon}</span><span className="label">{label}</span></NavLink>)}
      </nav>
      <div className="side-promo"><div className="sprout">♧</div><h3>Small Choices<br/>Big Impact</h3><p>Give your products a longer life.</p><button aria-label="Explore sustainability" onClick={() => notify("Every small action helps reduce waste.")}>→</button></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <label className="search">⌕ <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands, or services..." aria-label="Search products" /></label>
        <button className="icon-btn" aria-label="Notifications" onClick={() => notify("You're all caught up!")}>♧<span className="dot" /></button>
        <button className="profile" onClick={() => notify("Profile menu coming soon")}><span className="avatar">SG</span><span className="name">Sweta Gupta</span><span className="chev">⌄</span></button>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard products={visibleProducts} total={products.length} addProduct={addProduct} notify={notify} impactPeriod={impactPeriod} setImpactPeriod={setImpactPeriod} />} />
        <Route path="/products" element={<ProductsPage products={visibleProducts} total={products.length} addProduct={addProduct} />} />
        <Route path="/maintenance" element={<MaintenancePage notify={notify} />} />
        <Route path="/repairs" element={<RepairsPage notify={notify} />} />
        <Route path="/resale" element={<ResalePage notify={notify} />} />
        <Route path="/recycling" element={<RecyclingPage notify={notify} />} />
        <Route path="/analytics" element={<AnalyticsPage exportSummary={exportSummary} />} />
        <Route path="/community" element={<CommunityPage notify={notify} />} />
        <Route path="/settings" element={<SettingsPage notify={notify} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <footer className="footer">ResourceLoop · Track · Maintain · Reuse · Repeat</footer>
    </main>
    <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

function Dashboard({ products, total, addProduct, notify, impactPeriod, setImpactPeriod }) {
  const donutRef = useRef(null); const impactRef = useRef(null);
  useEffect(() => {
    const canvas = donutRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); const dpr = window.devicePixelRatio || 1; const size = canvas.clientWidth || 160;
    canvas.width = size * dpr; canvas.height = size * dpr; ctx.scale(dpr, dpr);
    const data = [{v:58,c:"#287451"},{v:12,c:"#d88938"},{v:13,c:"#d5bd51"},{v:9,c:"#6c9c78"},{v:8,c:"#a8c8ad"}];
    let start = -Math.PI / 2; data.forEach(d => { const end = start + Math.PI * 2 * d.v / 100; ctx.beginPath(); ctx.arc(size/2,size/2,size*.43,start,end); ctx.arc(size/2,size/2,size*.28,end,start,true); ctx.closePath(); ctx.fillStyle=d.c; ctx.fill(); start=end; });
  }, []);
  useEffect(() => {
    const canvas = impactRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); const w = canvas.clientWidth || 300, h = canvas.clientHeight || 132, dpr = window.devicePixelRatio || 1;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.scale(dpr,dpr);
    const values = impactPeriod === "This Month" ? [2,4,3,6,5,8,7,9,8,11] : [9,8,16,15,26,20,27,33,29,35];
    const max = Math.ceil(Math.max(...values)/10)*10, p={l:25,r:7,t:8,b:20}; const x=i=>p.l+i*(w-p.l-p.r)/(values.length-1); const y=v=>h-p.b-v/max*(h-p.t-p.b);
    ctx.strokeStyle="#e6ece5"; ctx.fillStyle="#778278"; ctx.font="9px system-ui";
    for(let i=0;i<=3;i++){const yy=p.t+i*(h-p.t-p.b)/3;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();ctx.fillText(Math.round(max*(1-i/3)),1,yy+3)}
    ctx.beginPath(); values.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v))); ctx.lineTo(x(values.length-1),h-p.b);ctx.lineTo(x(0),h-p.b);ctx.closePath();const grad=ctx.createLinearGradient(0,p.t,0,h-p.b);grad.addColorStop(0,"rgba(54,132,79,.28)");grad.addColorStop(1,"rgba(54,132,79,.02)");ctx.fillStyle=grad;ctx.fill();
    ctx.beginPath();values.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle="#287451";ctx.lineWidth=2.3;ctx.stroke();
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"].forEach((m,i)=>{if(i%2===0||i===9)ctx.fillText(m,x(i)-7,h-4)});
  }, [impactPeriod]);
  const lifecycle = [["In Use",58,"#287451"],["Under Maintenance",12,"#d88938"],["Repaired",13,"#d5bd51"],["Resold / Donated",9,"#6c9c78"],["Recycled",8,"#a8c8ad"]];
  return <>
    <section className="hero"><div className="hero-content"><div className="eyebrow">A more sustainable way of living</div><h1>Make Every Product Go Further</h1><p>Track. Maintain. Repair. Resell. Reuse. Recycle.</p><p>ResourceLoop helps you extend the life of your products and reduce environmental impact.</p><div className="hero-actions"><button className="btn-primary" onClick={addProduct}>＋ Add Your Product</button><button className="btn-ghost" onClick={() => notify("ResourceLoop helps you make more sustainable product choices.")}>▷ &nbsp;Watch How It Works</button></div></div><div className="hero-art" aria-hidden="true">♻</div></section>
    <section className="impact-strip"><div className="strip-head"><span>Today's Impact <span style={{color:"#4d985e"}}>♧</span></span><NavLink className="page-link" to="/analytics">→</NavLink></div><div className="strip-grid"><StripStat icon="♧" value="12 kg" label="Estimated e-waste avoided"/><StripStat icon="▣" value={Math.max(8,total)} label="Products under active use"/><StripStat icon="♻" value="2" label="Items repaired instead of replaced"/></div></section>
    <section className="metrics"><Metric icon="▣" value={total+20} label="Products Tracked" note="↗ Your tracked collection"/><Metric icon="⚙" tone="orange" value="3" label="Upcoming Maintenance" note="● Needs attention"/><Metric icon="🛠" tone="blue" value="2" label="Open Repair Cases" note="● In progress"/><Metric icon="♻" value="8" label="Reuse / Recycle Actions" note="↗ +2 this month"/></section>
    <section className="dash-grid"><div className="panel"><div className="panel-title">Product Lifecycle Overview <select className="select" defaultValue="This Year" onChange={() => notify("Lifecycle chart shows sample lifecycle distribution.")}><option>This Year</option><option>This Month</option></select></div><div className="lifecycle-layout"><div className="donut-wrap"><canvas ref={donutRef} aria-label="Product lifecycle chart"/><div className="donut-center"><strong>{total+20}</strong><span>Products</span></div></div><div className="legend">{lifecycle.map(([name,value,color])=><div className="legend-row" key={name}><i className="legend-dot" style={{background:color}}/><span>{name}</span><b>{value}%</b></div>)}</div></div></div>
      <div className="panel"><div className="panel-title">Environmental Impact <select className="select" value={impactPeriod} onChange={e=>setImpactPeriod(e.target.value)}><option>This Year</option><option>This Month</option></select></div><div className="impact-chips"><ImpactChip symbol="♧" value="48 kg" label="CO₂ saved"/><ImpactChip symbol="♧" value="1,200 L" label="Water saved"/><ImpactChip symbol="♧" value="15" label="Trees equivalent"/></div><div className="chart-wrap"><canvas ref={impactRef} /></div></div>
      <div className="panel actions-panel"><div className="panel-title">Recommended Actions <NavLink className="page-link" to="/products">→</NavLink></div><div className="action-list"><Action icon="💻" title="Laptop" desc="Warranty expires in 2 months" button="View" onClick={()=>notify("Laptop details opened")}/><Action icon="📱" title="Smartphone" desc="Screen issue detected" button="Get Repair Quote" onClick={()=>notify("Repair quote request started")}/><Action icon="🎧" title="Earphones" desc="Good condition for resale" button="List for Resale" onClick={()=>notify("Resale listing started")}/><Action icon="🖨️" title="Printer" desc="Consider recycling" button="Find Center" onClick={()=>notify("Recycling center finder coming soon")}/></div></div></section>
    <section className="bottom-grid"><div className="panel"><div className="panel-title">Recent Products <NavLink className="page-link" to="/products">View All →</NavLink></div><ProductTable products={products.slice(0,4)} notify={notify}/></div><div className="sustainability"><div className="eyebrow">♧ Because Resources Matter</div><h2>A More Sustainable Tomorrow</h2><p>Every repair, reuse, and recycle action adds up to a cleaner, greener planet.</p><button onClick={()=>notify("Thanks for joining the sustainability movement!")}>Join the Movement →</button></div></section>
  </>;
}
function StripStat({icon,value,label}){return <div className="strip-stat"><div className="strip-icon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div></div>}
function Metric({icon,value,label,note,tone=""}){return <div className="metric"><div className={`metric-icon ${tone}`}>{icon}</div><div><strong>{value}</strong><label>{label}</label><small>{note}</small></div></div>}
function ImpactChip({symbol,value,label}){return <div className="impact-chip"><div className="symbol">{symbol}</div><strong>{value}</strong><small>{label}</small></div>}
function Action({icon,title,desc,button,onClick}){return <div className="action"><div className="emoji">{icon}</div><div className="action-copy"><strong>{title}</strong><small>{desc}</small></div><button onClick={onClick}>{button}</button></div>}
function ProductTable({products,notify}){return <div className="table-wrap"><table className="products"><thead><tr><th>Product</th><th>Category</th><th>Purchase Date</th><th>Condition</th><th>Next Action</th></tr></thead><tbody>{products.length ? products.map(p=><tr key={p.id}><td><div className="product-name"><span className="product-thumb">{p.icon}</span>{p.name}</div></td><td>{p.category}</td><td>{p.date}</td><td><span className={`condition ${p.condition==="Needs Service"?"service":p.condition==="End of Life"?"end":""}`}>{p.condition}</span></td><td><button className={`table-action ${p.condition==="Needs Service"?"service":p.condition==="End of Life"?"recycle":""}`} onClick={()=>notify(`${p.name}: ${p.action}`)}>{p.action}</button></td></tr>) : <tr><td colSpan="5" className="empty-state">No matching products found.</td></tr>}</tbody></table></div>}
function PageHeading({title,description,actions}){return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{actions&&<div className="page-actions">{actions}</div>}</div>}
function StatCards({items}){return <div className="page-grid">{items.map(([label,value,note])=><div className="page-stat" key={label}><span>{label}</span><strong>{value}</strong><span>{note}</span></div>)}</div>}
function Note({children}){return <div className="page-note">{children}</div>}
function DataTable({headers,rows}){return <div className="panel page-section"><div className="table-wrap"><table className="page-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></div>}
function ProductsPage({products,total,addProduct}){return <><PageHeading title="My Products" description="Keep track of the products you own and choose their next best action." actions={<button className="page-btn" onClick={addProduct}>＋ Add Product</button>}/><StatCards items={[["Total products",total+20,"Across your collection"],["In active use",Math.max(8,total),"Products currently in use"],["Need attention",3,"Service or end-of-life actions"]]}/><div className="panel page-section"><div className="panel-title">Your product collection <span style={{fontSize:11,color:"var(--muted)",fontWeight:500}}>Demo records</span></div><ProductTable products={products} notify={()=>{}}/></div><Note>Tip: repairing or reusing a product often extends its useful life and reduces waste.</Note></>}
function MaintenancePage({notify}){return <><PageHeading title="Maintenance" description="Stay ahead of warranties, routine care, and product servicing." actions={<button className="page-btn" onClick={()=>notify("Maintenance reminder form opened")}>＋ Add Reminder</button>}/><StatCards items={[["Upcoming reminders","4","Next 30 days"],["Warranty expiring","2","Review coverage soon"],["Maintenance completed","7","This year"]]}/><DataTable headers={["Product","Task","Due date","Priority","Status"]} rows={[["💻 MacBook Air","Clean vents and check battery","05 Nov 2026",<span className="status-pill warn">Medium</span>,"Upcoming"],["📱 iPhone 13","Battery health check","31 Oct 2026",<span className="status-pill warn">High</span>,"Due soon"],["🖨️ HP DeskJet 2720","Assess repairability","12 Nov 2026",<span className="status-pill blue">Low</span>,"Planned"]]}/><Note>Set regular reminders for cleaning, software updates, battery care, and warranty checks.</Note></>}
function RepairsPage({notify}){return <><PageHeading title="Repair Center" description="Explore repair options before replacing a product." actions={<button className="page-btn" onClick={()=>notify("Repair request started")}>＋ Request Repair</button>}/><StatCards items={[["Open repair requests","2","Awaiting action"],["Estimated items saved","6","Kept in use through repair"],["Average repair cost","₹1,250","Illustrative estimate"]]}/><DataTable headers={["Product","Issue","Suggested next step","Status"]} rows={[["📱 iPhone 13","Screen issue","Request a screen repair quote",<span className="status-pill warn">Needs quote</span>],["💻 MacBook Air","Battery performance","Run diagnostics",<span className="status-pill blue">To review</span>],["🎧 Headphones","Ear cushion wear","Replace cushions",<span className="status-pill">Easy fix</span>]]}/><Note>Compare repair cost and product condition before deciding to replace an item.</Note></>}
function ResalePage({notify}){return <><PageHeading title="Resale & Donation" description="Give useful products a second life with resale or donation." actions={<button className="page-btn" onClick={()=>notify("New resale or donation listing started")}>＋ Create Listing</button>}/><StatCards items={[["Active listings","3","Available for a new owner"],["Items donated","5","Giving products another life"],["Potential resale value","₹8,400","Illustrative estimate"]]}/><DataTable headers={["Product","Condition","Suggested route","Estimated value","Action"]} rows={[["🎧 Sony headphones",<span className="status-pill">Good</span>,"Resale","₹4,000",<button className="table-action" onClick={()=>notify("Headphones listing started")}>List item</button>],["📚 Study books",<span className="status-pill">Good</span>,"Donation","Community benefit",<button className="table-action" onClick={()=>notify("Donation option opened")}>Donate</button>],["🪑 Desk chair",<span className="status-pill blue">Fair</span>,"Resale / donation","₹1,200",<button className="table-action" onClick={()=>notify("Chair listing started")}>List item</button>]]}/><Note>Clean the item, describe its condition honestly, and include clear photos before listing.</Note></>}
function RecyclingPage({notify}){return <><PageHeading title="Recycling" description="Find responsible end-of-life options for electronics and household products." actions={<button className="page-btn" onClick={()=>notify("Recycling center search opened")}>Find a Center</button>}/><StatCards items={[["Items ready to recycle","2","Require responsible disposal"],["Collection options","4","Illustrative nearby options"],["Material recovery","Tracked","Log recycling outcomes"]]}/><DataTable headers={["Product","Before recycling","Recommended route","Status"]} rows={[["🖨️ HP DeskJet printer","Remove cartridges where possible","Authorized e-waste collection",<span className="status-pill warn">To arrange</span>],["🔋 Old batteries","Tape terminals; keep separate","Battery collection point",<span className="status-pill warn">To arrange</span>],["📱 Old smartphone","Back up data and factory reset","Authorized e-waste recycler",<span className="status-pill blue">Checklist</span>]]}/><Note>Do not place electronics or batteries in regular household waste. Use authorized collection and recycling services.</Note></>}
function AnalyticsPage({exportSummary}){return <><PageHeading title="Analytics" description="Review your product lifecycle and environmental impact at a glance." actions={<button className="page-btn light" onClick={exportSummary}>Export Summary</button>}/><StatCards items={[["Estimated CO₂ saved","48 kg","From reuse and repair actions"],["Water saved","1,200 L","Illustrative tracked impact"],["Trees equivalent","15","Impact estimate"]]}/><div className="page-grid"><div className="panel"><div className="panel-title">Lifecycle distribution</div><div className="action-list"><Action icon="🌿" title="In use — 58%" desc="Products still being used" button="Details" onClick={()=>{}}/><Action icon="🛠️" title="Maintenance / repair — 25%" desc="Extending useful life" button="Details" onClick={()=>{}}/><Action icon="♻️" title="Resold, donated or recycled — 17%" desc="Moving products to their next stage" button="Details" onClick={()=>{}}/></div></div><div className="panel"><div className="panel-title">Impact highlights</div><div className="action-list"><Action icon="↘" title="Waste avoided" desc="12 kg estimated e-waste avoided" button="View" onClick={()=>{}}/><Action icon="🔧" title="Repairs completed" desc="2 items repaired instead of replaced" button="View" onClick={()=>{}}/><Action icon="💧" title="Resource savings" desc="Keep logging actions to improve estimates" button="View" onClick={()=>{}}/></div></div></div><Note>Impact values are sample dashboard estimates, not independently verified environmental measurements.</Note></>}
function CommunityPage({notify}){return <><PageHeading title="Community" description="Share useful items, exchange ideas, and build sustainable habits together." actions={<button className="page-btn" onClick={()=>notify("Community post editor opened")}>＋ Share an Update</button>}/><StatCards items={[["Community members","1,240","Sample community figure"],["Items shared","86","Reuse and donation"],["Challenges completed","32","Small actions add up"]]}/><div className="panel page-section"><div className="panel-title">Community board</div><div className="action-list"><Action icon="🌱" title="30-day repair challenge" desc="Try repairing one item before replacing it." button="Join" onClick={()=>notify("You joined the repair challenge")}/><Action icon="📚" title="Book and supplies exchange" desc="Pass on useful study materials in your community." button="Explore" onClick={()=>notify("Exchange details opened")}/><Action icon="♻️" title="Responsible recycling week" desc="Collect and route e-waste responsibly." button="Explore" onClick={()=>notify("Recycling week details opened")}/></div></div><Note>Community activity is demo content for the prototype; no posts are sent to a live service.</Note></>}
function SettingsPage({notify}){const [name,setName]=useState("Sweta Gupta");const [email,setEmail]=useState("sweta@example.com");const [reminders,setReminders]=useState(true);const [tips,setTips]=useState(true);return <><PageHeading title="Settings" description="Manage your profile preferences and ResourceLoop experience." actions={<button className="page-btn" onClick={()=>notify("Settings saved for this demo session")}>Save Changes</button>}/><div className="panel page-section"><div className="panel-title">Profile</div><div className="field-grid"><label>Full name<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Preferred location<input defaultValue="Pune, India"/></label><label>Impact units<select defaultValue="Metric (kg, L)"><option>Metric (kg, L)</option><option>Imperial</option></select></label></div></div><div className="panel page-section"><div className="panel-title">Notifications</div><div className="action-list"><div className="action"><div className="emoji">🔔</div><div className="action-copy"><strong>Maintenance reminders</strong><small>Get notified when a product needs attention.</small></div><input type="checkbox" checked={reminders} onChange={e=>setReminders(e.target.checked)} aria-label="Maintenance reminders"/></div><div className="action"><div className="emoji">♻️</div><div className="action-copy"><strong>Sustainability tips</strong><small>Receive practical reuse and recycling ideas.</small></div><input type="checkbox" checked={tips} onChange={e=>setTips(e.target.checked)} aria-label="Sustainability tips"/></div></div></div><Note>Settings are demo-only and will reset when the page reloads.</Note></>}

export default App;
