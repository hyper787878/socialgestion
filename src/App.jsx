import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

const META_APP_ID = "2263603634045697"

function AuthScreen() {
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
          <img src="/logo.png" style={{ width: "80px", height: "auto", margin: "0 auto 16px", display: "block" }} />
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
      <div style={{ width: "240px", background: "#1e293b", padding: "24px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", padding: "0 8px" }}>
          <img src="/logo.png" style={{ width: "40px", height: "auto" }} />
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

      <div style={{ flex: 1, padding: "32px" }}>
        {tab === "home" && <HomeTab user={user} />}
        {tab === "connect" && <ConnectTab user={user} />}
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
        {[
          { label: "Connected Accounts", value: "0", icon: "🔗", color: "#3b82f6" },
          { label: "Scheduled Posts", value: "0", icon: "📅", color: "#8b5cf6" },
          { label: "Published Posts", value: "0", icon: "✅", color: "#10b981" }
        ].map(card => (
          <div key={card.label} style={{ background: "#1e293b", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{card.icon}</div>
            <div style={{ color: card.color, fontSize: "32px", fontWeight: "700" }}>{card.value}</div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConnectTab({ user }) {
  const handleConnect = (platform) => {
    if (platform === 'instagram' || platform === 'facebook') {
      const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
        `client_id=${META_APP_ID}` +
        `&redirect_uri=https://socialgestion.vercel.app/auth/callback` +
        `&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_messages,pages_read_engagement,pages_show_list,business_management` +
        `&response_type=code` +
        `&state=${user.id}`
      window.location.href = authUrl
    }
  }

  const networks = [
    { id: "instagram", name: "Instagram", icon: "📸", color: "#e1306c", description: "Connect your Instagram Business account" },
    { id: "facebook", name: "Facebook", icon: "👤", color: "#1877f2", description: "Connect your Facebook Page" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "#25d366", description: "Coming soon", disabled: true },
  ]

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Connect Accounts</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>Link your social media accounts to start publishing</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {networks.map(n => (
          <div key={n.id} style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", background: n.color + "22", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{n.icon}</div>
              <div>
                <div style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "16px" }}>{n.name}</div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>{n.description}</div>
              </div>
            </div>
            <button
              onClick={() => !n.disabled && handleConnect(n.id)}
              disabled={n.disabled}
              style={{ padding: "10px 20px", background: n.disabled ? "#334155" : n.color, border: "none", borderRadius: "10px", color: "white", fontWeight: "700", cursor: n.disabled ? "not-allowed" : "pointer", fontSize: "14px", opacity: n.disabled ? 0.5 : 1 }}>
              {n.disabled ? "Soon" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleTab() {
  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Schedule Post</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>Create and schedule posts for your connected accounts</p>
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", maxWidth: "600px" }}>
        <p style={{ color: "#64748b", textAlign: "center", margin: "40px 0" }}>Connect a social account first to start scheduling posts</p>
      </div>
    </div>
  )
}

function PostsTab() {
  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>My Posts</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>All your scheduled and published posts</p>
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
        <p style={{ color: "#64748b", margin: "40px 0" }}>No posts yet. Schedule your first post!</p>
      </div>
    </div>
  )
}

function SettingsTab({ user }) {
  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 32px" }}>Settings</h2>
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", maxWidth: "500px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>EMAIL</label>
          <div style={{ color: "#f1f5f9", marginTop: "4px" }}>{user.email}</div>
        </div>
        <div>
          <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>PLAN</label>
          <div style={{ color: "#3b82f6", marginTop: "4px", fontWeight: "700" }}>Starter</div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <img src="/logo.png" style={{ width: "60px", animation: "pulse 1.5s infinite" }} />
    </div>
  )

  if (!session) return <AuthScreen />

  return <Dashboard user={session.user} onSignOut={() => supabase.auth.signOut()} />
}
