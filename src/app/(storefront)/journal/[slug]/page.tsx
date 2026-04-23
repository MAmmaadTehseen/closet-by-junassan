import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { JOURNAL } from "@/lib/journal";

export function generateStaticParams() {
  return JOURNAL.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = JOURNAL.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPost({ params }: { params: Params }) {
  const { slug } = await params;
  const post = JOURNAL.find((p) => p.slug === slug);
  if (!post) notFound();

  const more = JOURNAL.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
        </Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {post.tag}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-6xl">{post.title}</h1>
        <p className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>By {post.author}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
          <span>{new Date(post.date).toLocaleDateString("en-PK", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} min</span>
        </p>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-3xl bg-cream">
          <Image src={post.cover} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>

        <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/85">
          {post.body.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </article>

      <section className="border-t border-border bg-cream/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="eyebrow mb-6">Keep reading</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper">
                  <Image src={p.cover} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.readTime} min · {p.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
