const BaseRepository = require('./base-repository');
const CompanyRepository = require('./company-repository');

/**
 * Repository class for managing Job entities.
 * Extends the BaseRepository to provide CRUD operations and additional
 * methods specific to job postings, such as bulk creation and advanced search.
 *
 * @class
 * @extends BaseRepository
 *
 * @property {CompanyRepository} companyRepository - Instance for managing related company entities.
 *
 * @example
 * const jobRepo = new JobRepository();
 * await jobRepo.createJobs([...]);
 * const jobs = await jobRepo.searchJobs({ keywords: ['JavaScript', 'Remote'] });
 */
class JobRepository extends BaseRepository {
    constructor() {
        super('Job');
        this.companyRepository = new CompanyRepository();
    }

    /**
     * Creates multiple job entries in the database.
     *
     * @async
     * @param {Array<Object>} jobs - An array of job objects to be created.
     * @param {string} [jobs[].title] - The title of the job.
     * @param {string} [jobs[].description] - The description of the job.
     * @param {string} [jobs[].location] - The location of the job.
     * @param {Object} [jobs[].company] - The company object associated with the job.
     * @param {string} [jobs[].company.name] - The name of the company.
     * @param {string} [jobs[].company.description] - The description of the company.
     * @param {string} [jobs[].company.location] - The location of the company.
     * @param {string} [jobs[].company.website] - The website URL of the company.
     * @param {string} [jobs[].company.logoUrl] - The logo URL
     * @param {Date|string} [jobs[].postedAt] - The date the job was posted.
     * @param {string} [jobs[].link] - The link to the job posting.
     * @param {string} [jobs[].experience] - The required experience level.
     * @param {number} [jobs[].salaryMin] - The minimum salary for the job.
     * @param {number} [jobs[].salaryMax] - The maximum salary for the job.
     * @param {number} [jobs[].salaryRaw] - The raw salary value.
     * @param {string} [jobs[].salaryCurrency] - The currency of the salary.
     * @param {string} [jobs[].salaryUnit] - The salary unit (e.g., per year, per hour).
     * @param {string} [jobs[].jobType] - The type of job (e.g., full-time, part-time).
     * @param {string} [jobs[].remoteOption] - The remote work option.
     * @param {string} [jobs[].link] - The URL to the job posting.
     * @param {Array<string>} [jobs[].skills] - An array of skills required for the job.
     * @param {Array<string>} [jobs[].benefits] - An array of benefits offered by the job.
     * @param {Date|string} [jobs[].expiresAt] - The expiration date of the job posting.
     * @param {string} [jobs[].source] - The source of the job posting (e.g., website, referral).
     * @param {string} [jobs[].sourceId] - The unique identifier from the source.
     * @throws {Error} If the input is not a non-empty array.
     * @returns {Promise<Object>} The result of the bulk creation operation.
     */
    async createJobs(jobs) {
        if (!Array.isArray(jobs) || jobs.length === 0) {
            throw new Error('Invalid input: jobs must be a non-empty array');
        }

        // Remove duplicate sourceIds from input array
        const seen = new Set();
        const uniqueJobs = jobs.filter(job => {
            if (!job.sourceId || !job.source) return false; // Skip jobs without sourceId
            const key = `${job.sourceId}|${job.source}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // Find existing jobs in the database
        const sourceIdPairs = uniqueJobs.map(job => ({
            sourceId: job.sourceId,
            source: job.source
        }));

        // Find existing jobs in the database
        let existingJobs = [];
        if (sourceIdPairs.length > 0) {
            existingJobs = await this.findMany(
                {
                    // Find existing jobs by sourceId and source
                    OR: sourceIdPairs.map(pair => ({
                        sourceId: { equals: pair.sourceId },
                        source: { equals: pair.source }
                    }))
                },
                { select: { id: true, source: true, sourceId: true } } // Only select necessary fields
            );
        }

        const existingSourceIdMap = new Map(
            existingJobs.map(job => [`${job.sourceId}|${job.source}`, job])
        );

        const jobsToUpdate = [];
        const jobsToCreate = [];

        for (const job of uniqueJobs) {
            // Ensure the associated company exists or create it
            let company = await this.companyRepository.findCompanyByName(job.company.name);
            if (!company) {
                company = await this.companyRepository.create(job.company);
            }

            const jobData = {
                title: job.title,
                description: job.description,
                companyId: company.id,
                location: job.location,
                experience: job.experience,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                salaryRaw: job.salaryRaw,
                salaryCurrency: job.salaryCurrency,
                salaryUnit: job.salaryUnit,
                jobType: job.jobType,
                remoteOption: job.remoteOption,
                postedAt: job.postedAt,
                link: job.link || job.source || "#",
                applyLink: job.applyLink,
                skills: job.skills || [],
                benefits: job.benefits || [],
                expiresAt: job.expiresAt,
                source: job.source,
                sourceId: job.sourceId,
            };

            // Determine if we need to update an existing job or create a new one
            const key = `${job.sourceId}|${job.source}`;
            if (existingSourceIdMap.has(key)) {
                jobsToUpdate.push({ id: existingSourceIdMap.get(key).id, data: jobData });
            } else {
                jobsToCreate.push(jobData);
            }
        }

        // Update existing jobs and create new jobs in parallel
        await Promise.all([
            jobsToUpdate.length > 0
                ? Promise.all(jobsToUpdate.map(job => this.update(job.id, job.data)))
                : Promise.resolve(),
            jobsToCreate.length > 0
                ? this.createMany(jobsToCreate)
                : Promise.resolve()
        ]);

        return { updated: jobsToUpdate.length, created: jobsToCreate.length };
    }

    /**
     * Searches for jobs based on the provided query parameters.
     *
     * @async
     * @param {Object} query - The search criteria.
     * @param {Array<string>} [query.keywords] - Keywords to search for in job postings.
     * @param {string} [query.location] - Location to filter jobs by.
     * @param {string} [query.experience] - Experience level to filter jobs by.
     * @param {number} [query.salaryMin] - Minimum salary to filter jobs by.
     * @param {number} [query.salaryMax] - Maximum salary to filter jobs by.
     * @param {string} [query.jobType] - Type of job (e.g., full-time, part-time).
     * @param {string} [query.remoteOption] - Remote work option to filter jobs by.
     * @param {Array<string>} [query.otherPreferences] - Additional preferences for job search.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of job objects matching the search criteria.
     */
    async searchJobs(query) {
        const {
            keywords,
            location,
            experience,
            salaryMin,
            salaryMax,
            jobType,
            remoteOption,
            otherPreferences
        } = query;

        // Flatten keywords and remove duplicates
        const searchTerms = keywords
            ? Array.from(new Set(keywords.flatMap(k => k.split(' ')).map(w => w.trim()).filter(Boolean)))
            : [];

        const buildConditions = (relaxed = false) => [
            keywords?.length ? {
                OR: searchTerms.flatMap(term => [
                    { title: { contains: term, mode: 'insensitive' } },
                    { description: { contains: term, mode: 'insensitive' } }
                ])
            } : null,
            location ? { location: { contains: location, mode: 'insensitive' } } : null,
            !relaxed && remoteOption ? {
                remoteOption: { equals: remoteOption.toUpperCase() }
            } : null,
            !relaxed && experience ? {
                experience: { equals: experience.toUpperCase() }
            } : null,
            !relaxed && otherPreferences?.length ? {
                benefits: { hasSome: otherPreferences }
            } : null,
            !relaxed && jobType ? { jobType: { equals: jobType.toUpperCase() } } : null,
            !relaxed && salaryMin ? { salaryMin: { gte: salaryMin } } : null,
            !relaxed && salaryMax ? { salaryMax: { lte: salaryMax } } : null
        ].filter(Boolean);

        const validSearch = searchTerms.filter(term => !term.includes(' ')).join(' | ');
        const options = keywords?.length ? {
            orderBy: {
                _relevance: {
                    fields: ['title', 'description', 'location'],
                    search: validSearch,
                    sort: 'desc',
                }
            }
        } : {};

        // Always include company details in the results
        const includeCompany = { include: { company: true } };

        // First, strict search
        let results = await this.findMany({ AND: buildConditions(false) }, { ...options, ...includeCompany });

        // If no results, relax filters
        if (results.length === 0) {
            results = await this.findMany({ AND: buildConditions(true) }, { ...options, ...includeCompany });
        }

        return results;
    }
}

module.exports = JobRepository;