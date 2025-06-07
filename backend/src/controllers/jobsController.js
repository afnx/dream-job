
const prisma = require('../db');


exports.getJobs = async (req, res) => {
    const allJobs = await prisma.job.findMany();
    res.json(allJobs);
};