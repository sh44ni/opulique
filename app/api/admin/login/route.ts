import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/db/admin-auth';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const admin = await verifyAdminCredentials(email, password);

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = createSession({
            userId: admin.id,
            email: admin.email,
            name: admin.name,
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
        });

        // Set HTTP-only cookie
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
