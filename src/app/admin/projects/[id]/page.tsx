import { getProject } from "@/actions/projects"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <ProjectForm initialData={project} />
    </div>
  )
}
