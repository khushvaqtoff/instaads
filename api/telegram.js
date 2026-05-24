export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const BOT_TOKEN = "AAGvogT1cKZjUrHg1bA2Vnb0rZghCeMq36M";
  const CHAT_ID = "495260714";

  const r = await fetch(
    "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: req.body.text }),
    }
  );

  const data = await r.json();
  res.status(200).json(data);
}