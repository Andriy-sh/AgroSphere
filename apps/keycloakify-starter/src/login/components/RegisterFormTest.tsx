import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export function RegisterFormTest() {
    const [isLoading, setIsLoading] = useState(false);

    const handleTestSubmit = () => {
        setIsLoading(true);

        setTimeout(() => {
            const dashboardUrl =
                process.env.NODE_ENV === "development"
                    ? "http://localhost:3000/dashboard"
                    : "/dashboard";

            window.location.href = dashboardUrl;
        }, 3000);
    };

    if (isLoading) {
        return <LoadingSpinner message="Setting up your account..." size="large" />;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Registration Test</h2>
            <p className="text-gray-600 text-center mb-6">
                Click the button below to test the loading animation and redirect
                functionality.
            </p>
            <button
                onClick={handleTestSubmit}
                className="w-full bg-[#29B54C] text-white rounded-lg py-3 px-4 font-medium hover:bg-[#22a143] transition"
            >
                Test Registration Flow
            </button>
        </div>
    );
}
