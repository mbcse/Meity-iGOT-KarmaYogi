import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs"; // Example for password hashing

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Example users to seed
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: await hash("password123", 10), // Example: hash password
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: await hash("pass1234", 10),
    },
  ];

  // Insert users into the database
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
    console.log(`Created user: ${user.email}`);
  }

  console.log("Database seeding completed.");
}

// Execute the seeding function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
