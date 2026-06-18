import { getProfile } from "@/actions/profile"
import { ProfileForm } from "@/components/admin/profile-form"

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Profile</h1>
      <ProfileForm initialData={profile} />
    </div>
  )
}
