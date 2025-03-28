import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PostCard from '@/components/ui/PostCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Bài viết và chia sẻ',
  description: 'Đọc các bài viết chất lượng cao về các chủ đề mới nhất',
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    q?: string;
  };
}

const POSTS_PER_PAGE = 9;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;
  
  // Xây dựng câu truy vấn dựa trên các tham số tìm kiếm
  const whereClause: any = {
    published: true,
  };
  
  // Thêm điều kiện tìm kiếm theo danh mục nếu có
  if (searchParams.category) {
    whereClause.categories = {
      some: {
        slug: searchParams.category,
      },
    };
  }
  
  // Thêm điều kiện tìm kiếm theo tag nếu có
  if (searchParams.tag) {
    whereClause.tags = {
      some: {
        slug: searchParams.tag,
      },
    };
  }
  
  // Thêm điều kiện tìm kiếm theo từ khóa nếu có
  if (searchParams.q) {
    whereClause.OR = [
      {
        title: {
          contains: searchParams.q,
          mode: 'insensitive',
        },
      },
      {
        content: {
          contains: searchParams.q,
          mode: 'insensitive',
        },
      },
    ];
  }

  // Lấy các bài viết theo điều kiện
  const posts = await prisma.post.findMany({
    where: whereClause,
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
    skip,
    take: POSTS_PER_PAGE,
  });

  // Đếm tổng số bài viết để phân trang
  const totalPosts = await prisma.post.count({
    where: whereClause,
  });
  
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Lấy các danh mục phổ biến
  const categories = await prisma.category.findMany({
    take: 10,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
  });
  
  // Lấy các tags phổ biến
  const tags = await prisma.tag.findMany({
    take: 15,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Khám phá các bài viết chất lượng cao được tạo bởi con người và AI
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cột chính với danh sách bài viết */}
        <main className="lg:w-2/3">
          {/* Hiển thị title tùy thuộc vào bộ lọc */}
          {searchParams.category && (
            <h2 className="text-2xl font-bold mb-6">
              Danh mục: <span className="text-blue-600 dark:text-blue-400">{searchParams.category}</span>
            </h2>
          )}
          
          {searchParams.tag && (
            <h2 className="text-2xl font-bold mb-6">
              Tag: <span className="text-blue-600 dark:text-blue-400">#{searchParams.tag}</span>
            </h2>
          )}
          
          {searchParams.q && (
            <h2 className="text-2xl font-bold mb-6">
              Kết quả tìm kiếm cho: <span className="text-blue-600 dark:text-blue-400">{searchParams.q}</span>
            </h2>
          )}

          {/* Danh sách bài viết */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchParams.q 
                  ? `Không tìm thấy bài viết nào cho từ khóa "${searchParams.q}"`
                  : searchParams.category
                  ? `Không có bài viết nào trong danh mục "${searchParams.category}"`
                  : searchParams.tag
                  ? `Không có bài viết nào với tag #${searchParams.tag}`
                  : "Chưa có bài viết nào được đăng."}
              </p>
              <Link
                href="/blog"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Quay lại tất cả bài viết
              </Link>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="inline-flex rounded-md shadow">
                {/* Nút trang trước */}
                {page > 1 && (
                  <Link
                    href={{
                      pathname: '/blog',
                      query: {
                        ...searchParams,
                        page: page - 1,
                      },
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Trước
                  </Link>
                )}

                {/* Các nút số trang */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Tính toán số trang để hiển thị xung quanh trang hiện tại
                  const pageNumber = Math.max(
                    1,
                    Math.min(page - 2 + i, totalPages - 4 + i, totalPages)
                  );
                  return (
                    <Link
                      key={pageNumber}
                      href={{
                        pathname: '/blog',
                        query: {
                          ...searchParams,
                          page: pageNumber,
                        },
                      }}
                      className={`px-4 py-2 border border-gray-300 dark:border-gray-600 ${
                        pageNumber === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                {/* Nút trang tiếp theo */}
                {page < totalPages && (
                  <Link
                    href={{
                      pathname: '/blog',
                      query: {
                        ...searchParams,
                        page: page + 1,
                      },
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Tiếp
                  </Link>
                )}
              </nav>
            </div>
          )}
        </main>

        {/* Sidebar với các filter và danh mục */}
        <aside className="lg:w-1/3">
          {/* Ô tìm kiếm */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Tìm kiếm</h3>
            <form action="/blog">
              <div className="flex">
                <input
                  type="text"
                  name="q"
                  placeholder="Tìm kiếm bài viết..."
                  defaultValue={searchParams.q}
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Danh mục */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/blog?category=${category.slug}`}
                    className={`block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      searchParams.category === category.slug
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : ''
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Tags phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className={`px-3 py-1 text-sm rounded-full ${
                    searchParams.tag === tag.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}