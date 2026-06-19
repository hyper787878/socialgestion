// api/publish.js — Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { caption, imageUrl, platforms = ["instagram"] } = req.body;

  if (!caption) {
    return res.status(400).json({ error: "Caption es requerido" });
  }

  try {
    const body = {
      post: caption,
      platforms,
    };

    if (imageUrl) {
      body.mediaUrls = [imageUrl];
    }

    const response = await fetch("https://app.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AYRSHARE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Error al publicar" });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
