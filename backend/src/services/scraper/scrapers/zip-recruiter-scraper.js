const BaseScraper = require('./base-scraper');
const ZipRecruiterAdapter = require('../../../utils/scraper/site-adapters/zip-recruiter-adapter');
const { getBrowser } = require('../../../utils/scraper/browser-manager');
const { createStealthContext } = require('../../../utils/scraper/core/context-factory');
const { ERROR_TYPES, ScraperServiceError } = require('../../../utils/errors');
const { randomDelay, humanDelay } = require('../../../utils/scraper/core/timing-utils');
const { buildIdSelector } = require('../../../utils/scraper/selectors/selector-utils');
const { parseRelativeDate } = require('../../../utils/scraper/extractors/date-extractors');
const { extractSalary, extractJobType, determineRemoteOption } = require('../../../utils/scraper/extractors/text-extractors');
const { extractText, extractHTML, extractLink, findTextByCondition } = require('../../../utils/scraper/extractors/content-extractors');
const { injectPageUtilities } = require('../../../utils/scraper/core/page-utils');


/**
 * ZipRecruiterScraper is a service class for scraping job listings from ZipRecruiter.
 *
 * @class
 * @extends BaseScraper
 *
 * @param {Object} [options={}] - Configuration options for the scraper.
 */
class ZipRecruiterScraper extends BaseScraper {
    constructor(options = {}) {
        super(options);
        this.baseUrl = 'https://www.ziprecruiter.com/jobs-search';

        this.selectors = {
            jobCards: 'article[id^="job-card-"], div[id^="job-card-"]',
            rightPane: 'div[data-testid="right-pane"]',
            title: 'h1.text-header-md',
            company: 'a.text-link, a[aria-label]',
            location: 'p.text-body-md',
            postedDate: 'p.text-body-md',
            details: 'div.flex.gap-x-12 p.text-body-md',
            description: 'div.text-primary.whitespace-pre-line',
            applyLink: 'a[aria-label="Apply"]',
            companyAbout: 'article[data-testid="zds-company-description"] p'
        };
    }

    /**
     * Scrapes job listings from ZipRecruiter based on the provided query.
     * 
     * @async
     * @param {Object} query - The search query parameters used to build the ZipRecruiter URL.
     * @returns {Promise<Array<Object>>} Resolves to an array of job objects, each containing:
     *   - {string} title - The job title.
     *   - {string} company - The company name.
     *   - {string} location - The job location.
     *   - {string} remoteOption - Indicates if the job is remote (e.g., 'remote' or '').
     *   - {string} salary - The salary information, if available.
     *   - {string} jobType - The type of job (e.g., 'full-time', 'part-time').
     *   - {string} descriptionHTML - The job description in HTML format.
     *   - {string} description - The plain text job description.
     *   - {string} postedDate - The ISO date string representing when the job was posted.
     *   - {string} applyLink - The direct application link for the job.
     *   - {string} companyAbout - Information about the company.
     * @throws {ScraperServiceError} Throws if scraping fails or an internal error occurs.
     */
    async scrape(query) {
        const browser = await getBrowser();
        let context;

        try {
            context = await createStealthContext(browser, {
                isMobile: false,
            });

            const page = await context.newPage();

            // Inject utilities into browser context
            await injectPageUtilities(page);

            const adapter = new ZipRecruiterAdapter(page, this.selectors);

            // Random delay to avoid detection
            await randomDelay(500, 1500);

            const url = this.buildUrl(query);
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            await adapter.dismissOverlays();
            await adapter.simulateActivity();

            await adapter.waitForJobElements();

            const jobElementIds = await adapter.getJobElementIds();

            console.log(`[ZipRecruiterScraper] Found ${jobElementIds.length} possible jobs.`);

            const jobs = [];

            for (const elementId of jobElementIds) {
                const job = await this.extractJob(page, elementId);
                if (job) {
                    jobs.push(job);
                }

                await randomDelay(200, 500);
            }

            console.log(`[ZipRecruiterScraper] Scraping completed. Extracted ${jobs.length} jobs.`);

            return jobs;
        } catch (error) {
            throw new ScraperServiceError(
                ERROR_TYPES.INTERNAL_SERVER_ERROR,
                `Failed to scrape ZipRecruiter results: ${error.message}`,
                502,
            );

        } finally {
            if (context) {
                await context.close();
            }
        }
    }

    /**
     * Extracts job details from a job element on the ZipRecruiter page.
     *
     * @async
     * @param {import('playwright').Page} page - The Playwright page instance to operate on.
     * @param {string} elementId - The DOM element ID of the job element to extract.
     * @returns {Promise<Object|null>} A promise that resolves to an object containing job details, or null if extraction fails.
     */
    async extractJob(page, elementId) {
        const element = await page.$(buildIdSelector(elementId));
        if (!element) return null;

        await element.scrollIntoViewIfNeeded();
        await humanDelay('scroll');

        // Try to click the job title button inside the element
        await element.click({ position: { x: 10, y: 10 }, clickCount: 2 });

        // Wait for the job details to load
        await page.waitForSelector(
            `${this.selectors.rightPane} ${this.selectors.title}`,
            { timeout: 10000 }
        );

        const job = await this.extractJobData(page);

        if (job) {
            const jobIdMatch = elementId.match(/job-card-(.+)/);
            if (jobIdMatch) job.jobId = jobIdMatch[1];

            job.jobUrl = page.url();

        }

        return job;
    }

    /**
     * Extracts job data from the given page using specified selectors and utility functions.
     *
     * @async
     * @param {import('playwright').Page} page - The Playwright page instance to extract job data from.
     * @returns {Promise<{
     *   title: string,
     *   company: string,
     *   location: string,
     *   remoteOption: string,
     *   salary: string,
     *   jobType: string,
     *   descriptionHTML: string,
     *   description: string,
     *   postedDate: string,
     *   applyLink: string,
     *   companyAbout: string
     * } | null>} Resolves with an object containing extracted job data, or null if the job panel is not found.
     */
    async extractJobData(page) {
        return page.evaluate(([selectors]) => {
            const panel = document.querySelector(selectors.rightPane);
            if (!panel) return null;

            const title = extractText(panel, selectors.title);
            const company = extractText(panel, selectors.company);
            const locationText = extractText(panel, selectors.location);

            const location = locationText;
            const remoteOption = determineRemoteOption(locationText);

            // Extract salary and job type from detail elements
            const salary = findTextByCondition(panel, selectors.details,
                text => extractSalary(text));
            const jobType = findTextByCondition(panel, selectors.details,
                text => extractJobType(text));

            const descriptionHTML = extractHTML(panel, selectors.description);
            const description = descriptionHTML
                ? descriptionHTML.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
                : '';

            const applyLink = extractLink(panel, selectors.applyLink);
            const companyAbout = extractText(panel, selectors.companyAbout);

            // Extract posted date
            let postedDate = '';
            const postedText = findTextByCondition(panel, selectors.postedDate,
                text => /Posted\s/.test(text));
            if (postedText) {
                postedDate = parseRelativeDate(postedText);
            }

            return {
                title, company, location, remoteOption, salary, jobType,
                descriptionHTML, description, postedDate, applyLink, companyAbout
            };
        }, [this.selectors]);
    }

    /**
     * Builds a ZipRecruiter search URL based on the provided query parameters.
     *
     * @param {Object} query - The search query parameters.
     * @param {string} query.keywords - The keywords to search for.
     * @param {string} query.location - The location to search in.
     * @param {number} [query.page] - The page number for pagination (currently unused).
     * @returns {string} The constructed search URL.
     */
    buildUrl(query) {
        const { keywords, location } = query;
        const params = new URLSearchParams({
            search: keywords,
            location: location,
        });
        return `${this.baseUrl}?${params.toString()}`;
    }
}

module.exports = ZipRecruiterScraper;
