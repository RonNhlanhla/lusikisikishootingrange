'use client';
import React from 'react';
import { useCart, CartItem } from '@/components/CartContext';
import { Button } from '@/components/ui/button';
export default function ReturnPage() {
      const { items, getTotalPrice, clearCart } = useCart();
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
          style: 'currency',
          currency: 'ZAR',
        }).format(amount);
      };

    return(
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
  
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Your cart is empty.</p>
            <p className="mt-4 text-gray-500">Please add items to your cart before proceeding to checkout.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Items</h2>
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>No</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
                <div>
                    <h2>Payment Cancelled!</h2>
                </div>

            </div>
          </div>
        )}
      </div>
    );
}