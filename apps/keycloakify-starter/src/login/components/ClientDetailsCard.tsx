import React from "react";

export interface ClientDetailItem {
    icon: string;
    label: string;
    value: React.ReactNode;
    valueClassName?: string;
}

export interface ClientDetailsCardProps {
    items: ClientDetailItem[];
    tags?: string[];
}

export const ClientDetailsCard: React.FC<ClientDetailsCardProps> = ({ items, tags }) => (
    <>
        <div className="font-semibold text-[16px] text-[#101010] border-b border-gray-200 pb-2 flex items-center justify-between gap-2">
            Client details
            <span className="material-symbols-outlined">edit</span>
        </div>
        <div className="grid grid-cols-[180px_1fr] gap-y-2 gap-x-2">
            {items.map((item, idx) => (
                <React.Fragment key={idx}>
                    <div className="text-[#818D99]  flex items-center gap-2 !text-sm">
                        <span className="material-symbols-outlined !text-base">
                            {item.icon}
                        </span>
                        {item.label}
                    </div>
                    <div
                        className={
                            item.valueClassName || "text-[#101010] font-medium !text-sm"
                        }
                    >
                        {item.value}
                    </div>
                </React.Fragment>
            ))}
            {tags && (
                <>
                    <div className="text-[#818D99] flex items-center text-sm gap-2">
                        <span className="material-symbols-outlined !text-sm">label</span>
                        Tags:
                    </div>
                    <div className="flex gap-2">
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-[#F1F3F9] text-[#818D99] rounded px-2.5 py-0.5 font-medium !text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    </>
);
