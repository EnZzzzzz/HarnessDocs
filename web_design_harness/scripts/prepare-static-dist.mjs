import { rename, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const exportDir = resolve(projectRoot, "out");
const distDir = resolve(projectRoot, "dist");

await rm(distDir, { recursive: true, force: true });
await rename(exportDir, distDir);

console.log(`Static site prepared at ${distDir}`);
