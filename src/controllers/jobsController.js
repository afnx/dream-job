exports.getJobs = async (req, res) => {
    res.json({
        message: 'Jobs fetched successfully',
        data: [
            {
                id: 1,
                title: 'Software Engineer',
                company: 'Tech Company',
                location: 'Remote',
                description: 'Develop and maintain software applications.',
            },
            {
                id: 2,
                title: 'Data Scientist',
                company: 'Data Corp',
                location: 'New York, NY',
                description: 'Analyze and interpret complex data sets.',
            },
        ],
    });
};