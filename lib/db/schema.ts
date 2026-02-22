import { pgTable, uuid, text, decimal, integer, jsonb, boolean, timestamp, check } from 'drizzle-orm/pg-core';

// Products table
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    brand: text('brand').notNull(),
    sku: text('sku').notNull().default(''),
    category: text('category').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    original_price: decimal('original_price', { precision: 10, scale: 2 }),
    description: text('description').notNull(),
    images: jsonb('images').notNull().default([]),
    variants: jsonb('variants').notNull().default([]), // Array of ProductVariant
    status: text('status').notNull().default('active'), // 'active', 'draft', 'sold', 'archived'
    stock: integer('stock').notNull().default(1), // 0 = out of stock
    is_visible: boolean('is_visible').notNull().default(true), // admin hide/show toggle
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    order_number: text('order_number').notNull().unique(),
    customer_name: text('customer_name').notNull(),
    customer_email: text('customer_email'),
    customer_phone: text('customer_phone').notNull(),
    shipping_address: text('shipping_address').notNull(),
    city: text('city').notNull(),
    payment_method: text('payment_method').notNull(), // 'bank_transfer'

    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    delivery_fee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull(),
    discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),
    voucher_code: text('voucher_code'),
    status: text('status').notNull().default('pending'), // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
    items: jsonb('items').notNull(),
    notes: text('notes'),
    tracking_number: text('tracking_number'),
    courier_name: text('courier_name'),
    payment_proof: text('payment_proof'), // URL to screenshot
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Settings table
export const settings = pgTable('settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull().unique(), // e.g., 'bank_details'
    value: jsonb('value').notNull(), // Store dynamic data
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Customers table
export const customers = pgTable('customers', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone').unique(), // Removed notNull() to allow signups without phone
    city: text('city').notNull(),
    total_orders: integer('total_orders').default(0),
    total_spent: decimal('total_spent', { precision: 10, scale: 2 }).default('0'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Vouchers table
export const vouchers = pgTable('vouchers', {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull().unique(),
    discount_type: text('discount_type').notNull(), // 'percentage', 'fixed'
    discount_value: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
    min_order_amount: decimal('min_order_amount', { precision: 10, scale: 2 }).default('0'),
    max_uses: integer('max_uses').default(0),
    used_count: integer('used_count').default(0),
    is_active: boolean('is_active').default(true),
    expires_at: timestamp('expires_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Sliders table
export const sliders = pgTable('sliders', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    subtitle: text('subtitle').notNull(),
    cta_text: text('cta_text').notNull(),
    cta_link: text('cta_link').notNull(),
    background_color: text('background_color').notNull().default('#305752'),
    image_url: text('image_url').notNull(),
    sort_order: integer('sort_order').notNull().default(0),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Banners table
export const banners = pgTable('banners', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle').notNull(),
    background_color: text('background_color').notNull().default('#305752'),
    is_active: boolean('is_active').default(true),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Admin users table
export const admin_users = pgTable('admin_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    name: text('name').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    full_name: text('full_name').notNull(),
    phone: text('phone'),
    is_verified: boolean('is_verified').default(false),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Messages table (Contact Form)
export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    subject: text('subject'),
    message: text('message').notNull(),
    status: text('status').notNull().default('unread'), // 'unread', 'read', 'replied'
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Brands table
export const brands = pgTable('brands', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    cover_image: text('cover_image'),
    sort_order: integer('sort_order').notNull().default(0),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Reviews table
export const reviews = pgTable('reviews', {
    id: uuid('id').primaryKey().defaultRandom(),
    product_id: uuid('product_id').references(() => products.id), // Nullable for general site reviews if needed, but strict for now
    user_id: uuid('user_id').references(() => users.id).notNull(),
    rating: integer('rating').notNull(), // 1-5
    comment: text('comment').notNull(),
    is_verified_purchase: boolean('is_verified_purchase').default(false),
    is_featured: boolean('is_featured').default(false), // For homepage display
    is_hidden: boolean('is_hidden').default(false), // For moderation
    admin_reply: text('admin_reply'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
