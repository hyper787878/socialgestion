import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

// Auth Screen
function AuthScreen({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    setError("")
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (error) setError(error.message)
        else setError("Check your email to confirm your account.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "16px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>⚡</div>
          <h1 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>Social Gestión</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Manage all your social media in one place</p>
        </div>

        <div style={{ display: "flex", background: "#0f172a", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
          <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", background: isLogin ? "#3b82f6" : "transparent", color: isLogin ? "white" : "#94a3b8" }}>Sign In</button>
          <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", background: !isLogin ? "#3b82f6" : "transparent", color: !isLogin ? "white" : "#94a3b8" }}>Sign Up</button>
        </div>

        {!isLogin && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }} />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "20px", boxSizing: "border-box" }} />

        {error && <div style={{ background: error.includes("Check") ? "#064e3b" : "#450a0a", color: error.includes("Check") ? "#6ee7b7" : "#fca5a5", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

        <button onClick={handle} disabled={loading} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", borderRadius: "10px", color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </div>
    </div>
  )
}

// Dashboard
function Dashboard({ user, onSignOut }) {
  const [tab, setTab] = useState("home")

  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "connect", label: "Connect", icon: "🔗" },
    { id: "schedule", label: "Schedule", icon: "📅" },
    { id: "posts", label: "Posts", icon: "📋" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", background: "#1e293b", padding: "24px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", padding: "0 8px" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
          <span style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "16px" }}>Social Gestión</span>
        </div>

        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "4px", background: tab === t.id ? "#3b82f6" : "transparent", color: tab === t.id ? "white" : "#94a3b8", fontSize: "14px", fontWeight: "600", textAlign: "left" }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "12px", background: "#0f172a", borderRadius: "10px" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 8px" }}>{user.email}</p>
          <button onClick={onSignOut} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", padding: 0 }}>Sign out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px" }}>
        {tab === "home" && <HomeTab user={user} />}
        {tab === "connect" && <ConnectTab />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "settings" && <SettingsTab user={user} />}
      </div>
    </div>
  )
}

function HomeTab({ user }) {
  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Welcome back 👋</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>{user.email}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {[{ label: "Connected Accounts", value: "0", icon: "🔗", color: "#3b82f6" }, { label: "Scheduled Posts", value: "0", icon: "📅", color: "#8b5cf6" }, { label: "Published Posts", value: "0", icon: "✅", color: "#10b981" }].map(card => (
          <div key={card.label} style={{ background: "#1e293b", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{card.icon}</div>
            <div style={{ color: card.color, fontSize: "32px", fontWeight: "700" }}>{card.value}</div>
            <div style={{ color: "#94a3b8", fontSize:
