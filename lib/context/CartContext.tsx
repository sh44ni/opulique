'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CartItem {
    product: Product;
    color: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, color: string, quantity?: number) => void;
    removeItem: (productId: string, color: string) => void;
    updateQuantity: (productId: string, color: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('opulique_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('opulique_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (product: Product, color: string, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product.id === product.id && item.color === color
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product.id === product.id && item.color === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { product, color, quantity }];
        });
    };

    const removeItem = (productId: string, color: string) => {
        setItems((prevItems) =>
            prevItems.filter(
                (item) => !(item.product.id === productId && item.color === color)
            )
        );
    };

    const updateQuantity = (productId: string, color: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, color);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getItemCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getSubtotal = () => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemCount,
                getSubtotal,
                isLoaded,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
