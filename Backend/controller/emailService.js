const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport.
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or 'smtp.your-email-provider.com'
  auth: {
    user: 'sreyojitwork@gmail.com',  // Use the sender's email address here
    pass: 'jmny jkou sxvq oogu'   // Use the sender's email password here (or app-specific password)
  }
});

const sendEmail = async ( to, subject, text, senderPassword) => {
    console.log(to)
  const mailOptions = {
    from: 'sreyojitwork@gmail.com',  // Sender's email (this can be dynamic or static)
    to: to,      // Recipient's email
    subject: subject,
    text: text    // Message body
  };

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('Error sending email: ', error);
    throw error;  // Handle the error as needed
  }
};

module.exports = sendEmail;
