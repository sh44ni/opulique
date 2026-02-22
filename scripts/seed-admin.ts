import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { admin_users } from '../lib/db/schema';

// Configure WebSocket
neonConfig.webSocketConstructor = ws;

async function seedAdmin() {
    console.log('🌱 Seeding admin user...');
    console.log('📡 DATABASE_URL set:', !!process.env.DATABASE_URL);

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable not set');
        console.log('   Make sure .env.local exists in the project root');
        process.exit(1);
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const email = 'main@footfits.pk';
    const password = 'FootFits431#';
    const name = 'Admin User';

    try {
        // Check if admin user already exists
        const existing = await db
            .select()
            .from(admin_users)
            .where(eq(admin_users.email, email))
            .limit(1);

        if (existing.length > 0) {
            // Update existing user's password
            const passwordHash = await bcrypt.hash(password, 10);
            await db
                .update(admin_users)
                .set({ password_hash: passwordHash, name })
                .where(eq(admin_users.email, email));
            console.log('✅ Admin user updated with new password!');
        } else {
            // Create new user
            const passwordHash = await bcrypt.hash(password, 10);
            await db
                .insert(admin_users)
                .values({
                    email,
                    password_hash: passwordHash,
                    name,
                });
            console.log('✅ Admin user created successfully!');
        }

        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);

        // Verify the user exists
        const verify = await db
            .select({ id: admin_users.id, email: admin_users.email, name: admin_users.name })
            .from(admin_users);
        console.log('\n📋 All admin users:');
        verify.forEach((u) => console.log(`   - ${u.email} (${u.name})`));

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        await pool.end();
        process.exit(1);
    }
}

seedAdmin();
