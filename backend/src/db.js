const { PrismaClient } = require('../prisma/generated/prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;