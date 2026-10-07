import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
  toEmail: string;
  otpCode: string;
}

function getEmailHtml(otpCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mess Mate Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0F1115;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
    }
    .container {
      max-width: 520px;
      margin: 30px auto;
      background-color: #161920;
      border: 1px solid #232834;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      padding: 32px 32px 20px 32px;
      text-align: center;
      background: linear-gradient(180deg, rgba(224, 79, 22, 0.15) 0%, rgba(22, 25, 32, 0) 100%);
    }
    .logo-badge {
      display: inline-block;
      width: 54px;
      height: 54px;
      line-height: 54px;
      border-radius: 18px;
      background: linear-gradient(135deg, #E04F16, #F59E0B);
      font-size: 28px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 13px;
      color: #94A3B8;
      margin: 0;
      font-weight: 500;
    }
    .content {
      padding: 24px 32px 32px 32px;
      text-align: center;
    }
    .instruction {
      font-size: 14px;
      color: #CBD5E1;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .otp-box {
      background: #0F1115;
      border: 2px dashed #E04F16;
      border-radius: 16px;
      padding: 24px;
      margin: 0 auto 24px auto;
      max-width: 320px;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #F59E0B;
      margin-bottom: 10px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 40px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: 12px;
      margin-left: 12px;
    }
    .timer-note {
      font-size: 12px;
      color: #94A3B8;
      margin-bottom: 20px;
    }
    .footer {
      border-top: 1px solid #232834;
      padding: 20px 32px;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">🍲</div>
      <h1 class="title">Mess Mate</h1>
      <p class="subtitle">Campus Nutrition & Mess Intelligence • VIT-AP</p>
    </div>
    <div class="content">
      <p class="instruction">
        Enter this 6-digit verification code in the app to authenticate your student account:
      </p>
      <div class="otp-box">
        <div class="otp-label">One-Time Verification Code</div>
        <div class="otp-code">${otpCode}</div>
      </div>
      <p class="timer-note">
        ⏱️ This code expires in <strong>10 minutes</strong>. Never share this code with anyone.
      </p>
    </div>
    <div class="footer">
      <p>Only verified college students (@vitapstudent.ac.in) are authorized on Mess Mate.</p>
      <p>If you did not request this login code, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatches the 6-digit OTP code to the recipient's email address.
 * Automatically uses SMTP or Resend API if configured in environment variables.
 */
export async function sendOtpEmail({
  toEmail,
  otpCode,
}: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
  const htmlContent = getEmailHtml(otpCode);
  const textContent = `Mess Mate Verification Code: ${otpCode}\n\nThis 6-digit code expires in 10 minutes. Enter it in the Mess Mate app to authenticate your student account.`;

  // 1. Check for SMTP credentials (Gmail, SendGrid, Brevo, AWS SES, or college mail server)
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Mess Mate VIT-AP" <${smtpUser}>`,
        to: toEmail,
        subject: `Your Mess Mate Verification Code: ${otpCode}`,
        text: textContent,
        html: htmlContent,
      });

      return { success: true };
    } catch (err: any) {
      console.error('SMTP email sending failed:', err.message);
      return { success: false, error: `SMTP error: ${err.message}` };
    }
  }

  // 2. Check for Resend API Key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Mess Mate <onboarding@resend.dev>',
          to: [toEmail],
          subject: `Your Mess Mate Verification Code: ${otpCode}`,
          text: textContent,
          html: htmlContent,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        return { success: false, error: resData.message || 'Resend API error' };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Resend API email sending failed:', err.message);
      return { success: false, error: `Resend error: ${err.message}` };
    }
  }

  // 3. If neither SMTP nor Resend is configured:
  return {
    success: false,
    error:
      'Email dispatch service is not configured. Please add SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD) or RESEND_API_KEY to your environment variables to deliver emails to your college inbox.',
  };
}
