import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { User } from '@/types';
import bcrypt from 'bcryptjs';

export async function getUserByEmail(email: string) {
    try {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0];
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}

export async function createUser(data: { email: string; password: string; full_name: string; phone?: string }) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const result = await db.insert(users).values({
            email: data.email,
            password_hash: hashedPassword,
            full_name: data.full_name,
            phone: data.phone,
            is_verified: false,
        }).returning();

        return result[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function verifyUserCredentials(email: string, password: string) {
    try {
        const user = await getUserByEmail(email);
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;

        return user;
    } catch (error) {
        console.error('Error verifying user credentials:', error);
        return null;
    }
}

interface UserSession {
    id: string;
    email: string;
    full_name: string;
}

// Re-using JWT logic from session.ts but focused on user
// Ideally, should update session.ts to handle 'user' role too or generic payload
