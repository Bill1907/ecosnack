import { createFileRoute } from '@tanstack/react-router'
import { Webhook } from 'svix'
import { getDb } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

type ClerkWebhookEvent = {
  type: string
  data: {
    id: string
    email_addresses?: Array<{ email_address: string }>
    first_name?: string | null
    last_name?: string | null
    image_url?: string | null
  }
}

export const Route = createFileRoute('/api/webhooks/clerk')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

        if (!webhookSecret) {
          console.error('CLERK_WEBHOOK_SECRET is not set')
          return new Response('Webhook secret not configured', { status: 500 })
        }

        // Get headers for verification
        const svixId = request.headers.get('svix-id')
        const svixTimestamp = request.headers.get('svix-timestamp')
        const svixSignature = request.headers.get('svix-signature')

        if (!svixId || !svixTimestamp || !svixSignature) {
          return new Response('Missing svix headers', { status: 400 })
        }

        // Get the raw body
        const body = await request.text()

        // Verify webhook signature
        const wh = new Webhook(webhookSecret)
        let event: ClerkWebhookEvent

        try {
          event = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          }) as ClerkWebhookEvent
        } catch (err) {
          console.error('Webhook verification failed:', err)
          return new Response('Invalid signature', { status: 400 })
        }

        const db = getDb()
        const { type, data } = event

        try {
          switch (type) {
            case 'user.created':
            case 'user.updated': {
              const email = data.email_addresses?.[0]?.email_address ?? null
              const name =
                [data.first_name, data.last_name].filter(Boolean).join(' ') ||
                null

              await db
                .insert(users)
                .values({
                  clerkId: data.id,
                  email,
                  name,
                  imageUrl: data.image_url ?? null,
                  updatedAt: new Date(),
                })
                .onConflictDoUpdate({
                  target: users.clerkId,
                  set: {
                    email,
                    name,
                    imageUrl: data.image_url ?? null,
                    updatedAt: new Date(),
                  },
                })

              console.log(
                `User ${type === 'user.created' ? 'created' : 'updated'}: ${data.id}`,
              )
              break
            }

            case 'user.deleted': {
              await db.delete(users).where(eq(users.clerkId, data.id))
              console.log(`User deleted: ${data.id}`)
              break
            }

            default:
              console.log(`Unhandled webhook event: ${type}`)
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Webhook handler error:', error)
          return new Response('Internal server error', { status: 500 })
        }
      },
    },
  },
})
