'use client';

import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
      setIsOpen(false);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getItemCount() > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-white">
              {getItemCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full md:w-1/3 flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({getItemCount()} items)
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-2">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-3 px-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 border rounded-md hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">R{item.price.toFixed(2)}</p>
                    
                    {item.type === 'product' && (
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="mx-2 w-6 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium mt-1">
                      R{(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="py-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold">R{getTotalPrice().toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            variant="outline"
            className="h-12"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <Button
            className="h-12 bg-green-600 hover:bg-green-700"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Checkout
            <span className="ml-2">R{getTotalPrice().toFixed(2)}</span>
          </Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
