const { z } = require('zod');

const CompanySchema = z.object({
    id: z.number().int().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    logoUrl: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

module.exports = CompanySchema;