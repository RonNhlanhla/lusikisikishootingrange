"use client";

import React, { useState } from "react";
import { useCart, CartItem } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Helper function for currency formatting – uses South African Rand
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
};

export default function CheckoutPage() {
  // ----- Convex data -----
  const user = useQuery(api.myFunctions.getUserinfo);
  const createRegistrations = useMutation(api.myFunctions.createRegistrations);
  const myRegistrations = useQuery(api.myFunctions.getMyRegistrations);
  const { items, getTotalPrice, clearCart } = useCart();

  // ----- Checkout Fields State -----
  const [recipientName, setRecipientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"collect" | "delivery" | null>(null);

  // Structured Address
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const address = deliveryMethod === "delivery" 
    ? `${street.trim()}, ${city.trim()}, ${postalCode.trim()}`
    : "";

  const isCheckoutReady = 
    recipientName.trim() !== "" && 
    idNumber.trim() !== "" &&
    (
      deliveryMethod === "collect" || 
      (deliveryMethod === "delivery" && street.trim() !== "" && city.trim() !== "" && postalCode.trim() !== "")
    );

  // ----- PayFast Host -----
  const pfHost = process.env.NEXT_PUBLIC_PAYFAST_TESTING === "true"
    ? "sandbox.payfast.co.za"
    : "www.payfast.co.za";

  // ----- Manual Registration Handler -----
  const handleCreateRegistration = async () => {
    if (!items || items.length === 0) return;
    try {
      const courseItems = items.filter((item) => item.type === "course");
      if (courseItems.length === 0) {
        alert("No course items in cart to register.");
        return;
      }
      const registrationItems = courseItems.flatMap((item) =>
        Array(item.quantity)
          .fill(null)
          .map(() => {
            const dateStr = 'date' in item ? (item as any).date : undefined;
            return {
              courseId: item.id as Id<"courses">,
              amount: item.price,
              bookingDate: dateStr ? new Date(dateStr).getTime() : undefined,
            };
          }),
      );

      await createRegistrations({ 
        items: registrationItems,
        deliveryMethod: deliveryMethod as "collect" | "delivery",
        address,
        recipientName,
        idNumber,
      });
      alert("Registration created successfully!");
      clearCart();
    } catch (error) {
      console.error("Error creating registration:", error);
      alert("Failed to create registration.");
    }
  };

  // ----- PayNow handler -----
  const handlePayNow = async () => {
    try {
      // Only course items can be registered/paid for
      const courseItems = items.filter((item) => item.type === "course");
      if (courseItems.length === 0) {
        alert("No course items in cart to pay for.");
        return;
      }
      // Build registration items for Convex backend
      const registrationItems = courseItems.flatMap((item) =>
        Array(item.quantity)
          .fill(null)
          .map(() => {
            const dateStr = 'date' in item ? (item as any).date : undefined;
            return {
              courseId: item.id as Id<"courses">,
              amount: item.price,
              bookingDate: dateStr ? new Date(dateStr).getTime() : undefined,
            };
          }),
      );

      // Create registrations and obtain a unique payment ID from Convex
      const paymentId = await createRegistrations({ 
        items: registrationItems,
        deliveryMethod: deliveryMethod as "collect" | "delivery",
        address,
        recipientName,
        idNumber,
      });

      // Prepare data for signature generation API
      const username = user?.username || "";
      const nameParts = username.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const payload = {
        firstName,
        lastName,
        email: user?.email || "",
        paymentId: paymentId as string,
        amount: courseItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemName: "Order", // You might want to make this more specific
      };

      // Call our secure API route to get the signed PayFast data
      const response = await fetch("/api/payfast/generate-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate payment signature");
      }

      const signedData = await response.json();

      // Build a hidden form and submit to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `https://${pfHost}/eng/process`;

      Object.entries(signedData).forEach(([key, value]) => {
        if (!value) return;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = (value as string).trim();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  // ----- Render -----
  // Show loading state if user data is fetching
  if (user === undefined) {
    return <div className="container mx-auto px-4 py-8">Loading user profile...</div>;
  }

  if (!items) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Your cart is empty.</p>
          <p className="mt-4 text-gray-500">
            Please add items to your cart before proceeding to checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    {item.type === "course" && item.date && (
                      <p className="text-sm text-gray-500">Date: {new Date(item.date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
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
                <span>
                  {deliveryMethod === "delivery" ? "Delivery (Calculated later)" : deliveryMethod === "collect" ? "Collect at Office" : "Select an option"}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t pt-4">
                <span>Total</span>
                <span>{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>

            {/* Recipient Details & Delivery Method */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Recipient Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                    required
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3">How would you like to receive your items?</h3>
              <div className="flex flex-col space-y-3 mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="collect"
                    checked={deliveryMethod === "collect"}
                    onChange={() => setDeliveryMethod("collect")}
                    className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <span>Collect at the office</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="delivery"
                    checked={deliveryMethod === "delivery"}
                    onChange={() => setDeliveryMethod("delivery")}
                    className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <span>Require delivery</span>
                </label>
              </div>
              
              {deliveryMethod === "delivery" && (
                <div className="mt-4 space-y-4 duration-300 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-medium">Delivery Address</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handlePayNow} className="mt-6 w-full bg-green-600 text-white hover:bg-green-700" disabled={!user || items.length === 0 || !isCheckoutReady}>
              Pay Now (BETA)
            </Button>

            <Button
              onClick={handleCreateRegistration}
              className="mt-4 w-full bg-green-600 text-white hover:bg-green-700"
              disabled={!user || items.length === 0 || !isCheckoutReady}
            >
              Create Registration
            </Button>

            <Button
              onClick={clearCart}
              className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      )}

      {/* Registrations Table */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Registrations</h2>
        {myRegistrations === undefined ? (
          <p>Loading registrations...</p>
        ) : myRegistrations.length === 0 ? (
          <p className="text-gray-500">No registrations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myRegistrations.map((reg: any) => (
                  <tr key={reg._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reg.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(reg.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'completed' ? 'bg-green-100 text-green-800' :
                        reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

