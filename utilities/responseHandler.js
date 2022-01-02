exports.responseHandler = (
    res,
    message,
    statusCode,
    data = {},
    error = true
) => {
    res.status(statusCode).json({
        error,
        message,
        data
    })
}