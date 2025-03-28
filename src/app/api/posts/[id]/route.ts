import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Lấy chi tiết một bài viết theo ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PATCH: Cập nhật bài viết
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json();
    const { title, content, summary, slug, published, categoryIds, tagIds } = data;

    const post = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        summary,
        slug,
        published,
        categories: {
          set: categoryIds?.map((id: string) => ({ id })) || [],
        },
        tags: {
          set: tagIds?.map((id: string) => ({ id })) || [],
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE: Xóa bài viết
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Xóa bài viết
    const post = await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Bài viết đã được xóa thành công' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}