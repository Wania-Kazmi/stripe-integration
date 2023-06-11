'use client';

import React from "react";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

export default function StripaPayment() {
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState({
        name: "Apple AirPods",
        description: "Latest Apple AirPods.",
        image:
          "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
        quantity: 0,
        price: 999,
      });

    //   console.log("ITem is ===================", item);

      const changeQuantity = (value: number) => {
        // Don't allow the quantity less than 0, if the quantity is greater than value entered by user then the user entered quantity is used, else 0
        setItem({ ...item, quantity: Math.max(0, value) });
      };
    
      const onQuantityPlus = () => {
        changeQuantity(item.quantity + 1);
      };
    
      const onQuantityMinus = () => {
        changeQuantity(item.quantity - 1);
      };
      const onInputChange = (e: { target: { value: string } }) => {
        changeQuantity(parseInt(e.target.value));
      };
  // Create a Stripe client instance
  const publishableKey = process.env
    .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
  const stripePromise = loadStripe(publishableKey);

  //   Set up the checkout page

//   const [sessionId, setSessionId] = useState("");
  


    const createCheckOutSession = async () => {
        setLoading(true);
        const stripe = await stripePromise;
      // Fetch the checkout session ID from your server
      const response = await fetch("/api/create-checkout-session",{
        //mode: 'no-cors',
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
           item:item
        }),
      });
      console.log("Response of fetching checkout session --------------",  response)
      const sessionID  = await response.json();
      window.location.assign(sessionID);
      const result = await stripe?.redirectToCheckout({
        sessionId: sessionID
      });
      if(result?.error){
        alert(result.error.message);
      }
    //   setSessionId(sessionId);
    };

    


    //   const handleClick = async () => {
    //     const stripe = await stripePromise;
    //     const { error }:any = await stripe?.redirectToCheckout({ sessionId });
    //     if (error) {
    //       console.error(error);
    //     }
    //   };

  return (
    <div className="max-w-sm flex mx-auto mt-20">
      <div className="shadow-lg border rounded p-2 ">
        <img src={item.image} width={300} height={150} alt={item.name} />
        <h2 className="text-2xl">$ {item.price}</h2>
        <h3 className="text-xl">{item.name}</h3>
        <p className="text-gray-500">{item.description}</p>
        <p className="text-sm text-gray-600 mt-1">Quantity:</p>
        <div className="border rounded">
          <button
            onClick={onQuantityMinus}
            className="bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600"
          >
            -
          </button>
          <input
            type="number"
            className="p-2"
            onChange={onInputChange}
            value={item.quantity}
          />
          <button
            onClick={onQuantityPlus}
            className="bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
        <p>Total: ${item.quantity * item.price}</p>
        <button
          disabled={item.quantity === 0}
          onClick={createCheckOutSession}
          className="bg-blue-500 hover:bg-blue-600 text-white block w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-blue-100"
        >
         {loading ? 'Processing...' : 'Buy'}
        </button>
      </div>
    
    </div>
  );
}
