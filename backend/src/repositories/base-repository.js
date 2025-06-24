const prisma = require('../db');

/**
 * BaseRepository provides generic CRUD operations and transaction support for Prisma models.
 * 
 * @class
 * @param {object} model - The Prisma model name as a string.
 * 
 * @property {string} model - The name of the Prisma model to operate on.
 */
class BaseRepository {
    #prisma;

    constructor(model) {
        this.#prisma = prisma;
        this.model = model;
    }

    /**
     * Finds a record by its unique identifier.
     *
     * @async
     * @param {number|string} id - The unique identifier of the record to find.
     * @returns {Promise<Object|null>} The found record, or null if not found.
     * @throws {Error} If an error occurs during the database query.
     */
    async findById(id) {
        try {
            return await this.#prisma[this.model].findUnique({
                where: { id }
            });
        } catch (error) {
            throw new Error(`Error finding ${this.model} by ID: ${error.message}`);
        }
    }

    /**
     * Finds the first record that matches the specified criteria.
     *
     * @async
     * @param {Object} [where={}] - The filter criteria for the query.
     * @param {Object} [options={}] - Additional options to pass to the Prisma query.
     * @returns {Promise<Object|null>} The found record or null if no record matches.
     * @throws {Error} If an error occurs during the query.
     */
    async findFirst(where = {}, options = {}) {
        try {
            return await this.#prisma[this.model].findFirst({
                where,
                ...options
            });
        } catch (error) {
            throw new Error(`Error finding ${this.model}: ${error.message}`);
        }
    }

    /**
     * Retrieves multiple records from the database for the specified model.
     *
     * @async
     * @param {Object} [where={}] - The filter criteria for querying records.
     * @param {Object} [options={}] - Additional Prisma query options (e.g., select, include, orderBy, etc.).
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of records matching the criteria.
     * @throws {Error} If an error occurs during the database query.
     */
    async findMany(where = {}, options = {}) {
        try {
            return await this.#prisma[this.model].findMany({
                where,
                ...options
            });
        } catch (error) {
            throw new Error(`Error finding ${this.model}s: ${error.message}`);
        }
    }

    /**
     * Creates a new record in the database for the specified model.
     *
     * @async
     * @param {Object} data - The data to create the new record with.
     * @returns {Promise<Object>} The created record.
     * @throws {Error} If there is an error during creation.
     */
    async create(data) {
        try {
            return await this.#prisma[this.model].create({
                data
            });
        } catch (error) {
            throw new Error(`Error creating ${this.model}: ${error.message}`);
        }
    }

    /**
     * Creates multiple records in the database for the specified model.
     *
     * @async
     * @param {Array<Object>} data - An array of objects representing the records to be created.
     * @returns {Promise<Object>} The result of the createMany operation.
     * @throws {Error} If an error occurs during the creation process.
     */
    async createMany(data) {
        try {
            return await this.#prisma[this.model].createMany({
                data
            });
        } catch (error) {
            throw new Error(`Error creating many ${this.model}s: ${error.message}`);
        }
    }

    /**
     * Updates a record in the database for the specified model by its ID.
     *
     * @async
     * @param {number|string} id - The unique identifier of the record to update.
     * @param {Object} data - The data to update the record with.
     * @returns {Promise<Object>} The updated record.
     * @throws {Error} If an error occurs during the update operation.
     */
    async update(id, data) {
        try {
            return await this.#prisma[this.model].update({
                where: { id },
                data
            });
        } catch (error) {
            throw new Error(`Error updating ${this.model}: ${error.message}`);
        }
    }

    /**
     * Deletes a record from the database by its unique identifier.
     *
     * @async
     * @param {number|string} id - The unique identifier of the record to delete.
     * @returns {Promise<Object>} The deleted record.
     * @throws {Error} If an error occurs during deletion.
     */
    async delete(id) {
        try {
            return await this.#prisma[this.model].delete({
                where: { id }
            });
        } catch (error) {
            throw new Error(`Error deleting ${this.model}: ${error.message}`);
        }
    }

    /**
     * Counts the number of records in the database that match the specified conditions.
     *
     * @async
     * @param {Object} [where={}] - The filter conditions for counting records.
     * @returns {Promise<number>} The count of records matching the filter.
     * @throws {Error} If an error occurs during the count operation.
     */
    async count(where = {}) {
        try {
            return await this.#prisma[this.model].count({ where });
        } catch (error) {
            throw new Error(`Error counting ${this.model}s: ${error.message}`);
        }
    }

    /**
     * Executes a series of database operations within a transaction.
     *
     * @param {Function[]} operations - An array of functions representing the operations to be executed within the transaction.
     * @returns {Promise<*>} The result of the transaction.
     * @throws {Error} If the transaction fails, an error is thrown with a descriptive message.
     */
    async transaction(operations) {
        try {
            return await this.#prisma.$transaction(operations);
        } catch (error) {
            throw new Error(`Transaction failed: ${error.message}`);
        }
    }

    /**
     * Disconnects the Prisma client from the database.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the client has disconnected.
     */
    async disconnect() {
        await this.#prisma.$disconnect();
    }
}

module.exports = BaseRepository;