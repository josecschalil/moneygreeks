function MarketPulse() {
    return (
        <BentoCard
            title="Market Pulse"
            icon="dashboard"
            className="col-span-12 lg:col-span-8"
        >
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div>
                    <p className="text-xs text-zinc-500">NIFTY 50</p>
                    <p className="mt-2 text-3xl font-semibold">
                        24,850
                    </p>
                    <p className="text-sm text-green-600">
                        +0.84%
                    </p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">
                        BANKNIFTY
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                        56,420
                    </p>
                    <p className="text-sm text-green-600">
                        +1.12%
                    </p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">FII</p>
                    <p className="mt-2 text-3xl font-semibold">
                        ₹2412 Cr
                    </p>
                    <p className="text-sm text-green-600">
                        Net Buy
                    </p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">DII</p>
                    <p className="mt-2 text-3xl font-semibold">
                        ₹1834 Cr
                    </p>
                    <p className="text-sm text-green-600">
                        Net Buy
                    </p>
                </div>
            </div>
        </BentoCard>
    );
}

export default MarketPulse;