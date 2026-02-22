import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { getAdminById } from '@/lib/db/admin-auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_session')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const sessionData = verifySession(token);

        if (!sessionData) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Verify user still exists in database
        const admin = await getAdminById(sessionData.userId);

        if (!admin) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
