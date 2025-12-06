export const Badge = ({ text }: { text: React.ReactNode }) => {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 mb-4 text-foreground/70">
            {text}
        </div>
    );
};
