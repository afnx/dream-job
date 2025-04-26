const prisma = require('../src/db');

describe('Prisma Client', () => {
    afterAll(async () => {
        // Disconnect Prisma Client after tests
        await prisma.$disconnect();
    });

    test('Prisma Client should be defined', () => {
        expect(prisma).toBeDefined();
    });

    test('Prisma Client should connect successfully', async () => {
        try {
            await prisma.$connect();
            expect(true).toBe(true); // If no error, connection is successful
        } catch (error) {
            expect(error).toBeUndefined(); // Fail the test if there's an error
        }
    });
});