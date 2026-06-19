export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { caption, imageUrl } = req.body;

  if (!caption || !imageUrl) {
    return res.status(400).json({ error: "caption e imageUrl son requeridos" });
  }

  const IG_ID = process.env.IG_BUSINESS_ID;
  const TOKEN = process.env.META_ACCESS_TOKEN;

  try {
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: TOKEN,
        }),
      }
    );

    const containerData = await containerRes.json();

    if (!containerRes.ok) {
      return res.status(containerRes.status).json({
        error: containerData.error?.message || "Error al crear el contenedor de media",
      });
    }

    const creationId = containerData.id;

    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: TOKEN,
        }),
      }
    );

    const publishData = await publishRes.json();

    if (!publishRes.ok) {
      return res.status(publishRes.status).json({
        error: publishData.error?.message || "Error al publicar",
      });
    }

    return res.status(200).json({ success: true, data: publishData });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
}
