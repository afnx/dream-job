const { z } = require('zod');

const CompanySchema = z.object({
    id: z.number().int().nullable().optional(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    logoUrl: z.string().nullable().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional()
});

module.exports = CompanySchema;