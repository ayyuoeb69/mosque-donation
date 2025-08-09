import { hash } from "bcryptjs";
import { prisma } from "./prisma";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@mail.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await hash(password, 12);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("Admin user created:", admin.email);

  // Create default mosque content
  const existingContent = await prisma.mosqueContent.findFirst();

  if (!existingContent) {
    await prisma.mosqueContent.create({
      data: {
        title: "Help Build Our Community Mosque",
        description:
          "Join us in building a beautiful mosque that will serve as a center for worship, community gatherings, and Islamic education for generations to come.",
        goal: 500000,
        currentAmount: 0,
      },
    });
    console.log("Default mosque content created");
  }
}
