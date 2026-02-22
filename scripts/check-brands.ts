import { db } from '../lib/db';
import { products } from '../lib/db/schema';

async function checkBrands() {
    try {
        const allProducts = await db.select({
            id: products.id,
            name: products.name,
            brand: products.brand
        }).from(products);

        console.log('All Products Brands:');
        allProducts.forEach(p => console.log(`- ${p.name}: "${p.brand}"`));
    } catch (e) {
        console.error(e);
    }
}

checkBrands();
