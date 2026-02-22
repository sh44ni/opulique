import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function setupDatabase() {
    console.log('🚀 Setting up Neon database...\n');

    try {
        // Create tables
        console.log('📋 Creating tables...');

        await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women', 'Kids', 'Unisex')),
        category TEXT NOT NULL,
        condition_label TEXT NOT NULL,
        condition_score INTEGER NOT NULL CHECK (condition_score >= 1 AND condition_score <= 10),
        sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        color TEXT NOT NULL,
        description TEXT NOT NULL,
        condition_notes TEXT NOT NULL,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        rating DECIMAL(3,2),
        review_count INTEGER DEFAULT 0,
        is_new BOOLEAN DEFAULT false,
        is_sale BOOLEAN DEFAULT false,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold', 'archived')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        city TEXT NOT NULL,
        payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'jazzcash', 'easypaisa', 'bank_transfer')),
        subtotal DECIMAL(10,2) NOT NULL,
        delivery_fee DECIMAL(10,2) NOT NULL,
        discount DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        voucher_code TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
        items JSONB NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL UNIQUE,
        city TEXT NOT NULL,
        total_orders INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vouchers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_uses INTEGER DEFAULT 0,
        used_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sliders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        cta_text TEXT NOT NULL,
        cta_link TEXT NOT NULL,
        background_color TEXT NOT NULL DEFAULT '#305752',
        image_url TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS banners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        background_color TEXT NOT NULL DEFAULT '#305752',
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
      CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
    `;

        console.log('✅ Tables created successfully\n');

        // Check if data exists
        const existingProducts = await sql`SELECT COUNT(*) FROM products`;
        if (parseInt(existingProducts[0].count) > 0) {
            console.log('⚠️  Products already exist, skipping seed data');
        } else {
            console.log('🌱 Seeding data...');

            // Insert sliders
            await sql`
        INSERT INTO sliders (title, subtitle, cta_text, cta_link, background_color, image_url, sort_order, is_active)
        VALUES 
          ('Authentic Branded Shoes', 'Pre-loved & Brand New from USA/Europe', 'Shop Now', '/shop', '#305752', '/placeholder-slider-1.jpg', 1, true),
          ('Thrift Prices, Premium Quality', 'Save up to 70% on authentic footwear', 'Browse Collection', '/shop', '#305752', '/placeholder-slider-2.jpg', 2, true),
          ('New Arrivals Weekly', 'Fresh stock of Nike, Adidas, New Balance & more', ${'See What\'s New'}, '/shop?sort=newest', '#305752', '/placeholder-slider-3.jpg', 3, true)
      `;
            console.log('✅ Sliders seeded');

            // Insert products
            await sql`
        INSERT INTO products (slug, name, brand, gender, category, condition_label, condition_score, sizes, price, original_price, color, description, condition_notes, images, is_new, is_sale, status)
        VALUES 
          ('nike-air-max-90', 'Air Max 90', 'Nike', 'Men', 'Sneakers', 'Excellent 9/10', 9, '[8,9,10,11]'::jsonb, 6500, 9000, 'White/Red', 'Classic Nike Air Max 90 in excellent condition.', 'Minor creasing on toe box.', '[]'::jsonb, false, true, 'active'),
          ('adidas-ultraboost-22', 'Ultraboost 22', 'Adidas', 'Men', 'Running', 'Excellent 9/10', 9, '[9,10,11,12]'::jsonb, 8900, 14000, 'Black/White', 'Adidas Ultraboost 22 with responsive Boost cushioning.', 'Excellent condition.', '[]'::jsonb, false, true, 'active'),
          ('new-balance-990v5', '990v5', 'New Balance', 'Men', 'Lifestyle', 'Very Good 8/10', 8, '[8,9,10,11,12]'::jsonb, 8500, 15000, 'Grey', 'New Balance 990v5 - Made in USA.', 'Light wear on outsole.', '[]'::jsonb, false, true, 'active'),
          ('nike-dunk-low-panda', 'Dunk Low Panda', 'Nike', 'Unisex', 'Sneakers', 'Excellent 9/10', 9, '[6,7,8,9,10,11]'::jsonb, 5800, 8500, 'Black/White', 'Iconic Nike Dunk Low in Panda colorway.', 'Excellent condition.', '[]'::jsonb, false, true, 'active'),
          ('puma-rs-x-reinvention', 'RS-X Reinvention', 'Puma', 'Kids', 'Sneakers', 'Brand New', 10, '[1,2,3,4,5]'::jsonb, 4500, 4500, 'Multi-Color', 'Brand new Puma RS-X for kids.', 'Brand new in box.', '[]'::jsonb, true, false, 'active'),
          ('asics-gel-kayano-29', 'Gel-Kayano 29', 'ASICS', 'Men', 'Running', 'Very Good 8/10', 8, '[9,10,11,12]'::jsonb, 7200, 12000, 'Blue/White', 'ASICS Gel-Kayano 29 stability running shoe.', 'Good condition.', '[]'::jsonb, false, true, 'active'),
          ('converse-chuck-70', 'Chuck 70 High', 'Converse', 'Unisex', 'Casual', 'Excellent 9/10', 9, '[7,8,9,10,11]'::jsonb, 3500, 5500, 'Black', 'Classic Converse Chuck 70 High Top.', 'Minimal wear.', '[]'::jsonb, false, true, 'active'),
          ('vans-old-skool', 'Old Skool', 'Vans', 'Unisex', 'Skate', 'Good 7/10', 7, '[8,9,10,11]'::jsonb, 2800, 4500, 'Black/White', 'Classic Vans Old Skool skate shoes.', 'Some wear on canvas.', '[]'::jsonb, false, true, 'active'),
          ('reebok-classic-leather', 'Classic Leather', 'Reebok', 'Men', 'Lifestyle', 'Very Good 8/10', 8, '[9,10,11,12]'::jsonb, 3200, 5000, 'White', 'Reebok Classic Leather in white.', 'Light yellowing.', '[]'::jsonb, false, true, 'active'),
          ('skechers-max-cushioning', 'Max Cushioning Elite', 'Skechers', 'Women', 'Walking', 'Excellent 9/10', 9, '[6,7,8,9]'::jsonb, 4800, 7500, 'Grey/Pink', 'Skechers Max Cushioning for comfort.', 'Like new condition.', '[]'::jsonb, false, true, 'active')
      `;
            console.log('✅ Products seeded');

            // Insert vouchers
            await sql`
        INSERT INTO vouchers (code, discount_type, discount_value, min_order_amount, max_uses, is_active, expires_at)
        VALUES 
          ('WELCOME10', 'percentage', 10, 3000, 100, true, NOW() + INTERVAL '30 days'),
          ('FIRST500', 'fixed', 500, 5000, 50, true, NOW() + INTERVAL '30 days'),
          ('SAVE15', 'percentage', 15, 8000, 25, true, NOW() + INTERVAL '30 days')
      `;
            console.log('✅ Vouchers seeded');
        }

        console.log('\n🎉 Database setup complete!');
        console.log('🌐 Visit http://localhost:3000 to see your store\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setupDatabase();
