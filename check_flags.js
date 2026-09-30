const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// قراءة .env.local يدوياً
const env = {};
try {
  fs.readFileSync(".env.local", "utf8").split("\n").forEach(line => {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  });
} catch (e) {
  console.error("❌ لا يمكن قراءة .env.local");
  process.exit(1);
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ مفاتيح Supabase مفقودة");
  process.exit(1);
}

const sb = createClient(url, key);

(async () => {
  console.log("════════ فحص feature_flags ════════");
  console.log("");

  const { data, error } = await sb.from("feature_flags").select("*");

  if (error) {
    console.error("❌ خطأ:", error.message);
    console.error("   الرمز:", error.code);
    console.error("");
    console.error("💡 الجدول غير موجود — نفّذ SQL1 في Supabase أولاً");
    process.exit(1);
  }

  console.log("✅ الجدول موجود");
  console.log("📊 إجمالي الميزات:", data.length);
  console.log("🟢 نشطة:", data.filter(f => f.enabled).length);
  console.log("🔴 معطّلة:", data.filter(f => !f.enabled).length);
  console.log("");
  console.log("════════ القائمة ════════");
  data.sort((a,b) => a.key.localeCompare(b.key)).forEach(f => {
    console.log(`  ${f.enabled ? "🟢" : "🔴"} ${f.key.padEnd(22)} — ${f.label}`);
  });
})();
