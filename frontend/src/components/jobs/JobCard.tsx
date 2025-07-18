'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { Job, RemoteOption } from '@/types/job';
import { getTimeAgo } from '@/utils/date';

interface JobCardProps {
    job: Job;
    index: number;
}

export function JobCard({ job, index }: JobCardProps) {
    const handleApply = () => {
        if (job.applyLink || job.link) {
            window.open(job.applyLink || job.link, '_blank');
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
                <ExternalLink className="text-gray-400 hover:text-blue-600 transition-colors" size={20} />
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                {job.location && (
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                    </div>
                )}

                {job.salary && (
                    <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>{job.salary}</span>
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
                        {job.jobType}
                    </span>
                )}
                {job.remoteOption && job.remoteOption !== RemoteOption.ONSITE && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {job.remoteOption}
                    </span>
                )}
                {job.experience && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {job.experience}
                    </span>
                )}
            </div>

            {job.description && (
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {job.description.length > 800
                        ? `${job.description.substring(0, 800)}...`
                        : job.description
                    }
                </p>
            )}
        </motion.div>
    );
}