"use client";
import { useRouter } from "next/navigation";
import { Button } from "../UI/Button";

export const Hero = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center text-center gap-10">
            <h1 className="text-7xl font-extrabold tracking-tight">
                <span className="gradient-text">
                    Sharpen your coding skills,
                </span>
                <br />
                <span className="text-foreground">one email at a time.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-8">
                Built on the philosophy of Spaced Repetition and Active Recall —
                methods proven to strengthen memory and understanding.
            </p>
        </div>
    );
};

export const Actions = () => {
    const router = useRouter();
    const scrollToHowItWorks = () => {
        document
            .getElementById("how-it-works")
            ?.scrollIntoView({ behavior: "smooth" });
    };
    const navigateToSubscribe = () => {
        router.push("/subscribe");
    };

    return (
        <div className="flex items-center justify-around gap-6">
            <Button
                text="Subscribe - It's Free"
                type="primary"
                action={navigateToSubscribe}
            />
            <Button
                text="How It Works"
                type="secondary"
                action={scrollToHowItWorks}
            />
        </div>
    );
};
