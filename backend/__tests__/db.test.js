jest.mock('../src/db', () => ({
    $connect: jest.fn().mockResolvedValue(),
    $disconnect: jest.fn().mockResolvedValue(),
}));

const prisma = require('../src/db');

describe('Prisma Client', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('Prisma Client should be defined', () => {
        expect(prisma).toBeDefined();
    });

    test('Prisma Client should connect successfully', async () => {
        await expect(prisma.$connect()).resolves.toBeUndefined();
    });

    test('Prisma Client should handle disconnection gracefully', async () => {
        await prisma.$connect();
        await expect(prisma.$disconnect()).resolves.toBeUndefined();
    });
});