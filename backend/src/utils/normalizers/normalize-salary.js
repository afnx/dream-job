function normalizeSalary(raw) {
    if (raw == null || (typeof raw !== 'string' && typeof raw !== 'number')) {
        return { salaryRaw: null, salaryMin: null, salaryMax: null, salaryCurrency: null, salaryUnit: null };
    }

    const salaryRaw = raw;
    let salaryCurrency = null;
    let salaryUnit = null;
    let salaryMin = null;
    let salaryMax = null;

    // Detect currency
    const currencyMatch = raw.match(/([$€£])/);
    if (currencyMatch) salaryCurrency = currencyMatch[1];

    // Detect unit
    const unitMatch = raw.match(/(per\s*year|per\s*month|per\s*week|per\s*day|per\s*hour|\/\s*year|\/\s*month|\/\s*week|\/\s*day|\/\s*hr|\/\s*hour|\/\s*yr|per\s*yr)/i);
    if (unitMatch) {
        salaryUnit = unitMatch[0].replace(/^\//, '').replace(/per\s*/i, '').trim().toLowerCase();
        switch (salaryUnit) {
            case 'year':
            case 'yr':
                salaryUnit = 'YEAR';
                break;
            case 'month':
            case 'mo':
                salaryUnit = 'MONTH';
                break;
            case 'week':
            case 'wk':
                salaryUnit = 'WEEK';
                break;
            case 'day':
            case 'dy':
                salaryUnit = 'DAY';
                break;
            case 'hour':
            case 'hr':
                salaryUnit = 'HOUR';
                break;
            default:
                salaryUnit = null;
        }
    }

    // Remove currency, unit, and spaces for easier parsing
    const cleaned = raw.replace(/[$€£]/g, '')
        .replace(/(per\s*year|per\s*month|per\s*week|per\s*day|per\s*hour|\/\s*year|\/\s*month|\/\s*week|\/\s*day|\/\s*hr|\/\s*hour|\/\s*yr|per\s*yr)/gi, '')
        .replace(/[, ]+/g, '');

    // Handle ranges (e.g., "100K-120K", "10-15")
    const rangeMatch = cleaned.match(/([0-9,.kKmM]+)[-–—~to]+([0-9,.kKmM]+)/);
    if (rangeMatch) {
        salaryMin = parseSalaryValue(rangeMatch[1]);
        salaryMax = parseSalaryValue(rangeMatch[2]);
    } else {
        // Single value
        salaryMin = parseSalaryValue(cleaned);
        salaryMax = null;
    }

    // If only one value, set both min and max
    if (salaryMin && !salaryMax) salaryMax = salaryMin;

    return {
        salaryRaw,
        salaryMin,
        salaryMax,
        salaryCurrency,
        salaryUnit
    };
}

function parseSalaryValue(val) {
    if (!val) return null;
    let multiplier = 1;
    val = val.toLowerCase();
    if (val.endsWith('k')) {
        multiplier = 1000;
        val = val.replace('k', '');
    } else if (val.endsWith('m')) {
        multiplier = 1000000;
        val = val.replace('m', '');
    }
    val = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(val) * multiplier;
    return isFinite(num) && num > 0 ? num : null;
}

module.exports = normalizeSalary;