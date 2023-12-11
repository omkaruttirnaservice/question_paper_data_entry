export const sendSuccess = (res, data = '') => {
    res.status(200).json({
        success: 1,
        data,
    });
};

export const sendError = (res, error) => {
    res.status(500).json({
        success: 0,
        error,
    });
};
