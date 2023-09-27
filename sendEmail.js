import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
// import sass from "sass"
const winston = require('winston');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

  module.exports = async (emailData) => {
    try {
      const templateDirectory = path.join(process.cwd(), 'emails', 'EmailTemplate');
      const templatePath = path.join(templateDirectory, 'email-template.html');
    //   const sassFilePath = path.join(templateDirectory, 'styles.scss');
  
      // Read HTML template
      const template = fs.readFileSync(templatePath, 'utf-8');
  
      // Compile Sass styles
    //   const sassResult = sass.renderSync({
    //     file: sassFilePath,
    //     outputStyle: 'compressed' // Use 'compressed' for minified styles
    //   });
  
      const emailContent = template
        
        .replace('{{name}}', emailData.name)
        .replace('{{sender}}', emailData.sender)
        .replace('{{recipient}}', emailData.recipient)
        .replace('{{subject}}', emailData.subject)
        .replace('{{content}}', emailData.content);
  
      await transporter.sendMail({
        from: '"IntellisirnPortfolio" <roggersog@gmail.com>',
        to: emailData.recipient,
        subject: emailData.subject,
        html: emailContent,
        // attachments: [
          // {
          //   filename: 'styles.css',
          //   content: sassResult.css.toString(),
          //   contentType: 'text/css'
          // }
        // ]
      });
  
      logger.info('Email sent successfully');
    } catch (error) {
      logger.error('Error sending email:', error);
    }
  };

