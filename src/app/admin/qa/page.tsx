import { redirect } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchPendingQuestionsAdmin } from "@/lib/qa";
import { answerQuestion, deleteQuestion } from "@/lib/qa-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminQaPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const questions = hasAdminEnv() ? await fetchPendingQuestionsAdmin() : [];
  const pending = questions.filter((q) => !q.answer);
  const answered = questions.filter((q) => q.answer);

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Trust</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Questions</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {pending.length} pending · {answered.length} answered
          </p>
        </div>
        <MessagesSquare className="h-5 w-5 text-muted-foreground" />
      </div>

      {questions.length === 0 && (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No questions yet. They appear here once customers submit one from a product page.
        </p>
      )}

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-lg font-semibold">Pending</h2>
          <div className="space-y-4">
            {pending.map((q) => (
              <QCard key={q.id} q={q} />
            ))}
          </div>
        </section>
      )}

      {answered.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Answered</h2>
          <div className="space-y-4">
            {answered.map((q) => (
              <QCard key={q.id} q={q} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function QCard({
  q,
}: {
  q: {
    id: string;
    body: string;
    answer: string | null;
    asker_name: string | null;
    phone: string | null;
    product_name?: string;
    created_at: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {q.product_name ?? "Product"} · {new Date(q.created_at).toLocaleDateString("en-PK")} ·{" "}
        {q.asker_name ?? "Anonymous"}
      </p>
      <p className="mt-2 text-sm font-medium text-ink">{q.body}</p>

      <AdminForm action={answerQuestion} className="mt-4 space-y-3">
        <input type="hidden" name="id" value={q.id} />
        <textarea
          name="answer"
          defaultValue={q.answer ?? ""}
          required
          rows={3}
          placeholder="Type your answer…"
          className="w-full resize-none rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
        />
        <div className="flex gap-2">
          <SubmitButton
            pendingText="Publishing…"
            className="rounded-full bg-ink px-5 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
          >
            {q.answer ? "Update answer" : "Publish answer"}
          </SubmitButton>
        </div>
      </AdminForm>

      <AdminForm action={deleteQuestion} className="mt-3 border-t border-border pt-3">
        <input type="hidden" name="id" value={q.id} />
        <ConfirmButton
          message="Delete this question?"
          className="rounded-full border border-accent-red px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-red hover:bg-accent-red hover:text-paper"
        >
          Delete
        </ConfirmButton>
      </AdminForm>
    </div>
  );
}
