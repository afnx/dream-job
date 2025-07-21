'use client';

import { JobList } from '@/components/jobs/JobList';
import { RibbonCreditBanner } from '@/components/RibbonCreditBanner';
import { SearchInput } from '@/components/search/SearchInput';
import { useJobSearch } from '@/hooks/useJobSearch';
import { motion } from 'framer-motion';

export default function Home() {
  const { jobs, isLoading, error, fieldErrors, searchQuery, setSearchQuery } = useJobSearch();

  // Determine if there's any activity/content
  const hasActivity = isLoading ||
    error ||
    (fieldErrors && Object.keys(fieldErrors).length > 0) ||
    jobs.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 transition-all duration-700 ease-out ${hasActivity ? '' : 'flex items-center justify-center'
      }`}>

      {/* Ribbon Credit Banner */}
      <RibbonCreditBanner />

      <div className={`w-full transition-all duration-700 ease-out ${hasActivity ? 'container mx-auto px-4 py-8' : 'container mx-auto px-4 py-8'
        }`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center ${hasActivity ? 'mb-6' : 'mb-12'}`}
        >
          <h1
            className={`
              font-bold text-gray-900 mb-4
              ${hasActivity
                ? 'text-2xl md:text-4xl mt-16'
                : 'text-4xl md:text-6xl'
              }
            `}
          >
            Find Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          {!hasActivity && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Search thousands of job opportunities with AI-powered matching
            </p>
          )}
        </motion.div>

        {/* Search */}
        <div className="mb-12">
          <SearchInput
            value={searchQuery}
            onSubmit={setSearchQuery}
            isLoading={isLoading}
          />
        </div>

        {/* Results */}
        <JobList
          jobs={jobs}
          isLoading={isLoading}
          error={error}
          fieldErrors={fieldErrors}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}