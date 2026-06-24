export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`https://socialgestion.vercel.app?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    // Intercambiar code por token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
      `client_id=${process.env.META_APP_ID}` +
      `&client_secret=${process.env.META_APP_SECRET}` +
      `&redirect_uri=https://socialgestion.vercel.app/auth/callback` +
      `&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.redirect(`https://socialgestion.vercel.app?error=${tokenData.error.message}`);
    }

    const accessToken = tokenData.access_token;

    // Obtener páginas de Facebook e Instagram conectadas
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();

    // Redirigir con el token para guardarlo en Supabase desde el frontend
    const encoded = encodeURIComponent(JSON.stringify({
      token: accessToken,
      pages: pagesData.data || []
    }));

    return res.redirect(`https://socialgestion.vercel.app?connected=${encoded}`);

  } catch (err) {
    return res.redirect(`https://socialgestion.vercel.app?error=${err.message}`);
  }
}
