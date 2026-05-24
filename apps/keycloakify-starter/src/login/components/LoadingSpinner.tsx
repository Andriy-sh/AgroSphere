interface LoadingSpinnerProps {
    message?: string;
    size?: "small" | "medium" | "large";
}

export function LoadingSpinner({
    message = "Setting up your account...",
    size = "medium"
}: LoadingSpinnerProps) {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12"
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-[#29B54C] mb-4`}
            ></div>
            <p className="text-gray-600 text-center text-sm font-medium">{message}</p>
        </div>
    );
}
