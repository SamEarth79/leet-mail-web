import { Actions, Hero } from "@/components/PageComponents/HomePageComponents";
import { Badge } from "@/components/UI/Badge";
import { Button } from "@/components/UI/Button";
import { Sparkles, Mail, Code2, Video } from "lucide-react";

export default function Home() {
    const features = [
        {
            icon: Mail,
            title: "Subscribe",
            description:
                "Sign up with your email and set your coding preferences, topics, and difficulty level.",
        },
        {
            icon: Code2,
            title: "Curated Selection",
            description:
                "Choose the topics and difficulty level that match your learning goals.",
        },
        {
            icon: Video,
            title: "Learn Daily",
            description:
                "Receive the problem, detailed solution, and video explanation every morning.",
        },
    ];

    return (
        <div className="bg-background min-h-screen flex flex-col justify-center items-center">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float z-0" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float z-0" />

            <main className="flex flex-col justify-center items-center gap-10 px-6 z-30 min-h-screen">
                <Badge
                    text={
                        <>
                            <Sparkles className="w-4 h-4 text-primary" />
                            Revise DSA with your morning mail and coffee
                        </>
                    }
                />
                <Hero />
                <Actions />
            </main>

            <section
                id="how-it-works"
                className="relative py-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                            <span className="gradient-text">How It Works</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Three simple steps to level up your coding game
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="relative group hover:-translate-y-5 transition-transform duration-500"
                            >
                                <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/50">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center glow-effect group-hover:scale-110 transition-transform duration-300">
                                            <feature.icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-semibold text-foreground">
                                                {feature.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step number */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary text-lg">
                                        {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Button text="Start Your Journey" type="primary" />
                    </div>
                </div>
            </section>
        </div>
    );
}
