import subjectModel from '../model/subjectModel.js';
import { sendSuccess, sendError } from '../utils/commonFunctions.js';
const subjectController = {
    getSubjectList: async (_, res) => {
        try {
            const response = await subjectModel.getSubjectList();
            sendSuccess(res, response);
        } catch (error) {
            sendError(res, error);
        }
    },
    addSubject: async (req, res) => {
        try {
            const { subjectName } = req.body;
            const response = await subjectModel.addSubject(subjectName);
            if (response[0].affectedRows === 1) {
                sendSuccess(res);
            } else {
                throw new Error('Data not inserted');
            }
        } catch (error) {
            sendError(res, error);
        }
    },

    postEditSubjectName: async (req, res) => {
        try {
            const { newSubjectName, subjectId } = req.body;
            const response = await subjectModel.postEditSubjectName(newSubjectName, subjectId);
            if (response[0].affectedRows === 1) {
                sendSuccess(res);
            }
        } catch (error) {
            sendError(res, error);
        }
    },

    deleteSubject: async function (req, res) {
        try {
            const { subjectId } = req.body;
            const response = await subjectModel.deleteSubject(subjectId);
            if (response[0].affectedRows === 1) {
                sendSuccess(res);
            }
        } catch (error) {
            sendError(res, error);
        }
    },

    getTopicList: async function (req, res) {
        try {
            const subjectId = req.body.subjectId;
            const response = await subjectModel.getTopicList(subjectId);
            sendSuccess(res, response[0]);
        } catch (error) {
            sendError(res, error);
        }
    },

    addTopic: async function (req, res) {
        try {
            const data = req.body;
            const response = await subjectModel.addTopic(data);
            sendSuccess(res, response[0]);
        } catch (error) {
            sendError(res, error);
        }
    },
};

export default subjectController;
