'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface AIResponse {
  result: string;
  error?: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    slug: '',
    published: false,
    useAI: false,
    aiPrompt: '',
    aiType: 'CONTENT_GENERATOR',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^\\w\\s]/gi, '').replace(/\\s+/g, '-')
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const generateWithAI = async () => {
    if (!formData.aiPrompt) {
      setGenerationError('Vui lòng nhập prompt cho AI');
      return;
    }

    setGeneratingContent(true);
    setGenerationError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: formData.aiPrompt,
          type: formData.aiType
        })
      });

      const data: AIResponse = await response.json();

      if (data.error) {
        setGenerationError(data.error);
      } else {
        setFormData((prev) => ({
          ...prev,
          content: data.result
        }));
      }
    } catch (error) {
      setGenerationError('Đã xảy ra lỗi khi tạo nội dung bằng AI');
      console.error('AI generation error:', error);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.slug) {
      alert('Vui lòng điền đầy đủ tiêu đề, nội dung và slug');
      return;
    }

    setIsLoading(true);

    try {
      const authorId = "tempAuthorId";

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          authorId,
          aiGenerated: formData.useAI
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/blog/${data.post.slug}`);
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Đã xảy ra lỗi khi tạo bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại Dashboard
        </Link>

        <h1 className="text-3xl font-bold">Tạo bài viết mới</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Tạo và xuất bản bài viết mới của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tiêu đề:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-shadow"
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug:</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                    /blog/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full p-3 pl-[3.5rem] border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-shadow"
                    placeholder="slug-bai-viet"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tóm tắt:</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-shadow"
                  placeholder="Tóm tắt ngắn gọn về bài viết"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Nội dung:</label>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('write')}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        activeTab === 'write'
                          ? 'bg-white dark:bg-gray-600 shadow-sm'
                          : 'hover:bg-white/50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      Viết
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-white dark:bg-gray-600 shadow-sm'
                          : 'hover:bg-white/50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      Xem trước
                    </button>
                  </div>
                </div>

                {activeTab === 'write' ? (
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={12}
                    className="w-full p-3 border rounded-lg font-mono bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-shadow"
                    placeholder="Nội dung bài viết (hỗ trợ Markdown)"
                    required
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none border rounded-lg p-6 bg-white dark:bg-gray-700 min-h-[20rem]">
                    <ReactMarkdown>
                      {formData.content || '*Không có nội dung để xem trước*'}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Xuất bản ngay</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="useAI"
                    checked={formData.useAI}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm">Nội dung tạo bởi AI</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/dashboard"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? 'Đang xử lý...' : 'Tạo bài viết'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Assistant Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold">AI Assistant</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loại nội dung:</label>
                <select
                  name="aiType"
                  value={formData.aiType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="CONTENT_GENERATOR">Tạo bài viết</option>
                  <option value="HEADLINE_GENERATOR">Tạo tiêu đề hấp dẫn</option>
                  <option value="SUMMARIZER">Tóm tắt nội dung</option>
                  <option value="SEO_OPTIMIZER">Tối ưu SEO</option>
                  <option value="IMAGE_PROMPT">Gợi ý tạo hình ảnh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prompt:</label>
                <textarea
                  name="aiPrompt"
                  value={formData.aiPrompt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Nhập yêu cầu cho AI..."
                />
              </div>

              {generationError && (
                <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  {generationError}
                </div>
              )}

              <button
                type="button"
                onClick={generateWithAI}
                disabled={generatingContent}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
              >
                {generatingContent ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo nội dung...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tạo với AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem trước bài viết
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <h1>{formData.title || 'Tiêu đề bài viết'}</h1>
              
              {formData.summary && (
                <blockquote className="text-gray-600 dark:text-gray-400 italic">
                  {formData.summary}
                </blockquote>
              )}
              
              <ReactMarkdown>
                {formData.content || '*Nội dung bài viết sẽ hiển thị ở đây...*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}