import { cookies } from 'next/headers';
import { verifySession, SessionData } from './session';
import { NextResponse } from 'next/server';

export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) return null;

    return verifySession(token);
}

export async function requireAuth(): Promise<SessionData | NextResponse> {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    return session;
}
