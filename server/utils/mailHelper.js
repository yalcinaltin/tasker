/**
 * Created by yalcinaltin on 10.12.2016.
 */
const fs = require('fs');
const nodemailer = require('nodemailer');
const smtpConfig = JSON.parse(fs.readFileSync('./config/mailConfig.json')).smtpConfig;
const transporter = nodemailer.createTransport(smtpConfig);
const pug = require('pug');

var mailHelper = (function () {
    let mailList = {};
    mailList.USD = (data)=>{
        return new Promise(resolve => {
            let mailTemplate = pug.renderFile('./server/mailTemplates/usdTemplate.pug', data);
            let mailOptions = {
                from: '"SpeedFreak" <speedfreak.11@gmail.com>',
                to: 'cemalyalcinaltin@gmail.com',
                subject: '✔ $ is updated',
                html: mailTemplate
            };
            resolve(mailOptions);
        });
    };

    let sendMail = (mail,data) => {
        mailList[mail](data).then(mailOptions=>{
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
        });
    };
    return {
        sendMail: sendMail
    }
})();

module.exports = mailHelper;