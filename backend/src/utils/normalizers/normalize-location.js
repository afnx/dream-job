function normalizeLocation(raw) {
    if (!raw || typeof raw !== 'string') return null;

    const cleaned = raw.trim();

    const dotIndex = cleaned.indexOf('•');
    if (dotIndex !== -1) {
        return cleaned.substring(0, dotIndex).trim();
    }
    return cleaned;
}

module.exports = normalizeLocation;