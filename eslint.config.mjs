import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Forbid `@/lib/supabase/admin` imports from any module that opens with a
// `"use client"` directive. The admin client is `server-only` and holds
// `SUPABASE_SERVICE_ROLE_KEY`; importing it from a client module would
// bundle that key into the browser.
const noAdminSupabaseInClient = {
  meta: {
    type: "problem",
    docs: {
      description:
        'Disallow importing `@/lib/supabase/admin` from a `"use client"` file.',
    },
    schema: [],
    messages: {
      forbidden:
        '`@/lib/supabase/admin` is server-only — importing it from a `"use client"` file would ship SUPABASE_SERVICE_ROLE_KEY to the browser. Move the call into a server action or server component.',
    },
  },
  create(context) {
    let isClient = false;
    return {
      Program(node) {
        for (const stmt of node.body) {
          if (stmt.type !== "ExpressionStatement") break;
          const directive =
            stmt.directive ??
            (stmt.expression?.type === "Literal" ? stmt.expression.value : null);
          if (typeof directive !== "string") break;
          if (directive === "use client") {
            isClient = true;
            break;
          }
        }
      },
      ImportDeclaration(node) {
        if (!isClient) return;
        const src = node.source.value;
        if (typeof src !== "string") return;
        if (src === "@/lib/supabase/admin" || src.startsWith("@/lib/supabase/admin/")) {
          context.report({ node, messageId: "forbidden" });
        }
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      local: {
        rules: {
          "no-admin-supabase-in-client": noAdminSupabaseInClient,
        },
      },
    },
    rules: {
      "local/no-admin-supabase-in-client": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
