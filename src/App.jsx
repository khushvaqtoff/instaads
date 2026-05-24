import { useState } from "react";

const sendToTelegram = async (order) => {
  const lines = [
    "YANGI BUYURTMA!",
    "",
    "Akkaunt: @" + (order.username || "-"),
    "Telefon: " + (order.phone || "-"),
    "Biznes: " + order.accountType,
    "Maqsad: " + order.goal,
    "Regionlar: " + order.regions,
    order.cities ? "Shaharlar: " + order.cities : null,
    "Auditoriya: " + order.audience,
    order.interests ? "Qiziqishlar: " + order.interests : null,
    "Format: " + order.format,
    order.adText ? "Matn: " + order.adText : null,
    "Muddat: " + order.duration + " kun",
    "Byudjet: " + order.budget + " som/oy",
    "Korish: " + order.reach + " odam",
    "",
    new Date().toLocaleString(),
  ].filter(Boolean).join("\n");

  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: lines }),
  });
  if (!res.ok) throw new Error("fail");
};

const ALL_REGIONS = [
  { id: "uz", name: "O'zbekiston", flag: "🇺🇿", cities: ["Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon", "Farg'ona"] },
  { id: "ru", name: "Rossiya", flag: "🇷🇺", cities: ["Moskva", "Sankt-Peterburg", "Novosibirsk", "Yekaterinburg"] },
  { id: "kz", name: "Qozog'iston", flag: "🇰🇿", cities: ["Almaty", "Astana", "Shymkent"] },
  { id: "kg", name: "Qirg'iziston", flag: "🇰🇬", cities: ["Bishkek", "Osh"] },
  { id: "tj", name: "Tojikiston", flag: "🇹🇯", cities: ["Dushanba", "Xo'jand"] },
  { id: "az", name: "Ozarbayjon", flag: "🇦🇿", cities: ["Boku", "Ganja"] },
  { id: "ge", name: "Gruziya", flag: "🇬🇪", cities: ["Tbilisi", "Batumi"] },
  { id: "tr", name: "Turkiya", flag: "🇹🇷", cities: ["Istanbul", "Ankara", "Antalya"] },
  { id: "ae", name: "BAA (Dubai)", flag: "🇦🇪", cities: ["Dubai", "Abu Dhabi", "Sharjah"] },
  { id: "sa", name: "Saudiya Arabistoni", flag: "🇸🇦", cities: ["Ar-Riyod", "Jidda"] },
  { id: "qa", name: "Qatar", flag: "🇶🇦", cities: ["Doha"] },
  { id: "de", name: "Germaniya", flag: "🇩🇪", cities: ["Berlin", "Myunxen", "Frankfurt"] },
  { id: "gb", name: "Buyuk Britaniya", flag: "🇬🇧", cities: ["London", "Manchester"] },
  { id: "fr", name: "Fransiya", flag: "🇫🇷", cities: ["Parij", "Marsel"] },
  { id: "it", name: "Italiya", flag: "🇮🇹", cities: ["Rim", "Milan"] },
  { id: "es", name: "Ispaniya", flag: "🇪🇸", cities: ["Madrid", "Barselona"] },
  { id: "us", name: "AQSh", flag: "🇺🇸", cities: ["New York", "Los Angeles", "Chicago"] },
  { id: "ca", name: "Kanada", flag: "🇨🇦", cities: ["Toronto", "Vankuver"] },
  { id: "au", name: "Avstraliya", flag: "🇦🇺", cities: ["Sidney", "Melburn"] },
  { id: "cn", name: "Xitoy", flag: "🇨🇳", cities: ["Pekin", "Shanxay"] },
  { id: "jp", name: "Yaponiya", flag: "🇯🇵", cities: ["Tokio", "Osaka"] },
  { id: "kr", name: "Janubiy Koreya", flag: "🇰🇷", cities: ["Seul", "Busan"] },
  { id: "in", name: "Hindiston", flag: "🇮🇳", cities: ["Mumbay", "Dehli"] },
  { id: "br", name: "Braziliya", flag: "🇧🇷", cities: ["San-Paulo", "Rio"] },
  { id: "eg", name: "Misr", flag: "🇪🇬", cities: ["Qohira", "Iskandariya"] },
];

const GROUPS = [
  { label: "Markaziy Osiyo", ids: ["uz","kz","kg","tj"] },
  { label: "Yaqin Sharq", ids: ["ae","sa","qa","tr","az","ge"] },
  { label: "MDH", ids: ["ru","kz","kg","tj"] },
  { label: "Yevropa", ids: ["de","gb","fr","it","es"] },
  { label: "Amerika", ids: ["us","ca","br"] },
  { label: "Osiyo", ids: ["cn","jp","kr","in"] },
];

const AD_FORMATS = [
  { id: "feed", name: "Feed reklama", icon: "🖼️", desc: "Asosiy lenta" },
  { id: "story", name: "Stories reklama", icon: "📱", desc: "To'liq ekran" },
  { id: "reels", name: "Reels reklama", icon: "🎬", desc: "Video format" },
  { id: "explore", name: "Explore sahifasi", icon: "🔍", desc: "Yangi auditoriya" },
];

const GOALS = [
  { id: "followers", name: "Obunachi yig'ish", icon: "👥" },
  { id: "traffic", name: "Saytga tashrif", icon: "🌐" },
  { id: "sales", name: "Sotuvni oshirish", icon: "🛒" },
  { id: "brand", name: "Brend taniqlilik", icon: "⭐" },
  { id: "messages", name: "DM xabarlar", icon: "💬" },
  { id: "calls", name: "Qo'ng'iroqlar", icon: "📞" },
];

const AUDIENCES = [
  { id: "18-24", label: "18-24 yosh", icon: "🎓" },
  { id: "25-34", label: "25-34 yosh", icon: "💼" },
  { id: "35-44", label: "35-44 yosh", icon: "🏡" },
  { id: "45p", label: "45+ yosh", icon: "👔" },
  { id: "female", label: "Ayollar", icon: "👩" },
  { id: "male", label: "Erkaklar", icon: "👨" },
];

const INTERESTS = [
  "Savdo & Biznes","Go'zallik & Moda","Restoran & Ovqat",
  "Sport & Fitness","Sayohat","Texnologiya",
  "Uy-joy & Dizayn","Salomatlik","Ta'lim",
  "San'at & Kreativ","Moliya","Avtomobil",
];

const DEFAULT_BUDGETS = [
  { label: "Boshlang'ich", som: "650 000", reach: "5 000-15 000", color: "#6366f1" },
  { label: "O'rta", som: "1 950 000", reach: "20 000-60 000", color: "#f59e0b", popular: true },
  { label: "Katta", som: "5 200 000", reach: "80 000-200 000", color: "#10b981" },
  { label: "Premium", som: "13 000 000", reach: "300 000-1 000 000", color: "#ec4899" },
];

const STEPS = ["Biznes","Maqsad","Region","Auditoriya","Format","Byudjet","Buyurtma"];

export default function App() {
  const [view, setView] = useState("main");
  const [step, setStep] = useState(1);
  const [adminPass, setAdminPass] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [editBudgets, setEditBudgets] = useState(JSON.parse(JSON.stringify(DEFAULT_BUDGETS)));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tgError, setTgError] = useState(false);

  const [accountType, setAccountType] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [adFormat, setAdFormat] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [adText, setAdText] = useState("");
  const [duration, setDuration] = useState("30");
  const [regionSearch, setRegionSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("barchasi");

  const toggle = (arr, setArr, item) =>
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);

  const filteredRegions = ALL_REGIONS.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(regionSearch.toLowerCase());
    if (activeGroup === "barchasi") return matchSearch;
    const grp = GROUPS.find(g => g.label === activeGroup);
    return grp && grp.ids.includes(r.id) && matchSearch;
  });

  const handleOrder = async () => {
    setLoading(true);
    setTgError(false);
    try {
      await sendToTelegram({
        username, phone, accountType, goal,
        regions: selectedRegions.map(r => ALL_REGIONS.find(x => x.id === r).name).join(", "),
        cities: selectedCities.length ? selectedCities.join(", ") : null,
        audience: selectedAudience.join(", "),
        interests: selectedInterests.length ? selectedInterests.join(", ") : null,
        format: AD_FORMATS.find(f => f.id === adFormat).name,
        adText: adText || null,
        duration,
        budget: selectedBudget.som,
        reach: selectedBudget.reach,
      });
      setSubmitted(true);
    } catch (e) {
      setTgError(true);
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1); setSubmitted(false); setTgError(false);
    setAccountType(""); setUsername(""); setPhone(""); setGoal("");
    setSelectedRegions([]); setSelectedCities([]); setSelectedAudience([]);
    setSelectedInterests([]); setAdFormat(""); setSelectedBudget(null);
    setAdText(""); setDuration("30");
  };

  if (view === "admin") {
    return (
      <div style={S.root}>
        <div style={S.bg}><div style={S.b1}/><div style={S.b2}/></div>
        <div style={S.hdr}>
          <div style={S.logoRow}><span>⚙️</span><span style={S.logoTxt}>Admin Panel</span></div>
          <button style={S.backBtn} onClick={() => setView("main")}>Saytga qaytish</button>
        </div>
        <div style={{...S.main, maxWidth: 680}}>
          {!adminUnlocked ? (
            <div style={S.card}>
              <h2 style={S.cTitle}>Admin kirish</h2>
              <p style={S.cSub}>Parol kiriting (demo: admin123)</p>
              <input style={{...S.adminInput, width:"100%", boxSizing:"border-box"}} type="password" placeholder="Parol..."
                value={adminPass} onChange={e => setAdminPass(e.target.value)} />
              {adminError && <p style={{color:"#ef4444",fontSize:13,marginTop:6}}>Noto'g'ri parol</p>}
              <button style={{...S.nextBtn, marginTop:14, width:"100%"}}
                onClick={() => {
                  if (adminPass === "admin123") { setAdminUnlocked(true); setAdminError(false); }
                  else { setAdminError(true); }
                }}>Kirish</button>
            </div>
          ) : (
            <div>
              <div style={{...S.card, marginBottom:14}}>
                <h2 style={S.cTitle}>Byudjet va Narxlarni tahrirlash</h2>
                <p style={S.cSub}>Som da narxlarni va auditoriya hajmini ozgartiring</p>
              </div>
              {editBudgets.map((b, i) => (
                <div key={i} style={{...S.card, marginBottom:12, borderLeft:"4px solid " + b.color}}>
                  <h3 style={{color:b.color, margin:"0 0 12px", fontSize:16}}>{b.label} paketi</h3>
                  <div style={S.adminGrid}>
                    <div>
                      <label style={S.aLabel}>Paket nomi</label>
                      <input style={S.adminInput} value={b.label} onChange={e => {
                        const c = [...editBudgets]; c[i] = {...c[i], label: e.target.value}; setEditBudgets(c);
                      }}/>
                    </div>
                    <div>
                      <label style={S.aLabel}>Narx (som)</label>
                      <input style={S.adminInput} value={b.som} onChange={e => {
                        const c = [...editBudgets]; c[i] = {...c[i], som: e.target.value}; setEditBudgets(c);
                      }}/>
                    </div>
                    <div>
                      <label style={S.aLabel}>Korish soni</label>
                      <input style={S.adminInput} value={b.reach} onChange={e => {
                        const c = [...editBudgets]; c[i] = {...c[i], reach: e.target.value}; setEditBudgets(c);
                      }}/>
                    </div>
                  </div>
                </div>
              ))}
              <button style={{...S.orderBtn, width:"100%"}}
                onClick={() => { setBudgets(JSON.parse(JSON.stringify(editBudgets))); alert("Narxlar saqlandi!"); }}>
                Saqlash
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={S.successPage}>
        <div style={S.successCard}>
          <div style={{fontSize:56, marginBottom:14}}>🎯</div>
          <h2 style={{fontSize:22, fontWeight:800, color:"#fff", margin:"0 0 10px"}}>Buyurtma qabul qilindi!</h2>
          <p style={{color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.6, margin:"0 0 16px"}}>
            Sizning buyurtmangiz Telegram orqali bizga yetdi! 2 soat ichida siz bilan boglanamiz.
          </p>
          <div style={S.infoBox}>
            <p style={{margin:0, fontSize:12, color:"#6ee7b7", lineHeight:1.5}}>
              Reklama Instagram Meta Ads tizimi orqali korsatiladi. Faqat siz tanlagan auditoriyaga. Spam yoq.
            </p>
          </div>
          <button style={{...S.orderBtn, width:"100%", marginTop:14}} onClick={reset}>Yangi kampaniya</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <div style={S.bg}><div style={S.b1}/><div style={S.b2}/><div style={S.b3}/></div>

      <header style={S.hdr}>
        <div style={S.logoRow}>
          <span style={{fontSize:28}}>📸</span>
          <span style={S.logoTxt}>InstaAds <span style={S.logoBadge}>PRO</span></span>
        </div>
        <p style={{color:"rgba(255,255,255,0.45)", fontSize:12, margin:"4px 0 0"}}>
          Instagram rasmiy reklama orqali mijoz yigish xizmati
        </p>
        <button style={S.adminLink} onClick={() => setView("admin")}>Admin</button>
      </header>

      <div style={S.progWrap}>
        {STEPS.map((s, i) => (
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:44}}>
            <div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",background:step>i+1?"#10b981":step===i+1?"#f59e0b":"rgba(255,255,255,0.12)",boxShadow:step===i+1?"0 0 10px #f59e0b":"none"}}>
              {step > i+1 ? "✓" : i+1}
            </div>
            <span style={{fontSize:8,textAlign:"center",color:step===i+1?"#f59e0b":step>i+1?"#10b981":"rgba(255,255,255,0.3)",maxWidth:44}}>{s}</span>
          </div>
        ))}
      </div>

      <main style={S.main}>

        {step === 1 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Biznes turini tanlang</h2>
            <p style={S.cSub}>Instagram reklama qaysi biznes uchun?</p>
            <div style={S.acctGrid}>
              {["Do'kon / E-commerce","Go'zallik saloni","Restoran / Kafe","Sport klubi","Rieltorlik","Ta'lim markazi","Tibbiyot","Sayohat agentligi","Moliya / Konsalting","Kreativ studiya","IT / Texnologiya","Qurilish"].map(t => (
                <button key={t} style={{...S.chip,...(accountType===t?S.chipActive:{})}} onClick={() => setAccountType(t)}>{t}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              <div>
                <label style={S.aLabel}>Instagram username</label>
                <div style={S.iRow}>
                  <span style={{padding:"10px 8px 10px 12px",color:"#6366f1",fontWeight:700}}>@</span>
                  <input style={S.iInput} placeholder="akkount" value={username} onChange={e => setUsername(e.target.value)}/>
                </div>
              </div>
              <div>
                <label style={S.aLabel}>Telefon raqam</label>
                <div style={S.iRow}>
                  <span style={{padding:"10px 8px 10px 12px",color:"#6366f1"}}>+</span>
                  <input style={S.iInput} placeholder="998 90 123 45 67" value={phone} onChange={e => setPhone(e.target.value)}/>
                </div>
              </div>
            </div>
            <button style={{...S.nextBtn,opacity:accountType?1:0.4}} disabled={!accountType} onClick={() => setStep(2)}>Davom etish</button>
          </div>
        )}

        {step === 2 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Kampaniya maqsadini tanlang</h2>
            <p style={S.cSub}>Instagram reklama nima uchun?</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:20}}>
              {GOALS.map(g => (
                <div key={g.id} style={{...S.goalCard,...(goal===g.name?S.goalActive:{})}} onClick={() => setGoal(g.name)}>
                  <span style={{fontSize:28}}>{g.icon}</span>
                  <span style={{fontSize:12,fontWeight:600,textAlign:"center"}}>{g.name}</span>
                </div>
              ))}
            </div>
            <div style={S.navRow}>
              <button style={S.backBtn} onClick={() => setStep(1)}>Orqaga</button>
              <button style={{...S.nextBtn,opacity:goal?1:0.4}} disabled={!goal} onClick={() => setStep(3)}>Davom etish</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Regionlarni tanlang</h2>
            <p style={S.cSub}>Reklama qaysi mamlakatlarda korsatilsin? ({selectedRegions.length} tanlangan)</p>
            <input style={S.searchInp} placeholder="Mamlakat qidirish..." value={regionSearch} onChange={e => setRegionSearch(e.target.value)}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
              {["barchasi",...GROUPS.map(g => g.label)].map(g => (
                <button key={g} style={{...S.groupBtn,...(activeGroup===g?S.groupActive:{})}} onClick={() => setActiveGroup(g)}>
                  {g === "barchasi" ? "Barchasi" : g}
                </button>
              ))}
            </div>
            {activeGroup !== "barchasi" && (
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                <button style={S.selBtn} onClick={() => {
                  const grp = GROUPS.find(x => x.label === activeGroup);
                  if (grp) setSelectedRegions([...new Set([...selectedRegions, ...grp.ids])]);
                }}>Hammasini tanlash</button>
                <button style={S.selBtn} onClick={() => {
                  const grp = GROUPS.find(x => x.label === activeGroup);
                  if (grp) setSelectedRegions(selectedRegions.filter(r => !grp.ids.includes(r)));
                }}>Olib tashlash</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(95px,1fr))",gap:6,marginBottom:12}}>
              {filteredRegions.map(r => (
                <div key={r.id} style={{...S.regCard,...(selectedRegions.includes(r.id)?S.regActive:{})}} onClick={() => toggle(selectedRegions, setSelectedRegions, r.id)}>
                  <span style={{fontSize:22}}>{r.flag}</span>
                  <span style={{fontSize:10,fontWeight:600,textAlign:"center",lineHeight:1.3}}>{r.name}</span>
                  {selectedRegions.includes(r.id) && <span style={{position:"absolute",top:4,right:6,color:"#6366f1",fontSize:10}}>✓</span>}
                </div>
              ))}
            </div>
            {selectedRegions.length > 0 && (
              <div style={{marginBottom:12}}>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6}}>Shaharlar (ixtiyoriy)</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {selectedRegions.flatMap(rid => (ALL_REGIONS.find(r => r.id === rid) || {cities:[]}).cities).map(c => (
                    <button key={c} style={{...S.cityBtn,...(selectedCities.includes(c)?S.cityActive:{})}} onClick={() => toggle(selectedCities, setSelectedCities, c)}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={S.navRow}>
              <button style={S.backBtn} onClick={() => setStep(2)}>Orqaga</button>
              <button style={{...S.nextBtn,opacity:selectedRegions.length?1:0.4}} disabled={!selectedRegions.length} onClick={() => setStep(4)}>Davom etish</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Auditoriyani tanlang</h2>
            <p style={S.cSub}>Kim sizning mijozingiz?</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:16}}>
              {AUDIENCES.map(a => (
                <button key={a.id} style={{...S.audBtn,...(selectedAudience.includes(a.label)?S.audActive:{})}} onClick={() => toggle(selectedAudience, setSelectedAudience, a.label)}>
                  <span style={{fontSize:22}}>{a.icon}</span>
                  <span style={{fontSize:11}}>{a.label}</span>
                </button>
              ))}
            </div>
            <p style={S.cSub}>Qiziqishlar (ixtiyoriy)</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {INTERESTS.map(i => (
                <button key={i} style={{...S.interestBtn,...(selectedInterests.includes(i)?S.interestActive:{})}} onClick={() => toggle(selectedInterests, setSelectedInterests, i)}>{i}</button>
              ))}
            </div>
            <div style={S.navRow}>
              <button style={S.backBtn} onClick={() => setStep(3)}>Orqaga</button>
              <button style={{...S.nextBtn,opacity:selectedAudience.length?1:0.4}} disabled={!selectedAudience.length} onClick={() => setStep(5)}>Davom etish</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Reklama formatini tanlang</h2>
            <p style={S.cSub}>Qaysi formatda reklama korsatilsin?</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:18}}>
              {AD_FORMATS.map(f => (
                <div key={f.id} style={{...S.fmtCard,...(adFormat===f.id?S.fmtActive:{})}} onClick={() => setAdFormat(f.id)}>
                  <span style={{fontSize:32}}>{f.icon}</span>
                  <span style={{fontSize:13,fontWeight:700}}>{f.name}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",textAlign:"center"}}>{f.desc}</span>
                  {adFormat === f.id && <span style={{color:"#f59e0b",fontSize:11}}>Tanlandi</span>}
                </div>
              ))}
            </div>
            <div style={{marginBottom:16}}>
              <label style={S.aLabel}>Reklama matni (ixtiyoriy)</label>
              <textarea style={S.textarea} placeholder="Masalan: Toshkentdagi eng yaxshi gozellik saloni! Birinchi tashrif 20% chegirma..." value={adText} onChange={e => setAdText(e.target.value)} rows={3}/>
            </div>
            <div style={S.navRow}>
              <button style={S.backBtn} onClick={() => setStep(4)}>Orqaga</button>
              <button style={{...S.nextBtn,opacity:adFormat?1:0.4}} disabled={!adFormat} onClick={() => setStep(6)}>Davom etish</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Byudjet tanlang</h2>
            <p style={S.cSub}>Instagram reklama uchun oylik byudjet</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10,marginBottom:16}}>
              {budgets.map((b, i) => (
                <div key={i} style={{...S.budCard,borderColor:selectedBudget&&selectedBudget.label===b.label?b.color:"rgba(255,255,255,0.1)",boxShadow:selectedBudget&&selectedBudget.label===b.label?"0 0 20px "+b.color+"44":"none"}} onClick={() => setSelectedBudget(b)}>
                  {b.popular && <div style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",background:b.color,borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>Mashhur</div>}
                  <span style={{fontSize:13,fontWeight:700,color:b.color}}>{b.label}</span>
                  <span style={{fontSize:20,fontWeight:900,color:"#fff"}}>{b.som}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>som / oy</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:4}}>{b.reach} odam</span>
                  {selectedBudget && selectedBudget.label===b.label && <span style={{fontSize:11,color:b.color,fontWeight:700}}>Tanlandi</span>}
                </div>
              ))}
            </div>
            <div style={{marginBottom:16}}>
              <label style={S.aLabel}>Kampaniya muddati</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["7","14","30","60","90"].map(d => (
                  <button key={d} style={{...S.durBtn,...(duration===d?S.durActive:{})}} onClick={() => setDuration(d)}>{d} kun</button>
                ))}
              </div>
            </div>
            <div style={S.navRow}>
              <button style={S.backBtn} onClick={() => setStep(5)}>Orqaga</button>
              <button style={{...S.nextBtn,opacity:selectedBudget?1:0.4}} disabled={!selectedBudget} onClick={() => setStep(7)}>Davom etish</button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div style={S.card}>
            <h2 style={S.cTitle}>Buyurtmani tasdiqlang</h2>
            <p style={S.cSub}>Kampaniya malumotlarini tekshiring</p>
            <div style={S.sumBox}>
              {[
                ["Akkaunt", "@"+(username||"-")],
                ["Telefon", phone||"-"],
                ["Biznes", accountType],
                ["Maqsad", goal],
                ["Regionlar", selectedRegions.map(r => (ALL_REGIONS.find(x => x.id===r)||{name:r}).name).join(", ")||"-"],
                ["Auditoriya", selectedAudience.join(", ")],
                ["Format", (AD_FORMATS.find(f => f.id===adFormat)||{name:"-"}).name],
                ["Muddat", duration+" kun"],
              ].map(([l,v]) => (
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:12,color:"rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.06)",gap:10}}>
                  <span style={{color:"rgba(255,255,255,0.45)",whiteSpace:"nowrap"}}>{l}:</span>
                  <span style={{textAlign:"right"}}>{v}</span>
                </div>
              ))}
              <div style={{height:1,background:"rgba(255,255,255,0.08)",margin:"10px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"rgba(255,255,255,0.5)",fontSize:13}}>Korish:</span>
                <span style={{color:"#f59e0b",fontWeight:700}}>{selectedBudget ? selectedBudget.reach : "-"} odam</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                <span style={{fontSize:15,color:"rgba(255,255,255,0.7)"}}>Byudjet:</span>
                <span style={{fontSize:20,color:"#10b981",fontWeight:800}}>{selectedBudget ? selectedBudget.som : "-"} som/oy</span>
              </div>
            </div>
            <div style={S.infoBox}>
              <p style={{margin:0,fontSize:12,color:"#6ee7b7",lineHeight:1.5}}>
                Buyurtma Telegram orqali bizga yuboriladi. Reklama Instagram Meta Ads tizimi orqali korsatiladi. Spam yoq.
              </p>
            </div>
            {tgError && (
              <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                <p style={{margin:0,fontSize:12,color:"#f87171"}}>Xatolik yuz berdi. Internet aloqasini tekshiring va qayta urinib koring.</p>
              </div>
            )}
            <div style={S.navRow}>
              <button style={S.backBtn} onClick={() => setStep(6)}>Orqaga</button>
              <button style={S.orderBtn} onClick={handleOrder} disabled={loading}>
                {loading ? "Yuborilmoqda..." : "Kampaniyani boshlash"}
              </button>
            </div>
          </div>
        )}
      </main>

      <div style={S.statsBar}>
        {[["25+","Mamlakat"],["5M+","Korish/oy"],["98%","Mamnuniyat"],["24/7","Yordam"]].map(([n,l]) => (
          <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 20px",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{fontSize:18,fontWeight:800,background:"linear-gradient(90deg,#f59e0b,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</span>
            <span style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  root:{minHeight:"100vh",background:"#07070f",color:"#fff",fontFamily:"'Segoe UI',sans-serif",position:"relative",overflow:"hidden"},
  bg:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0},
  b1:{position:"absolute",top:"-10%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)",filter:"blur(50px)"},
  b2:{position:"absolute",top:"40%",right:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)",filter:"blur(50px)"},
  b3:{position:"absolute",bottom:0,left:"25%",width:500,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)",filter:"blur(60px)"},
  hdr:{position:"relative",zIndex:1,textAlign:"center",padding:"24px 16px 10px"},
  logoRow:{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:5},
  logoTxt:{fontSize:24,fontWeight:800,letterSpacing:-0.5,background:"linear-gradient(90deg,#f59e0b,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  logoBadge:{background:"#6366f1",WebkitBackgroundClip:"unset",WebkitTextFillColor:"#fff",fontSize:10,padding:"2px 6px",borderRadius:5,fontWeight:700,verticalAlign:"middle"},
  adminLink:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,padding:"4px 10px",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:11,marginTop:6},
  progWrap:{position:"relative",zIndex:1,display:"flex",justifyContent:"center",gap:2,padding:"10px 8px",flexWrap:"wrap"},
  main:{position:"relative",zIndex:1,maxWidth:780,margin:"0 auto",padding:"0 12px 28px"},
  card:{background:"rgba(255,255,255,0.035)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"22px 18px"},
  cTitle:{fontSize:19,fontWeight:800,margin:"0 0 5px",background:"linear-gradient(90deg,#fff,rgba(255,255,255,0.65))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  cSub:{color:"rgba(255,255,255,0.45)",fontSize:12,margin:"0 0 14px"},
  acctGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:7,marginBottom:16},
  chip:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:9,padding:"9px 11px",color:"rgba(255,255,255,0.8)",cursor:"pointer",fontSize:12,textAlign:"left"},
  chipActive:{background:"rgba(245,158,11,0.14)",borderColor:"#f59e0b",color:"#f59e0b"},
  iRow:{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:9,overflow:"hidden"},
  iInput:{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:13,padding:"10px 12px 10px 0"},
  aLabel:{fontSize:11,color:"rgba(255,255,255,0.45)",display:"block",marginBottom:5},
  goalCard:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  goalActive:{background:"rgba(99,102,241,0.15)",borderColor:"#6366f1"},
  searchInp:{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 13px",color:"#fff",fontSize:13,outline:"none",marginBottom:8},
  groupBtn:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"4px 9px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:10,whiteSpace:"nowrap"},
  groupActive:{background:"rgba(99,102,241,0.18)",borderColor:"#6366f1",color:"#a5b4fc"},
  selBtn:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"4px 11px",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:11},
  regCard:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"9px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative"},
  regActive:{background:"rgba(99,102,241,0.14)",borderColor:"#6366f1"},
  cityBtn:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:18,padding:"4px 10px",color:"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:10},
  cityActive:{background:"rgba(99,102,241,0.18)",borderColor:"#6366f1",color:"#a5b4fc"},
  audBtn:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"12px 8px",color:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,fontSize:12},
  audActive:{background:"rgba(236,72,153,0.14)",borderColor:"#ec4899"},
  interestBtn:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"6px 11px",color:"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:11},
  interestActive:{background:"rgba(16,185,129,0.14)",borderColor:"#10b981",color:"#6ee7b7"},
  fmtCard:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  fmtActive:{background:"rgba(245,158,11,0.12)",borderColor:"#f59e0b"},
  textarea:{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:9,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"},
  budCard:{background:"rgba(255,255,255,0.04)",border:"2px solid",borderRadius:14,padding:"16px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative"},
  durBtn:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 14px",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:13},
  durActive:{background:"rgba(99,102,241,0.18)",borderColor:"#6366f1",color:"#a5b4fc",fontWeight:700},
  sumBox:{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"14px",marginBottom:12},
  infoBox:{background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.18)",borderRadius:10,padding:"12px",marginBottom:14},
  navRow:{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",marginTop:8},
  backBtn:{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",borderRadius:9,padding:"10px 16px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:13},
  nextBtn:{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:9,padding:"10px 20px",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700},
  orderBtn:{flex:1,background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:11,padding:"12px 20px",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:800},
  statsBar:{position:"relative",zIndex:1,display:"flex",justifyContent:"center",flexWrap:"wrap",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"14px"},
  adminGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10},
  adminInput:{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,outline:"none"},
  successPage:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#07070f",padding:16},
  successCard:{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:22,padding:"32px 24px",maxWidth:420,width:"100%",textAlign:"center"},
};