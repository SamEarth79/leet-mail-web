"use client";
import {
    Mail,
    KeyRound,
    InfoIcon,
    Timer,
    Globe,
    FileText,
    Crown,
    Shapes,
} from "lucide-react";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";

import { Button } from "../UI/Button";
import { useRouter } from "next/navigation";
import { BootstrapTooltip } from "../UI/ToolTip";
import {
    CONTENT_TYPES,
    DIFFICULTY,
    DSAtopics,
    SDTopics,
    timezones,
} from "@/constants/subscriptionConstants";
import { authService } from "@/services/auth";
import { subscriptionService } from "@/services/subscription";
import PremiumModal from "../UI/PremiumDialog";
import { Toast } from "../UI/Toast";

const SuccessfulSubscribe = ({ email }: { email: string }) => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 mx-auto my-20 w-[60%] z-50 text-center">
            <h2 className="text-3xl font-bold text-primary">
                Subscription Successful!
            </h2>
            <div className="flex items-center justify-center gap-20 ">
                <div className="flex-1">
                    <p className="text-lg text-foreground/80">
                        Thank you for subscribing to LeetMail. You will start
                        receiving our content at {email}.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const SubscribeForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [time, setTime] = useState("09:00");
    const [timezone, setTimezone] = useState(timezones[12]);
    const [dsaSelectedTopics, setDSASelectedTopics] = useState<string[]>([]);
    const [sdSelectedTopics, setSDSelectedTopics] = useState<string[]>([]);
    const [contentType, setContentType] = useState<typeof CONTENT_TYPES.DSA>(
        CONTENT_TYPES.DSA
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState(
        DIFFICULTY.MIXED
    );
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
        supabase?: string;
        subscription?: string;
    }>({});
    const [successful, setSuccessful] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<any | null>(null);
    const [openPremiumModal, setOpenPremiumModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [openToast, setOpenToast] = useState(false);
    const [loading, setLoading] = useState(false);

    const showToast = (message: string) => {
        setToastMessage(message);
        setOpenToast(true);
    };

    const fetchSubscription = async (userId: string) => {
        try {
            const subscription = await subscriptionService.get(userId);
            console.log(subscription);
            setSubscription(subscription);

            setContentType(
                Object.entries(CONTENT_TYPES).find(
                    ([_, value]) => value.code === subscription?.content_type
                )?.[1] ?? null
            );

            setSelectedDifficulty(
                Object.entries(DIFFICULTY).find(
                    ([_, value]) => value.code === subscription?.difficulty
                )?.[1] ?? null
            );

            const raw = subscription.email_time; // e.g. "04:00:00+00"
            const [hh, mm] = raw.split(":");
            setTime(`${hh}:${mm}`);

            const offset = raw.slice(-3); // "+00", "-05", "+09"
            const offsetHours = Number(offset);

            // Build timezone string matching your array
            const tzString = `UTC${
                offsetHours >= 0 ? "+" : ""
            }${offsetHours}:00`;

            setTimezone(tzString);
            showToast("Subscription loaded successfully!");
        } catch (error) {
            if (error?.code !== "PGRST116") {
                setErrors((e) => ({ ...e, subscription: error.message }));
            }
            return;
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const user = await authService.getUser();
                setUserId(user?.id ?? null);

                if (user?.id) {
                    await fetchSubscription(user.id);
                }
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };
        load();
    }, []);

    const toggleDSATopic = (topic: string) => {
        const newTopics = dsaSelectedTopics.includes(topic)
            ? dsaSelectedTopics.filter((t) => t !== topic)
            : [...dsaSelectedTopics, topic];
        setDSASelectedTopics(newTopics);
    };

    const toggleSDTopic = (topic: string) => {
        const newTopics = sdSelectedTopics.includes(topic)
            ? sdSelectedTopics.filter((t) => t !== topic)
            : [...sdSelectedTopics, topic];
        setSDSelectedTopics(newTopics);
    };

    const validateFields = () => {
        if (subscription) return true;
        const newErrors: {
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        // Email validation
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid.";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            newErrors.password =
                "Password must include uppercase, lowercase, and a number.";
        }

        // Confirm Password validation
        if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        console.log(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateFields()) return;
        try {
            setLoading(true);
            if (subscription) {
                // Update Subscription
                const updatedSubscription = await subscriptionService.update(
                    userId,
                    {
                        time,
                        timezone,
                        contentType: contentType.code,
                        selectedDifficulty: selectedDifficulty.code,
                        dsaSelectedTopics: dsaSelectedTopics,
                        sdSelectedTopics: sdSelectedTopics,
                    }
                );
            } else {
                // Create Subscription
                const userId = await authService.signUpAndLogin(
                    email,
                    password
                );
                const subscriptionRes = await subscriptionService.create({
                    subscriber_id: userId,
                    time,
                    timezone,
                    contentType: contentType.code,
                    selectedDifficulty: selectedDifficulty.code,
                    dsaSelectedTopics: dsaSelectedTopics,
                    sdSelectedTopics: sdSelectedTopics,
                });
                console.log(subscriptionRes);
                setSuccessful(true);
            }
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                supabase:
                    error?.message || "An error occurred. Please try again.",
            }));
        } finally {
            setLoading(false);
        }
    };

    if (successful) {
        return <SuccessfulSubscribe email={email} />;
    }

    return (
        <form
            onSubmit={submitForm}
            className="flex flex-col justify-center items-center gap-8 mx-auto my-20 w-[48%] z-50"
        >
            <Toast
                open={openToast}
                handleClose={() => setOpenToast(false)}
                message={toastMessage}
            />
            <PremiumModal
                open={openPremiumModal}
                onOpenChange={setOpenPremiumModal}
            />
            <div className="-my-2">
                <p className="text-red-600 text-sm">{errors?.subscription}</p>
            </div>
            {!subscription && (
                <>
                    <div className="w-full">
                        <label className="flex items-center gap-2 text-base">
                            <Mail className="w-4 h-4 text-primary" />
                            Email Address
                            <BootstrapTooltip
                                title="The email where you'll receive your daily coding challenges."
                                placement="top"
                                arrow
                                className="relative right-2"
                            >
                                <IconButton>
                                    <InfoIcon className="w-4 h-4 text-foreground" />
                                </IconButton>
                            </BootstrapTooltip>
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            className=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-4 w-full">
                        <div className="flex-1">
                            <label className="flex items-center gap-2 text-base">
                                <KeyRound className="w-4 h-4 text-primary" />
                                Password
                                <BootstrapTooltip
                                    title="Choose a password to login later and manage your subscription."
                                    placement="top"
                                    arrow
                                    className="relative right-6"
                                >
                                    <IconButton>
                                        <InfoIcon className="w-4 h-4 text-foreground" />
                                    </IconButton>
                                </BootstrapTooltip>
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="flex items-center gap-2 text-base">
                                <KeyRound className="w-4 h-4 text-primary" />
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className=""
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="-my-4">
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>
                </>
            )}
            <div className="flex justify-center items-center gap-4 w-full">
                <div className="flex-1">
                    <label className="flex items-center gap-2 text-base">
                        <Timer className="w-4 h-4 text-primary" />
                        Preferred Time
                    </label>
                    <input
                        type="time"
                        name="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        step="3600" // Restrict input to hours only
                    />
                </div>
                <div className="flex-1">
                    <label className="flex items-center gap-2 text-base">
                        <Globe className="w-4 h-4 text-primary" />
                        Timezone
                    </label>
                    <select
                        name="timezone"
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full"
                        aria-label="Select your timezone"
                    >
                        {timezones.map((tz) => (
                            <option key={tz} value={tz}>
                                {tz}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="w-full">
                <label className="flex items-center gap-2 text-base mb-4">
                    <FileText className="w-4 h-4 text-primary fill-primatext-primary" />
                    Content Type
                    <BootstrapTooltip
                        title="Choose whether you want to receive Data Structures & Algorithms, System Design, or both (alternate)."
                        placement="top"
                        arrow
                        className="relative right-2"
                    >
                        <IconButton>
                            <InfoIcon className="w-4 h-4 text-foreground" />
                        </IconButton>
                    </BootstrapTooltip>
                </label>
                <div className="flex flex-wrap gap-3 ">
                    {Object.entries(CONTENT_TYPES).map(([type, value]) => {
                        const color = value.isPremium ? "premium" : "primary";
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    if (
                                        value.isPremium &&
                                        !subscription?.isPremium
                                    ) {
                                        setOpenPremiumModal(true);
                                    } else {
                                        setContentType(value);
                                    }
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    contentType === value
                                        ? `bg-${color} text-black shadow-lg shadow-${color}/20 border border-${color}`
                                        : `border border-${color} hover:border-${color}/50`
                                }
                            `}
                            >
                                {type === "DSA"
                                    ? "Data Structures & Algorithms"
                                    : type === "SystemDesign"
                                    ? "System Design"
                                    : "Both"}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="w-full">
                <label className="flex items-center gap-2 text-base mb-4">
                    <Shapes className="w-4 h-4 text-primary fill-primary" />
                    Difficulty
                    <BootstrapTooltip
                        title="Choose the data structures and algorithms topics you'd like to revise on."
                        placement="top"
                        arrow
                        className="relative right-2"
                    >
                        <IconButton>
                            <InfoIcon className="w-4 h-4 text-foreground" />
                        </IconButton>
                    </BootstrapTooltip>
                </label>
                <div className="flex flex-wrap gap-3 ">
                    {Object.entries(DIFFICULTY).map(([type, value]) => {
                        const color = value.isPremium ? "premium" : "primary";
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    if (
                                        value.isPremium &&
                                        !subscription?.isPremium
                                    ) {
                                        setOpenPremiumModal(true);
                                    } else {
                                        setSelectedDifficulty(value);
                                    }
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    selectedDifficulty === value
                                        ? `bg-${color} text-black shadow-lg shadow-${color}/20 border border-${color}`
                                        : `border border-${color} hover:border-${color}/50`
                                }
                            `}
                            >
                                {type === "MIXED" ? "Mixed" : "Medium & Hard"}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="w-full">
                <label className="flex items-center gap-2 text-base mb-4">
                    <Crown className="w-4 h-4 text-premium fill-premium" />
                    Select Topics of Interest
                    <BootstrapTooltip
                        title="Choose the data structures and algorithms topics you'd like to revise on."
                        placement="top"
                        arrow
                        className="relative right-2"
                    >
                        <IconButton>
                            <InfoIcon className="w-4 h-4 text-foreground" />
                        </IconButton>
                    </BootstrapTooltip>
                </label>
                <div
                    className={`flex items-center justify-start gap-2 ml-1 mb-2 ${
                        contentType === CONTENT_TYPES.DSA ||
                        contentType === CONTENT_TYPES.DSAAndSystemDesign
                            ? ""
                            : "opacity-15 transition-all duration-500"
                    }`}
                >
                    <p className="text-lg font-bold">DSA</p>
                    <button
                        onClick={() => {
                            setDSASelectedTopics(DSAtopics);
                        }}
                        className="cursor-pointer font-semibold bg-gray-400/20 text-xs p-1 px-2 rounded-lg my-2"
                    >
                        Select All
                    </button>
                    <button
                        onClick={() => {
                            setDSASelectedTopics([]);
                        }}
                        className="cursor-pointer font-semibold bg-gray-400/20 text-xs p-1 px-2 rounded-lg my-2"
                    >
                        Clear
                    </button>
                </div>
                <div
                    className={`flex flex-wrap gap-3 ${
                        contentType === CONTENT_TYPES.DSA ||
                        contentType === CONTENT_TYPES.DSAAndSystemDesign
                            ? ""
                            : "opacity-15 transition-all duration-500"
                    }`}
                >
                    {DSAtopics.map((topic) => (
                        <button
                            key={topic}
                            type="button"
                            onClick={() => toggleDSATopic(topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                dsaSelectedTopics.includes(topic)
                                    ? "bg-premium text-black shadow-lg shadow-premium/20 border border-premium"
                                    : "border border-premium hover:border-premium/50"
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
                <div
                    className={`flex items-center justify-start gap-2 ml-1 mb-2 mt-2 ${
                        contentType === CONTENT_TYPES.SystemDesign ||
                        contentType === CONTENT_TYPES.DSAAndSystemDesign
                            ? ""
                            : "opacity-15 transition-all duration-500"
                    }`}
                >
                    <p className="text-lg font-bold">System Design</p>
                    <button
                        onClick={() => {
                            setSDSelectedTopics(SDTopics);
                        }}
                        className="cursor-pointer font-semibold bg-gray-400/20 text-xs p-1 px-2 rounded-lg my-2"
                    >
                        Select All
                    </button>
                    <button
                        onClick={() => {
                            setSDSelectedTopics([]);
                        }}
                        className="cursor-pointer font-semibold bg-gray-400/20 text-xs p-1 px-2 rounded-lg my-2"
                    >
                        Clear
                    </button>
                </div>
                <div
                    className={`flex flex-wrap gap-3 ${
                        contentType === CONTENT_TYPES.SystemDesign ||
                        contentType === CONTENT_TYPES.DSAAndSystemDesign
                            ? ""
                            : "opacity-15 transition-all duration-500"
                    }`}
                >
                    {SDTopics.map((topic) => (
                        <button
                            key={topic}
                            type="button"
                            onClick={() => toggleSDTopic(topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                sdSelectedTopics.includes(topic)
                                    ? "bg-premium text-black shadow-lg shadow-premium/20 border border-premium"
                                    : "border border-premium hover:border-premium/50"
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
            <div className="-my-2">
                <p className="text-red-600 text-sm">{errors?.supabase}</p>
            </div>
            <div className="flex justify-center items-center w-full gap-4 mt-10">
                <Button
                    text={subscription ? "Update" : "Subscribe"}
                    type="primary"
                    classNames="rounded-xl flex-1 py-0"
                    submit
                    loading={loading}
                />
                <Button
                    text="View Examplary Email"
                    type="secondary"
                    classNames="rounded-xl flex-1 py-0"
                />
            </div>
        </form>
    );
};
