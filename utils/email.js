const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    //create a tranporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        // Activate in gmail "less secure app" option
        // tls: {
        //     rejectUnauthorized: false
        // }
    });
    const message = {
        from: 'vu the hoc',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html: '<h1>Hello world?</h1>'
    };
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info;
};

module.exports = sendEmail