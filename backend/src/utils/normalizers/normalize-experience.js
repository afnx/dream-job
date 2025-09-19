function normalizeExperience(raw) {
    if (!raw || typeof raw !== 'string') return null;

    const cleaned = raw.trim().toLowerCase();

    // Patterns for matching experience levels
    const patterns = [
        { regex: /\b(entry[\s-_]?level|junior|jr\.?|beginner|no[\s-_]?experience|fresh[\s-_]?graduate|new[\s-_]?grad|trainee)\b/, value: 'ENTRY_LEVEL' },
        { regex: /\b(mid[\s-_]?level|intermediate|experienced|associate|mid[\s-_]?career|middle[\s-_]?level)\b/, value: 'MID_LEVEL' },
        { regex: /\b(senior|sr\.?|lead|principal|expert|seasoned|advanced|senior[\s-_]?level|manager)\b/, value: 'SENIOR_LEVEL' },
    ];

    for (const { regex, value } of patterns) {
        if (regex.test(cleaned)) return value;
    }

    return null;
}

module.exports = normalizeExperience;