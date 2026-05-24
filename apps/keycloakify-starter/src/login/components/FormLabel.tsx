import type { KcClsx } from "keycloakify/login/lib/kcClsx";

interface FormLabelProps {
    htmlFor: string;
    children: React.ReactNode;
    kcClsx: KcClsx;
    required?: boolean;
    style?: React.CSSProperties;
}

export function FormLabel({
    htmlFor,
    children,
    kcClsx,
    required = true,
    style
}: FormLabelProps) {
    return (
        <label htmlFor={htmlFor} className={kcClsx("kcLabelClass")} style={style}>
            {children}
            {required && <span className="text-[#FF323F] ml-0.5">*</span>}
        </label>
    );
}
