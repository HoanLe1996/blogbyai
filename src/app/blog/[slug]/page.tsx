import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Component để hiển thị markdown
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Tạo metadata động cho SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Không tìm thấy bài viết',
      description: 'Bài viết không tồn tại hoặc đã bị xóa'
    };
  }
  
  return {
    title: post.title,
    description: post.summary || `Đọc bài viết ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.summary || `Đọc bài viết ${post.title}`,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      url: `https://yourblog.com/blog/${post.slug}`,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      authors: [post.author.name || 'Tác giả'],
    },
  };
}

// Lấy thông tin bài viết từ database
async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return post;
}

// Lấy các bài viết liên quan
async function getRelatedPosts(postId: string, categoryIds: string[]) {
  const relatedPosts = await prisma.post.findMany({
    where: {
      id: {
        not: postId,
      },
      published: true,
      categories: {
        some: {
          id: {
            in: categoryIds,
          },
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      },
    },
    take: 3,
  });

  return relatedPosts;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }

  // Lấy các bài viết liên quan
  const categoryIds = post.categories.map(category => category.id);
  const relatedPosts = await getRelatedPosts(post.id, categoryIds);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
          Blog
        </Link>
        {post.categories.length > 0 && (
          <>
            <span className="mx-2">/</span>
            <Link 
              href={`/blog/category/${post.categories[0].slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {post.categories[0].name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-200">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* Meta info */}
        <div className="flex flex-wrap items-center mb-6 space-x-4 text-sm text-gray-600 dark:text-gray-400">
          {/* Author info */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-2">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs">{post.author.name?.[0]}</span>
                </div>
              )}
            </div>
            <span>{post.author.name}</span>
          </div>

          {/* Divider */}
          <span>•</span>

          {/* Date */}
          <time dateTime={post.createdAt.toISOString()}>
            {format(new Date(post.createdAt), 'dd MMM, yyyy')}
          </time>

          {/* AI Badge */}
          {post.aiGenerated && (
            <>
              <span>•</span>
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                AI Generated
              </span>
            </>
          )}
        </div>

        {/* Categories and tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {category.name}
            </Link>
          ))}
          
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        
        {/* Featured image */}
        {post.featuredImage && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}
        
        {/* Summary */}
        {post.summary && (
          <div className="mb-8 text-lg italic text-gray-600 dark:text-gray-400 border-l-4 border-blue-600 pl-4 py-2">
            {post.summary}
          </div>
        )}
      </header>

      {/* Main content */}
      <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </article>

      {/* Author bio */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-12">
        <div className="flex items-start">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || 'Author'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span>{post.author.name?.[0]}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {post.author.name || 'Tác giả'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {post.author.bio || 'Không có thông tin giới thiệu.'}
            </p>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group-hover:shadow-md transition-shadow">
                  <div className="relative h-40 w-full">
                    {relatedPost.featuredImage ? (
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>{relatedPost.author.name}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={relatedPost.createdAt.toISOString()}>
                        {format(new Date(relatedPost.createdAt), 'dd MMM, yyyy')}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}