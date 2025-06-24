function normalizeSalary(raw) {
    if (raw == null || (typeof raw !== 'string' && typeof raw !== 'number')) return null;

    if (typeof raw === 'number') {
        return isFinite(raw) && raw > 0 ? raw : null;
    }

    // Remove currency symbols, commas, spaces, and common salary suffixes (k, K, m, M)
    let cleaned = raw.replace(/[, ]+/g, '').replace(/[$€£]/g, '');

    // Handle 'k' or 'K' for thousands, 'm' or 'M' for millions
    let multiplier = 1;
    if (/(\d+)(k|K)$/.test(cleaned)) {
        multiplier = 1000;
        cleaned = cleaned.replace(/k|K$/, '');
    } else if (/(\d+)(m|M)$/.test(cleaned)) {
        multiplier = 1000000;
        cleaned = cleaned.replace(/m|M$/, '');
    }

    // Remove any remaining non-digit characters
    cleaned = cleaned.replace(/[^0-9.]/g, '');

    if (!cleaned) return null;

    const salary = parseFloat(cleaned) * multiplier;
    return isFinite(salary) && salary > 0 ? salary : null;
}

module.exports = normalizeSalary;