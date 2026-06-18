import { getCertifications } from "@/actions/certifications"
import { CertificationsClient } from "@/components/admin/certifications-client"

export default async function CertificationsPage() {
  const certifications = await getCertifications()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
        <p className="text-muted-foreground">Manage your certifications and badges.</p>
      </div>

      <CertificationsClient initialCertifications={certifications} />
    </div>
  )
}
