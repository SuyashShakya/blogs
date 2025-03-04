import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessions } from "@/utils/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET all posts for the current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions) as sessions;

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPosts = await prisma.post.count({
      where: { authorId: session.user.id },
    });

    return NextResponse.json({ posts, totalPosts, page, limit }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// CREATE a new post
export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as sessions;

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, tags, image, published } = await req.json();

    // Create or connect tags
    const tagObjects = tags && tags.length > 0
      ? {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        }
      : undefined;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        published: published || false,
        author: {
          connect: { id: session.user.id },
        },
        ...(tagObjects && { tags: tagObjects }),
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 }
    );
  }
}