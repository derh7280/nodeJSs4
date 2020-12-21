const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;

if (process.env.NODE_ENV === 'production') {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }

    mailConfig = sgTransport(options);

} else {
    if (process.env.NODE_ENV === 'staging') {
        console.log('xxxxxxxxxxxxx');
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        }

        mailConfig = sgTransport(options);

    } else {
        // Development
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PWD
            }
        };
    }
}

// const mailConfig = {
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'flo.sanford97@ethereal.email',
//         pass: 'ZPe3NjTzxYCkcnRH88'
//     }
// };

module.exports = nodemailer.createTransport(mailConfig);