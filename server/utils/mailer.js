const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOTPEmail = async (to, name, otp, isReset = false) => {
  const transporter = createTransporter();
  const subject = isReset
    ? 'SportSync — Password Reset OTP'
    : 'SportSync — Verify Your Email';

  const html = `
    <div style="font-family:'Outfit',Arial,sans-serif;background:#0a0a0a;padding:40px;border-radius:16px;max-width:480px;margin:0 auto">
      <div style="text-align:center;margin-bottom:32px">
        <h1 style="color:white;font-size:28px;font-weight:800;margin:0">
          Sport<span style="color:#e94560">Sync</span>
        </h1>
        <p style="color:#555;font-size:13px;margin:4px 0 0">Presidency University</p>
      </div>

      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;text-align:center">
        <h2 style="color:white;font-size:20px;margin:0 0 8px">
          ${isReset ? 'Reset your password' : 'Verify your email'}
        </h2>
        <p style="color:#666;font-size:14px;margin:0 0 28px">
          Hi ${name}, use the OTP below to ${isReset ? 'reset your password' : 'verify your account'}.
        </p>

        <div style="background:linear-gradient(135deg,rgba(233,69,96,0.15),rgba(15,52,96,0.3));border:1px solid rgba(233,69,96,0.3);border-radius:12px;padding:24px">
          <p style="color:#a0a0a0;font-size:12px;letter-spacing:2px;margin:0 0 8px">YOUR OTP</p>
          <p style="color:white;font-size:40px;font-weight:900;letter-spacing:12px;margin:0">${otp}</p>
        </div>

        <p style="color:#444;font-size:12px;margin:20px 0 0">This OTP expires in <strong style="color:#e94560">10 minutes</strong></p>
      </div>

      <p style="color:#333;font-size:11px;text-align:center;margin-top:24px">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"SportSync" <${process.env.SMTP_USER}>`,
    to, subject, html,
  });
};
