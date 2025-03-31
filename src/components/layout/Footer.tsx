import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo và Giới thiệu */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/ai-writer.svg"
                alt="BlogAI Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">BlogAI</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              BlogAI là nền tảng blog kết hợp sức mạnh của AI để tạo ra những bài viết chất lượng cao, 
              đa dạng và sáng tạo. Chúng tôi cung cấp các công cụ AI hỗ trợ người dùng tạo nội dung, 
              tối ưu SEO và thu hút độc giả.
            </p>
          </div>
          
          {/* Liên kết */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Liên kết</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Tài khoản */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tài khoản</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/signin" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} BlogAI. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}