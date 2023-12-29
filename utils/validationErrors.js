const displayValidationErrors = (errors, res) => {

    return res.status(400).json({
        status: "fail",
        message: "validation errors",
        errors: errors.array({ onlyFirstError: true })
    })
}


module.exports = displayValidationErrors