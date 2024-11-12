"use client";

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import convertToSubcurrency from "../../lib/convertToSubCurrency";
import CheckoutPage from "../../components/CheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Home() {
  const amount = 99.99

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Stripe Payment
        </h1>
        <h2 className="text-2xl font-bold">has requested
          <span className="text-4xl font-bold"> ${amount}</span>
        </h2>
      </div>

      <Elements stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "chf",
        }}
      >


        <CheckoutPage amount={amount} /> 
      </Elements>


    </div>
  );
}



