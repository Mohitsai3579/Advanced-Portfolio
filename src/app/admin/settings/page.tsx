import { getSiteSettings } from "@/actions/settings"
import { getAccountSettings } from "@/actions/account"
import { SettingsForm } from "@/components/admin/settings-form"
import { AccountForm } from "@/components/admin/account-form"

export default async function SettingsPage() {
  const settings = await getSiteSettings()
  const account = await getAccountSettings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your website configuration and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <SettingsForm initialData={settings} />
        <AccountForm initialData={account} />
      </div>
    </div>
  )
}
