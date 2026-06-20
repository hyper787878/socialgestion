export default async function handler(req, res) {
  const IG_ID = process.env.IG_BUSINESS_ID;
  const TOKEN = process.env.META_ACCESS_TOKEN;

  if (!IG_ID || !TOKEN) {
    return res.status(500).json({
      connected: false,
      error: "Variables de entorno no configuradas (IG_BUSINESS_ID o META_ACCESS_TOKEN).",
    });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}?fields=username,followers_count&access_token=${TOKEN}`
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        connected: false,
        error: data.error?.message || "No se pudo conectar con Instagram.",
      });
    }

    return res.status(200).json({
      connected: true,
      username: data.username ? "@" + data.username : "@tu_cuenta",
      followers: data.followers_count || "—",
    });
  } catch (error) {
    return res.status(500).json({
      connected: false,
      error: "Error al verificar: " + error.message,
    });
  }
}
