const { z } = require('zod');

const JobQuerySchema = z.object({
    keywords: z.array(z.string()),
    location: z.string().nullable().optional(),
    experience: z.string().nullable().optional(),
    salaryMin: z.number().nullable().optional(),
    salaryMax: z.number().nullable().optional(),
    salaryCurrency: z.string().nullable().optional(),
    jobType: z.string().nullable().optional(),
    remoteOption: z.string().nullable().optional(),
    otherPreferences: z.array(z.string()).optional()
});

module.exports = JobQuerySchema;