import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // If no credentials configured, serve the app directly
  if (!username || !password) {
    return serveIndex(res);
  }

  const header = req.headers.authorization;
  if (header) {
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const [u, ...rest] = decoded.split(":");
      const p = rest.join(":");
      if (u === username && p === password) {
        return serveIndex(res);
      }
    }
  }

  res.setHeader("WWW-Authenticate", 'Basic realm="Light Darkly"');
  return res.status(401).send("Unauthorized");
}

function serveIndex(res: VercelResponse) {
  try {
    const indexPath = join(process.cwd(), "dist", "index.html");
    const html = readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch {
    return res.status(500).send("Failed to load application");
  }
}
