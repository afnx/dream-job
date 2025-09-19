const OpenAIClient = require('../../../src/services/ai/openai-client');
const { OpenAI } = require('openai');

// Mock the OpenAI SDK
jest.mock('openai');

describe('OpenAIClient', () => {
    let mockOpenAI;
    let mockChatCompletions;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup OpenAI mock
        mockChatCompletions = {
            parse: jest.fn()
        };

        mockOpenAI = {
            responses: mockChatCompletions
        };

        OpenAI.mockImplementation(() => mockOpenAI);
    });

    describe('constructor', () => {
        it('should initialize with valid config', () => {
            const config = { apiKey: 'test-key', model: 'gpt-3.5-turbo' };
            const client = new OpenAIClient(config);

            expect(client.model).toBe('gpt-3.5-turbo');
            expect(client.openai).toBe(mockOpenAI);
            expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'test-key' });
        });

        it('should throw error when config is missing', () => {
            expect(() => new OpenAIClient()).toThrow(
                /OpenAIClient is not configured properly\. Please provide apiKey and model\.|AIClient requires a configuration object\./
            );
        });

        it('should throw error when apiKey is missing', () => {
            const config = { model: 'gpt-3.5-turbo' };
            expect(() => new OpenAIClient(config)).toThrow(
                /OpenAIClient is not configured properly\. Please provide apiKey and model\.|AIClient requires a configuration object\./
            );
        });

        it('should throw error when model is missing', () => {
            const config = { apiKey: 'test-key' };
            expect(() => new OpenAIClient(config)).toThrow(
                /OpenAIClient is not configured properly\. Please provide apiKey and model\.|AIClient requires a configuration object\./
            );
        });

        it('should throw error when config is null', () => {
            expect(() => new OpenAIClient(null)).toThrow(
                /OpenAIClient is not configured properly\. Please provide apiKey and model\.|AIClient requires a configuration object\./
            );
        });
    });

    describe('extractJobQueryDetails', () => {
        let client;
        const validConfig = { apiKey: 'test-key', model: 'gpt-3.5-turbo' };

        beforeEach(() => {
            client = new OpenAIClient(validConfig);
        });

        it('should extract job query details successfully', async () => {
            const mockResponse = {
                output_parsed: {
                    keywords: ['javascript', 'developer'],
                    location: 'Remote',
                    companyName: 'TechCorp',
                    experience: 'mid-level',
                    salaryMin: 50000,
                    salaryMax: 100000,
                    salaryCurrency: 'USD',
                    jobType: 'full-time',
                    remoteOption: 'remote',
                    otherPreferences: ['flexible hours', 'health benefits']
                }
            };

            mockChatCompletions.parse.mockResolvedValue(mockResponse);

            const result = await client.extractJobQueryDetails('Looking for a JavaScript developer job remotely with flexible hours and health benefits. Salary range: 50k-100k. Experience level: mid-level. Job type: full-time. Remote option: remote.');

            expect(result).toEqual({
                keywords: ['javascript', 'developer'],
                location: 'Remote',
                companyName: 'TechCorp',
                experience: 'mid-level',
                salaryMin: 50000,
                salaryMax: 100000,
                salaryCurrency: 'USD',
                jobType: 'full-time',
                remoteOption: 'remote',
                otherPreferences: ['flexible hours', 'health benefits']
            });

            expect(mockChatCompletions.parse).toHaveBeenCalledWith({
                model: 'gpt-3.5-turbo',
                max_output_tokens: 10000,
                input: [
                    {
                        role: "system",
                        content: "Extract the job information."
                    },
                    {
                        role: "user",
                        content: expect.stringContaining('Looking for a JavaScript developer job remotely with flexible hours and health benefits. Salary range: 50k-100k. Experience level: mid-level. Job type: full-time. Remote option: remote.')
                    },
                ],
                text: {
                    format: expect.anything(), // zodTextFormat(JobQuerySchema, "jobQuery") is not directly testable here
                },
            });
        });

        it('should handle response with missing fields', async () => {
            const mockResponse = {
                output_parsed: {
                    keywords: ['developer'],
                    // missing location and preferences
                }
            };

            mockChatCompletions.parse.mockResolvedValue(mockResponse);

            const result = await client.extractJobQueryDetails('Developer position');

            expect(result).toEqual({
                keywords: ['developer'],
            });
        });

        it('should handle invalid JSON response', async () => {
            // Simulate parse returning a string that's not valid JSON
            mockChatCompletions.parse.mockResolvedValue('Invalid JSON response');

            const result = await client.extractJobQueryDetails('test input');
            expect(result).toBeUndefined();
        });

        it('should handle OpenAI API errors', async () => {
            const apiError = new Error('API Error');
            apiError.code = 'insufficient_quota';

            mockChatCompletions.parse.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'OpenAI quota exceeded. Please check your billing.'
            );
        });

        it('should handle rate limit error', async () => {
            const apiError = new Error('Rate limit exceeded');
            apiError.code = 'rate_limit_exceeded';

            mockChatCompletions.parse.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'OpenAI rate limit exceeded. Please try again later.'
            );
        });

        it('should handle invalid API key error', async () => {
            const apiError = new Error('Invalid API key');
            apiError.code = 'invalid_api_key';

            mockChatCompletions.parse.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'Invalid OpenAI API key. Please check your configuration.'
            );
        });

        it('should handle model not found error', async () => {
            const apiError = new Error('Model not found');
            apiError.code = 'model_not_found';

            mockChatCompletions.parse.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                "Model 'gpt-3.5-turbo' not found. Please check your model configuration."
            );
        });

        it('should handle timeout error', async () => {
            const timeoutError = new Error('Request timeout');
            timeoutError.name = 'AbortError';

            mockChatCompletions.parse.mockRejectedValue(timeoutError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'Request timeout. Please try again.'
            );
        });
    });
});