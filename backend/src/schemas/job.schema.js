const { z } = require('zod');

const CompanySchema = require('./company.schema');

const JobSchema = z.object({
    id: z.number().int().optional(),
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    company: CompanySchema.optional(),
    companyId: z.number().int().nullable().optional(),
    location: z.string().nullable().optional(),
    experience: z.enum(['ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL']).nullable().optional(),
    salaryMin: z.number().int().nullable().optional(),
    salaryMax: z.number().int().nullable().optional(),
    salaryRaw: z.string().nullable().optional(),
    salaryCurrency: z.string().nullable().optional(),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE']).nullable().optional(),
    remoteOption: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).nullable().optional(),
    postedAt: z.date().nullable().optional(),
    link: z.string().optional(),
    applyLink: z.string().nullable().optional(),
    skills: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    expiresAt: z.date().optional(),
    source: z.string().nullable().optional(),
    rawData: z.any().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

module.exports = JobSchema;
