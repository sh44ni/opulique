import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zyjtjanrqrhccuuorpyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anRqYW5ycXJoY2N1dW9ycHlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc1MDQ3NywiZXhwIjoyMDU1MzI2NDc3fQ.anT5HFMCr5_W-9S';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🚀 Setting up database via Supabase API...\n');

    try {
        // Insert sliders
        console.log('🌱 Seeding sliders...');
        const { data: existingSliders } = await supabase.from('sliders').select('id').limit(1);

        if (!existingSliders || existingSliders.length === 0) {
            const { error: slidersError } = await supabase.from('sliders').insert([
                {
                    title: 'Authentic Branded Shoes',
                    subtitle: 'Pre-loved & Brand New from USA/Europe',
                    cta_text: 'Shop Now',
                    cta_link: '/shop',
                    background_color: '#305752',
                    image_url: '/placeholder-slider-1.jpg',
                    sort_order: 1,
                    is_active: true,
                },
                {
                    title: 'Thrift Prices, Premium Quality',
                    subtitle: 'Save up to 70% on authentic footwear',
                    cta_text: 'Browse Collection',
                    cta_link: '/shop',
                    background_color: '#305752',
                    image_url: '/placeholder-slider-2.jpg',
                    sort_order: 2,
                    is_active: true,
                },
                {
                    title: 'New Arrivals Weekly',
                    subtitle: 'Fresh stock of Nike, Adidas, New Balance & more',
                    cta_text: "See What's New",
                    cta_link: '/shop?sort=newest',
                    background_color: '#305752',
                    image_url: '/placeholder-slider-3.jpg',
                    sort_order: 3,
                    is_active: true,
                },
            ]);

            if (slidersError) {
                console.error('Error inserting sliders:', slidersError);
            } else {
                console.log('✅ Sliders seeded');
            }
        } else {
            console.log('⚠️  Sliders already exist, skipping');
        }

        // Insert products
        console.log('\n🌱 Seeding products...');
        const { data: existingProducts } = await supabase.from('products').select('id').limit(1);

        if (!existingProducts || existingProducts.length === 0) {
            const products = [
                {
                    slug: 'nike-air-max-90',
                    name: 'Air Max 90',
                    brand: 'Nike',
                    gender: 'Men',
                    category: 'Sneakers',
                    condition_label: 'Excellent 9/10',
                    condition_score: 9,
                    sizes: [8, 9, 10, 11],
                    price: 6500,
                    original_price: 9000,
                    color: 'White/Red',
                    description: 'Classic Nike Air Max 90 in excellent condition. Minimal wear, clean uppers, and fully functional air unit.',
                    condition_notes: 'Minor creasing on toe box, no major flaws. Comes with original box.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'adidas-ultraboost-22',
                    name: 'Ultraboost 22',
                    brand: 'Adidas',
                    gender: 'Men',
                    category: 'Running',
                    condition_label: 'Excellent 9/10',
                    condition_score: 9,
                    sizes: [9, 10, 11, 12],
                    price: 8900,
                    original_price: 14000,
                    color: 'Black/White',
                    description: 'Adidas Ultraboost 22 with responsive Boost cushioning. Barely worn, like-new condition.',
                    condition_notes: 'Excellent condition, minimal sole wear. Original insoles included.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'new-balance-990v5',
                    name: '990v5',
                    brand: 'New Balance',
                    gender: 'Men',
                    category: 'Lifestyle',
                    condition_label: 'Very Good 8/10',
                    condition_score: 8,
                    sizes: [8, 9, 10, 11, 12],
                    price: 8500,
                    original_price: 15000,
                    color: 'Grey',
                    description: 'New Balance 990v5 - Made in USA. Premium suede and mesh construction.',
                    condition_notes: 'Light wear on outsole, uppers in great shape. No box included.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'nike-dunk-low-panda',
                    name: 'Dunk Low Panda',
                    brand: 'Nike',
                    gender: 'Unisex',
                    category: 'Sneakers',
                    condition_label: 'Excellent 9/10',
                    condition_score: 9,
                    sizes: [6, 7, 8, 9, 10, 11],
                    price: 5800,
                    original_price: 8500,
                    color: 'Black/White',
                    description: 'Iconic Nike Dunk Low in the popular Panda colorway. Clean black and white leather.',
                    condition_notes: 'Excellent condition with minimal wear. Original box and laces included.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'puma-rs-x-reinvention',
                    name: 'RS-X Reinvention',
                    brand: 'Puma',
                    gender: 'Kids',
                    category: 'Sneakers',
                    condition_label: 'Brand New',
                    condition_score: 10,
                    sizes: [1, 2, 3, 4, 5],
                    price: 4500,
                    original_price: 4500,
                    color: 'Multi-Color',
                    description: 'Brand new Puma RS-X for kids. Chunky retro design with bold colors.',
                    condition_notes: 'Brand new in box, never worn. All tags attached.',
                    images: [],
                    is_new: true,
                    is_sale: false,
                    status: 'active',
                },
                {
                    slug: 'asics-gel-kayano-29',
                    name: 'Gel-Kayano 29',
                    brand: 'ASICS',
                    gender: 'Men',
                    category: 'Running',
                    condition_label: 'Very Good 8/10',
                    condition_score: 8,
                    sizes: [9, 10, 11, 12],
                    price: 7200,
                    original_price: 12000,
                    color: 'Blue/White',
                    description: 'ASICS Gel-Kayano 29 stability running shoe with excellent support.',
                    condition_notes: 'Good condition with some wear on outsole. Clean uppers.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'converse-chuck-70',
                    name: 'Chuck 70 High',
                    brand: 'Converse',
                    gender: 'Unisex',
                    category: 'Casual',
                    condition_label: 'Excellent 9/10',
                    condition_score: 9,
                    sizes: [7, 8, 9, 10, 11],
                    price: 3500,
                    original_price: 5500,
                    color: 'Black',
                    description: 'Classic Converse Chuck 70 High Top in black canvas.',
                    condition_notes: 'Minimal wear, great condition. Original box included.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'vans-old-skool',
                    name: 'Old Skool',
                    brand: 'Vans',
                    gender: 'Unisex',
                    category: 'Skate',
                    condition_label: 'Good 7/10',
                    condition_score: 7,
                    sizes: [8, 9, 10, 11],
                    price: 2800,
                    original_price: 4500,
                    color: 'Black/White',
                    description: 'Classic Vans Old Skool skate shoes with signature side stripe.',
                    condition_notes: 'Some wear on canvas and sole. Still plenty of life left.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'reebok-classic-leather',
                    name: 'Classic Leather',
                    brand: 'Reebok',
                    gender: 'Men',
                    category: 'Lifestyle',
                    condition_label: 'Very Good 8/10',
                    condition_score: 8,
                    sizes: [9, 10, 11, 12],
                    price: 3200,
                    original_price: 5000,
                    color: 'White',
                    description: 'Reebok Classic Leather in white. Timeless retro style.',
                    condition_notes: 'Light yellowing on sole, uppers in good shape.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
                {
                    slug: 'skechers-max-cushioning',
                    name: 'Max Cushioning Elite',
                    brand: 'Skechers',
                    gender: 'Women',
                    category: 'Walking',
                    condition_label: 'Excellent 9/10',
                    condition_score: 9,
                    sizes: [6, 7, 8, 9],
                    price: 4800,
                    original_price: 7500,
                    color: 'Grey/Pink',
                    description: 'Skechers Max Cushioning for ultimate comfort during walks.',
                    condition_notes: 'Like new condition, barely worn.',
                    images: [],
                    is_new: false,
                    is_sale: true,
                    status: 'active',
                },
            ];

            const { error: productsError } = await supabase.from('products').insert(products);

            if (productsError) {
                console.error('Error inserting products:', productsError);
            } else {
                console.log('✅ Products seeded');
            }
        } else {
            console.log('⚠️  Products already exist, skipping');
        }

        // Insert vouchers
        console.log('\n🌱 Seeding vouchers...');
        const { data: existingVouchers } = await supabase.from('vouchers').select('id').limit(1);

        if (!existingVouchers || existingVouchers.length === 0) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            const { error: vouchersError } = await supabase.from('vouchers').insert([
                {
                    code: 'WELCOME10',
                    discount_type: 'percentage',
                    discount_value: 10,
                    min_order_amount: 3000,
                    max_uses: 100,
                    used_count: 0,
                    is_active: true,
                    expires_at: expiryDate.toISOString(),
                },
                {
                    code: 'FIRST500',
                    discount_type: 'fixed',
                    discount_value: 500,
                    min_order_amount: 5000,
                    max_uses: 50,
                    used_count: 0,
                    is_active: true,
                    expires_at: expiryDate.toISOString(),
                },
                {
                    code: 'SAVE15',
                    discount_type: 'percentage',
                    discount_value: 15,
                    min_order_amount: 8000,
                    max_uses: 25,
                    used_count: 0,
                    is_active: true,
                    expires_at: expiryDate.toISOString(),
                },
            ]);

            if (vouchersError) {
                console.error('Error inserting vouchers:', vouchersError);
            } else {
                console.log('✅ Vouchers seeded');
            }
        } else {
            console.log('⚠️  Vouchers already exist, skipping');
        }

        console.log('\n🎉 Database seeding complete!');
        console.log('🌐 Refresh http://localhost:3000 to see your store\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setupDatabase();
