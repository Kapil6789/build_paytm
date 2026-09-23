import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const backend = spawn(process.execPath, ["index.js"], {
  cwd: root,
  stdio: "inherit",
});

const frontend = spawn(npm, ["run", "dev"], {
  cwd: path.join(root, "frontend"),
  stdio: "inherit",
  shell: process.platform === "win32",
});

function stop() {
  backend.kill();
  frontend.kill();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

backend.on("exit", (code) => {
  if (code !== 0 && code !== null) console.error(`Backend exited with code ${code}`);
});
frontend.on("exit", (code) => {
  if (code !== 0 && code !== null) console.error(`Frontend exited with code ${code}`);
});
