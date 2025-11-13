import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions';

/**
 * Clerk webhook handler for user events
 * Syncs user data to MongoDB when users are created, updated, or deleted
 */
export async function POST(req: Request) {
  console.log('🔔 Webhook received at:', new Date().toISOString());

  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET not found in environment');
    throw new Error(
      'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local'
    );
  }

  console.log('✅ Webhook secret found');

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook signature verified');
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = evt.type;
  console.log('📋 Event type:', eventType);

  try {
    if (eventType === 'user.created') {
      console.log('👤 Processing user.created event');
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      console.log('📝 User data:', {
        id,
        email: email_addresses?.[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
      });

      // Validate required fields
      if (!id) {
        console.error('❌ Missing user ID in webhook payload');
        return new Response('Error: Missing user ID', { status: 400 });
      }

      if (!email_addresses || email_addresses.length === 0) {
        console.error('❌ Missing email addresses in webhook payload');
        return new Response('Error: Missing email address', { status: 400 });
      }

      console.log('💾 Attempting to create user in MongoDB...');

      // Create user in MongoDB
      const user = await createUser({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      });

      console.log('✅ User created successfully:', {
        userId: user._id,
        clerkId: user.clerkId,
        email: user.email,
      });

      return Response.json(
        { message: 'User created successfully', userId: user._id },
        { status: 201 }
      );
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      // Validate required fields
      if (!id) {
        console.error('Missing user ID in webhook payload');
        return new Response('Error: Missing user ID', { status: 400 });
      }

      // Update user in MongoDB
      const user = await updateUser(id, {
        email: email_addresses?.[0]?.email_address,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      });

      console.log('User updated successfully:', user);

      return Response.json(
        { message: 'User updated successfully', userId: user?._id },
        { status: 200 }
      );
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      // Delete user from MongoDB
      const deleted = await deleteUser(id!);

      console.log('User deleted:', deleted);

      return Response.json(
        { message: 'User deleted successfully' },
        { status: 200 }
      );
    }

    // Return 200 for other event types (not handled)
    return Response.json(
      { message: 'Webhook received but not processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      eventType: evt?.type,
    });

    return new Response(
      JSON.stringify({
        error: 'Processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
