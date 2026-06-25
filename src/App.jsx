import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

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

        {error && (
          <div style={{ background: error.includes("Check") ? "#064e3b" : "#450a0a", color: error.includes("Check") ? "#6ee7b7" : "#fca5a5", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <button onClick={handle} disabled={loading} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", borderRadius: "10px", color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </div>
    </div>
  )
}

function Dashboard({ user, onSignOut }) {
  const [tab, setTab] = useState("home")
  const [connectedAccounts, setConnectedAccounts] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const connected = params.get("connected")
    if (connected) {
      try {
        const data = JSON.parse(decodeURIComponent(connected))
        saveAccount(data)
        window.history.replaceState({}, "", "/")
      } catch (e) {}
    }
    loadAccounts()
  }, [])

  const saveAccount = async (data) => {
    await supabase.from("social_accounts").upsert({
      user_id: user.id,
      platform: data.platform,
      account_id: data.account_id,
      account_name: data.account_name,
      access_token: data.access_token,
    })
    loadAccounts()
  }

  const loadAccounts = async () => {
    const { data } = await supabase.from("social_accounts").select("*").eq("user_id", user.id)
    if (data) setConnectedAccounts(data)
  }

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
        {tab === "home" && <HomeTab user={user} connectedAccounts={connectedAccounts} />}
        {tab === "connect" && <ConnectTab user={user} connectedAccounts={connectedAccounts} onRefresh={loadAccounts} />}
        {tab === "schedule" && <ScheduleTab connectedAccounts={connectedAccounts} />}
        {tab === "posts" && <PostsTab user={user} />}
        {tab === "settings" && <SettingsTab user={user} />}
      </div>
    </div>
  )
}

function HomeTab({ user, connectedAccounts }) {
  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Welcome back 👋</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>{user.email}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {[
          { label: "Connected Accounts", value: connectedAccounts.length.toString(), icon: "🔗", color: "#3b82f6" },
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

function ConnectTab({ user, connectedAccounts, onRefresh }) {
  const handleConnect = (platform) => {
    console.log("user:", user, "platform:", platform)
    if (platform === "instagram") {
      const authUrl = `https://api.instagram.com/oauth/authorize?` +
        `client_id=2263603634045697` +
        `&redirect_uri=https://socialgestion.vercel.app/auth/callback` +
        `&scope=instagram_business_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_messages` +
        `&response_type=code` +
        `&state=${user.id}`
      window.location.href = authUrl
    }
  }

  const handleDisconnect = async (id) => {
    await supabase.from("social_accounts").delete().eq("id", id)
    onRefresh()
  }

  const networks = [
    { id: "instagram", name: "Instagram", icon: "📸", color: "#e1306c", description: "Connect your Instagram Business account" },
    { id: "facebook", name: "Facebook", icon: "👤", color: "#1877f2", description: "Coming soon", disabled: true },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "#25d366", description: "Coming soon", disabled: true },
  ]

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Connect Accounts</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>Link your social media accounts to start publishing</p>

      {connectedAccounts.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", marginBottom: "12px" }}>CONNECTED</h3>
          {connectedAccounts.map(acc => (
            <div key={acc.id} style={{ background: "#1e293b", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", background: "#e1306c22", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📸</div>
                <div>
                  <div style={{ color: "#f1f5f9", fontWeight: "600" }}>@{acc.account_name}</div>
                  <div style={{ color: "#10b981", fontSize: "12px" }}>● Connected</div>
                </div>
              </div>
              <button onClick={() => handleDisconnect(acc.id)} style={{ color: "#ef4444", background: "none", border: "1px solid #ef444433", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>Disconnect</button>
            </div>
          ))}
        </div>
      )}

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
            <button onClick={() => !n.disabled && handleConnect(n.id)} disabled={n.disabled} style={{ padding: "10px 20px", background: n.disabled ? "#334155" : n.color, border: "none", borderRadius: "10px", color: "white", fontWeight: "700", cursor: n.disabled ? "not-allowed" : "pointer", fontSize: "14px", opacity: n.disabled ? 0.5 : 1 }}>
              {n.disabled ? "Soon" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleTab({ connectedAccounts }) {
  const [caption, setCaption] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [scheduledFor, setScheduledFor] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSchedule = async () => {
    if (!caption || !imageUrl || !scheduledFor || !selectedAccount) {
      setMessage("Please fill all fields")
      return
    }
    setLoading(true)
    const { error } = await supabase.from("scheduled_posts").insert({
      user_id: (await supabase.auth.getUser()).data.user.id,
      social_account_id: selectedAccount,
      platform: "instagram",
      caption,
      image_url: imageUrl,
      scheduled_for: scheduledFor,
      status: "pending"
    })
    setLoading(false)
    if (error) setMessage("Error: " + error.message)
    else { setMessage("Post scheduled!"); setCaption(""); setImageUrl(""); setScheduledFor("") }
  }

  if (connectedAccounts.length === 0) {
    return (
      <div>
        <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Schedule Post</h2>
        <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <p style={{ color: "#64748b", margin: "40px 0" }}>Connect a social account first to start scheduling posts</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>Schedule Post</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>Create and schedule posts for your connected accounts</p>
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", maxWidth: "600px" }}>
        <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }}>
          <option value="">Select account</option>
          {connectedAccounts.map(acc => <option key={acc.id} value={acc.id}>@{acc.account_name}</option>)}
        </select>
        <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..." rows={4} style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", resize: "vertical" }} />
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (must be public)" style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }} />
        <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", marginBottom: "20px", boxSizing: "border-box" }} />
        {message && <div style={{ padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", background: message.includes("Error") ? "#450a0a" : "#064e3b", color: message.includes("Error") ? "#fca5a5" : "#6ee7b7" }}>{message}</div>}
        <button onClick={handleSchedule} disabled={loading} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", borderRadius: "10px", color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Scheduling..." : "Schedule Post"}
        </button>
      </div>
    </div>
  )
}

function PostsTab({ user }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    supabase.from("scheduled_posts").select("*").eq("user_id", user.id).order("scheduled_for", { ascending: true }).then(({ data }) => { if (data) setPosts(data) })
  }, [])

  const statusColor = { pending: "#f59e0b", published: "#10b981", failed: "#ef4444" }

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>My Posts</h2>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>All your scheduled and published posts</p>
      {posts.length === 0 ? (
        <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <p style={{ color: "#64748b", margin: "40px 0" }}>No posts yet. Schedule your first post!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
              {post.image_url && <img src={post.image_url} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />}
              <div style={{ flex: 1 }}>
                <div style={{ color: "#f1f5f9", fontWeight: "600", marginBottom: "4px" }}>{post.caption.substring(0, 80)}...</div>
                <div style={{ color: "#64748b", fontSize: "13px" }}>{new Date(post.scheduled_for).toLocaleString()}</div>
              </div>
              <div style={{ color: statusColor[post.status], fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>{post.status}</div>
            </div>
          ))}
        </div>
      )}
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
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src="/logo.png" style={{ width: "60px" }} />
    </div>
  )

  if (!session) return <AuthScreen />

  return <Dashboard user={session.user} onSignOut={() => supabase.auth.signOut()} />
}
