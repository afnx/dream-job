const OpenAIClient = require('../../src/ai/openai-client');
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
            create: jest.fn()
        };

        mockOpenAI = {
            chat: {
                completions: mockChatCompletions
            }
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
                choices: [{
                    message: {
                        content: JSON.stringify({
                            keywords: ['javascript', 'developer'],
                            location: 'Remote',
                            preferences: 'full-time'
                        })
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await client.extractJobQueryDetails('Looking for a JavaScript developer job remotely');

            expect(result).toEqual({
                keywords: ['javascript', 'developer'],
                location: 'Remote',
                preferences: 'full-time'
            });

            expect(mockChatCompletions.create).toHaveBeenCalledWith({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: expect.stringContaining('Looking for a JavaScript developer job remotely') }],
                max_tokens: 500,
                temperature: 0.3
            });
        });

        it('should handle response with missing fields and provide defaults', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            keywords: ['developer'],
                            // missing location and preferences
                        })
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await client.extractJobQueryDetails('Developer position');

            expect(result).toEqual({
                keywords: ['developer'],
                location: '',
                preferences: ''
            });
        });

        it('should handle response with invalid field types and provide defaults', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            keywords: 'not-an-array',
                            location: 123,
                            preferences: null
                        })
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await client.extractJobQueryDetails('Test input');

            expect(result).toEqual({
                keywords: [],
                location: '',
                preferences: ''
            });
        });

        it('should handle invalid JSON response', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: 'Invalid JSON response'
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'Invalid JSON response from AI'
            );
        });

        it('should handle missing response content', async () => {
            const mockResponse = {
                choices: [{
                    message: {}
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'Invalid response from OpenAI API: no content received'
            );
        });

        it('should handle OpenAI API errors', async () => {
            const apiError = new Error('API Error');
            apiError.code = 'insufficient_quota';

            mockChatCompletions.create.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'OpenAI quota exceeded. Please check your billing.'
            );
        });

        it('should handle rate limit error', async () => {
            const apiError = new Error('Rate limit exceeded');
            apiError.code = 'rate_limit_exceeded';

            mockChatCompletions.create.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'OpenAI rate limit exceeded. Please try again later.'
            );
        });

        it('should handle invalid API key error', async () => {
            const apiError = new Error('Invalid API key');
            apiError.code = 'invalid_api_key';

            mockChatCompletions.create.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'Invalid OpenAI API key. Please check your configuration.'
            );
        });

        it('should handle model not found error', async () => {
            const apiError = new Error('Model not found');
            apiError.code = 'model_not_found';

            mockChatCompletions.create.mockRejectedValue(apiError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                "Model 'gpt-3.5-turbo' not found. Please check your model configuration."
            );
        });

        it('should handle timeout error', async () => {
            const timeoutError = new Error('Request timeout');
            timeoutError.name = 'AbortError';

            mockChatCompletions.create.mockRejectedValue(timeoutError);

            await expect(client.extractJobQueryDetails('test input')).rejects.toThrow(
                'Request timeout. Please try again.'
            );
        });
    });

    describe('rankJobListings', () => {
        let client;
        const validConfig = { apiKey: 'test-key', model: 'gpt-3.5-turbo' };
        const sampleJobListings = [
            { id: '1', title: 'Frontend Developer', company: 'TechCorp' },
            { id: '2', title: 'Backend Developer', company: 'StartupInc' }
        ];

        beforeEach(() => {
            client = new OpenAIClient(validConfig);
        });

        it('should rank job listings successfully', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify([
                            {
                                id: '1',
                                ranking: 1,
                                title: 'Frontend Developer',
                                company: 'TechCorp',
                                reason: 'Perfect match for frontend skills'
                            },
                            {
                                id: '2',
                                ranking: 2,
                                title: 'Backend Developer',
                                company: 'StartupInc',
                                reason: 'Good match but requires backend skills'
                            }
                        ])
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await client.rankJobListings('frontend developer', sampleJobListings);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: '1',
                ranking: 1,
                title: 'Frontend Developer',
                company: 'TechCorp',
                reason: 'Perfect match for frontend skills'
            });

            expect(mockChatCompletions.create).toHaveBeenCalledWith({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: expect.stringContaining('frontend developer') }],
                max_tokens: 1500,
                temperature: 0.3
            });
        });

        it('should sanitize incomplete ranking data', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify([
                            {
                                id: '1',
                                // missing ranking, title, company, reason
                            },
                            {
                                // missing id
                                ranking: 'not-a-number',
                                title: 123,
                                company: null,
                                reason: undefined
                            }
                        ])
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await client.rankJobListings('test query', sampleJobListings);

            expect(result).toEqual([
                {
                    id: '1',
                    ranking: 1,
                    title: 'Unknown Title',
                    company: 'Unknown Company',
                    reason: 'No reason provided'
                },
                {
                    id: 'unknown_1',
                    ranking: 2,
                    title: 'Unknown Title',
                    company: 'Unknown Company',
                    reason: 'No reason provided'
                }
            ]);
        });

        it('should handle non-array response', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({ not: 'an array' })
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            await expect(client.rankJobListings('test query', sampleJobListings)).rejects.toThrow(
                'AI response is not a valid array'
            );
        });

        it('should handle context length exceeded error', async () => {
            const apiError = new Error('Context length exceeded');
            apiError.code = 'context_length_exceeded';

            mockChatCompletions.create.mockRejectedValue(apiError);

            await expect(client.rankJobListings('test query', sampleJobListings)).rejects.toThrow(
                'Job listings are too large. Please try with fewer listings.'
            );
        });

        it('should filter out invalid items and handle empty array', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify([
                            null,
                            'not-an-object',
                            undefined,
                            { id: 'valid', ranking: 1 }
                        ])
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await client.rankJobListings('test query', sampleJobListings);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('valid');
        });
    });

    describe('error logging', () => {
        let client;
        let consoleSpy;

        beforeEach(() => {
            client = new OpenAIClient({ apiKey: 'test-key', model: 'gpt-3.5-turbo' });
            consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should log JSON parsing errors', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: 'Invalid JSON'
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            await expect(client.extractJobQueryDetails('test')).rejects.toThrow();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to parse OpenAI response as JSON:',
                'Invalid JSON'
            );
        });

        it('should log unexpected errors', async () => {
            const unexpectedError = new Error('Unexpected error');
            mockChatCompletions.create.mockRejectedValue(unexpectedError);

            await expect(client.extractJobQueryDetails('test')).rejects.toThrow();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Unexpected error in extractJobQueryDetails:',
                unexpectedError
            );
        });
    });
});