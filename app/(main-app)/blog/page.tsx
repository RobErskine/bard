// src/app/posts/page.tsx
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';

import Link from 'next/link';
import Image from 'next/image';

// 1. Create a reader
const reader = createReader(process.cwd(), keystaticConfig);

export default async function Page() {
  
  // 2. Read the "Posts" collection
  const posts = await reader.collections.posts.all();
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map(post => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            {post.entry.featuredImage && (
              <div className="relative w-full rounded-br-2xl overflow-hidden">
                <Image className="object-cover w-full block" src={`${post.entry.featuredImage}`} alt="" width="400" height="225" />
              </div>
            )}
            <h2 className="inline-block leading-5 mt-3">{post.entry.title}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}