import User from "../models/User.js";

const isProduction = process.env.NODE_ENV === "production";
const fallbackAdmin = {
  name: "Algora Admin",
  email: "admin@algora.dev",
  password: "Admin@12345",
};

const getAdminSeed = () => ({
  name: process.env.ADMIN_NAME || fallbackAdmin.name,
  email: (process.env.ADMIN_EMAIL || fallbackAdmin.email).trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || fallbackAdmin.password,
});

export const ensureAdminUser = async () => {
  const hasExplicitProductionConfig =
    Boolean(process.env.ADMIN_NAME) &&
    Boolean(process.env.ADMIN_EMAIL) &&
    Boolean(process.env.ADMIN_PASSWORD);

  if (isProduction && !hasExplicitProductionConfig) {
    return;
  }

  const adminSeed = getAdminSeed();
  const existingUser = await User.findOne({ email: adminSeed.email }).select("+password");

  if (!existingUser) {
    await User.create({
      ...adminSeed,
      role: "admin",
    });

    console.log(`Admin account ready for ${adminSeed.email}`);
    return;
  }

  if (existingUser.role !== "admin") {
    existingUser.role = "admin";
    await existingUser.save();
  }
};
