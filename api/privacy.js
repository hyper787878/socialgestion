export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Privacy Policy - Social Gestion</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 60px auto; padding: 0 24px; color: #1e293b; line-height: 1.7; }
    h1 { color: #0047CC; }
    h2 { color: #1e293b; margin-top: 32px; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p>Last updated: June 25, 2026</p>
  <h2>1. Information We Collect</h2>
  <p>Social Gestion collects information you provide when creating an account, including your name, email address, and social media account credentials necessary to provide our services.</p>
  <h2>2. How We Use Your Information</h2>
  <p>We use your information to provide, maintain, and improve our social media management services, including scheduling and publishing posts on your behalf.</p>
  <h2>3. Data Sharing</h2>
  <p>We do not sell your personal information. We share data only with Meta platforms (Instagram, Facebook, WhatsApp) as required to provide our core services.</p>
  <h2>4. Data Deletion</h2>
  <p>You may request deletion of your data at any time by contacting us at luciano222015suarez@gmail.com. We will delete your data within 30 days.</p>
  <h2>5. Contact</h2>
  <p>For any privacy-related questions, contact us at luciano222015suarez@gmail.com</p>
</body>
</html>`);
}
