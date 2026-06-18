import Link from "next/link"
import { getProjects, deleteProject } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { bulkImportProjectsFromResume } from "@/actions/bulk-import"
import { Wand2 } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects and case studies.</p>
        </div>
        <div className="flex gap-3">
          <form action={async () => {
            "use server"
            await bulkImportProjectsFromResume()
          }}>
            <Button type="submit" variant="secondary" className="gap-2 shadow-sm">
              <Wand2 className="w-4 h-4" /> Auto-Import
            </Button>
          </form>
          <Link href="/admin/projects/new">
            <Button className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No projects found. Create your first project to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <Link href={`/admin/projects/${project.id}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {project.featured && <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Featured</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server"
                        await deleteProject(project.id)
                      }}>
                        <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
