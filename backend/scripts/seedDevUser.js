import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB } from "../src/config/db.js";
import { ensureDevUser, DEV_USER_DEFAULTS } from "../src/utils/ensureDevUser.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env") });

/**
 * Seeds the default development user:
 * - name: Development User
 * - email: dev@careerforge.com
 * - role: pro (stored as subscriptionStatus)
 */
async function seedDevUser() {
  try {
    await connectDB();

    const user = await ensureDevUser();

    if (!user) {
      console.error("SKIP_AUTH is not enabled. Set SKIP_AUTH=true in .env to seed a dev user.");
      process.exit(1);
    }

    console.log("Development user ready:");
    console.log(JSON.stringify({
      id: user._id.toString(),
      name: user.fullName,
      email: user.email,
      role: user.subscriptionStatus,
    }, null, 2));
    console.log("\nDefaults:", DEV_USER_DEFAULTS.email);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed development user:", error);
    process.exit(1);
  }
}

seedDevUser();
