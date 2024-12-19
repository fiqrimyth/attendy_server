const nodemailer = require("nodemailer");

let transporter;

if (process.env.NODE_ENV === "development") {
  transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    // Production configuration
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true untuk port 465, false untuk port lain
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const sendEmail = async (options) => {
  try {
    // Konfigurasi email
    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html, // Opsional: jika ingin mengirim email dalam format HTML
    };

    // Kirim email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email terkirim: ", info.messageId);

    return true;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    throw new Error("Gagal mengirim email");
  }
};

module.exports = sendEmail;
