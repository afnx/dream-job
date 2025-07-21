import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { ApiException } from '@/utils/errors';
import { Job } from '@/types/job';

interface UseJobSearchResult {
    jobs: Job[];
    isLoading: boolean;
    error: string | null;
    fieldErrors: Record<string, string[]>;
    searchQuery: string;
    setSearchQuery: (_query: string) => void;
    clearError: () => void;
}

export function useJobSearch(): UseJobSearchResult {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const clearError = () => {
        setError(null);
        setFieldErrors({});
    };

    useEffect(() => {
        // If the search query is empty, reset jobs and return early
        if (!searchQuery.trim()) {
            setJobs([]);
            return;
        }

        const searchJobs = async () => {
            setIsLoading(true);
            clearError();

            try {
                const response = await apiService.searchJobs(searchQuery);

                if (response.success && response.data) {
                    setJobs(response.data || []);
                }
            } catch (err) {
                if (err instanceof ApiException) {
                    setError(err.getDisplayMessage());
                    setFieldErrors(err.getFieldErrors());
                } else {
                    setError('An unexpected error occurred');
                    console.error('Unexpected error:', err);
                }
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchJobs();
    }, [searchQuery]);

    return {
        jobs,
        isLoading,
        error,
        fieldErrors,
        searchQuery,
        setSearchQuery,
        clearError,
    };
}
