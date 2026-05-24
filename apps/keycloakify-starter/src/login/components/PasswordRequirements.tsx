import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { PASSWORD_MIN_LENGTH } from "../schemas/common";

interface PasswordRequirementsProps {
    password: string;
    kcClsx: KcClsx;
    show?: boolean;
}

interface Requirement {
    id: string;
    text: string;
    validator: (password: string) => boolean;
}

const requirements: Requirement[] = [
    {
        id: "length",
        text: `${PASSWORD_MIN_LENGTH} characters minimum`,
        validator: (password: string) => password.length >= PASSWORD_MIN_LENGTH
    },
    {
        id: "uppercase",
        text: "One uppercase character",
        validator: (password: string) => /[A-Z]/.test(password)
    },
    {
        id: "number",
        text: "One number",
        validator: (password: string) => /\d/.test(password)
    }
];

export function PasswordRequirements({
    password,
    kcClsx,
    show = false
}: PasswordRequirementsProps) {
    if (!show) {
        return null;
    }

    const metRequirements = new Set<string>();
    requirements.forEach(requirement => {
        if (requirement.validator(password)) {
            metRequirements.add(requirement.id);
        }
    });

    return (
        <div className={`${kcClsx("kcFormGroupClass")} mt-3 px-5`}>
            <div className=" text-basic-black mb-3">Must contain at list</div>
            <div className="flex flex-col gap-2">
                {requirements.map(requirement => {
                    const isMet = metRequirements.has(requirement.id);
                    const hasStartedTyping = password.length > 0;

                    return (
                        <div
                            key={requirement.id}
                            className={`flex items-center gap-2 text-xs${
                                !hasStartedTyping
                                    ? "text-gray-500"
                                    : isMet
                                      ? "text-green-600"
                                      : "text-red-500"
                            }`}
                        >
                            <span
                                className={`material-symbols-outlined text-lg transition-colors duration-200 ${
                                    !hasStartedTyping
                                        ? "text-[#818D99]"
                                        : isMet
                                          ? "text-[#29B54C]"
                                          : "text-[#FF323F]"
                                }`}
                            >
                                {!hasStartedTyping
                                    ? "check_circle"
                                    : isMet
                                      ? "check_circle"
                                      : "cancel"}
                            </span>
                            <span>{requirement.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
