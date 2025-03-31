'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  aiGenerated: boolean;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError('Không thể tải danh sách bài viết');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header Section with animation */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-md mb-8 transform hover:scale-[1.02] transition-transform duration-300">
        <h1 className="text-4xl font-bold animate-fade-in">Dashboard</h1>
        <p className="mt-2 text-lg opacity-90">Quản lý bài viết và công cụ AI của bạn</p>
        <Link 
          href="/dashboard/create" 
          className="inline-flex items-center px-6 py-3 mt-4 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo bài viết mới
        </Link>
      </div>

      {/* Quick Stats Section with hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</h2>
          <p className="text-gray-600 dark:text-gray-300">Tổng bài viết</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">{posts.filter(post => post.published).length}</h2>
          <p className="text-gray-600 dark:text-gray-300">Đã xuất bản</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{posts.filter(post => !post.published).length}</h2>
          <p className="text-gray-600 dark:text-gray-300">Bản nháp</p>
        </div>
      </div>

      {/* Posts Section with better card design */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Danh sách bài viết</h2>
          <Link 
            href="/dashboard/create" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo mới
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 mb-4">Chưa có bài viết nào</p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo bài viết đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.published 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                    {post.aiGenerated && (
                      <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                        AI
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Xem
                    </Link>
                    <Link 
                      href={`/dashboard/edit/${post.id}`} 
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Sửa
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Tools Section with better visual hierarchy */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow p-8">
        <div className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <h2 className="text-2xl font-semibold">Công cụ AI</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Tăng hiệu quả với trí tuệ nhân tạo</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/dashboard/create?aiType=CONTENT_GENERATOR" 
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center mb-4 text-purple-600 dark:text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold">Tạo bài viết với AI</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tạo nội dung bài viết tự động chất lượng cao bằng AI</p>
          </Link>
          <Link 
            href="/dashboard/create?aiType=HEADLINE_GENERATOR" 
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center mb-4 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold">Tạo tiêu đề hấp dẫn</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tạo nhiều tiêu đề thu hút, tăng tỷ lệ click</p>
          </Link>
          <Link 
            href="/dashboard/create?aiType=SEO_OPTIMIZER" 
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center mb-4 text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              <h3 className="font-semibold">Tối ưu SEO</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Phân tích và đề xuất cải tiến SEO thông minh</p>
          </Link>
        </div>
      </div>
    </div>
  );
}