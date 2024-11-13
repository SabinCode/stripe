export default function PaymentSuccess({ searchParams: { amount } }: { searchParams: { amount: string } }) {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    Payment Succeeded
                </h1>
                <h2 className="text-2xl font-bold">You have paid
                    <span className="text-4xl font-bold"> ${amount}</span>
                </h2>
            </div>
        </div>
    );
}