export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { caption, imageUrl, scheduleDate } = req.body;

  if (!caption || !imageUrl || !scheduleDate) {
    return res.status(400).json({
      error: "caption, imageUrl y scheduleDate son requeridos",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Post guardado para programación (simulado). Próximamente: publicación automática real.",
    scheduledFor: scheduleDate,
  });
}
