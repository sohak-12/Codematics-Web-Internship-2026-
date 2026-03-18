// Backend/utils/responseHandler.js
exports.success = (res, data, message = "Success") => {
    res.status(200).json({ success: true, message, data });
};

exports.error = (res, message = "Server Error", statusCode = 500) => {
    res.status(statusCode).json({ success: false, message });
};