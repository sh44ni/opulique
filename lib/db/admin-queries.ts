import { db } from '@/lib/db';
import { products, orders, customers, vouchers, sliders, admin_users, settings } from '@/lib/db/schema';
import { eq, desc, asc, ilike, and, sql, count, sum } from 'drizzle-orm';
import type { Product, Slider } from '@/types';

// ============== DASHBOARD ==============

export async function getDashboardStats() {
    try {
        const [productCount] = await db.select({ count: count() }).from(products).where(eq(products.status, 'active'));
        const [orderCount] = await db.select({ count: count() }).from(orders);
        const [revenueResult] = await db.select({ total: sum(orders.total) }).from(orders).where(eq(orders.status, 'delivered'));
        const [pendingCount] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending'));

        return {
            totalProducts: productCount?.count ?? 0,
            totalOrders: orderCount?.count ?? 0,
            totalRevenue: Number(revenueResult?.total ?? 0),
            pendingOrders: pendingCount?.count ?? 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 };
    }
}

export async function getRecentOrders(limit = 5) {
    try {
        return await db.select().from(orders).orderBy(desc(orders.created_at)).limit(limit);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

// ============== PRODUCTS ==============

export async function adminGetProducts(filters?: {
    search?: string;
    status?: string;
    brand?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (filters?.status) conditions.push(eq(products.status, filters.status));
        if (filters?.brand) conditions.push(ilike(products.brand, `%${filters.brand}%`));
        if (filters?.search) conditions.push(ilike(products.name, `%${filters.search}%`));

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, [totalResult]] = await Promise.all([
            db.select().from(products).where(where).orderBy(desc(products.created_at)).limit(limit).offset(offset),
            db.select({ count: count() }).from(products).where(where),
        ]);

        return {
            products: data,
            total: totalResult?.count ?? 0,
            page,
            totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
    } catch (error) {
        console.error('Error fetching admin products:', error);
        return { products: [], total: 0, page: 1, totalPages: 0 };
    }
}

export async function adminGetProductById(id: string) {
    try {
        const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
        return product || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

function sanitizeProductData(data: any) {
    return {
        slug: data.slug,
        name: data.name,
        brand: data.brand,
        sku: data.sku ?? '',
        category: data.category,
        price: data.price,
        original_price: data.original_price || null,
        description: data.description,
        images: data.images ?? [],
        variants: data.variants ?? [],
        status: data.status ?? 'active',
        stock: data.stock !== undefined ? Number(data.stock) : 1,
        is_visible: data.is_visible !== undefined ? Boolean(data.is_visible) : true,
    };
}

export async function adminCreateProduct(data: any) {
    try {
        const [product] = await db.insert(products).values(sanitizeProductData(data)).returning();
        return product;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function adminUpdateProduct(id: string, data: any) {
    try {
        const [product] = await db
            .update(products)
            .set({ ...sanitizeProductData(data), updated_at: new Date() })
            .where(eq(products.id, id))
            .returning();
        return product;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export async function adminDeleteProduct(id: string) {
    try {
        await db.update(products).set({ status: 'archived', updated_at: new Date() }).where(eq(products.id, id));
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function adminToggleProductVisibility(id: string, is_visible: boolean) {
    try {
        const [product] = await db
            .update(products)
            .set({ is_visible, updated_at: new Date() })
            .where(eq(products.id, id))
            .returning();
        return product;
    } catch (error) {
        console.error('Error toggling visibility:', error);
        throw error;
    }
}

// ============== ORDERS ==============

export async function adminGetOrders(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (filters?.status) conditions.push(eq(orders.status, filters.status));
        if (filters?.search) {
            conditions.push(
                ilike(orders.customer_name, `%${filters.search}%`)
            );
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, [totalResult]] = await Promise.all([
            db.select().from(orders).where(where).orderBy(desc(orders.created_at)).limit(limit).offset(offset),
            db.select({ count: count() }).from(orders).where(where),
        ]);

        return {
            orders: data,
            total: totalResult?.count ?? 0,
            page,
            totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], total: 0, page: 1, totalPages: 0 };
    }
}

export async function adminGetOrderById(id: string) {
    try {
        const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
        return order || null;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

export async function adminUpdateOrderStatus(id: string, status: string) {
    try {
        const [order] = await db.update(orders).set({ status, updated_at: new Date() }).where(eq(orders.id, id)).returning();
        return order;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

// ============== CUSTOMERS ==============

export async function adminGetCustomers(filters?: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (filters?.search) {
            conditions.push(ilike(customers.name, `%${filters.search}%`));
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, [totalResult]] = await Promise.all([
            db.select().from(customers).where(where).orderBy(desc(customers.created_at)).limit(limit).offset(offset),
            db.select({ count: count() }).from(customers).where(where),
        ]);

        return {
            customers: data,
            total: totalResult?.count ?? 0,
            page,
            totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
    } catch (error) {
        console.error('Error fetching customers:', error);
        return { customers: [], total: 0, page: 1, totalPages: 0 };
    }
}

// ============== VOUCHERS ==============

export async function adminGetVouchers() {
    try {
        return await db.select().from(vouchers).orderBy(desc(vouchers.created_at));
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        return [];
    }
}

export async function adminCreateVoucher(data: any) {
    try {
        const [voucher] = await db.insert(vouchers).values(data).returning();
        return voucher;
    } catch (error) {
        console.error('Error creating voucher:', error);
        throw error;
    }
}

export async function adminUpdateVoucher(id: string, data: any) {
    try {
        const [voucher] = await db.update(vouchers).set(data).where(eq(vouchers.id, id)).returning();
        return voucher;
    } catch (error) {
        console.error('Error updating voucher:', error);
        throw error;
    }
}

export async function adminDeleteVoucher(id: string) {
    try {
        await db.delete(vouchers).where(eq(vouchers.id, id));
        return true;
    } catch (error) {
        console.error('Error deleting voucher:', error);
        throw error;
    }
}

// ============== SLIDERS ==============

export async function adminGetSliders() {
    try {
        return await db.select().from(sliders).orderBy(asc(sliders.sort_order));
    } catch (error) {
        console.error('Error fetching sliders:', error);
        return [];
    }
}

export async function adminCreateSlider(data: any) {
    try {
        const [slider] = await db.insert(sliders).values(data).returning();
        return slider;
    } catch (error) {
        console.error('Error creating slider:', error);
        throw error;
    }
}

export async function adminUpdateSlider(id: string, data: any) {
    try {
        const [slider] = await db.update(sliders).set(data).where(eq(sliders.id, id)).returning();
        return slider;
    } catch (error) {
        console.error('Error updating slider:', error);
        throw error;
    }
}

export async function adminDeleteSlider(id: string) {
    try {
        await db.delete(sliders).where(eq(sliders.id, id));
        return true;
    } catch (error) {
        console.error('Error deleting slider:', error);
        throw error;
    }
}

// ============== SETTINGS ==============

export async function getSettings(key: string) {
    try {
        const [setting] = await db.select().from(settings).where(eq(settings.key, key));
        return setting?.value || null;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function updateSettings(key: string, value: any) {
    try {
        const [existing] = await db.select().from(settings).where(eq(settings.key, key));

        if (existing) {
            const [updated] = await db.update(settings).set({ value, updated_at: new Date() }).where(eq(settings.key, key)).returning();
            return updated;
        } else {
            const [inserted] = await db.insert(settings).values({ key, value }).returning();
            return inserted;
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}
