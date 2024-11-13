"use client"

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import convertToSubcurrency from "../lib/convertToSubCurrency";


const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string>();
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState("")

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [amount])

    //everytime the amount changes , we will be creating a new clientSecret, this allow us to process the payment.

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setPaymentError(submitError.message);
            setPaymentSucceeded(false);
            setIsLoading(false);
            return;
        }

        //we are now ready to process the payment. stripe.confirmPayment will return an error if the payment fails
        //or an API response if it succeeds , stripe will take the money from the customer's card
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            }
        })

        if (error) {
            //this point is only reached if there is an immediate error when confirming the payment
            //Show the eeror to your customer ( for example, payment details incomplete)
            setPaymentError("There was an error processing your payment. Please try again later. " + error.message);
            setPaymentSucceeded(false);
            setIsLoading(false);
        } else {
            //The payment has been processed
            //The payment UI automatically closes with a success message or animation
            //Your customer is redeirect to your `return_url`	
            setPaymentSucceeded(true);
            setPaymentError("there is no error, the payment went through");

        }
        setIsLoading(false);
    }

    if(!clientSecret || !stripe || !elements)
        return (
            <div className="bg-white shadow rounded-md p-4">
                Loading...
            </div>
        )

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-4">
            {clientSecret && <PaymentElement />}

            {paymentError && <div>{paymentError}</div>}

            <button
                disabled={!stripe || isLoading}
                className="text-white bg-black px-4 py-2 rounded-md font-bold 
            disabled:opacity-50 disabled:animate-pulse"
            >
                {!isLoading ? `pay chf ${amount}` : "Processing..."}
            </button>
        </form>
    )
}

export default CheckoutPage
