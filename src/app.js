import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//setting up cross origin sharing configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

//setting up json data configuration

app.use(express.json({ limit: "16kb" }));

// setting up url data configuration

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

//setting up cookie parser configuration

app.use(cookieParser());

export default app;
