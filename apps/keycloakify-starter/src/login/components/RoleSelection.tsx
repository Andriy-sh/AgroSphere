import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { FormError } from "./FormError";
import type { ValidRole } from "../schemas/register.schema";

interface RoleSelectionProps {
    value: ValidRole;
    onChange: (role: ValidRole) => void;
    error?: string;
    kcClsx: KcClsx;
}

export function RoleSelection({ value, onChange, error, kcClsx }: RoleSelectionProps) {
    const roles = [
        { value: "farmer" as ValidRole, label: "I'm a farmer" },
        { value: "advisor" as ValidRole, label: "I'm a advisor" },
        { value: "contractor" as ValidRole, label: "I'm a contractor" }
    ];

    return (
        <div className="flex flex-col">
            <label className="text-sm text-[#101010] !font-normal mb-4 block cursor-pointer">
                Please select your role
            </label>
            <div className="flex gap-16 items-center">
                {roles.map(option => (
                    <label
                        key={option.value}
                        className="flex items-center mt-2 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={value === option.value}
                            onChange={e => {
                                const newRole = e.target.value as ValidRole;
                                onChange(newRole);
                            }}
                            className="hidden"
                        />
                        <span
                            className={`text-[#101010] !font-normal !text-sm leading-[17px] whitespace-nowrap relative pl-4 before:content-[''] before:absolute before:mt-[2px] before:left-0 before:top-0 before:w-3 before:h-3 before:border-[1.5px] before:rounded-full before:inline-block before:mr-4 before:p-0 before:align-top before:transition-all before:duration-200 ${
                                value === option.value
                                    ? "before:bg-green-500 before:border-green-500 before:shadow-[inset_0px_0px_0px_1px_#fff]"
                                    : "before:border-[#f0f0f0]"
                            }`}
                        >
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
            {error && (
                <FormError
                    message={error}
                    className={kcClsx("kcInputErrorMessageClass")}
                />
            )}
        </div>
    );
}
