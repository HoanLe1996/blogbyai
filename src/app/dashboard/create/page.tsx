'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    slug: '',
    categoryIds: [] as string[],
    published: false,
    useAI: false,
    aiPrompt: '',
    aiType: 'CONTENT_GENERATOR', // Mặc định là tạo nội dung
  });

  // Xử lý thay đổi input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Tự động tạo slug từ tiêu đề
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      }));
    }
  };

  // Xử lý checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Xử lý tạo nội dung bằng AI
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
        // Nếu là CONTENT_GENERATOR, cập nhật trực tiếp vào nội dung
        if (formData.aiType === 'CONTENT_GENERATOR') {
          setFormData((prev) => ({
            ...prev,
            content: data.result
          }));
        } 
        // Nếu là HEADLINE_GENERATOR, hiển thị danh sách tiêu đề để người dùng chọn
        else if (formData.aiType === 'HEADLINE_GENERATOR') {
          setAiContent(data.result);
        }
        // Nếu là SUMMARIZER, cập nhật vào phần tóm tắt
        else if (formData.aiType === 'SUMMARIZER') {
          setFormData((prev) => ({
            ...prev,
            summary: data.result
          }));
        }
        // Hiển thị kết quả cho các loại khác
        else {
          setAiContent(data.result);
        }
      }
    } catch (error) {
      setGenerationError('Đã xảy ra lỗi khi tạo nội dung bằng AI');
      console.error('AI generation error:', error);
    } finally {
      setGeneratingContent(false);
    }
  };

  // Xử lý tạo bài viết
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.slug) {
      alert('Vui lòng điền đầy đủ tiêu đề, nội dung và slug');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Giả định có authorId từ session
      const authorId = "tempAuthorId"; // Trong thực tế, lấy từ session
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          authorId,
          aiGenerated: formData.useAI // Đánh dấu bài viết được tạo bằng AI
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Chuyển hướng đến trang blog sau khi tạo thành công
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
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại Dashboard
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Tạo bài viết mới</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Tùy chọn sử dụng AI */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="useAI"
                checked={formData.useAI}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2">Sử dụng AI để hỗ trợ tạo nội dung</span>
            </label>
          </div>
          
          {/* Phần tạo nội dung bằng AI */}
          {formData.useAI && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Tạo nội dung với AI</h2>
              
              <div className="mb-4">
                <label className="block mb-2">Chọn loại nội dung:</label>
                <select
                  name="aiType"
                  value={formData.aiType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="CONTENT_GENERATOR">Tạo nội dung bài viết</option>
                  <option value="HEADLINE_GENERATOR">Tạo tiêu đề thu hút</option>
                  <option value="SUMMARIZER">Tóm tắt nội dung</option>
                  <option value="SEO_OPTIMIZER">Tối ưu hóa SEO</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">
                  {formData.aiType === 'CONTENT_GENERATOR' && 'Nhập chủ đề hoặc yêu cầu cho bài viết:'}
                  {formData.aiType === 'HEADLINE_GENERATOR' && 'Nhập chủ đề để tạo các tiêu đề thu hút:'}
                  {formData.aiType === 'SUMMARIZER' && 'Dán nội dung cần tóm tắt:'}
                  {formData.aiType === 'SEO_OPTIMIZER' && 'Dán nội dung cần tối ưu SEO:'}
                </label>
                <textarea
                  name="aiPrompt"
                  value={formData.aiPrompt}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Nhập yêu cầu cho AI..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <button
                  type="button"
                  onClick={generateWithAI}
                  disabled={generatingContent || !formData.aiPrompt}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {generatingContent ? 'Đang tạo...' : 'Tạo với AI'}
                </button>
              </div>
              
              {generationError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {generationError}
                </div>
              )}
              
              {aiContent && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Kết quả từ AI:</h3>
                  <pre className="whitespace-pre-wrap">{aiContent}</pre>
                </div>
              )}
            </div>
          )}
          
          {/* Form tạo bài viết */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2">Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Slug:</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="slug-bai-viet"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Slug sẽ được sử dụng trong URL của bài viết
              </p>
            </div>
            
            <div>
              <label className="block mb-2">Tóm tắt:</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Tóm tắt ngắn gọn về bài viết"
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-2">Nội dung:</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                className="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600"
                placeholder="Nội dung bài viết (hỗ trợ Markdown)"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2">Xuất bản ngay</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Tạo bài viết'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}