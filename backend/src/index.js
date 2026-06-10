import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureDevUser } from "./utils/ensureDevUser.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL: GROQ_API_KEY is missing in .env");
}

console.log("Attempting to connect to Database...");

connectDB()
  .then(async () => {
    console.log("Database connected successfully!");

    if (process.env.SKIP_AUTH === "true") {
      const devUser = await ensureDevUser();
      console.log(
        `[Dev Auth] SKIP_AUTH enabled — AI routes use: ${devUser.email} (${devUser._id})`
      );
    }

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
