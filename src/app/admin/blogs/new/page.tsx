import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Write Post</h1>
      </div>
      <BlogForm />
    </div>
  )
}
