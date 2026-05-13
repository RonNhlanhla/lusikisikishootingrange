'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Check, LogIn } from 'lucide-react';
import { useCart, CartItem, CartCourseItem, CartProductItem } from './CartContext';
import { useRouter } from 'next/navigation';
import Footer from './ui/Footer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useConvexAuth } from 'convex/react';


type AddToCartButtonBaseProps = {
  id: string;
  name: string;
  price: number | string;
  description?: string;
};

type AddToCartCourseProps = AddToCartButtonBaseProps & {
  itemType: 'course';
  date?: Date;
};

type AddToCartProductProps = AddToCartButtonBaseProps & {
  itemType: 'product';
};

type AddToCartButtonProps = AddToCartCourseProps | AddToCartProductProps;

const AddToCartButton = (props: AddToCartButtonProps) => {

  const [isAdded, setIsAdded] = useState(false);
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser)

  // Handle loading state
  if (isLoading) return <div>Loading...</div>

  // Handle unauthenticated users
  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        className="w-1/2 flex items-center justify-center gap-2"
        onClick={() => { window.location.href = '/sign-in'; }}
      >
        <LogIn className="h-4 w-4" />
        {props.itemType === 'course' ? 'Sign In to Enroll' : 'Sign In to Add to Cart'}
      </Button>
    );
  }

  const itemId = props.id;
  // Convert price to number if it's a string
  const price = typeof props.price === 'string' ? parseFloat(props.price) : props.price;

  const isInCart = items.some(item => item.id === itemId);

  // Handle the sign in redirection after successful sign in
  const handleSignIn = () => {
    // After sign in, the page will refresh and the button will update
    // You can also add a redirect back to the current page if needed
    router.refresh();
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      let itemToAdd: CartItem;

      if (props.itemType === 'course') {
        if (!isAuthenticated) {
          // This should never happen due to the auth check above, but TypeScript needs this
          toast({
            title: 'Error',
            description: 'User information not available',
            variant: 'destructive',
          });
          return;
        }
        itemToAdd = {
          id: props.id,
          name: props.name,
          price: price, // Use the converted price
          description: props.description,
          quantity: 1,
          type: 'course',
          userIdentifier: user?._id ?? "",
          date: props.date?.toISOString(),
        };
      } else {
        itemToAdd = {
          id: props.id,
          name: props.name,
          price: price, // Use the converted price
          description: props.description,
          quantity: 1,
          type: 'product',
        };
      }

      addItem(itemToAdd);
      setIsAdded(true);

      toast({
        title: 'Added to cart',
        description: `${props.name} has been added to your cart.`,
        duration: 3000,
      });

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } else {
      toast({
        title: 'Already in cart',
        description: `${props.name} is already in your cart.`,
        duration: 3000,
      });
    }
  };



  return (
    <>
      {user ? (
        <Button
          onClick={handleAddToCart}
          disabled={isInCart}
          className="w-1/2"
          variant={isInCart ? "outline" : "default"}
        >
          {isInCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              In Cart
            </>
          ) : isAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-1/2 flex items-center justify-center gap-2"
          onClick={() => { window.location.href = '/sign-in'; }}
        >
          <LogIn className="h-4 w-4" />
          Sign In to Enroll
        </Button>
      )}
    </>
  );
}



export default AddToCartButton;
