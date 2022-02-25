const nodemailer = require('nodemailer')
const { emailService, emailUsername, emailPassword, emailFrom } = require('../../config/vars')

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: emailUsername,
            pass: emailPassword
        }
    })

    const mailOptions = {
        from: emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}

module.exports = sendEmail