// scripts/seedAdmin.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // update path if needed
import connectDB from "./dbConfig/db.js";
dotenv.config();

const seedAdmin = async () => {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "admin@learnix.ai" });
    if (existingAdmin) {
        console.log("✅ Admin already exists");
        return process.exit();
    }

    const admin = new User({
        name: "Admin",
        email: "admin@learnix.ai",
        password: "SuperSecure123!",
        role: "admin",
    });

    await admin.save();
    console.log("✅ Admin seeded");
    process.exit();
};

seedAdmin().catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
});
