"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { customtoast } from "@/components/ui/toast";
import { createPost } from "@/utils/apiFunctions";
import { blogSchema } from "@/utils/schemas";
import { sessions } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createClient } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { v4 as uuidv4 } from "uuid";

interface Blog {
  title: string;
  content: string;
  image?: string;
  tags?: string;
  published?: boolean;
}

export const BlogAdd = () => {
  const router = useRouter();
  const [previewMode] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Blog>({
    resolver: zodResolver(blogSchema),
  });

  const session = useSession();

  const { mutate: createPostMutate, isPending: createPostPending } =
    useMutation({
      mutationFn: createPost,
      onSuccess: (res) => {
        customtoast({ message: res?.data?.message, type: "success" });
        router.push("/");
      },
      onError: (error: { response: { data: { message: string } } }) => {
        customtoast({ message: error?.response?.data?.message, type: "error" });
      },
    });
  const content = watch("content");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const bucket = "blogs";
  const [image, setImage] = useState<string[]>([]);

  const onImageUpload = async (e) => {
    const randomNo = uuidv4();
    const image = e?.target?.files;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${randomNo}-${image[0]?.name}`, image[0]);
    if (data) {
      setImage([
        `${process.env["NEXT_PUBLIC_SUPABASE_URL"]}/storage/v1/object/public/${bucket}/${data?.path}`,
      ]);
    }
    if (error) {
      console.error(error?.message);
    }
  };

  const onSubmit = (e) => {
    // e.preventDefault();
    const values = getValues();
    createPostMutate({
      title: values?.title,
      content: values?.content,
      image: image[0],
      published: values?.published,
      tags: values?.tags?.split(","),
      authorId: (session?.data as unknown as sessions)?.user?.id,
    });
  };

  return (
    <div>
      <div className="flex h-[50px] p-4 gap-4">
        <Link href="/">
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <p className="text-xl font-medium">Add Blog</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 p-4">
          <div className="grid gap-2 ">
            <Label>Title</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your Name"
              {...register("title")}
            />
            {!!errors?.title?.message && (
              <p className="text-red-500 text-xs">{errors.title?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Upload Feature Image</Label>
            <div className="flex flex-col gap-4">
              <input
                accept=".jpg, .jpeg, .png"
                type="file"
                onChange={(e) => onImageUpload(e)}
                multiple
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Content</Label>
            {previewMode ? (
              <div className="border p-4 rounded min-h-64 prose">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full h-64 p-4 border rounded font-mono"
                      placeholder="Write your markdown here..."
                    />
                  )}
                />
                {!!errors?.content?.message && (
                  <p className="text-red-500 text-xs">
                    {errors.content?.message}
                  </p>
                )}
              </>
            )}

            <div className="markdown-help text-sm text-gray-600">
              <details>
                <summary className="cursor-pointer">Markdown Help</summary>
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <p>
                    <code># Heading 1</code> - Creates a large heading
                  </p>
                  <p>
                    <code>## Heading 2</code> - Creates a medium heading
                  </p>
                  <p>
                    <code>**bold**</code> - Makes text <strong>bold</strong>
                  </p>
                  <p>
                    <code>*italic*</code> - Makes text <em>italic</em>
                  </p>
                  <p>
                    <code>[link](url)</code> - Creates a link
                  </p>
                  <p>
                    <code>- item</code> - Creates a list item
                  </p>
                  <p>
                    <code>```code```</code> - Creates a code block
                  </p>
                </div>
              </details>
            </div>

            {!previewMode && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
                <div className="border p-4 rounded prose">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Tags (comma separated)</Label>
            <Textarea
              id="tags"
              placeholder="Enter your Tags"
              {...register("tags")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={field.value as CheckedState}
                    onCheckedChange={field.onChange} // React Hook Form handles state
                  />
                  <p className="text-sm">Is Published?</p>
                </div>
              )}
            />
          </div>

          <Button className="w-fit hover:bg-black" type="submit">
            {createPostPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
