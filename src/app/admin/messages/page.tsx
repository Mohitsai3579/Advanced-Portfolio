import { getContactMessages } from "@/actions/contact"
import { MessagesList } from "@/components/admin/messages-list"

export default async function MessagesPage() {
  const messages = await getContactMessages()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">Read and manage messages from your public portfolio.</p>
        </div>
      </div>

      <MessagesList initialMessages={messages} />
    </div>
  )
}
