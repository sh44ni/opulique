import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, phone, subject, message } = result.data;

        // Insert into database
        await db.insert(messages).values({
            name,
            email,
            phone: phone || null,
            subject: subject || 'General Inquiry',
            message,
            status: 'unread',
        });

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);

        // Return specifics if it's a ZodError (though safeParse handles this mostly)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.flatten() },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}
