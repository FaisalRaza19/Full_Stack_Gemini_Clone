import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routes/user.route.js";
import chatRouter from "./Routes/chat.route.js";
import { connectToDb } from "./DataBase/db.js";

dotenv.config({ path: ".env" });

const app = express();

// Connect DB
connectToDb();

// Production proxy fix
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Allowed origins
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(o => o.trim()).filter(Boolean)
    : [];

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// CORS setup
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173' || 'https://full-stack-gemini-clone.vercel.app'];

        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "X-Requested-With"],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/", (req, res) => res.send("Hello World!"));

// Routes
app.use("/user", router);
app.use("/chat", chatRouter);

// Error handler (must be last)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
