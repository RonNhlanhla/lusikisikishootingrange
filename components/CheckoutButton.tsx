'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { useCart, CartCourseItem } from './CartContext';

interface CheckoutButtonProps {
  amount: number;
  courseName?: string;
  courseId?: string;
  description?: string;
  userIdentifier: string;
}

const CheckoutButton = ({ amount, courseName = "Course", courseId, description, userIdentifier }: CheckoutButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, items } = useCart();
  const { toast } = useToast();

  // Generate a unique ID if not provided
  const id = courseId || `course-${Date.now()}`;
  
  // Check if the course is already in the cart
  const isInCart = items.some(item => item.id === id);

  const handleAddToCart = () => {
    if (!isInCart) {
      // Create a course object from the props
      const course: CartCourseItem = {
        id,
        name: courseName,
        price: amount,
        description,
        type: 'course',
        quantity: 1,
        userIdentifier: userIdentifier,
      };
      
      addItem(course);
      setIsAdded(true);
      
      toast({
        title: 'Added to cart',
        description: `${courseName} has been added to your cart.`,
        duration: 3000,
      });
      
      // Reset the button state after a delay
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } else {
      toast({
        title: 'Already in cart',
        description: `${courseName} is already in your cart.`,
        duration: 3000,
      });
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isInCart}
      className="w-full"
      variant={isInCart ? "outline" : "default"}
    >
      {isInCart ? (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          In Cart
        </>
      ) : isAdded ? (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart - R${amount}
        </>
      )}
    </Button>
  );
};

export default CheckoutButton;