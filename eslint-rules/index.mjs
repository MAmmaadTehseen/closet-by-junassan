/**
 * Local ESLint plugin for closet-by-junassan.
 *
 * Currently provides a single rule that guards the Supabase service-role
 * client (`@/lib/supabase/admin`) from ever being imported into a file
 * with the `"use client"` directive. The admin module already has
 * `import "server-only"` + a runtime browser-throw — this rule catches
 * the same class of mistake at edit time, before build/runtime.
 */

const ADMIN_MODULE = "@/lib/supabase/admin";
const RELATIVE_SUFFIX = "/lib/supabase/admin";

function isAdminSpecifier(value) {
  if (typeof value !== "string") return false;
  if (value === ADMIN_MODULE) return true;
  // relative imports like "../../lib/supabase/admin"
  if (value.startsWith(".") && value.endsWith(RELATIVE_SUFFIX)) return true;
  return false;
}

function fileIsUseClient(ast) {
  for (const stmt of ast.body) {
    if (stmt.type !== "ExpressionStatement") break;
    if (stmt.expression?.type !== "Literal") break;
    if (typeof stmt.expression.value !== "string") break;
    if (stmt.expression.value === "use client") return true;
  }
  return false;
}

const noAdminInClient = {
  meta: {
    type: "problem",
    docs: {
      description:
        'Forbid importing "@/lib/supabase/admin" from a file with the "use client" directive. The admin client uses SUPABASE_SERVICE_ROLE_KEY and must only run on the server.',
      recommended: true,
    },
    schema: [],
    messages: {
      forbidden:
        'Do not import "{{specifier}}" from a "use client" file — it exposes the Supabase service-role key to the browser bundle. Move the call into a server component, server action, or route handler.',
    },
  },
  create(context) {
    const ast = context.sourceCode.ast;
    if (!fileIsUseClient(ast)) return {};

    function check(node, specifier) {
      if (isAdminSpecifier(specifier)) {
        context.report({ node, messageId: "forbidden", data: { specifier } });
      }
    }

    return {
      ImportDeclaration(node) {
        check(node, node.source.value);
      },
      ImportExpression(node) {
        if (node.source.type === "Literal") check(node, node.source.value);
      },
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "require" &&
          node.arguments[0]?.type === "Literal"
        ) {
          check(node, node.arguments[0].value);
        }
      },
    };
  },
};

const plugin = {
  meta: { name: "local" },
  rules: {
    "no-admin-in-client": noAdminInClient,
  },
};

export default plugin;
