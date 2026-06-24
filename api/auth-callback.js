export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`https://socialgestion.vercel.app?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const tokenRes = await fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.IG_APP_ID,
          client_secret: process.env.IG_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: "https://socialgestion.vercel.app/auth/callback",
          code: code,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error_type) {
      return res.redirect(`https://socialgestion.vercel.app?error=${tokenData.error_message}`);
    }

    const shortToken = tokenData.access_token;
    const igUserId = tokenData.user_id;

    // Intercambiar por token de larga duración (60 días)
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.IG_APP_SECRET}&access_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    const longToken = longTokenData.access_token || shortToken;

    // Obtener info del usuario
    const userRes = await fetch(
      `https://graph.instagram.com/v19.0/me?fields=id,username&access_token=${longToken}`
    );
    const userData = await userRes.json();

    const encoded = encodeURIComponent(JSON.stringify({
      platform: "instagram",
      account_id: igUserId,
      account_name: userData.username || "instagram",
      access_token: longToken,
    }));

    return res.redirect(`https://socialgestion.vercel.app?connected=${encoded}`);

  } catch (err) {
    return res.redirect(`https://socialgestion.vercel.app?error=${err.message}`);
  }
}
