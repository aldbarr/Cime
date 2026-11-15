// Assemble src/ into a single self-contained dist/index.html
const fs = require("fs");
const path = require("path");
const read = f => fs.readFileSync(path.join(__dirname, "src", f), "utf8");
const html = read("shell.html")
  .replace("/*GEO*/", () => read("geo.js"))
  .replace("/*I18N*/", () => read("i18n.js"))
  .replace("/*APP*/", () => read("app.js"));
fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist", "index.html"), html);
console.log(`dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);
