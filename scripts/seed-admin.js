const { createAdminUser } = require('./lib/db/admin-auth.ts');

async function seedAdmin() {
    console.log('🌱 Seeding admin user...');

    try {
        const admin = await createAdminUser(
            'admin@footfits.pk',
            'admin123',  // Change this password!
            'Admin User'
        );

        if (admin) {
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email:', admin.email);
            console.log('🔑 Password: admin123');
            console.log('⚠️  IMPORTANT: Change this password after first login!');
        } else {
            console.log('❌ Failed to create admin user (may already exist)');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
