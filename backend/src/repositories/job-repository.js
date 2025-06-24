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
     * @param {string} [jobs[].jobType] - The type of job (e.g., full-time, part-time).
     * @param {string} [jobs[].remoteOption] - The remote work option.
     * @param {string} [jobs[].link] - The URL to the job posting.
     * @param {Array<string>} [jobs[].skills] - An array of skills required for the job.
     * @param {Array<string>} [jobs[].benefits] - An array of benefits offered by the job.
     * @param {Date|string} [jobs[].expiresAt] - The expiration date of the job posting.
     * @param {string} [jobs[].source] - The source of the job posting (e.g., website, referral).
     * @throws {Error} If the input is not a non-empty array.
     * @returns {Promise<Object>} The result of the bulk creation operation.
     */
    async createJobs(jobs) {
        if (!Array.isArray(jobs) || jobs.length === 0) {
            throw new Error('Invalid input: jobs must be a non-empty array');
        }

        const jobsWithCompanyIds = [];

        // Ensure each job has a valid company ID
        for (const job of jobs) {
            let company = await this.companyRepository.findByName(job.company.name);

            // If the company does not exist, create it
            if (!company) {
                company = await this.companyRepository.create(job.company);
            }

            // Add the company ID to the job object
            jobsWithCompanyIds.push({
                ...job,
                companyId: company.id
            });
        }

        // Prepare the job data for bulk creation
        jobs = jobsWithCompanyIds;

        const jobData = jobs.map(job => ({
            title: job.title,
            description: job.description,
            companyId: job.companyId,
            location: job.location,
            experience: job.experience,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            salaryRaw: job.salaryRaw,
            salaryCurrency: job.salaryCurrency,
            jobType: job.jobType,
            remoteOption: job.remoteOption,
            postedAt: job.postedAt,
            link: job.link,
            skills: job.skills,
            benefits: job.benefits,
            expiresAt: job.expiresAt,
            source: job.source,
        }));

        return await this.createMany({
            data: jobData
        });
    }

    /**
     * Searches for jobs based on the provided query parameters.
     *
     * @async
     * @param {Object} query - The search criteria.
     * @param {Array<string>} [query.keywords] - Keywords to search for in job postings.
     * @param {string} [query.location] - Location to filter jobs by.
     * @param {string} [query.experience] - Experience level to filter jobs by.
     * @param {number} [query.salary_min] - Minimum salary to filter jobs by.
     * @param {number} [query.salary_max] - Maximum salary to filter jobs by.
     * @param {string} [query.job_type] - Type of job (e.g., full-time, part-time).
     * @param {string} [query.remote_option] - Remote work option to filter jobs by.
     * @param {Array<string>} [query.other_preferences] - Additional preferences for job search.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of job objects matching the search criteria.
     */
    async searchJobs(query) {
        const { keywords, location, experience, salaryMin, salaryMax, jobType, remoteOption, otherPreferences } = query;

        const conditions = [
            keywords?.length ? {
                OR: [
                    {
                        title: {
                            search: keywords.join(" & "),
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            search: keywords.join(" & "),
                            mode: 'insensitive'
                        }
                    }
                ]
            } : null,
            remoteOption ? {
                remoteOption: {
                    equals: remoteOption,
                    mode: 'insensitive'
                }
            } : null,
            experienceLevel ? {
                experienceLevel: {
                    equals: experienceLevel,
                    mode: 'insensitive'
                }
            } : null,
            otherPreferences?.length ? {
                otherPreferences: {
                    search: otherPreferences.join(" | "),
                    mode: 'insensitive'
                }
            } : null,
            location ? { location: { contains: location, mode: 'insensitive' } } : null,
            jobType ? { jobType: { equals: jobType, mode: 'insensitive' } } : null,
            salaryMin ? { salary: { gte: salaryMin } } : null,
            salaryMax ? { salary: { lte: salaryMax } } : null
        ].filter(Boolean);

        return await this.findMany({
            AND: conditions
        }, {
            _relevance: {
                fields: ['title', 'description', 'location', 'experienceLevel', 'salary', 'jobType', 'remoteOption'],
                search: keywords ? keywords.join(" | ") : '',
                sort: 'asc',
            },
        });
    }
}

module.exports = JobRepository;