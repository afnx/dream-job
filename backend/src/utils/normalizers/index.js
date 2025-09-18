const normalizeRemoteOption = require('./normalize-remote-option');
const normalizeSalary = require('./normalize-salary');

/**
 * Normalizes job data fields to match Job schema requirements.
 *
 * @param {Object} input - The raw job data to normalize.
 * @param {*} input.remote - The remote option value to normalize.
 * @param {*} input.salary - The salary value to normalize.
 * @returns {Object} The normalized job data with Job schema fields.
 */
function normalizeJobData(input) {
    return {
        remote: normalizeRemoteOption(input.remote),
        salary: normalizeSalary(input.salary)
        // TODO: Add more normalizers for other fields
    };
}

module.exports = { normalizeJobData };