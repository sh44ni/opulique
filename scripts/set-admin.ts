import { db } from '../lib/db';
import { admin_users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function defineAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('opuliquesuperadmin431', 10);

        await db.insert(admin_users).values({
            email: 'admin@opulique.com',
            name: 'Super Admin',
            password_hash: hashedPassword,
        }).onConflictDoUpdate({
            target: admin_users.email,
            set: {
                password_hash: hashedPassword
            }
        });

        console.log('✅ Admin credentials updated successfully.');
    } catch (e) {
        console.error('❌ Error updating admin credentials:', e);
    } finally {
        process.exit();
    }
}

defineAdmin();
