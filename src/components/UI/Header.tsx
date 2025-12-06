"use client";
import { Code2, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../images/logo.svg";

export const Header = () => {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userEmail = sessionStorage.getItem("userEmail");
            if (userEmail) {
                setTimeout(() => {
                    setUserEmail(userEmail);
                }, 0);
            }
        }
    }, []);
    return (
        <header className="absolute top-0 p-10 flex items-center justify-between w-full z-50">
            <button
                className="flex items-start justify-center gap-1 cursor-pointer "
                onClick={() => {
                    router.push("/");
                }}
            >
                {/* <Code2 className="w-5 h-5 text-primary" /> */}
                <Image
                    src={Logo}
                    alt="LeetMail Logo"
                    width={28}
                    height={28}
                    className="relative bottom-1"
                />
                <h2 className="font-semibold text-foreground text-xl">
                    LeetMail
                </h2>
            </button>
            <div className="">
                <button
                    className="flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => {
                        if (!userEmail) {
                            router.push("/login");
                        }
                    }}
                >
                    <UserRound className="w-5 h-5 text-primary" />
                    <p className="font-semibold">
                        {userEmail ? userEmail : `Login`}
                    </p>
                </button>
            </div>
        </header>
    );
};
