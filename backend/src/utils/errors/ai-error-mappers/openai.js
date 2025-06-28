const { AIServiceError, ERROR_TYPES } = require('../index');

function mapOpenAIError(error, config, context = 'OpenAI operation failed') {
    if (error.code === 'insufficient_quota') {
        return new AIServiceError(
            ERROR_TYPES.QUOTA_EXCEEDED,
            'OpenAI quota exceeded. Please check your billing.',
            429
        );
    } else if (error.code === 'invalid_api_key') {
        return new AIServiceError(
            ERROR_TYPES.AI_INVALID_API_KEY,
            'Invalid OpenAI API key. Please check your configuration.',
            401
        );

    } else if (error.code === 'model_not_found') {
        return new AIServiceError(
            ERROR_TYPES.AI_MODEL_NOT_FOUND,
            `Model '${config.model}' not found. Please check your model configuration.`,
            400
        );

    } else if (error.code === 'rate_limit_exceeded') {
        return new AIServiceError(
            ERROR_TYPES.RATE_LIMIT_EXCEEDED,
            'OpenAI rate limit exceeded. Please try again later.',
            429
        );

    } else if (error.name === 'AbortError') {
        return new AIServiceError(
            ERROR_TYPES.TIMEOUT,
            'Request timeout. Please try again.',
            504
        );

    }

    // Re-throw our custom errors
    if (error.message.includes('Invalid user input') ||
        error.message.includes('not configured') ||
        error.message.includes('Invalid JSON response') ||
        error.message.includes('AI response is not valid')) {
        return error;
    }

    return new AIServiceError(
        ERROR_TYPES.EXTERNAL_SERVICE_ERROR,
        `${context}: ${error.message}`,
        502
    );
}

module.exports = mapOpenAIError;