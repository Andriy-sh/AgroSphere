import React, { useState } from "react";
import { InviteOrganisationCard } from "./InviteOrganisationCard";
import { ClientDetailsCard, ClientDetailItem } from "./ClientDetailsCard";
import { TaskCard } from "./TaskCard";
import { FloatingBadge } from "./FloatingBadge";
import Cursor from "../assets/cursor.svg";
import Dot from "../assets/dot.png";
import CursorBottom from "../assets/cursor_bottom.png";
export const LeftShowcase: React.FC<{ variant?: "login" | "register" | "invite" }> = ({
    variant = "login"
}) => {
    const [activeIndex, setActiveIndex] = useState(1);

    const dotsCount = 3;

    const handlePrev = () => setActiveIndex(prev => (prev - 1 + dotsCount) % dotsCount);
    const handleNext = () => setActiveIndex(prev => (prev + 1) % dotsCount);

    const slides = [
        {
            title: "Introducing new features",
            desc: "Stay on top of your work with improved task tracking, clearer statuses, and faster updates. Our new tools help you assign, monitor, and complete tasks more efficiently — all in one place."
        },
        {
            title: "Real-Time Field Monitoring",
            desc: "Get instant insights into your farm's performance with advanced analytics and real-time monitoring. Track soil health, weather conditions, and crop development to make data-driven decisions."
        },
        {
            title: "Boost Productivity & Efficiency",
            desc: "Increase your farm's productivity by up to 40% with intelligent task management, automated workflows, and predictive analytics. Manage your entire operation from seed to harvest."
        }
    ];

    const tasks = [
        {
            number: "#126",
            numberColor: "#818D99",
            flagColor: "#3b82f6",
            title: "Soil preparation",
            badges: ["B", "D"],
            date: "June 8",
            icons: ["timelapse"],
            iconColor: "#41B0FF",
            description:
                "Collect soil samples from designated locations to assess soil composition...",
            borderBottom: true
        },
        {
            number: "#128",
            numberColor: "#818D99",
            flagColor: "#ef4444",
            title: "Pesticide spraying",
            badges: ["A"],
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            date: "June 20",
            icons: ["timelapse"],
            iconColor: "#41B0FF",

            description:
                "Collect soil samples from designated locations to assess soil composition...",
            borderBottom: true
        },
        {
            number: "#129",
            numberColor: "#818D99",
            flagColor: "#3b82f6",
            title: "Drainage inspection",
            badges: ["D"],
            avatar: "https://randomuser.me/api/portraits/women/45.jpg",
            date: "June 18",
            icons: ["hourglass_bottom"],
            iconColor: "#FFC652",
            description:
                "Collect soil samples from designated locations to assess soil composition...",
            borderBottom: true
        },
        {
            number: "#131",
            numberColor: "#818D99",
            flagColor: "#ef4444",
            title: "Soil sampling",
            badges: ["B", "R"],
            date: "June 16",
            icons: ["task_alt"],
            iconColor: "#29B54C",
            description:
                "Collect soil samples from designated locations to assess soil composition...",
            inactive: true,
            borderBottom: false
        }
    ];

    const clientDetailsItems: ClientDetailItem[] = [
        { icon: "person", label: "Name:", value: "Ralph Edwards" },
        { icon: "tag", label: "Account No:", value: "F-0045" },
        {
            icon: "location_on",
            label: "Address:",
            value: "3891 Ranchview Dr. Richardson, California 62639"
        },
        {
            icon: "call",
            label: "Phone number:",
            value: <span className="text-[#29B54C] font-medium">+353 86 123 4567</span>,
            valueClassName: "text-[#29B54C] font-medium"
        },
        { icon: "mail", label: "Email:", value: "bill.sanders@example.com" },
        { icon: "tag", label: "Herd No:", value: "A1130318" },
        {
            icon: "person",
            label: "Lead consultant:",
            value: (
                <span className="flex items-center gap-2">
                    <span className="bg-[#e6f4ea] text-[#29B54C] rounded w-7 h-7 flex items-center justify-center font-semibold">
                        K
                    </span>{" "}
                    Kristin Wood
                </span>
            )
        }
    ];
    const clientTags = ["Organic", "Multi-location"];

    const [inviteFields, setInviteFields] = useState([
        { value: "tim.jennings@example.com", placeholder: "Enter email of org admin" },
        { value: "", placeholder: "Enter email of org admin" }
    ]);
    const handleInviteFieldChange = (idx: number, value: string) => {
        setInviteFields(fields =>
            fields.map((f, i) => (i === idx ? { ...f, value } : f))
        );
    };
    const handleInviteRemove = (idx: number) => {
        setInviteFields(fields => fields.filter((_, i) => i !== idx));
    };
    const inviteFieldsProps = inviteFields.map((f, i) => ({
        ...f,
        onChange: (v: string) => handleInviteFieldChange(i, v),
        onRemove: () => handleInviteRemove(i)
    }));

    return (
        <div className="w-full max-w-[620px] relative h-full flex flex-col justify-between">
            <div className="relative mt-[180px] flex flex-row justify-center">
                {variant === "invite" ? (
                    <>
                        <FloatingBadge
                            iconSrc={Cursor}
                            label="Send invite"
                            style={{ top: 361, right: 50 }}
                            iconPosition="bottom"
                        />
                        <FloatingBadge
                            iconSrc={CursorBottom}
                            label="Add more organisation"
                            style={{ bottom: 386, left: 90 }}
                            iconPosition="top"
                        />
                    </>
                ) : variant === "register" ? (
                    <>
                        <FloatingBadge
                            iconSrc={Cursor}
                            label="Add a task"
                            style={{ top: 361, right: 50 }}
                            iconPosition="bottom"
                        />
                        <FloatingBadge
                            iconSrc={CursorBottom}
                            label="Massage client"
                            style={{ bottom: 386, left: 90 }}
                            iconPosition="top"
                        />
                    </>
                ) : (
                    <>
                        <FloatingBadge
                            iconSrc={Cursor}
                            label="Completed task"
                            style={{ top: 351, right: 50 }}
                            iconPosition="bottom"
                        />
                        <FloatingBadge
                            iconSrc={CursorBottom}
                            label="Normal priority"
                            style={{ bottom: 386, left: 90 }}
                            iconPosition="top"
                        />
                    </>
                )}

                <div
                    className="absolute top-0 left-0 right-0 h-[240px] bg-[#265442] rounded-[16px] z-0 opacity-70 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                    style={{ transform: "translateY(-55px) scale(0.82)" }}
                />
                <div
                    className="absolute top-0 left-0 right-0 h-[240px] bg-[#406456] rounded-[16px] z-1 opacity-70 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                    style={{ transform: "translateY(-30px) scale(0.88)" }}
                />
                <div className="relative bg-white h-[326px] rounded-lg shadow-[0px_3.86px_23.16px_-3.86px_rgba(42,42,42,0.4)] p-5 w-full mx-5 z-2 flex flex-col gap-4">
                    {variant === "register" ? (
                        <ClientDetailsCard items={clientDetailsItems} tags={clientTags} />
                    ) : variant === "invite" ? (
                        <InviteOrganisationCard fields={inviteFieldsProps} />
                    ) : (
                        tasks.map(task => <TaskCard key={task.number} {...task} />)
                    )}
                </div>
            </div>
            <div className="relative text-white rounded-[24px] px-6 mb-6 font-semibold text-lg mt-16"></div>

            <div className="flex flex-col justify-between items-center h-[260px] w-full mb-[50px]">
                <div className="text-center text-white gap-4 px-[70px]">
                    <h2 className="font-semibold text-xl mb-4">
                        {slides[activeIndex].title}
                    </h2>
                    <p className="text-sm font-normal text-white/70 m-0">
                        {slides[activeIndex].desc}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-8 h-[100px]">
                    <button
                        className="bg-none border-none cursor-pointer p-0 leading-none flex items-center"
                        aria-label="Previous"
                        onClick={handlePrev}
                    >
                        <span
                            className="material-symbols-outlined text-white"
                            style={{ fontSize: 18 }}
                        >
                            arrow_back_ios
                        </span>
                    </button>

                    <div className="flex items-center gap-4">
                        {Array.from({ length: dotsCount }).map((_, idx) =>
                            idx === activeIndex ? (
                                <span
                                    key={idx}
                                    className="w-[22px] h-[22px] flex items-center justify-center box-border cursor-pointer"
                                    onClick={() => setActiveIndex(idx)}
                                >
                                    <img src={Dot} alt="Cursor" className="w-4 h-4" />
                                </span>
                            ) : (
                                <span
                                    key={idx}
                                    className="w-1.5 h-1.5 rounded-full bg-white inline-block cursor-pointer"
                                    onClick={() => setActiveIndex(idx)}
                                ></span>
                            )
                        )}
                    </div>

                    <button
                        className="bg-none border-none cursor-pointer p-0 leading-none flex items-center"
                        aria-label="Next"
                        onClick={handleNext}
                    >
                        <span
                            className="material-symbols-outlined text-white"
                            style={{ fontSize: 18 }}
                        >
                            arrow_forward_ios
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
