'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { JobCard } from './JobCard';
import { Job } from '@/types/job';

interface JobListProps {
    jobs: Job[];
    isLoading: boolean;
    error: string | null;
    fieldErrors: Record<string, string[]>;
    searchQuery: string;
}

export function JobList({ jobs, isLoading, error, fieldErrors, searchQuery }: JobListProps) {
    if (error || (fieldErrors && Object.keys(fieldErrors).length > 0)) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    {fieldErrors && Object.keys(fieldErrors).length > 0 ? (
                        <ul>
                            {Object.entries(fieldErrors).map(([field, messages]) => (
                                <li key={field} className="text-red-600">
                                    {messages.join(', ')}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-red-600">{error}</p>
                    )}
                </div>
            </motion.div>
        );
    }

    if (!isLoading && jobs.length === 0 && searchQuery.trim()) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <p className="text-gray-500 text-lg">No jobs found</p>
            </motion.div>
        );
    }

    if (!searchQuery.trim()) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                {!isLoading && jobs.length > 0 && (
                    <motion.div
                        key="jobs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6"
                    >
                        {jobs.map((job, index) => (
                            <JobCard key={job.id || index} job={job} index={index} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && jobs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8 py-4 text-gray-600"
                >
                    Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} for you.
                </motion.div>
            )}
        </div>
    );
}