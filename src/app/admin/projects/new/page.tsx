import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add Project</h1>
      </div>
      <ProjectForm />
    </div>
  )
}
