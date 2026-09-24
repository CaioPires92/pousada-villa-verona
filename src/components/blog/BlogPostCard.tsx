import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatBlogDate, getBlogCategoryBySlug } from "@/lib/blog";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const category = getBlogCategoryBySlug(post.category);

  return (
    <article className="group overflow-hidden border border-brand-brown-dark/10 bg-white transition-colors duration-200 hover:border-brand-brown-dark/20">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-brown-dark/5">
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {category ? (
            <Badge variant="outline" className="rounded-none border-brand-brown-dark/15 px-3 py-1">
              {category.shortLabel}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-foreground/72">
            {formatBlogDate(post.publishedAt)} • {post.readingTime}
          </p>
          <h3 className="font-heading text-[2rem] font-semibold leading-snug text-brand-brown-dark">
            <Link href={`/blog/${post.slug}`} className="hover:text-brand-brown-dark/85">
              {post.title}
            </Link>
          </h3>
          <p className="line-clamp-3 text-sm leading-7 text-foreground/72">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-brand-brown-dark/10 pt-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-brand-brown-dark/5 px-3 py-1 text-xs font-medium text-brand-brown-dark/85">
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-brown-dark transition-colors hover:text-brand-brown-dark/80"
          >
            Ler
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
