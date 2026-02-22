
import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db/admin-queries';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const value = await getSettings(key);
        return NextResponse.json(value || {});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { key, value } = await request.json();

        if (!key || !value) {
            return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
        }

        const updated = await updateSettings(key, value);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
