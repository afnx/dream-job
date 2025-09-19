function normalizeJobType(raw) {
    if (!raw || typeof raw !== 'string') return null;

    const cleaned = raw.trim().toLowerCase();

    // Patterns for matching job types
    const patterns = [
        { regex: /\b(full[\s-_]?time|ft|fulltime|full[\s-_]?t|f\/t|f\.t\.|full-timer|fulltimed)\b/, value: 'FULL_TIME' },
        { regex: /\b(part[\s-_]?time|pt|parttime|part[\s-_]?t|p\/t|p\.t\.|part-timer|parttimed)\b/, value: 'PART_TIME' },
        { regex: /\b(contract|contractor|temp|temporary|cont[\s-_]?ract|contr|temp[\s-_]?work|temp[\s-_]?position|fixed[\s-_]?term)\b/, value: 'CONTRACT' },
        { regex: /\b(intern(ship)?|internship|interning|interned|trainee|student[\s-_]?placement|work[\s-_]?experience)\b/, value: 'INTERNSHIP' },
        { regex: /\b(volunteer|volunteering|voluntary|pro[\s-_]?bono|community[\s-_]?service)\b/, value: 'VOLUNTEER' },
        { regex: /\b(freelance|freelancer|self[\s-_]?employed|independent[\s-_]?contractor|gig[\s-_]?work|consultant|consulting)\b/, value: 'FREELANCE' },
    ];

    for (const { regex, value } of patterns) {
        if (regex.test(cleaned)) return value;
    }

    return null;
}

module.exports = normalizeJobType;