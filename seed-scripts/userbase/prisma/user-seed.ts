import {PrismaClient} from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const NUMBER_OF_USERS = 100; // Adjust the number as needed

const seedDatabase = async () => {
  const users = Array.from({ length: NUMBER_OF_USERS }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    number: faker.phone.number(),
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Skip users with duplicate email
  });

  console.log(`${NUMBER_OF_USERS} users created.`);
};

seedDatabase()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
