import { NextRequest, NextResponse } from 'next/server';
import { verifyUserCredentials } from '@/lib/db/auth-queries';
import { createSession } from '@/lib/auth/session';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const user = await verifyUserCredentials(email, password);
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Create Session
        const token = createSession({
            userId: user.id,
            email: user.email,
            name: user.full_name,
        });

        // Set Cookie
        (await cookies()).set('user_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({ success: true, user: { email: user.email, name: user.full_name } });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
