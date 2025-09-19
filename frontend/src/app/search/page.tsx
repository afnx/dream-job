'use client';

import { JobList } from '@/components/jobs/JobList';
import { SearchInput } from '@/components/search/SearchInput';
import { useJobSearch } from '@/hooks/useJobSearch';
import Logo from '@/components/Logo';
import LogOutButton from '@/components/search/LogOutButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';


export default function Home() {
  const { jobs, isLoading, error, fieldErrors, searchQuery, setSearchQuery } = useJobSearch();

  // Determine if there's any activity/content
  const hasActivity = Boolean(
    isLoading ||
    error ||
    (fieldErrors && Object.keys(fieldErrors).length > 0) ||
    jobs.length > 0 ||
    searchQuery.trim().length > 0
  );

  return (
    <div className={`min-h-screen gradient-bg transition-all duration-700 ease-out ${hasActivity ? '' : 'flex items-center justify-center'
      }`}>
      {/* Logout Button */}
      {/* Show only if auth provider is configured */}
      {process.env.NEXT_PUBLIC_AUTH_PROVIDER && process.env.NEXT_PUBLIC_AUTH_PROVIDER !== 'none' && (
        <LogOutButton />
      )}

      <div className={`w-full transition-all duration-700 ease-out ${hasActivity ? 'container mx-auto px-4 py-8' : 'container mx-auto px-4 py-8'
        }`}>
        {/* Header */}
        <Logo shrink={hasActivity} className={`text-center ${hasActivity ? 'mb-6 mt-16' : 'mb-12'}`} />

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
      <ScrollToTopButton />
    </div>
  );
}