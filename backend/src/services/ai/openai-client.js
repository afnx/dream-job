const { OpenAI } = require("openai");
const AIClient = require("./ai-client");

class OpenAIClient extends AIClient {
    /**
    * OpenClient Service for interacting with OpenAI's API.
    * @param {object} config - Configuration specific to OpenAI (e.g., apiKey, model).
    * @param {string} config.apiKey - The API key for OpenAI.
    * @param {string} config.model - The model to use for OpenAI requests (e.g., "gpt-3.5-turbo").
    */
    constructor(config) {
        super(config);
        if (!config || !config.apiKey || !config.model) {
            throw new Error("OpenAIClient is not configured properly. Please provide apiKey and model.");
        }

        this.model = config.model;
        this.openai = new OpenAI({
            apiKey: config.apiKey,
        });

    }

    async extractJobQueryDetails(userInput) {
        try {
            const prompt = `Extract the job title keywords, location, experience, salary, job type, and work preferences from this user input:
            "${userInput}"
            Return in JSON format:
            {
                "keywords": [...], // Array of keywords related to the job title
                "location": "...", // Location for the job search (e.g., "New York", "San Francisco, CA", "California", "remote", or null if not specified)
                "experience": "...", // Experience level (e.g., "entry-level", "mid-level", "senior-level", or null if not specified)
                "salaryMin": ..., // Minimum salary expectation (e.g., 50000, or null if not specified)
                "salaryMax": ..., // Maximum salary expectation (e.g., 100000, or null if not specified)
                "salaryCurrency": "USD", // Currency for the salary (e.g., "USD", "EUR", or null if not specified)
                "jobType": "...", // Job type (e.g., "full-time", "part-time", "contract", "temporary", "internship", or null if not specified)
                "remoteOption": "...",  // Remote work options ("remote", "onsite", "hybrid", or null if not specified)
                "otherPreferences": [...] // Array of any other preferences or requirements
            }`;

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
                temperature: 0.3,
            });

            // Validate response structure
            if (!response?.choices?.[0]?.message?.content) {
                throw new Error('Invalid response from OpenAI API: no content received');
            }

            const content = response.choices[0].message.content.trim();

            // Parse JSON response with error handling
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(content);
            } catch (jsonError) {
                console.error('Failed to parse OpenAI response as JSON:', content);
                throw new Error(`Invalid JSON response from AI: ${jsonError.message}`);
            }

            // Validate parsed response structure
            if (!parsedResponse || typeof parsedResponse !== 'object') {
                throw new Error('AI response is not a valid object');
            }

            return {
                keywords: parsedResponse.keywords,
                location: parsedResponse.location,
                experience: parsedResponse.experience,
                salaryMin: parsedResponse.salaryMin,
                salaryMax: parsedResponse.salaryMax,
                salaryCurrency: parsedResponse.salaryCurrency,
                jobType: parsedResponse.jobType,
                remoteOption: parsedResponse.remoteOption,
                otherPreferences: parsedResponse.otherPreferences
            };

        } catch (error) {
            // Handle different types of errors
            if (error.code === 'insufficient_quota') {
                throw new Error('OpenAI quota exceeded. Please check your billing.');
            } else if (error.code === 'invalid_api_key') {
                throw new Error('Invalid OpenAI API key. Please check your configuration.');
            } else if (error.code === 'model_not_found') {
                throw new Error(`Model '${this.model}' not found. Please check your model configuration.`);
            } else if (error.code === 'rate_limit_exceeded') {
                throw new Error('OpenAI rate limit exceeded. Please try again later.');
            } else if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }

            // Re-throw our custom errors
            if (error.message.includes('Invalid user input') ||
                error.message.includes('not configured') ||
                error.message.includes('Invalid JSON response') ||
                error.message.includes('AI response is not valid')) {
                throw error;
            }

            // Log unexpected errors for debugging
            console.error('Unexpected error in extractJobQueryDetails:', error);
            throw new Error(`Failed to extract job query details: ${error.message}`);
        }
    }

    async rankJobListings(userInput, jobListings) {
        try {
            const prompt = `User input: "${userInput}"
                Here are job listings:
                ${JSON.stringify(jobListings, null, 2)}

                Rank them by best match. Return JSON like this:
                [
                {
                    "id": "job_123",
                    "ranking": 1,
                    "title": "...",
                    "company": "...",
                    "reason": "..."
                }
                ]`;

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.3,
            });

            // Validate response structure
            if (!response?.choices?.[0]?.message?.content) {
                throw new Error('Invalid response from OpenAI API: no content received');
            }

            const content = response.choices[0].message.content.trim();

            // Parse JSON response with error handling
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(content);
            } catch (jsonError) {
                console.error('Failed to parse OpenAI response as JSON:', content);
                throw new Error(`Invalid JSON response from AI: ${jsonError.message}`);
            }

            // Validate parsed response is an array
            if (!Array.isArray(parsedResponse)) {
                console.error('AI response is not an array:', parsedResponse);
                throw new Error('AI response is not a valid array');
            }

            // Validate each ranking item and sanitize
            const sanitizedRankings = parsedResponse
                .filter(item => item && typeof item === 'object')
                .map((item, index) => ({
                    id: item.id || `unknown_${index}`,
                    ranking: typeof item.ranking === 'number' ? item.ranking : index + 1,
                    title: typeof item.title === 'string' ? item.title : 'Unknown Title',
                    company: typeof item.company === 'string' ? item.company : 'Unknown Company',
                    reason: typeof item.reason === 'string' ? item.reason : 'No reason provided'
                }));

            return sanitizedRankings;

        } catch (error) {
            // Handle different types of errors
            if (error.code === 'insufficient_quota') {
                throw new Error('OpenAI quota exceeded. Please check your billing.');
            } else if (error.code === 'invalid_api_key') {
                throw new Error('Invalid OpenAI API key. Please check your configuration.');
            } else if (error.code === 'model_not_found') {
                throw new Error(`Model '${this.model}' not found. Please check your model configuration.`);
            } else if (error.code === 'rate_limit_exceeded') {
                throw new Error('OpenAI rate limit exceeded. Please try again later.');
            } else if (error.code === 'context_length_exceeded') {
                throw new Error('Job listings are too large. Please try with fewer listings.');
            } else if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }

            // Re-throw our custom errors
            if (error.message.includes('Invalid user input') ||
                error.message.includes('Invalid job listings') ||
                error.message.includes('not configured') ||
                error.message.includes('Invalid JSON response') ||
                error.message.includes('AI response is not valid')) {
                throw error;
            }

            // Log unexpected errors for debugging
            console.error('Unexpected error in rankJobListings:', error);
            throw new Error(`Failed to rank job listings: ${error.message}`);
        }
    }
}

module.exports = OpenAIClient;
