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

    return (
        <form className="bg-white shadow rounded-md p-4">
            {clientSecret && <PaymentElement />}

            {paymentError && <div>{paymentError}</div>}

            <button>Pay</button>
        </form>
    )
}

export default CheckoutPage
