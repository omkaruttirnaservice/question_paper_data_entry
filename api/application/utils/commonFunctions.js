export const sendSuccess = (res, data = '', usrMsg = '') => {
    res.status(200).json({
        success: 1,
        data: data,
        usrMsg,
    });
};

export const sendError = (res, usrMsg = '', error) => {
    res.status(500).json({
        success: 0,
        data: error || 'Server error',
        usrMsg,
    });
};
