export const Button = ({
    text,
    type,
    action,
    classNames = "",
    submit = false,
    loading = false,
}: {
    text: string;
    type: "primary" | "secondary";
    action?: () => void;
    classNames?: string;
    submit?: boolean;
    loading?: boolean;
}) => {
    return (
        <button
            onClick={action}
            type={submit ? "submit" : "button"}
            className={`
        px-6 py-3 rounded-full font-medium text-xl cursor-pointer 
        ${
            type === "primary" &&
            "bg-primary text-background hover:bg-primary/90 hover:scale-105 transition-all duration-200 glow-effect"
        }
        ${
            type === "secondary" &&
            "border border-primary/20 text-foreground/70 hover:bg-primary hover:text-background transition-all duration-200"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${classNames}
    `}
        >
            {text}
        </button>
    );
};
