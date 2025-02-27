import { prisma } from "@/lib/prisma";
import { userSchema } from "@/utils/schemas";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = z.object(userSchema).parse(body);

    const existingUserByEmail = await prisma?.user?.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "user with this email already exist" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma?.user?.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const { name: newName, email: newEmail } = newUser;
    return NextResponse.json(
      { user: {
        name: newName,
        email: newEmail
      }, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) { 
    if (error instanceof Error) {
        return NextResponse.json(
            { message: error.message }, 
            { status: 500 }
        );
    }

    return NextResponse.json(
        { message: "Something went wrong!!" }, 
        { status: 500 }
    );
}
}