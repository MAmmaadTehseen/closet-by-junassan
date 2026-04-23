import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL, findPost } from "@/lib/journal";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return JOURNAL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.dek,
    openGraph: { title: post.title, description: post.dek, images: [post.cover] },
  };
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const related = JOURNAL.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
      <Link
        href="/journal"
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-ink"
      >
        ← Journal
      </Link>
      <p className="eyebrow mt-6">{post.category} · {post.readMinutes} min read</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">{post.dek}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        By {post.author} · {new Date(post.date).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-3xl bg-cream">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          priority
          className="object-cover"
        />
      </div>

      <div className="prose-none space-y-6 text-base leading-relaxed text-ink/90">
        {post.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <p className="eyebrow mb-4">More from the Journal</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/journal/${r.slug}`} className="group block focus-ring">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
                  <Image
                    src={r.cover}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.dek}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
