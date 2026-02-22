import { db } from '../lib/db';
import { products, brands } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars so script can use Cloudinary keys when run independently
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(url: string, folder: string): Promise<string | null> {
    try {
        const result = await cloudinary.uploader.upload(url, {
            folder: `opulique/${folder}`,
            use_filename: true,
            unique_filename: true,
            overwrite: false,
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Cloudinary upload failed for ${url}:`, error);
        return null;
    }
}

// Usage: npx tsx scripts/import-csv.ts path/to/file.csv
async function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Please provide a path to the CSV file");
        process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    console.log(`Found ${records.length} records in CSV. Clearing existing products...`);
    await db.delete(products);
    console.log('Products cleared. Processing new records...');

    for (const record of records) {
        try {
            // Trim whitespace from keys and values
            const cleanRecord: any = {};
            for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
                cleanRecord[key.trim()] = (value as string).trim();
            }

            const title = cleanRecord['Product Name'];
            const description = ''; // No description in this CSV
            const price = '50'; // Mock price
            const originalPrice = null;
            const brandName = 'Longchamp';
            const color = cleanRecord['Color'] || 'Multicolor';
            const sku = cleanRecord['SKU'] || '';

            // Extract images and upload to Cloudinary
            const images = [];
            const imgUrl = cleanRecord['Image URL'];

            if (!title) {
                console.log('Skipping row without a Title');
                continue;
            }

            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            if (imgUrl) {
                console.log(`Uploading image for ${slug} (${color})...`);
                const uploadedUrl = await uploadImage(imgUrl, `products/${slug}`);
                if (uploadedUrl) {
                    images.push(uploadedUrl);
                } else {
                    images.push(imgUrl); // Fallback to original
                }
            }



            // 1. Ensure Brand exists
            let brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            let [existingBrand] = await db.select().from(brands).where(eq(brands.slug, brandSlug));

            if (!existingBrand) {
                [existingBrand] = await db.insert(brands).values({
                    name: brandName,
                    slug: brandSlug,
                    is_active: true
                }).returning();
                console.log(`Created new brand: ${brandName}`);
            }

            // 2. Check if product exists to either create or add variant
            let [existingProduct] = await db.select().from(products).where(eq(products.slug, slug));

            const newVariant = {
                color: color,
                images: images
            };

            if (existingProduct) {
                // Product exists, append variant if color doesn't exist
                const currentVariants = Array.isArray(existingProduct.variants) ? existingProduct.variants : [];
                const variantExists = currentVariants.some((v: any) => v.color.toLowerCase() === color.toLowerCase());

                if (!variantExists) {
                    const existingImages = Array.isArray(existingProduct.images) ? existingProduct.images : [];
                    await db.update(products)
                        .set({
                            variants: [...currentVariants, newVariant],
                            images: [...new Set([...existingImages, ...images])].slice(0, 10),
                            updated_at: new Date()
                        })
                        .where(eq(products.id, existingProduct.id));
                    console.log(`Added variant '${color}' to existing product '${title}'`);
                } else {
                    console.log(`Variant '${color}' already exists on '${title}'. Skipping.`);
                }
            } else {
                // Create new product
                await db.insert(products).values({
                    name: title,
                    slug: slug,
                    sku: sku,
                    brand: brandName,
                    category: 'Handbags', // Default category
                    price: price.toString(),
                    original_price: originalPrice ? originalPrice.toString() : null,
                    description: description,
                    images: images,
                    variants: [newVariant],
                    stock: 1, // Default stock amount
                    is_visible: true,
                    status: 'active'
                });
                console.log(`Created new product '${title}' with variant '${color}'`);
            }
        } catch (err: any) {
            console.error(`Error processing record: `, err.message);
        }
    }

    console.log("CSV Import completed successfully.");
    process.exit(0);
}

main().catch(console.error);
