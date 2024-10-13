import { connectToDb } from "./DataBase/db.js"
import express from "express";
import bodyParser from "body-parser";
import router from "./Routes/user.route.js"
import chatRouter from "./Routes/chat.route.js";
import dotenv from "dotenv";
import cors from "cors";
const app = express();


connectToDb();

dotenv.config({
    path: ".env"
});

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173','https://full-stack-gemini-clone.vercel.app'];

        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.warn(`CORS error for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};


// Midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Hello World!')
})


// user route
app.use("/user", router);

// chat route 
app.use("/chat", chatRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`)
})
