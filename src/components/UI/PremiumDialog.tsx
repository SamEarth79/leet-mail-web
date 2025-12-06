import {
    Dialog,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    Typography,
    Box,
    Button as MUIButton,
} from "@mui/material";
// import { Badge } from "@/components/ui/badge"; // keep if you want your badge styling
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useTheme } from "@mui/material/styles";

interface PremiumModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PremiumModal = ({ open, onOpenChange }: PremiumModalProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const freeFeatures = [
        "Daily DSA question email",
        "Weekly system design snippet",
        "Basic editorial notes",
    ];

    const premiumFeatures = [
        "Everything in Free +",
        "Daily DSA + SQL + System Design + Behavioural curated set",
        "Weekly full mock interview prep packs",
        "Company-wise preparation roadmap (FAANG, startups, fintech, etc.)",
        "Topic-wise streak tracking + analytics",
        "Priority support + early access to new features",
    ];

    return (
        <Dialog
            open={open}
            onClose={() => onOpenChange(false)}
            fullScreen={fullScreen}
            maxWidth="md"
            PaperProps={{
                style: {
                    borderRadius: 16,
                    overflow: "hidden",
                    padding: 0,
                },
            }}
        >
            <DialogContent
                sx={{ p: 0, overflow: "hidden" }}
                className="bg-background text-white"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Header */}
                    <Box textAlign="center" px={6} pt={6} pb={4}>
                        <DialogTitle
                            sx={{
                                fontSize: "2rem",
                                fontWeight: 700,
                                mb: 1,
                                background:
                                    "linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-secondary-main))",
                                WebkitBackgroundClip: "text",
                            }}
                            className="text-foreground"
                        >
                            🚀 Welcome to the Premium side of LeetMail
                        </DialogTitle>
                        <Typography
                            variant="body2"
                            className="text-foreground"
                            sx={{ my: -2 }}
                        >
                            Premium gives personalized curated prep designed to
                            help you land offers faster.
                        </Typography>
                    </Box>

                    {/* Pricing Columns */}
                    <Box px={6} pb={4}>
                        <Box
                            display="grid"
                            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                            gap={4}
                        >
                            {/* Free Tier */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="rounded-xl border border-border/40 bg-card/30 p-6 backdrop-blur"
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    mb={1}
                                >
                                    Free
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-foreground"
                                    mb={3}
                                >
                                    Get started with the basics
                                </Typography>

                                {freeFeatures.map((f, i) => (
                                    <Box
                                        key={i}
                                        display="flex"
                                        alignItems="flex-start"
                                        gap={2}
                                        mb={1.5}
                                    >
                                        <Check className="w-4 h-4 text-muted-foreground" />
                                        <Typography variant="body2">
                                            {f}
                                        </Typography>
                                    </Box>
                                ))}
                            </motion.div>

                            {/* Premium Tier */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="rounded-xl border-2 border-primary/40 p-6 bg-linear-to-br from-card to-primary/10 backdrop-blur relative"
                            >
                                {/* Glow */}
                                <Box className="absolute -top-28 -right-28 w-48 h-48 bg-primary/25 rounded-full blur-[90px]" />

                                {/* <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge> */}

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    mb={1}
                                    className="text-foreground"
                                >
                                    Premium
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-foreground"
                                    mb={3}
                                >
                                    Land your dream offer faster
                                </Typography>

                                {premiumFeatures.map((f, i) => (
                                    <Box
                                        key={i}
                                        display="flex"
                                        alignItems="flex-start"
                                        gap={2}
                                        mb={1.5}
                                    >
                                        <Check className="w-4 h-4 text-primary" />
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                        >
                                            {f}
                                        </Typography>
                                    </Box>
                                ))}
                            </motion.div>
                        </Box>

                        {/* Emotional Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                textAlign: "center",
                                marginTop: 28,
                                marginBottom: 18,
                            }}
                        >
                            <Typography
                                variant="body2"
                                className="text-foreground"
                            >
                                Helping you stay consistent and confident
                                through your interview journey ❤️
                            </Typography>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 16,
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={1}
                            >
                                <MUIButton
                                    variant="contained"
                                    sx={{
                                        width: { xs: "100%", sm: "auto" },
                                        py: 1.2,
                                        fontWeight: 600,
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Upgrade to Premium — 7-day Free Trial
                                </MUIButton>
                                <Typography
                                    variant="caption"
                                    className="text-foreground"
                                >
                                    Cancel anytime. No hidden fees.
                                </Typography>
                            </Box>
                        </motion.div>
                    </Box>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default PremiumModal;
