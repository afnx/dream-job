const AIService = require('../../../src/services/ai/ai-service');
const OpenAIClient = require('../../../src/services/ai/openai-client');

// Mock the OpenAIClient
jest.mock('../../../src/services/ai/openai-client');

describe('AIService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize with valid config', () => {
            const config = { provider: 'openai', apiKey: 'test-key', model: 'gpt-3.5-turbo' };
            const service = new AIService(config);

            expect(service.config).toBe(config);
            expect(service.aiProvider).toBe('openai');
        });

        it('should convert provider to lowercase', () => {
            const config = { provider: 'OPENAI', apiKey: 'test-key', model: 'gpt-3.5-turbo' };
            const service = new AIService(config);

            expect(service.aiProvider).toBe('openai');
        });

        it('should throw error when config is missing', () => {
            expect(() => new AIService()).toThrow(
                'AIService is not configured properly. Please provide a provider.'
            );
        });

        it('should throw error when provider is missing', () => {
            const config = { apiKey: 'test-key', model: 'gpt-3.5-turbo' };
            expect(() => new AIService(config)).toThrow(
                'AIService is not configured properly. Please provide a provider.'
            );
        });
    });

    describe('getAIClient', () => {
        it('should return OpenAIClient for openai provider', () => {
            const config = { provider: 'openai', apiKey: 'test-key', model: 'gpt-3.5-turbo' };
            const service = new AIService(config);

            const client = service.getAIClient();

            expect(OpenAIClient).toHaveBeenCalledWith(config);
            expect(client).toBeInstanceOf(OpenAIClient);
        });

        it('should throw error for unsupported provider', () => {
            const config = { provider: 'unsupported', apiKey: 'test-key', model: 'test-model' };
            const service = new AIService(config);

            expect(() => service.getAIClient()).toThrow(
                `Unsupported AI provider: ${config.provider}`
            );
        });
    });
});