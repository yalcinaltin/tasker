/**
 * Created by yalcinaltin on 10.12.2016.
 */
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpConfig = JSON.parse(fs.readFileSync('./config/mailConfig.json')).smtpConfig;
var transporter = nodemailer.createTransport(smtpConfig);

var mailHelper = (function () {
    let mailOptions = {
        from: '"SpeedFreak" <speedfreak.11@gmail.com>',
        to: 'cemalyalcinaltin@gmail.com',
        subject: 'Hello ✔',
        html: '<b>Hello world ? &#10004;</b>'
    };
    let sendMail = () => {
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    };
    return {
        sendMail: sendMail
    }
})();

module.exports = mailHelper;