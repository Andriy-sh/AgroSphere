import React from "react";

interface FloatingBadgeProps {
    iconSrc: string;
    label: string;
    style?: React.CSSProperties;
    className?: string;
    iconPosition?: "top" | "bottom";
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
    iconSrc,
    label,
    style,
    className,
    iconPosition = "bottom"
}) => (
    <div className={`absolute z-[1000] ${className || ""}`} style={style}>
        <img
            src={iconSrc}
            alt="Floating Badge"
            className="w-4 h-4 absolute"
            style={
                iconPosition === "top"
                    ? { top: 28, left: -10 }
                    : { bottom: 25, left: -10 }
            }
        />
        <span className="flex flex-col border border-[#29B54C] px-3 py-1.5 gap-1.5 font-semibold text-xs shadow-[0_2px_8px_rgba(41,181,76,0.08)] items-start bg-[#29B54C] text-white rounded-[19px]">
            {label}
        </span>
    </div>
);
