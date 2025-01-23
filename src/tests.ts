
import { faker } from "@faker-js/faker";
import { ShipmentStatus } from "@prisma/client";

export function generateShipmentRecords(n: number) {
  const records = [];

  for (let i = 0; i < n; i++) {
    const randomStatus = Object.values(ShipmentStatus);
    const record = {
      description: faker.commerce.productDescription(),
      pickupAddress: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.country(),
      deliveryAddress: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.country(),
      status: randomStatus[Math.floor(Math.random() * randomStatus.length)],
      driversEmail: faker.internet.email(),
      customersEmail: faker.internet.email(),
    };

    records.push(record);
  }

  return records;
}


export function generateShipmentLogRecords(n: number) {
  const logs = [];

  for (let i = 0; i < n; i++) {
    const randomStatus = Object.values(ShipmentStatus);

    const log = {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      timestamp: faker.date.recent(), // Random date within the last few days
      status: randomStatus[Math.floor(Math.random() * randomStatus.length)],
      error: faker.datatype.boolean() ? faker.lorem.sentence() : "", // Random error or empty string
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };

    logs.push(log);
  }

  return logs;
}
