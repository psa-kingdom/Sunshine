import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];

  if (!emailArg || !passwordArg) {
    console.error("\nError: Please provide both email and password as CLI arguments.");
    console.error("Usage: npx tsx scripts/seed-admin.ts <email> <password>\n");
    process.exit(1);
  }

  const email = emailArg.toLowerCase().trim();
  const password = passwordArg.trim();

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("\nError: MONGODB_URI environment variable is required.");
    console.error("Set MONGODB_URI in your .env file or pass it in environment.\n");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.error(`\nError: Admin user with email "${email}" already exists.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newAdmin = new Admin({
      email,
      passwordHash,
      role: "admin",
    });

    await newAdmin.save();

    console.log(`\nSuccessfully created admin user: ${email}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("\nFailed to seed admin user:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();
