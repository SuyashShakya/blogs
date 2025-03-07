import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessions } from "@/utils/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET a single post
export async function GET(
  req: Request,

) {

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  // const {id } = params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        tags: true,
        author: {
          select: {
            name: true
          }
        }
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
}

// UPDATE a post
export async function PUT(
  req: Request,
) {

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const session = await getServerSession(authOptions) as sessions;

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags, image, published } = await req.json();

    // Update post
    const updatedPost = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        image,
        published,
        // Update tags - disconnect all existing and connect/create new ones
        tags: {
          disconnect: await prisma.tag.findMany({
            where: {
              posts: {
                some: {
                  id: id,
                },
              },
            },
          }).then(tags => tags.map(tag => ({ id: tag.id }))),
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  req: Request,
) {

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const session = await getServerSession(authOptions) as sessions;

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Delete post
    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
}