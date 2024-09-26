// Update seed.mjs to use faker for generating at least 10,000 records
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/en_IN';
import { config } from 'dotenv';

config(); // Load .env file
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:6001/ext-services";
  }
const prisma = new PrismaClient();

async function main() {
  const numberOfRecords = 1000; // Number of records to generate

  console.log(`Start seeding ...`);
  for (let i = 0; i < numberOfRecords; i++) {
    const {startTime, endTime} = generateRandomTimeOfDay();
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      jobTitle: faker.person.jobTitle(),
      gender: faker.person.sex(),
      number: faker.phone.number('+91##########'),
      birthday: new Date(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).setUTCHours(0,0,0,0)),
      officeStartTime: startTime,
      officeEndTime: endTime,
      location: faker.location.state(),
    };

    function generateRandomTimeOfDay() {
      const startHour = getRandomInt(0, 23);
      const startMinute = getRandomInt(0, 59);
      const endHour = getRandomInt(startHour, 23);
      const endMinute = getRandomInt(startMinute, 59);

      const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
      return { startTime, endTime };
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const userRecord = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${userRecord.id}`);
  }
  console.log(`Seeding finished. ${numberOfRecords} records created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });