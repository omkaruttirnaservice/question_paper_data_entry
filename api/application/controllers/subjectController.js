import subjectModel from '../model/subjectModel.js';

const subjectController = {
    getSubjectList: async (_, res) => {
        try {
            let response = await subjectModel.getSubjectList();
            response = response[0].map((subject) => {
                return subject.subject_name;
            });
            sendSuccess(res, response);
        } catch (error) {
            sendError(res, error);
        }
    },
    addSubject: async (req, res) => {
        try {
            let { subjectName } = req.body;
            let response = await subjectModel.addSubject(subjectName);
            if (response[0].affectedRows === 1) {
                sendSuccess(res);
            } else {
                throw new Error('Data not inserted');
            }
        } catch (error) {
            sendError(res, error);
        }
    },
};

function sendSuccess(res, data = '') {
    res.status(200).json({
        success: 1,
        data,
    });
}

function sendError(res, error) {
    res.status(500).json({
        success: 0,
        error,
    });
}
export default subjectController;
