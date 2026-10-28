// Builds a browser preview from the real source files, without npm.
// Each .ts/.tsx file is transpiled by TypeScript into a tiny CommonJS-style
// module; a small loader in the page wires up `require`.
//
// Usage: node preview/build.mjs <path-to-typescript.js> <out-dir> [gsap-dist-dir]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [, , tsPath, outDir, gsapDir] = process.argv;
const ts = createRequire(import.meta.url)(tsPath);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = path.join(root, "src");

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f) && !f.endsWith(".d.ts") && !p.endsWith("layout.tsx")) files.push(p);
  }
})(src);

let bundle = "";
let errors = 0;
for (const file of files) {
  const code = fs.readFileSync(file, "utf8");
  const out = ts.transpileModule(code, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      jsxFactory: "React.createElement",
      jsxFragmentFactory: "React.Fragment",
    },
  });
  for (const d of out.diagnostics ?? []) {
    errors++;
    console.error(file, ts.flattenDiagnosticMessageText(d.messageText, "\n"));
  }
  const id = "@/" + path.relative(src, file).replace(/\\/g, "/").replace(/\.(tsx|ts)$/, "");
  // CSS imports are handled by the page itself.
  const js = out.outputText.replace(/require\("[^"]+\.css"\);?/g, "");
  bundle += `__define(${JSON.stringify(id)}, function (require, exports, module) {\nvar React = require("react");\n${js}\n});\n`;
}
if (errors) {
  console.error(`${errors} syntax error(s)`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "app.bundle.js"), bundle);
fs.copyFileSync(path.join(src, "app/globals.css"), path.join(outDir, "globals.css"));
if (gsapDir) {
  for (const f of ["gsap.min.js", "ScrollTrigger.min.js"]) fs.copyFileSync(path.join(gsapDir, f), path.join(outDir, f));
}
console.log(`bundled ${files.length} modules → ${outDir}`);
