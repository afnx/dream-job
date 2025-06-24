function normalizeRemoteOption(raw) {
    if (!raw || typeof raw !== 'string') return null;

    const cleaned = raw.trim().toLowerCase();

    // Patterns for matching remote options
    const patterns = [
        { regex: /\b(remote|remote work|work from home|wfh)\b/, value: 'REMOTE' },
        { regex: /\b(hybrid|partially remote|remote onsite|remote\/onsite|onsite\/remote)\b/, value: 'HYBRID' },
        { regex: /\b(onsite only|onsite|work in office|in office|office only)\b/, value: 'ONSITE' },
    ];

    for (const { regex, value } of patterns) {
        if (regex.test(cleaned)) return value;
    }

    return null;
}

module.exports = normalizeRemoteOption;