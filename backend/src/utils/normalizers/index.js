const normalizeRemoteOption = require('./normalize-remote-option');
const normalizeSalary = require('./normalize-salary');

function normalizedJobQuery(input) {
    return {
        remote: normalizeRemoteOption(input.remote),
        salary: normalizeSalary(input.salary)
        // TODO: Add more normalizers for other fields
    };
}

module.exports = normalizedJobQuery;