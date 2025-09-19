import { ApiResponse } from "./api";
import { Company } from "./company";

export interface JobSearchRequest {
    input: string;
}

export type JobSearchResponse = ApiResponse<Job[]>;

export const Experience = {
    ENTRY_LEVEL: "ENTRY_LEVEL",
    MID_LEVEL: "MID_LEVEL",
    SENIOR_LEVEL: "SENIOR_LEVEL"
} as const;

export const JobType = {
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACT",
    INTERNSHIP: "INTERNSHIP",
    VOLUNTEER: "VOLUNTEER",
    FREELANCE: "FREELANCE"
} as const;

export const RemoteOption = {
    REMOTE: "REMOTE",
    HYBRID: "HYBRID",
    ONSITE: "ONSITE"
} as const;

export type Experience = typeof Experience[keyof typeof Experience];
export type JobType = typeof JobType[keyof typeof JobType];
export type RemoteOption = typeof RemoteOption[keyof typeof RemoteOption];

export interface Job {
    id: string;
    title: string;
    description?: string;
    company?: Company;
    companyId?: string;
    location?: string;
    experience?: Experience;
    salaryRaw?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryUnit?: string;
    jobType?: JobType;
    remoteOption?: RemoteOption;
    postedAt?: Date;
    link: string;
    applyLink?: string;
    source?: string;
}
