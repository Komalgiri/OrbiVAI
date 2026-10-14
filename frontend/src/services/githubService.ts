import { apiRequest } from './api';

export interface ProfileAnalysis {
    techStack: string[];
    inferredRole: string;
    roleAnalysis?: {
        languages: { name: string; percentage: number }[];
        domains: { name: string; score: number }[];
        reason: string;
    };
}

export interface LanguageDistributionItem {
    name: string;
    bytes: number;
    percentage: number;
    color: string;
}

export interface NotableProject {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updatedAt?: string;
}

export interface AIIntelligenceData {
    archetype: string;
    archetypeSummary: string;
    technicalStrength: string;
    careerTrajectory: string;
    strategicGrowthTips: string[];
    recruiterOutlook: string;
}

export interface DeveloperIntelligenceData {
    profile: {
        username: string;
        name: string;
        avatarUrl: string;
        bio: string;
        location: string;
        githubUrl: string;
        yearsActive: string;
        yearsActiveRaw: number;
    };
    metrics: {
        developerScore: number;
        totalStars: number;
        starsPerRepo: string;
        totalRepos: number;
        sourceRepos: number;
        forkedRepos: number;
        repoSummary: string;
        totalForks: number;
        followers: number;
        following: number;
        communityRatio: string;
    };
    languageDistribution: LanguageDistributionItem[];
    projectScale: {
        totalSource: number;
        totalForks: number;
        notableProjects: NotableProject[];
    };
    aiIntelligence: AIIntelligenceData;
    analyzedAt: string;
}

export const githubService = {
    analyzeProfile: async (): Promise<ProfileAnalysis> => {
        const token = localStorage.getItem('token');
        return apiRequest<ProfileAnalysis>('github/analyze', {
            method: 'POST',
            token: token || undefined,
        });
    },

    syncActivity: async () => {
        const token = localStorage.getItem('token');
        return apiRequest('github/sync', {
            method: 'POST',
            token: token || undefined,
        });
    },

    getIntelligence: async (username?: string): Promise<DeveloperIntelligenceData> => {
        const token = localStorage.getItem('token');
        const endpoint = username ? `github/analytics/${encodeURIComponent(username)}` : 'github/analytics';
        return apiRequest<DeveloperIntelligenceData>(endpoint, {
            method: 'GET',
            token: token || undefined,
        });
    }
};
