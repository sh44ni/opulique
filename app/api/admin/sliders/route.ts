import { NextRequest, NextResponse } from 'next/server';
import { adminGetSliders, adminCreateSlider, adminUpdateSlider, adminDeleteSlider } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET() {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const data = await adminGetSliders();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sliders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const data = await request.json();
        const slider = await adminCreateSlider(data);
        return NextResponse.json(slider, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create slider' }, { status: 500 });
    }
}
