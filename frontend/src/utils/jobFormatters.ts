export function formatJobType(type?: string) {
    switch (type) {
        case 'FULL_TIME': return 'Full time';
        case 'PART_TIME': return 'Part time';
        case 'CONTRACT': return 'Contract';
        case 'TEMPORARY': return 'Temporary';
        case 'INTERNSHIP': return 'Internship';
        default: return type || '';
    }
}

export function formatRemoteOption(option?: string) {
    switch (option) {
        case 'REMOTE': return 'Remote';
        case 'HYBRID': return 'Hybrid';
        case 'ONSITE': return 'On-site';
        default: return option || '';
    }
}

export function formatExperience(level?: string) {
    switch (level) {
        case 'ENTRY_LEVEL': return 'Entry level';
        case 'MID_LEVEL': return 'Mid level';
        case 'SENIOR_LEVEL': return 'Senior level';
        default: return level || '';
    }
}