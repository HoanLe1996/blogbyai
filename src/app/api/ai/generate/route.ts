import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { prisma } from '@/lib/prisma';

// Khởi tạo OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { prompt, type, userId } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let systemPrompt = '';
    let userPrompt = prompt;

    // Thiết lập prompt theo từng loại yêu cầu AI
    switch (type) {
      case 'CONTENT_GENERATOR':
        systemPrompt = 'Bạn là một nhà văn chuyên nghiệp. Hãy tạo một bài viết đầy đủ, có cấu trúc và hấp dẫn về chủ đề được cung cấp. Hãy sử dụng định dạng Markdown.';
        break;
      case 'HEADLINE_GENERATOR':
        systemPrompt = 'Hãy tạo 5 tiêu đề hấp dẫn và thu hút sự chú ý cho bài viết dựa trên chủ đề sau. Mỗi tiêu đề cần ngắn gọn, rõ ràng và có tính thu hút.';
        break;
      case 'SUMMARIZER':
        systemPrompt = 'Hãy tạo bản tóm tắt ngắn gọn (trong khoảng 2-3 câu) cho nội dung bài viết sau đây.';
        break;
      case 'SEO_OPTIMIZER':
        systemPrompt = 'Hãy phân tích và đưa ra đề xuất để tối ưu hóa SEO cho bài viết sau. Bao gồm từ khóa đề xuất, cấu trúc meta description, và các cải tiến có thể thực hiện.';
        break;
      case 'IMAGE_PROMPT':
        systemPrompt = 'Hãy tạo một prompt chi tiết để tạo hình ảnh minh họa cho bài viết này bằng AI. Mô tả chi tiết về cảnh, màu sắc, phong cách nghệ thuật và bối cảnh.';
        break;
      default:
        systemPrompt = 'Hãy viết câu trả lời chuyên nghiệp cho yêu cầu sau.';
    }

    // Gọi API OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content || '';

    // Lưu prompt và response vào database
    if (userId) {
      await prisma.aIPrompt.create({
        data: {
          prompt: userPrompt,
          response,
          type,
          userId
        }
      });
    }

    return NextResponse.json({
      result: response
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}