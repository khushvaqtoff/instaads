export async function sendTelegram(order) {
  const BOT_TOKEN = "AAGvogT1cKZjUrHg1bA2Vnb0rZghCeMq36M";
  const CHAT_ID = "495260714";

  const text = `🎯 *YANGI BUYURTMA!*

📱 *Akkaunt:* @${order.username || "—"}
📞 *Telefon:* ${order.phone || "—"}
🏪 *Biznes:* ${order.accountType}
🎯 *Maqsad:* ${order.goal}
📍 *Regionlar:* ${order.regions}${order.cities ? `\n🏙️ *Shaharlar:* ${order.cities}` : ""}
👥 *Auditoriya:* ${order.audience}${order.interests ? `\n💡 *Qiziqishlar:* ${order.interests}` : ""}
🎬 *Format:* ${order.format}${order.adText ? `\n📝 *Matn:* ${order.adText}` : ""}
📅 *Muddat:* ${order.duration} kun
💰 *Byudjet:* ${order.budget} so'm/oy
👁️ *Ko'rish:* ${order.reach} odam

⏰ ${new Date().toLocaleString("uz-UZ")}`;

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" }),
  });

  return res.ok;
}