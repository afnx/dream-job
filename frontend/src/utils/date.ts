/**
 * Calculates and formats the time elapsed since a given date
 * @param dateString - Date string or Date object
 * @returns Formatted string representing time elapsed (e.g., "2 days ago", "Today")
 */
export function getTimeAgo(dateString: string | Date | null | undefined): string | null {
    if (!dateString) return null;

    const date = dateString instanceof Date ? dateString : new Date(dateString);

    // Validate date
    if (isNaN(date.getTime())) return null;

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Formats a date for display purposes
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}