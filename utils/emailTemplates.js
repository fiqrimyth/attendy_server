const getResetPasswordTemplate = (resetUrl, name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 15px;
    }
    .button {
      display: block;
      width: fit-content;
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 12px 24px;
      margin: 20px auto;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      border-radius: 6px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #45a049;
    }
    .warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #888888;
      padding: 10px 20px;
      border-top: 1px solid #eeeeee;
    }
  </style>
  </head>
  <body>
  <div class="container">
    <div class="header">Reset Password Attendy</div>
    <div class="content">
      <p>Halo ${userName},</p>
      <p>Kami menerima permintaan untuk mereset password akun Attendy Anda. Klik tombol di bawah ini untuk melanjutkan proses reset password:</p>
      
      <a href="${resetUrl}" class="button">Reset Password</a>
      
      <div class="warning">
        <p><strong>⚠️ Perhatian:</strong> Link reset password ini hanya berlaku selama 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini atau hubungi admin.</p>
      </div>
      
      <p>Salam,<br>Tim Attendy</p>
    </div>
    <div class="footer">
      &copy; 2024 Attendy. All rights reserved.
    </div>
    </div>
  </body>
</html>
    `;
};

module.exports = {
  getResetPasswordTemplate,
};
