module.exports.handler = (err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).json({ data: {}, meta: { message: err.message, flag: "FAIL", statusCode: statusCode } })
}