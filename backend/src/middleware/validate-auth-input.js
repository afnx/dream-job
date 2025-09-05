const { ERROR_TYPES, ValidationError } = require('../utils/errors/index');

exports.validateSignIn = (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!email) {
        errors.push({
            type: ERROR_TYPES.REQUIRED_FIELD,
            field: "email",
            message: "Email is required"
        });
    } else {
        // Check if email is a string
        if (typeof email !== "string") {
            errors.push({
                type: ERROR_TYPES.INVALID_VALUE,
                field: "email",
                message: "Email must be a string"
            });
        } else {
            // Trim and check for empty string
            if (email.trim() === "") {
                errors.push({
                    type: ERROR_TYPES.REQUIRED_FIELD,
                    field: "email",
                    message: "Email cannot be empty"
                });
            }
            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push({
                    type: ERROR_TYPES.INVALID_FORMAT,
                    field: "email",
                    message: "Email format is invalid"
                });
            }
        }
    }

    if (errors.length > 0) {
        return next(new ValidationError(errors));
    }

    next();
};

exports.validateConfirmSignIn = (req, res, next) => {
    const { email, code, session } = req.body;
    const errors = [];

    if (!email) {
        errors.push({
            type: ERROR_TYPES.REQUIRED_FIELD,
            field: "email",
            message: "Email is required"
        });
    } else {
        // Check if email is a string
        if (typeof email !== "string") {
            errors.push({
                type: ERROR_TYPES.INVALID_VALUE,
                field: "email",
                message: "Email must be a string"
            });
        } else {
            // Trim and check for empty string
            if (email.trim() === "") {
                errors.push({
                    type: ERROR_TYPES.REQUIRED_FIELD,
                    field: "email",
                    message: "Email cannot be empty"
                });
            }
            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push({
                    type: ERROR_TYPES.INVALID_FORMAT,
                    field: "email",
                    message: "Email format is invalid"
                });
            }
        }
    }

    if (!code) {
        errors.push({
            type: ERROR_TYPES.REQUIRED_FIELD,
            field: "code",
            message: "Code is required"
        });
    } else {
        // Check if code is a string
        if (typeof code !== "string") {
            errors.push({
                type: ERROR_TYPES.INVALID_VALUE,
                field: "code",
                message: "Code must be a string"
            });
        } else {
            // Trim and check for empty string
            if (code.trim() === "") {
                errors.push({
                    type: ERROR_TYPES.REQUIRED_FIELD,
                    field: "code",
                    message: "Code cannot be empty"
                });
            }
            // Check code length
            if (code.length !== 8) {
                errors.push({
                    type: ERROR_TYPES.INVALID_FORMAT,
                    field: "code",
                    message: "Code must be 8 digits"
                });
            }
        }
    }

    if (!session) {
        errors.push({
            type: ERROR_TYPES.REQUIRED_FIELD,
            field: "session",
            message: "Session is required"
        });
    } else {
        // Check if session is a string
        if (typeof session !== "string") {
            errors.push({
                type: ERROR_TYPES.INVALID_VALUE,
                field: "session",
                message: "Session must be a string"
            });
        } else {
            // Trim and check for empty string
            if (session.trim() === "") {
                errors.push({
                    type: ERROR_TYPES.REQUIRED_FIELD,
                    field: "session",
                    message: "Session cannot be empty"
                });
            }
        }
    }

    if (errors.length > 0) {
        return next(new ValidationError(errors));
    }

    next();
};  