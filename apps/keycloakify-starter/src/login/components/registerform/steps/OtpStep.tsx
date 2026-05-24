import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { OTPInput } from "../../OTPInput";
import { Button } from "@@agrosphere/shared";

type OtpStepProps = {
    otp: string[];
    onOtpChange: (value: string[]) => void;
    onCancel: () => void;
    onSubmit: () => void;
    timer: string;
    onResendCode?: () => void;
    isCodeIncorrect?: boolean;
    correctOtp?: string;
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
};

export const OtpStep = ({
    otp,
    onOtpChange,
    onCancel,
    onSubmit,
    timer,
    onResendCode,
    isCodeIncorrect,
    correctOtp,
    kcClsx
}: OtpStepProps) => {
    const timerSeconds = parseInt(timer.split(":")[1]) || 0;
    const isOtpComplete = otp.every(digit => digit.trim().length > 0);

    const handleValidate = (code: string) => {
        return correctOtp ? code === correctOtp : false;
    };

    return (
        <div className={kcClsx("kcFormGroupClass")}>
            <OTPInput
                value={otp}
                onChange={onOtpChange}
                onValidate={handleValidate}
                autoFocus
                timer={timerSeconds}
                onResendCode={onResendCode}
                isCodeIncorrect={isCodeIncorrect}
            />
            <div className="flex gap-3">
                <Button
                    variant="cancel"
                    size="md"
                    type="button"
                    onClick={onCancel}
                    className="flex-1 !bg-[#EEF0F6] h-9 !text-[#101010]"
                >
                    Cancel
                </Button>
                <Button
                    variant="complete"
                    size="md"
                    type="button"
                    onClick={onSubmit}
                    className={`flex-1 ${
                        isOtpComplete
                            ? "bg-[#29B54C] !text-white"
                            : "opacity-50 bg-[#29B54C] cursor-not-allowed"
                    }`}
                    disabled={!isOtpComplete}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};
