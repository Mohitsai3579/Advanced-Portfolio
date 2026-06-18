import { getPost } from "@/actions/blogs"
import { BlogForm } from "@/components/admin/blog-form"
import { notFound } from "next/navigation"

export default async function EditBlogPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
      </div>
      <BlogForm initialData={post} />
    </div>
  )
}
