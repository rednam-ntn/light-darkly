/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function basicAuthPlugin(): Plugin {
  return {
    name: "basic-auth",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const username = process.env.BASIC_AUTH_USERNAME;
        const password = process.env.BASIC_AUTH_PASSWORD;

        if (!username || !password) {
          return next();
        }

        const header = req.headers.authorization;
        if (header) {
          const [scheme, encoded] = header.split(" ");
          if (scheme === "Basic" && encoded) {
            const decoded = Buffer.from(encoded, "base64").toString("utf-8");
            const [u, p] = decoded.split(":");
            if (u === username && p === password) {
              return next();
            }
          }
        }

        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", 'Basic realm="Light Darkly"');
        res.end("Unauthorized");
      });
    },
  };
}

export default defineConfig({
  plugins: [basicAuthPlugin(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
