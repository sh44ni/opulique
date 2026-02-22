import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { admin_users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    created_at: string;
}

export async function verifyAdminCredentials(
    email: string,
    password: string
): Promise<AdminUser | null> {
    try {
        const result = await db
            .select()
            .from(admin_users)
            .where(eq(admin_users.email, email))
            .limit(1);

        if (!result || result.length === 0) {
            return null;
        }

        const admin = result[0];
        const isValid = await bcrypt.compare(password, admin.password_hash);

        if (!isValid) {
            return null;
        }

        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            created_at: admin.created_at?.toISOString() || '',
        };
    } catch (error) {
        console.error('Error verifying admin credentials:', error);
        return null;
    }
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
    try {
        const result = await db
            .select()
            .from(admin_users)
            .where(eq(admin_users.id, id))
            .limit(1);

        if (!result || result.length === 0) {
            return null;
        }

        const admin = result[0];
        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            created_at: admin.created_at?.toISOString() || '',
        };
    } catch (error) {
        console.error('Error fetching admin by ID:', error);
        return null;
    }
}

export async function createAdminUser(
    email: string,
    password: string,
    name: string
): Promise<AdminUser | null> {
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db
            .insert(admin_users)
            .values({
                email,
                password_hash: passwordHash,
                name,
            })
            .returning();

        if (!result || result.length === 0) {
            return null;
        }

        const admin = result[0];
        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            created_at: admin.created_at?.toISOString() || '',
        };
    } catch (error) {
        console.error('Error creating admin user:', error);
        return null;
    }
}
