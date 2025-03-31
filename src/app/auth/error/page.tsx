'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Map mã lỗi thành thông báo lỗi thân thiện với người dùng
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return 'Có lỗi trong cấu hình máy chủ xác thực.';
      case 'AccessDenied':
        return 'Truy cập bị từ chối. Bạn không có quyền truy cập tài nguyên này.';
      case 'Verification':
        return 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.';
      case 'OAuthSignin':
        return 'Có lỗi trong quá trình bắt đầu xác thực OAuth.';
      case 'OAuthCallback':
        return 'Có lỗi trong quá trình xử lý phản hồi từ nhà cung cấp OAuth.';
      case 'OAuthCreateAccount':
        return 'Không thể tạo tài khoản người dùng khi đăng nhập với nhà cung cấp OAuth.';
      case 'EmailCreateAccount':
        return 'Không thể tạo tài khoản người dùng bằng email đã cung cấp.';
      case 'Callback':
        return 'Có lỗi trong quá trình xử lý phản hồi xác thực.';
      case 'OAuthAccountNotLinked':
        return 'Email này đã được sử dụng với một tài khoản khác. Vui lòng đăng nhập bằng nhà cung cấp bạn đã sử dụng trước đây.';
      case 'EmailSignin':
        return 'Kiểm tra email của bạn để hoàn thành quá trình đăng nhập.';
      case 'CredentialsSignin':
        return 'Thông tin đăng nhập không chính xác.';
      case 'SessionRequired':
        return 'Yêu cầu đăng nhập để truy cập trang này.';
      case 'Default':
      default:
        return 'Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Lỗi xác thực
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Link
            href="/auth/signin"
            className="w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Thử đăng nhập lại
          </Link>
          <Link
            href="/"
            className="w-full text-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}