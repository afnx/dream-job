const AIClient = require('../../../src/services/ai/ai-client'); // Adjust the path as necessary

// Mock concrete implementation for testing
class MockAIClient extends AIClient {
  constructor(config) {
    super(config);
  }

  async extractJobQueryDetails(userInput) {
    if (!userInput || typeof userInput !== 'string') {
      throw new Error('Invalid user input');
    }
    return {
      keywords: ['software', 'engineer'],
      location: 'San Francisco',
      experience: 'mid-level',
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: 'USD',
      jobType: 'full-time',
      remoteOption: 'remote',
      otherPreferences: ['flexible hours', 'health benefits'],
    };
  }

  async rankJobListings(userQuery, jobListings) {
    if (!userQuery || !Array.isArray(jobListings)) {
      throw new Error('Invalid parameters');
    }
    return jobListings.map((job, index) => ({
      id: job.id || `job_${index}`,
      ranking: index + 1,
      title: job.title || 'Unknown Title',
      company: job.company || 'Unknown Company',
      reason: 'Mock ranking reason'
    }));
  }
}

describe('AIClient', () => {
  describe('Constructor', () => {
    test('should throw error when no config is provided', () => {
      expect(() => new AIClient()).toThrow('AIClient requires a configuration object.');
    });

    test('should throw error when null config is provided', () => {
      expect(() => new AIClient(null)).toThrow('AIClient requires a configuration object.');
    });

    test('should throw error when undefined config is provided', () => {
      expect(() => new AIClient(undefined)).toThrow('AIClient requires a configuration object.');
    });

    test('should successfully create instance with valid config', () => {
      const config = { provider: 'test', apiKey: 'test-key' };
      const client = new AIClient(config);
      expect(client).toBeInstanceOf(AIClient);
      expect(client.config).toEqual(config);
    });

    test('should store config object correctly', () => {
      const config = { provider: 'openai', apiKey: 'sk-test', model: 'gpt-3.5-turbo' };
      const client = new AIClient(config);
      expect(client.config).toBe(config);
    });
  });

  describe('Abstract Methods', () => {
    let client;

    beforeEach(() => {
      client = new AIClient({ provider: 'test' });
    });

    test('extractJobQueryDetails should throw "Not implemented" error', async () => {
      await expect(client.extractJobQueryDetails('test input')).rejects.toThrow('extractJobQueryDetails() not implemented.');
    });

    test('rankJobListings should throw "Not implemented" error', async () => {
      const userQuery = { keywords: ['developer'] };
      const jobListings = [{ id: '1', title: 'Developer' }];
      await expect(client.rankJobListings(userQuery, jobListings)).rejects.toThrow('rankJobListings() not implemented.');
    });
  });

  describe('Interface Contract for Concrete Implementations', () => {
    let mockClient;

    beforeEach(() => {
      mockClient = new MockAIClient({ provider: 'mock', apiKey: 'test-key' });
    });

    describe('extractJobQueryDetails', () => {
      test('should return object with required fields for valid input', async () => {
        const userInput = 'Looking for software engineer jobs in San Francisco with mid-level experience and a salary between 80k and 120k. Full-time remote options preferred. Flexible hours and health benefits are a plus.';
        const result = await mockClient.extractJobQueryDetails(userInput);

        expect(result).toHaveProperty('keywords');
        expect(result).toHaveProperty('location');
        expect(result).toHaveProperty('experience');
        expect(result).toHaveProperty('salaryMin');
        expect(result).toHaveProperty('salaryMax');
        expect(result).toHaveProperty('salaryCurrency');
        expect(result).toHaveProperty('jobType');
        expect(result).toHaveProperty('remoteOption');
        expect(result).toHaveProperty('otherPreferences');
        expect(Array.isArray(result.keywords)).toBe(true);
        expect(typeof result.location).toBe('string');
        expect(typeof result.experience).toBe('string');
        expect(typeof result.salaryMin).toBe('number');
        expect(typeof result.salaryMax).toBe('number');
        expect(typeof result.salaryCurrency).toBe('string');
        expect(typeof result.jobType).toBe('string');
        expect(typeof result.remoteOption).toBe('string');
        expect(Array.isArray(result.otherPreferences)).toBe(true);
      });

      test('should handle invalid input gracefully', async () => {
        await expect(mockClient.extractJobQueryDetails('')).rejects.toThrow('Invalid user input');
        await expect(mockClient.extractJobQueryDetails(null)).rejects.toThrow('Invalid user input');
        await expect(mockClient.extractJobQueryDetails(123)).rejects.toThrow('Invalid user input');
      });

      test('should return consistent structure', async () => {
        const result = await mockClient.extractJobQueryDetails('test input');
        expect(result).toMatchObject({
          keywords: expect.any(Array),
          location: expect.any(String),
          experience: expect.any(String),
          salaryMin: expect.any(Number),
          salaryMax: expect.any(Number),
          salaryCurrency: expect.any(String),
          jobType: expect.any(String),
          remoteOption: expect.any(String),
          otherPreferences: expect.any(Array)
        });
      });
    });

    describe('rankJobListings', () => {
      test('should return array of ranked jobs with required fields', async () => {
        const userQuery = { keywords: ['developer'], location: 'SF' };
        const jobListings = [
          { id: '1', title: 'Senior Developer', company: 'Tech Corp' },
          { id: '2', title: 'Junior Developer', company: 'Startup Inc' }
        ];

        const result = await mockClient.rankJobListings(userQuery, jobListings);

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);

        result.forEach(rankedJob => {
          expect(rankedJob).toHaveProperty('id');
          expect(rankedJob).toHaveProperty('ranking');
          expect(rankedJob).toHaveProperty('title');
          expect(rankedJob).toHaveProperty('company');
          expect(rankedJob).toHaveProperty('reason');
          expect(typeof rankedJob.ranking).toBe('number');
        });
      });

      test('should handle empty job listings', async () => {
        const userQuery = { keywords: ['developer'] };
        const result = await mockClient.rankJobListings(userQuery, []);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
      });

      test('should handle invalid parameters', async () => {
        const userQuery = { keywords: ['developer'] };

        await expect(mockClient.rankJobListings(null, [])).rejects.toThrow('Invalid parameters');
        await expect(mockClient.rankJobListings(userQuery, null)).rejects.toThrow('Invalid parameters');
        await expect(mockClient.rankJobListings(userQuery, 'not-array')).rejects.toThrow('Invalid parameters');
      });

      test('should maintain job data integrity', async () => {
        const userQuery = { keywords: ['developer'] };
        const jobListings = [
          { id: 'job1', title: 'React Developer', company: 'Meta' }
        ];

        const result = await mockClient.rankJobListings(userQuery, jobListings);

        expect(result[0].id).toBe('job1');
        expect(result[0].title).toBe('React Developer');
        expect(result[0].company).toBe('Meta');
      });
    });
  });

  describe('Provider Agnostic Behavior', () => {
    test('should work with different config structures', () => {
      const configs = [
        { provider: 'openai', apiKey: 'sk-test', model: 'gpt-4' },
        { provider: 'claude', apiKey: 'claude-key', version: 'v1' },
        { provider: 'custom', endpoint: 'https://api.custom.com', token: 'token123' }
      ];

      configs.forEach(config => {
        expect(() => new MockAIClient(config)).not.toThrow();
        const client = new MockAIClient(config);
        expect(client.config).toEqual(config);
      });
    });

    test('should maintain consistent interface regardless of provider', async () => {
      const providers = ['openai', 'claude', 'custom'];

      for (const provider of providers) {
        const client = new MockAIClient({ provider, apiKey: 'test' });

        // Test extractJobQueryDetails interface
        const extractResult = await client.extractJobQueryDetails('test query');
        expect(extractResult).toHaveProperty('keywords');
        expect(extractResult).toHaveProperty('location');
        expect(extractResult).toHaveProperty('experience');
        expect(extractResult).toHaveProperty('salaryMin');
        expect(extractResult).toHaveProperty('salaryMax');
        expect(extractResult).toHaveProperty('salaryCurrency');
        expect(extractResult).toHaveProperty('jobType');
        expect(extractResult).toHaveProperty('remoteOption');
        expect(extractResult).toHaveProperty('otherPreferences');

        // Test rankJobListings interface
        const rankResult = await client.rankJobListings(
          { keywords: ['test'] },
          [{ id: '1', title: 'Test Job' }]
        );
        expect(Array.isArray(rankResult)).toBe(true);
        if (rankResult.length > 0) {
          expect(rankResult[0]).toHaveProperty('id');
          expect(rankResult[0]).toHaveProperty('ranking');
          expect(rankResult[0]).toHaveProperty('title');
          expect(rankResult[0]).toHaveProperty('company');
          expect(rankResult[0]).toHaveProperty('reason');
        }
      }
    });
  });
});