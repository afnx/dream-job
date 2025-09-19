const normalizeRemoteOption = require('./normalize-remote-option');
const normalizeSalary = require('./normalize-salary');
const normalizeJobType = require('./normalize-job-type');
const normalizeExperience = require('./normalize-experience');
const normalizeLocation = require('./normalize-location');

/**
 * Normalizes job data fields to match Job schema requirements.
 *
 * @param {Object} input - The raw job data to normalize.
 * @param {*} input.title - The job title to normalize.
 * @param {*} input.description - The job description to normalize.
 * @param {*} input.location - The job location to normalize.
 * @param {*} input.remoteOption - The remote option value to normalize.
 * @param {*} input.company - The company name to normalize.
 * @param {*} input.companyAbout - The company description to normalize.
 * @param {*} input.postedDate - The posted date to normalize.
 * @param {*} input.applyLink - The application link to normalize.
 * @param {*} input.jobType - The job type to normalize.
 * @param {*} input.salary - The salary information to normalize.
 * @param {*} input.source - The source of the job listing to normalize.
 * @returns {Object} The normalized job data with Job schema fields.
 */
function normalizeJobData(input) {
    const { salaryRaw, salaryMin, salaryMax, salaryCurrency, salaryUnit } = normalizeSalary(input.salary);
    return {
        title: input.title || null,
        description: input.description || null,
        location: normalizeLocation(input.location),
        remoteOption: normalizeRemoteOption(input.remoteOption),
        company: {
            name: input.company || null,
            description: input.companyAbout || null

        },
        postedAt: input.postedDate ? new Date(input.postedDate) : null,
        link: input.link || null,
        applyLink: input.applyLink || null,
        jobType: normalizeJobType(input.jobType),
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        salaryRaw: salaryRaw,
        salaryCurrency: salaryCurrency,
        salaryUnit: salaryUnit,
        source: input.source || null,
        sourceId: input.jobId || null
    };
}

/**
 * Normalizes a job query fields to match Job Query schema requirements.
 *
 * @param {Object} input - The raw job query input object.
 * @param {string} [input.keywords] - Keywords related to the job search.
 * @param {string} [input.location] - Desired job location.
 * @param {string} [input.companyName] - Name of the company.
 * @param {*} [input.experience] - Experience level; normalized by `normalizeExperience`.
 * @param {number} [input.salaryMin] - Minimum salary expectation.
 * @param {number} [input.salaryMax] - Maximum salary expectation.
 * @param {string} [input.salaryCurrency] - Currency for the salary.
 * @param {*} [input.jobType] - Type of job; normalized by `normalizeJobType`.
 * @param {*} [input.remoteOption] - Remote work option; normalized by `normalizeRemoteOption`.
 * @param {*} [input.otherPreferences] - Any other job preferences.
 * @returns {Object} Normalized job query with Job Query schema fields.
 */
function normalizeJobQuery(input) {
    return {
        keywords: input.keywords || null,
        location: input.location || null,
        companyName: input.companyName || null,
        experience: normalizeExperience(input.experience),
        salaryMin: input.salaryMin || null,
        salaryMax: input.salaryMax || null,
        salaryCurrency: input.salaryCurrency || null,
        jobType: normalizeJobType(input.jobType),
        remoteOption: normalizeRemoteOption(input.remoteOption),
        otherPreferences: input.otherPreferences || null
    };
}

module.exports = { normalizeJobData, normalizeJobQuery };