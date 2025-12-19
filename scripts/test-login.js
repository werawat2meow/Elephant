const http = require("http");
const { URLSearchParams } = require("url");
const fs = require("fs");
const path = require("path");

// load .env minimal
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(?:"([^"]*)"|(.*))$/);
    if (m) process.env[m[1]] = m[2] ?? m[3];
  });
}

const HOST = process.env.NEXTAUTH_URL || "http://localhost:3000";
async function fetchCsrf() {
  const res = await fetch(HOST + "/api/auth/csrf", { method: "GET" });
  const cookies = res.headers.get("set-cookie") || "";
  const body = await res.json();
  return { body, cookies };
}

async function postCredentials(csrfToken, cookies, email, password) {
  const params = new URLSearchParams();
  params.append("csrfToken", csrfToken);
  params.append("callbackUrl", "/");
  params.append("email", email);
  params.append("password", password);

  const res = await fetch(HOST + "/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies.split(",")[0] || "",
    },
    body: params.toString(),
    redirect: "manual",
  });
  const text = await res.text();
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers),
    body: text,
  };
}

(async function main() {
  try {
    console.log("HOST:", HOST);
    const { body, cookies } = await fetchCsrf();
    console.log("csrf body:", body);
    console.log("cookies header:", cookies);
    const email = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
    const res = await postCredentials(body.csrfToken, cookies, email, password);
    console.log("POST result status:", res.status);
    console.log("POST headers:", res.headers);
    console.log("POST body (truncated):", res.body.slice(0, 1000));
  } catch (e) {
    console.error(e);
  }
})();
