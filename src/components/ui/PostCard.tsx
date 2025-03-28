import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    featuredImage?: string | null;
    summary?: string | null;
    createdAt: Date;
    author: Author;
    categories: Category[];
    aiGenerated: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}
        {post.aiGenerated && (
          <span className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs rounded-md">
            AI Generated
          </span>
        )}
      </div>
      
      <div className="p-4">
        {post.categories.length > 0 && (
          <div className="flex gap-2 mb-2">
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
        
        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400">
            {post.title}
          </h3>
        </Link>
        
        {post.summary && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {post.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
          
          <time dateTime={post.createdAt.toISOString()}>
            {format(new Date(post.createdAt), 'dd MMM, yyyy')}
          </time>
        </div>
      </div>
    </div>
  );
}