import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db/auth-queries';
import { createSession } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resend } from '@/lib/resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, full_name, phone, website } = body;

        // 1. Spam Protection: Honeypot Check
        if (website) {
            return NextResponse.json({ success: true });
        }

        // 2. Validate Input
        if (!email || !password || !full_name || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // 3. Check if user exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // 4. Create User
        const newUser = await createUser({ email, password, full_name });

        // 4b. Sync to Customers Table (for Admin Panel)
        try {
            const [existingCustomer] = await db.select().from(customers).where(eq(customers.email, email));

            if (!existingCustomer) {
                await db.insert(customers).values({
                    name: full_name,
                    email: email,
                    phone: phone || null,
                    city: 'Unknown',
                    total_orders: 0,
                    total_spent: '0',
                });
            }
        } catch (err) {
            console.error("Failed to sync customer:", err);
            // Don't block signup flow
        }

        // 5. Create Session
        const token = createSession({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.full_name,
        });

        // 5b. Send Welcome Email
        try {
            const emailResponse = await resend.emails.send({
                from: 'FootFits <noreply@footfits.pk>',
                to: email, // Validated above
                subject: 'Welcome to FootFits! 👟',
                react: <WelcomeEmail userFirstname={full_name.split(' ')[0]} />,
            });
            console.log('Welcome email sent successfully:', emailResponse);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't block signup
        }

        // 6. Set Cookie
        (await cookies()).set('user_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({ success: true, user: { email: newUser.email, name: newUser.full_name } });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
