import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Lấy danh sách tất cả bài viết đã xuất bản
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST: Tạo bài viết mới
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, authorId, categoryIds, tagIds, published = false, summary, slug, featuredImage } = data;

    // Tạo bài viết mới
    const post = await prisma.post.create({
      data: {
        title,
        content,
        summary,
        slug,
        featuredImage,
        published,
        author: {
          connect: { id: authorId }
        },
        categories: {
          connect: categoryIds?.map((id: string) => ({ id })) || []
        },
        tags: {
          connect: tagIds?.map((id: string) => ({ id })) || []
        }
      }
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}