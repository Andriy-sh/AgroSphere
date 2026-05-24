type ProgressIndicatorProps = {
    currentStep: number;
};

export const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => (
    <div className="flex justify-center gap-2 mt-4">
        {[0, 1, 2, 3].map(step => (
            <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                    step === currentStep
                        ? "bg-green-400 w-6"
                        : step < currentStep
                          ? "bg-green-300 w-2"
                          : "bg-gray-300 w-2"
                }`}
                title={`Step ${step + 1}`}
            />
        ))}
    </div>
);
