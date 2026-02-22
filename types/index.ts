// Product Types
export interface ProductVariant {
    color: string;
    images: string[];
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    brand: string;
    sku: string;
    category: string;
    price: number;
    original_price: number | null;
    description: string;
    images: string[];
    variants: ProductVariant[];
    status: 'active' | 'draft' | 'sold' | 'archived';
    stock: number;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
}

// Order Types
export interface OrderItem {
    product_id: string;
    product_name: string;
    product_image: string;
    color: string;
    quantity: number;
    price: number;
}
// Cart Types
export interface CartItem {
    product: Product;
    color: string;
    quantity: number;
}

export interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    payment_method: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
    subtotal: number;
    delivery_fee: number;
    discount: number;
    total: number;
    voucher_code: string | null;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    items: OrderItem[];
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// Customer Types
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    total_orders: number;
    total_spent: number;
    created_at: string;
}

// Voucher Types
export interface Voucher {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    max_uses: number;
    used_count: number;
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
}

// Slider Types
export interface Slider {
    id: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    background_color: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

// Banner Types
export interface Banner {
    id: string;
    name: string;
    title: string;
    subtitle: string;
    background_color: string;
    is_active: boolean;
    updated_at: string;
}

// Settings Types
export interface StoreSettings {
    store_name: string;
    whatsapp_number: string;
    email: string;
    address: string;
    delivery_fee: number;
    free_delivery_threshold: number;
    instagram_url: string;
    facebook_url: string;
    tiktok_url: string;
}

// User Types
export interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    is_verified: boolean;
    created_at: string;
}
