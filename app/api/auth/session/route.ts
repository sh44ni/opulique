import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
    const token = (await cookies()).get('user_session')?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    const session = verifySession(token);
    if (!session) {
        return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true, user: session });
}
