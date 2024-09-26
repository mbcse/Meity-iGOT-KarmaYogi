import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { allowedOrigins, port } from "./config";

import { requireAuth } from "./middleware/authMiddleware"; 

import authRouter from "./routes/auth.routes";
import producerRouter from "./routes/producer.routes";
import bucketsRouter from "./routes/buckets.routes";
import pixelRouter from "./routes/pixel.routes";
import statsRouter from "./routes/stats.routes";
import campaignRouter from "./routes/campaign.routes";
import templateRouter from "./routes/templates.routes";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!allowedOrigins || allowedOrigins.length === 0) {
      // If no allowed origins are specified, allow all origins
      callback(null, true);
    } else if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // If the origin is in the allowedOrigins array or no origin is provided
      callback(null, true);
    } else {
      // If the origin is not allowed
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If you need to send cookies or authorization headers
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/auth", authRouter);

app.use(requireAuth);


app.use("/producer", producerRouter);
app.use("/buckets", bucketsRouter);
app.use("/pixels", pixelRouter);
app.use("/stats", statsRouter);
app.use("/campaigns", campaignRouter);
app.use("/templates", templateRouter);

app.get("/health", (req, res) => {
  res.json("healthy");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
