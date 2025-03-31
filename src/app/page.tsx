import { prisma } from '@/lib/prisma';
import PostCard from '@/components/ui/PostCard';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for build time
const mockPosts = [
  {
    id: 'mock-1',
    title: 'Sample Post 1',
    content: 'This is a sample post content',
    slug: 'sample-post-1',
    summary: 'Sample excerpt for post 1',
    featuredImage: null,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-author',
    aiGenerated: false,
    author: {
      id: 'mock-author',
      name: 'Mock Author',
      image: null,
    },
    categories: [
      {
        id: 'mock-category',
        name: 'Mock Category',
        slug: 'mock-category',
      },
    ],
  },
];

const mockCategories = [
  {
    id: 'mock-category',
    name: 'Mock Category',
    slug: 'mock-category',
  },
];

export default async function HomePage() {
  let posts = [];
  let categories = [];

  try {
    // Only try to fetch from database if we're not in build process
    if (process.env.NEXT_PUBLIC_SHOW_MOCK_DATA !== 'true') {
      // Lấy các bài viết mới nhất đã xuất bản
      posts = await prisma.post.findMany({
        where: {
          published: true,
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
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 6,
      });
      
      // Lấy các danh mục phổ biến
      categories = await prisma.category.findMany({
        take: 5,
      });
    } else {
      // Use mock data during build time
      posts = mockPosts;
      categories = mockCategories;
    }
  } catch (error) {
    console.error('Database connection error:', error);
    // Fallback to mock data in case of error
    posts = mockPosts;
    categories = mockCategories;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog tích hợp AI cho nội dung sáng tạo</h1>
              <p className="text-xl mb-6">
                Khám phá các bài viết được tạo bởi AI và con người, mang đến góc nhìn độc đáo và sâu sắc.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/blog" 
                  className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Đọc Blog
                </Link>
                <Link 
                  href="/dashboard/create" 
                  className="px-6 py-3 bg-purple-500 font-medium rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Tạo bài với AI
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-80">
                <Image
                  src="/images/ai-writer.svg" 
                  alt="AI Writing Assistant"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>
      {/* Featured Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Bài viết nổi bật</h2>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p>
              <Link
                href="/dashboard/create"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo bài viết
              </Link>
            </div>
          )}
          
          {posts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Xem tất cả bài viết
              </Link>
            </div>
          )}
        </div>
      </section>
      {/* AI Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Tính năng AI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tạo nội dung tự động</h3>
              <p className="text-gray-600">Tự động tạo bài viết chất lượng cao dựa trên chủ đề và từ khóa bạn cung cấp.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tạo tiêu đề thu hút</h3>
              <p className="text-gray-600">Tạo nhiều tiêu đề hấp dẫn để tăng tỉ lệ click và khả năng hiển thị trên các công cụ tìm kiếm.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tối ưu hóa SEO</h3>
              <p className="text-gray-600">Phân tích và đề xuất các cải tiến SEO để tăng thứ hạng trên công cụ tìm kiếm.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Khám phá theo danh mục</h2>
          
          {categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Chưa có danh mục nào được tạo.</p>
          )}
        </div>
      </section>
    </main>
  );
}
