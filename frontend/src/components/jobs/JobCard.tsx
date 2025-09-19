'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { Job, RemoteOption } from '@/types/job';
import { getTimeAgo } from '@/utils/date';
import { formatJobType, formatExperience, formatRemoteOption } from '@/utils/jobFormatters';

interface JobCardProps {
    job: Job;
    index: number;
}

export function JobCard({ job, index }: JobCardProps) {
    const handleApply = () => {
        if (job.applyLink || job.link) {
            window.open(job.applyLink || job.link, '_blank');
        } else if (job.source) {
            window.open('https://' + job.source + '.com', '_blank');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 12
            }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleApply}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {job.title}
                    </h3>
                    {job.company && (
                        <p className="text-lg text-gray-700 font-medium mb-2">{job.company.name}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {job.source && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-semibold border border-gray-200">
                            {job.source}
                        </span>
                    )}
                    <ExternalLink className="text-gray-400 hover:text-blue-600 transition-colors" size={20} />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                {job.location && (
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                    </div>
                )}

                {job.salaryRaw && (
                    <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>{job.salaryRaw}</span>
                    </div>
                )}

                {job.postedAt && (
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{getTimeAgo(job.postedAt)}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mb-6">
                {job.jobType && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {formatJobType(job.jobType)}
                    </span>
                )}
                {job.remoteOption && job.remoteOption !== RemoteOption.ONSITE && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {formatRemoteOption(job.remoteOption)}
                    </span>
                )}
                {job.experience && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {formatExperience(job.experience)}
                    </span>
                )}
            </div>

            {job.description && (
                <p className="text-gray-600 text-base line-clamp-3 leading-relaxed">
                    {job.description.length > 1000
                        ? `${job.description.substring(0, 1000)}...`
                        : job.description
                    }
                </p>
            )}
        </motion.div>
    );
}