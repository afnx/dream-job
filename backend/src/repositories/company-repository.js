const BaseRepository = require('./base-repository');

/**
 * Repository class for managing Company entities.
 * Extends the BaseRepository to provide CRUD operations specific to companies.
 *
 * @class
 * @extends BaseRepository
 */
class CompanyRepository extends BaseRepository {
    constructor() {
        super('Company');
    }

    /**
     * Creates a new company record in the repository.
     *
     * @async
     * @param {Object} company - The company object to create.
     * @param {string} company.name - The name of the company (required).
     * @param {string} [company.description] - The description of the company.
     * @param {string} [company.location] - The location of the company.
     * @param {string} [company.website] - The website URL of the company.
     * @param {string} [company.logoUrl] - The logo URL of the company.
     * @throws {Error} If the input is invalid or missing required properties.
     * @returns {Promise<Object>} The created company object.
     */
    async createCompany(company) {
        if (!company || typeof company !== 'object' || !company.name) {
            throw new Error('Invalid input: company must be an object with a name property');
        }
        const newCompany = await this.create({
            name: company.name,
            description: company.description || null,
            location: company.location || null,
            website: company.website || null,
            logoUrl: company.logoUrl || null
        });
        return newCompany;
    }

    /**
     * Finds a company by its name in a case-insensitive manner.
     *
     * @async
     * @param {string} name - The name of the company to search for. Must be a non-empty string.
     * @returns {Promise<Object|null>} The company object if found, or null if not found.
     * @throws {Error} If the input name is not a non-empty string.
     */
    async findCompanyByName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Invalid input: name must be a non-empty string');
        }

        return await this.findFirst({
            name: {
                equals: name,
                mode: 'insensitive'
            },
        });
    }
}

module.exports = CompanyRepository;