import { PostCard } from "@/components/blog/post-card";
import type { BlogCard } from "@/sanity/blog";

/*
 * Related posts (Blog Build Spec §4/§5): up to 3 from the same category,
 * excluding the current post. Also an internal-linking ranking signal.
 * Renders nothing when a category has no other posts yet.
 */
export function RelatedPosts({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;
  return (
    <section aria-label="Related posts" className="mt-20">
      <h2 className="text-center">Keep reading</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
