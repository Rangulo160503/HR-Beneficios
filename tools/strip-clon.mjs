import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
const traverse = traverseModule.default || traverseModule;
import generateModule from "@babel/generator";
const generate = generateModule.default || generateModule;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CLON = path.join(ROOT, "clon");

const EMOJI_RE = /\p{Extended_Pictographic}/gu;

function stripEmoji(s) {
  if (typeof s !== "string") return s;
  return s.replace(EMOJI_RE, "").replace(/\uFE0F/g, "").replace(/\u200D/g, "");
}

function isConsoleCall(node) {
  if (node?.type !== "CallExpression") return false;
  const c = node.callee;
  if (c?.type === "MemberExpression" && !c.computed) {
    if (c.object?.type === "Identifier" && c.object.name === "console") return true;
  }
  return false;
}

function walkDirs(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".vite") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkDirs(p, out);
    else if (/\.(m?jsx?)$/.test(name)) out.push(p);
  }
  return out;
}

function processFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
      errorRecovery: true,
    });
  } catch {
    return;
  }

  traverse(ast, {
    enter(p) {
      const n = p.node;
      n.leadingComments = null;
      n.innerComments = null;
      n.trailingComments = null;
    },
    StringLiteral(p) {
      p.node.value = stripEmoji(p.node.value);
    },
    JSXText(p) {
      p.node.value = stripEmoji(p.node.value);
    },
    TemplateElement(p) {
      const v = p.node.value;
      v.raw = stripEmoji(v.raw);
      v.cooked = stripEmoji(v.cooked);
    },
    ExpressionStatement(p) {
      if (isConsoleCall(p.node.expression)) {
        p.remove();
      }
    },
    JSXExpressionContainer(p) {
      const ex = p.node.expression;
      if (ex?.type === "JSXEmptyExpression") {
        p.remove();
      }
    },
  });

  const out = generate(ast, { comments: false, retainLines: false }, code).code;
  fs.writeFileSync(filePath, out + (out.endsWith("\n") ? "" : "\n"), "utf8");
}

const apps = [
  "AdminBeneficiosFinalPublicado",
  "InicioBeneficiosFinalPublicado",
  "BeneficiosFinalPublicado",
  "ProveedorBeneficiosFinalPublicado",
];

for (const app of apps) {
  const src = path.join(CLON, app, "src");
  if (!fs.existsSync(src)) continue;
  for (const f of walkDirs(src)) {
    processFile(f);
  }
}
