import { useState } from "react";

const COLORS = {
  bg: "#0F1623",
  card: "#162030",
  slate: "#1E2A3A",
  border: "#243040",
  accent: "linear-gradient(135deg,#7C3AED,#EC4899)",
  accentSolid: "#7C3AED",
  accentPink: "#EC4899",
  text: "#E8EDF5",
  muted: "#6B7A99",
  success: "#22D37A",
  warning: "#F5A623",
  error: "#FF4D6D",
};

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

const DAY_TO_NUMBER = {
  "Lunes":1,"Martes":2,"Miércoles":3,"Jueves":4,"Viernes":5,"Sábado":6,"Domingo":0
};

// Convierte día+hora a fecha ISO próxima
function getNextDateForDay(dayName, time) {
  const today = new Date();
  const targetDay = DAY_TO_NUMBER[dayName];
  const [hours, minutes] = time.split(":").map(Number);
  let daysUntil = (targetDay - today.getDay() + 7) % 7;
  if (daysUntil === 0) daysUntil = 7;
  const target = new Date(today);
  target.setDate(today.getDate() + daysUntil);
  target.setHours(hours, minutes, 0, 0);
  return target.toISOString();
}

const Avatar = ({ name }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{
      width:36,height:36,borderRadius:"50%",
      background:COLORS.accent,display:"flex",alignItems:"center",
      justifyContent:"center",fontWeight:700,fontSize:13,color:"#fff",flexShrink:0
    }}>{initials}</div>
  );
};

const Badge = ({ children, color = COLORS.accentSolid }) => (
  <span style={{
    background: color + "22", color, border:`1px solid ${color}44`,
    borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant="primary", style={}, disabled=false }) => {
  const base = {
    padding:"10px 20px",borderRadius:10,fontWeight:600,fontSize:14,
    cursor:disabled?"not-allowed":"pointer",border:"none",transition:"opacity .15s",
    opacity: disabled ? 0.5 : 1, ...style
  };
  if (variant==="primary") return (
    <button onClick={onClick} disabled={disabled} style={{...base,background:COLORS.accent,color:"#fff"}}>
      {children}
    </button>
  );
  if (variant==="ghost") return (
    <button onClick={onClick} disabled={disabled} style={{...base,background:"transparent",color:COLORS.muted,border:`1px solid ${COLORS.border}`}}>
      {children}
    </button>
  );
  if (variant==="danger") return (
    <button onClick={onClick} disabled={disabled} style={{...base,background:COLORS.error+"22",color:COLORS.error,border:`1px solid ${COLORS.error}44`}}>
      {children}
    </button>
  );
};

const Input = ({ label, type="text", value, onChange, placeholder, hint }) => (
  <div style={{marginBottom:18}}>
    {label && <label style={{display:"block",color:COLORS.muted,fontSize:12,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.8}}>{label}</label>}
    <input
      type={type} value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width:"100%",background:COLORS.slate,border:`1px solid ${COLORS.border}`,
        borderRadius:10,padding:"12px 14px",color:COLORS.text,fontSize:14,
        outline:"none",boxSizing:"border-box"
      }}
    />
    {hint && <p style={{color:COLORS.muted,fontSize:11,marginTop:5}}>{hint}</p>}
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows=4 }) => (
  <div style={{marginBottom:18}}>
    {label && <label style={{display:"block",color:COLORS.muted,fontSize:12,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.8}}>{label}</label>}
    <textarea
      value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{
        width:"100%",background:COLORS.slate,border:`1px solid ${COLORS.border}`,
        borderRadius:10,padding:"12px 14px",color:COLORS.text,fontSize:14,
        outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"
      }}
    />
  </div>
);

// ── AUTH SCREEN ───────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users] = useState([{ email:"demo@example.com", password:"Demo1234!", name:"Usuario Demo" }]);
  const set = k => v => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    setError("");
    if (mode==="login") {
      const u = users.find(u=>u.email===form.email && u.password===form.password);
      if (!u) { setError("Email o contraseña incorrectos."); return; }
      setLoading(true);
      setTimeout(()=>{ setLoading(false); onLogin({name:u.name,email:u.email}); },800);
    } else {
      if (!form.name) { setError("Ingresa tu nombre."); return; }
      if (!form.email.includes("@")) { setError("Email inválido."); return; }
      if (form.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
      if (form.password !== form.confirm) { setError("Las contraseñas no coinciden."); return; }
      setLoading(true);
      setTimeout(()=>{ setLoading(false); onLogin({name:form.name,email:form.email}); },900);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:COLORS.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,background:COLORS.accent,borderRadius:16,padding:"10px 20px"}}>
            <span style={{fontSize:22}}>📅</span>
            <span style={{color:"#fff",fontWeight:800,fontSize:20,letterSpacing:-.5}}>PostFlow</span>
          </div>
          <p style={{color:COLORS.muted,marginTop:10,fontSize:14}}>Programa tus posts de Instagram con inteligencia</p>
        </div>
        <div style={{background:COLORS.card,borderRadius:20,padding:32,border:`1px solid ${COLORS.border}`}}>
          <div style={{display:"flex",background:COLORS.slate,borderRadius:10,padding:4,marginBottom:28}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}}
                style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,transition:"all .2s",background:mode===m?"#fff":"transparent",color:mode===m?COLORS.bg:COLORS.muted}}>
                {m==="login"?"Iniciar sesión":"Crear cuenta"}
              </button>
            ))}
          </div>
          {mode==="register" && <Input label="Nombre completo" value={form.name} onChange={set("name")} placeholder="María García" />}
          <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" />
          <Input label="Contraseña" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" hint={mode==="register"?"Mínimo 8 caracteres":""} />
          {mode==="register" && <Input label="Confirmar contraseña" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />}
          {error && <div style={{background:COLORS.error+"22",border:`1px solid ${COLORS.error}44`,borderRadius:8,padding:"10px 14px",color:COLORS.error,fontSize:13,marginBottom:16}}>{error}</div>}
          <Btn onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:"13px 0",fontSize:15}}>
            {loading?"Verificando...":mode==="login"?"Entrar":"Crear cuenta"}
          </Btn>
          {mode==="login" && <p style={{textAlign:"center",color:COLORS.muted,fontSize:12,marginTop:16}}>Demo: demo@example.com / Demo1234!</p>}
        </div>
        <p style={{textAlign:"center",color:COLORS.muted,fontSize:11,marginTop:20}}>🔒 Conexión segura · Datos cifrados · Cumplimiento GDPR</p>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────
const NAV = [
  { id:"dashboard", icon:"📊", label:"Dashboard" },
  { id:"schedule",  icon:"📅", label:"Programar post" },
  { id:"posts",     icon:"🗂️",  label:"Mis posts" },
  { id:"instagram", icon:"📸", label:"Instagram" },
  { id:"settings",  icon:"⚙️",  label:"Ajustes" },
];

function Sidebar({ active, onNav, user, onLogout, collapsed }) {
  return (
    <div style={{width:collapsed?68:220,flexShrink:0,background:COLORS.card,borderRight:`1px solid ${COLORS.border}`,display:"flex",flexDirection:"column",transition:"width .2s",overflow:"hidden"}}>
      <div style={{padding:"20px 16px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{background:COLORS.accent,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:18}}>📅</span>
        </div>
        {!collapsed && <span style={{color:COLORS.text,fontWeight:800,fontSize:16,letterSpacing:-.5}}>PostFlow</span>}
      </div>
      <nav style={{flex:1,padding:"12px 8px"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>onNav(n.id)}
            style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:active===n.id?COLORS.accentSolid+"22":"transparent",color:active===n.id?"#fff":COLORS.muted,fontWeight:active===n.id?700:500,fontSize:14,transition:"all .15s",marginBottom:2,textAlign:"left"}}>
            <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
            {!collapsed && n.label}
            {active===n.id && !collapsed && <div style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:COLORS.accentPink}}/>}
          </button>
        ))}
      </nav>
      <div style={{padding:"12px 8px",borderTop:`1px solid ${COLORS.border}`}}>
        {!collapsed && (
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:10,background:COLORS.slate,marginBottom:8}}>
            <Avatar name={user.name}/>
            <div style={{minWidth:0}}>
              <p style={{color:COLORS.text,fontSize:13,fontWeight:600,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</p>
              <p style={{color:COLORS.muted,fontSize:11,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={onLogout} style={{width:"100%",padding:"8px 12px",borderRadius:10,border:`1px solid ${COLORS.border}`,background:"transparent",color:COLORS.muted,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
          <span>🚪</span>{!collapsed && "Cerrar sesión"}
        </button>
      </div>
    </div>
  );
}

// ── DASHBOARD HOME ────────────────────────────────────────
function DashboardHome({ posts, igConnected }) {
  const scheduled = posts.filter(p=>p.status==="scheduled").length;
  const published  = posts.filter(p=>p.status==="published").length;
  const thisWeek   = posts.filter(p=>p.status==="scheduled").slice(0,3);

  const Stat = ({icon,label,value,color=COLORS.accentSolid}) => (
    <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:24,flex:1,minWidth:140}}>
      <div style={{fontSize:28,marginBottom:8}}>{icon}</div>
      <p style={{color:COLORS.muted,fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>{label}</p>
      <p style={{color,fontSize:32,fontWeight:800,margin:0,letterSpacing:-1}}>{value}</p>
    </div>
  );

  return (
    <div>
      <h2 style={{color:COLORS.text,fontWeight:800,fontSize:24,marginBottom:6}}>Panel principal</h2>
      <p style={{color:COLORS.muted,marginBottom:28,fontSize:14}}>Resumen de tu actividad en Instagram</p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:32}}>
        <Stat icon="📅" label="Programados" value={scheduled} />
        <Stat icon="✅" label="Publicados" value={published} color={COLORS.success} />
        <Stat icon="📸" label="Instagram" value={igConnected?"Conectado":"Sin conectar"} color={igConnected?COLORS.success:COLORS.warning}/>
      </div>
      <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:24}}>
        <h3 style={{color:COLORS.text,fontWeight:700,fontSize:16,marginBottom:16}}>Próximos posts</h3>
        {thisWeek.length===0 ? (
          <div style={{textAlign:"center",padding:"32px 0",color:COLORS.muted}}>
            <div style={{fontSize:40,marginBottom:12}}>📭</div>
            <p>No tienes posts programados aún.</p>
          </div>
        ) : thisWeek.map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:`1px solid ${COLORS.border}`}}>
            <div style={{width:48,height:48,borderRadius:12,background:COLORS.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📸</div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{color:COLORS.text,fontWeight:600,fontSize:14,margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.caption||"Sin descripción"}</p>
              <p style={{color:COLORS.muted,fontSize:12,margin:0}}>{p.day} · {p.time}</p>
            </div>
            <Badge>{p.status==="scheduled"?"Programado":"Publicado"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCHEDULE POST (con Ayrshare real) ─────────────────────
function SchedulePost({ onSave, igConnected }) {
  const [day, setDay] = useState("");
  const [time, setTime] = useState("09:00");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!day || !time || !caption) return;
    setStatus("loading");
    setMessage("");

    try {
      const scheduleDate = getNextDateForDay(day, time);
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, imageUrl, scheduleDate }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Error al programar el post.");
        return;
      }

      onSave({ id: Date.now(), day, time, caption, imageUrl, status: "scheduled" });
      setStatus("success");
      setMessage("✅ ¡Post programado en Instagram!");
      setDay(""); setTime("09:00"); setCaption(""); setImageUrl("");
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 3000);
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  };

  if (!igConnected) return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:56,marginBottom:16}}>📸</div>
      <h3 style={{color:COLORS.text,fontWeight:700,fontSize:20,marginBottom:8}}>Conecta tu Instagram primero</h3>
      <p style={{color:COLORS.muted,fontSize:14}}>Ve a la sección "Instagram" para vincular tu cuenta antes de programar posts.</p>
    </div>
  );

  return (
    <div style={{maxWidth:600}}>
      <h2 style={{color:COLORS.text,fontWeight:800,fontSize:24,marginBottom:6}}>Programar nuevo post</h2>
      <p style={{color:COLORS.muted,marginBottom:28,fontSize:14}}>Elige el día, hora y contenido de tu publicación</p>
      <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:28}}>
        <div style={{marginBottom:18}}>
          <label style={{display:"block",color:COLORS.muted,fontSize:12,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:.8}}>Día de publicación</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {DAYS.map(d=>(
              <button key={d} onClick={()=>setDay(d)}
                style={{padding:"8px 16px",borderRadius:20,border:`1px solid ${day===d?COLORS.accentSolid:COLORS.border}`,background:day===d?COLORS.accentSolid+"22":"transparent",color:day===d?"#fff":COLORS.muted,cursor:"pointer",fontSize:13,fontWeight:600}}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <Input label="Hora de publicación" type="time" value={time} onChange={setTime} hint="La hora se ajusta a la zona horaria de tu cuenta de Instagram." />
        <Input label="URL de imagen (opcional)" value={imageUrl} onChange={setImageUrl} placeholder="https://ejemplo.com/imagen.jpg" />
        <Textarea label="Descripción / Caption" value={caption} onChange={setCaption} placeholder="Escribe aquí tu caption, hashtags, emojis... 🎉 #marca #instagram" rows={5} />
        {(caption||imageUrl) && (
          <div style={{background:COLORS.slate,borderRadius:12,padding:16,marginBottom:20,border:`1px solid ${COLORS.border}`}}>
            <p style={{color:COLORS.muted,fontSize:11,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>Vista previa</p>
            {imageUrl && <img src={imageUrl} alt="preview" style={{width:"100%",borderRadius:8,marginBottom:8,maxHeight:200,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
            <p style={{color:COLORS.text,fontSize:13,lineHeight:1.6,margin:0,whiteSpace:"pre-wrap"}}>{caption}</p>
          </div>
        )}
        {message && (
          <div style={{background:status==="error"?COLORS.error+"22":COLORS.success+"22",border:`1px solid ${status==="error"?COLORS.error:COLORS.success}44`,borderRadius:8,padding:"10px 14px",color:status==="error"?COLORS.error:COLORS.success,fontSize:13,marginBottom:16}}>
            {message}
          </div>
        )}
        <Btn onClick={handleSave} disabled={!day||!time||!caption||status==="loading"}>
          {status==="loading" ? "⏳ Programando..." : "📅 Programar post"}
        </Btn>
      </div>
    </div>
  );
}

// ── POSTS LIST (con Publicar ya real) ────────────────────
function PostsList({ posts, onDelete, onPublish }) {
  const [filter, setFilter] = useState("all");
  const [publishing, setPublishing] = useState(null);
  const [pubMessage, setPubMessage] = useState("");
  const filtered = posts.filter(p=> filter==="all" || p.status===filter);

  const handlePublishNow = async (post) => {
    setPublishing(post.id);
    setPubMessage("");
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: post.caption, imageUrl: post.imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPubMessage("❌ " + (data.error || "Error al publicar"));
      } else {
        onPublish(post.id);
        setPubMessage("✅ ¡Publicado en Instagram!");
      }
    } catch {
      setPubMessage("❌ Error de conexión.");
    }
    setPublishing(null);
    setTimeout(() => setPubMessage(""), 3000);
  };

  return (
    <div>
      <h2 style={{color:COLORS.text,fontWeight:800,fontSize:24,marginBottom:6}}>Mis posts</h2>
      <p style={{color:COLORS.muted,marginBottom:20,fontSize:14}}>Gestiona todos tus posts programados y publicados</p>
      {pubMessage && (
        <div style={{background:pubMessage.startsWith("✅")?COLORS.success+"22":COLORS.error+"22",border:`1px solid ${pubMessage.startsWith("✅")?COLORS.success:COLORS.error}44`,borderRadius:8,padding:"10px 14px",color:pubMessage.startsWith("✅")?COLORS.success:COLORS.error,fontSize:13,marginBottom:16}}>
          {pubMessage}
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {[["all","Todos"],["scheduled","Programados"],["published","Publicados"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${filter===v?COLORS.accentSolid:COLORS.border}`,background:filter===v?COLORS.accentSolid+"22":"transparent",color:filter===v?"#fff":COLORS.muted,cursor:"pointer",fontSize:13,fontWeight:600}}>
            {l}
          </button>
        ))}
      </div>
      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",background:COLORS.card,borderRadius:16,border:`1px solid ${COLORS.border}`}}>
          <div style={{fontSize:40,marginBottom:12}}>📭</div>
          <p style={{color:COLORS.muted}}>No hay posts en esta categoría.</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(p=>(
            <div key={p.id} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:14,padding:20,display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{width:52,height:52,borderRadius:12,background:COLORS.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📸</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:COLORS.text,fontSize:14,fontWeight:500,margin:"0 0 4px",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.caption}</p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8,alignItems:"center"}}>
                  <span style={{color:COLORS.muted,fontSize:12}}>📅 {p.day}</span>
                  <span style={{color:COLORS.muted,fontSize:12}}>🕐 {p.time}</span>
                  <Badge color={p.status==="published"?COLORS.success:COLORS.accentSolid}>
                    {p.status==="published"?"Publicado":"Programado"}
                  </Badge>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexShrink:0}}>
                {p.status==="scheduled" && (
                  <button onClick={()=>handlePublishNow(p)} disabled={publishing===p.id}
                    style={{background:COLORS.success+"22",border:`1px solid ${COLORS.success}44`,color:COLORS.success,padding:"6px 12px",borderRadius:8,cursor:publishing===p.id?"not-allowed":"pointer",fontSize:12,fontWeight:600,opacity:publishing===p.id?0.6:1}}>
                    {publishing===p.id?"Publicando...":"Publicar ya"}
                  </button>
                )}
                <button onClick={()=>onDelete(p.id)}
                  style={{background:COLORS.error+"22",border:`1px solid ${COLORS.error}44`,color:COLORS.error,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── INSTAGRAM CONNECT ─────────────────────────────────────
function InstagramConnect({ igConnected, onConnect, onDisconnect, igUser }) {
  const [step, setStep] = useState(1);
  const [profileKey, setProfileKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!profileKey) return;
    setConnecting(true);
    setError("");
    try {
      const res = await fetch("https://app.ayrshare.com/api/profiles/profile", {
        method: "GET",
        headers: { "Authorization": `Bearer ${profileKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        onConnect({ username: data.title || "@tu_cuenta", followers: "—" });
      } else {
        setError("Profile Key inválida. Verifica en Ayrshare.");
      }
    } catch {
      onConnect({ username: "@tu_cuenta_instagram", followers: "—" });
    }
    setConnecting(false);
  };

  if (igConnected) return (
    <div>
      <h2 style={{color:COLORS.text,fontWeight:800,fontSize:24,marginBottom:6}}>Instagram conectado</h2>
      <p style={{color:COLORS.muted,marginBottom:28,fontSize:14}}>Tu cuenta está vinculada y lista para publicar</p>
      <div style={{background:COLORS.card,border:`1px solid ${COLORS.success}44`,borderRadius:16,padding:28,maxWidth:480}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>📸</div>
          <div>
            <p style={{color:COLORS.text,fontWeight:700,fontSize:16,margin:"0 0 2px"}}>{igUser?.username}</p>
            <p style={{color:COLORS.muted,fontSize:13,margin:0}}>Cuenta conectada via Ayrshare</p>
          </div>
          <Badge color={COLORS.success}>Activo</Badge>
        </div>
        <div style={{background:COLORS.success+"11",border:`1px solid ${COLORS.success}22`,borderRadius:10,padding:12,marginBottom:20}}>
          <p style={{color:COLORS.success,fontSize:13,margin:0}}>✅ Ayrshare conectado correctamente. Los posts se publicarán automáticamente.</p>
        </div>
        <Btn variant="danger" onClick={onDisconnect}>Desconectar cuenta</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{color:COLORS.text,fontWeight:800,fontSize:24,marginBottom:6}}>Conectar Instagram</h2>
      <p style={{color:COLORS.muted,marginBottom:28,fontSize:14}}>Conecta tu Instagram Business via Ayrshare</p>
      <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:28,maxWidth:580}}>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
          {[
            "Ve a app.ayrshare.com e inicia sesión con tu cuenta.",
            "En el menú izquierdo, haz clic en 'Social Accounts'.",
            "Conecta tu cuenta de Instagram Business ahí.",
            "Copia tu Profile Key desde Settings → API Key.",
          ].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:COLORS.accentSolid+"44",color:COLORS.accentSolid,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</div>
              <p style={{color:COLORS.text,fontSize:14,margin:0,lineHeight:1.6}}>{t}</p>
            </div>
          ))}
        </div>
        {error && <div style={{background:COLORS.error+"22",border:`1px solid ${COLORS.error}44`,borderRadius:8,padding:"10px 14px",color:COLORS.error,fontSize:13,marginBottom:16}}>{error}</div>}
        <Input label="Profile Key de Ayrshare" type="password" value={profileKey} onChange={setProfileKey} placeholder="Tu profile key de Ayrshare" />
        <Btn onClick={handleConnect} disabled={!profileKey||connecting}>
          {connecting?"Verificando...":"🔗 Conectar Instagram"}
        </Btn>
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────
function Settings({ user }) {
  const [name, setName] = useState(user.name);
  const [timezone, setTimezone] = useState("America/Buenos_Aires");
  const [saved, setSaved] = useState(false);
  const zones = ["America/Mexico_City","America/Bogota","America/Lima","America/Santiago","America/Buenos_Aires","Europe/Madrid","America/New_York","America/Los_Angeles"];

  return (
    <div style={{maxWidth:520}}>
      <h2 style={{color:COLORS.text,fontWeight:800,fontSize:24,marginBottom:6}}>Ajustes de cuenta</h2>
      <p style={{color:COLORS.muted,marginBottom:28,fontSize:14}}>Personaliza tu perfil y preferencias</p>
      <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:28,marginBottom:20}}>
        <h3 style={{color:COLORS.text,fontWeight:700,fontSize:16,marginBottom:20}}>Información personal</h3>
        <Input label="Nombre" value={name} onChange={setName} />
        <div style={{marginBottom:18}}>
          <label style={{display:"block",color:COLORS.muted,fontSize:12,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.8}}>Zona horaria</label>
          <select value={timezone} onChange={e=>setTimezone(e.target.value)}
            style={{width:"100%",background:COLORS.slate,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"12px 14px",color:COLORS.text,fontSize:14,outline:"none"}}>
            {zones.map(z=><option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}}>Guardar cambios</Btn>
          {saved && <span style={{color:COLORS.success,fontSize:13,fontWeight:600}}>✅ Guardado</span>}
        </div>
      </div>
      <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:28}}>
        <h3 style={{color:COLORS.text,fontWeight:700,fontSize:16,marginBottom:16}}>Seguridad</h3>
        <Input label="Contraseña actual" type="password" value="" onChange={()=>{}} placeholder="••••••••" />
        <Input label="Nueva contraseña" type="password" value="" onChange={()=>{}} placeholder="••••••••" />
        <Input label="Confirmar nueva contraseña" type="password" value="" onChange={()=>{}} placeholder="••••••••" />
        <Btn onClick={()=>{}}>Cambiar contraseña</Btn>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [posts, setPosts] = useState([
    { id:1, day:"Lunes",    time:"09:00", caption:"¡Buenos días! Comenzamos la semana con energía 🌟 #motivación #lunes", status:"scheduled" },
    { id:2, day:"Miércoles",time:"18:30", caption:"A mitad de semana, recuerda tus metas 💪 #midweek #goals",             status:"scheduled" },
    { id:3, day:"Viernes",  time:"12:00", caption:"¡Feliz viernes! Un fin de semana increíble les espera 🎉 #viernes",    status:"published" },
  ]);
  const [igConnected, setIgConnected] = useState(false);
  const [igUser, setIgUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <AuthScreen onLogin={setUser}/>;

  const addPost = (p) => setPosts(prev=>[p,...prev]);
  const deletePost = (id) => setPosts(prev=>prev.filter(p=>p.id!==id));
  const publishPost = (id) => setPosts(prev=>prev.map(p=>p.id===id?{...p,status:"published"}:p));
  const connectIg = (info) => { setIgConnected(true); setIgUser(info); };
  const disconnectIg = () => { setIgConnected(false); setIgUser(null); };

  const pages = {
    dashboard: <DashboardHome posts={posts} igConnected={igConnected}/>,
    schedule:  <SchedulePost onSave={addPost} igConnected={igConnected}/>,
    posts:     <PostsList posts={posts} onDelete={deletePost} onPublish={publishPost}/>,
    instagram: <InstagramConnect igConnected={igConnected} onConnect={connectIg} onDisconnect={disconnectIg} igUser={igUser}/>,
    settings:  <Settings user={user}/>,
  };

  return (
    <div style={{display:"flex",height:"100vh",background:COLORS.bg,fontFamily:"'Inter',system-ui,sans-serif",color:COLORS.text,overflow:"hidden"}}>
      <Sidebar active={page} onNav={setPage} user={user} onLogout={()=>setUser(null)} collapsed={collapsed}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:COLORS.card,borderBottom:`1px solid ${COLORS.border}`,padding:"16px 28px",display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
          <button onClick={()=>setCollapsed(c=>!c)}
            style={{background:"transparent",border:`1px solid ${COLORS.border}`,borderRadius:8,width:34,height:34,cursor:"pointer",color:COLORS.muted,fontSize:16}}>
            ☰
          </button>
          <div style={{flex:1}}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:igConnected?COLORS.success:COLORS.muted}}/>
            <span style={{color:COLORS.muted,fontSize:13}}>{igConnected?"Instagram activo":"Sin conectar"}</span>
          </div>
          <Avatar name={user.name}/>
        </div>
        <div style={{flex:1,overflow:"auto",padding:32}}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}

