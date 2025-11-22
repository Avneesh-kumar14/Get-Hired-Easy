const getLoginOTPTemplate = (userName, otp) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>GetHiredEasy - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Logo & Header -->
                    <tr>
                        <td align="center" bgcolor="#2563eb" style="padding: 30px 20px; border-radius: 12px 12px 0 0;">
                            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">GetHiredEasy</h1>
                            <p style="color: #ffffff; font-size: 16px; margin: 0; opacity: 0.9;">Account Verification</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- Greeting -->
                                <tr>
                                    <td style="color: #1f2937; font-size: 18px; line-height: 24px; padding-bottom: 20px;">
                                        Hi${userName ? ' ' + userName : ''},
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #4b5563; font-size: 16px; line-height: 24px; padding-bottom: 25px;">
                                        Welcome to GetHiredEasy! To ensure the security of your account, please use the following verification code:
                                    </td>
                                </tr>

                                <!-- OTP Display -->
                                <tr>
                                    <td align="center" style="padding: 25px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(to right, #2563eb11, #2563eb22); border: 2px dashed #2563eb; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 25px 50px;">
                                                    <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 12px;">
                                                        ${otp}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Timer Warning -->
                                <tr>
                                    <td style="padding: 25px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; margin: 20px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #991b1b; font-weight: bold; font-size: 14px; padding-bottom: 5px;">
                                                    Important:
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #991b1b; font-size: 14px; line-height: 20px;">
                                                    • This code will expire in 5 minutes<br/>
                                                    • Never share this code with anyone<br/>
                                                    • GetHiredEasy team will never ask for this code
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Security Note -->
                                <tr>
                                    <td style="padding-top: 25px;">
                                        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 20px;">
                                            If you didn't request this verification code, please ignore this email or contact our support team if you believe this is suspicious activity.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 25px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;">© 2024 GetHiredEasy. All rights reserved.</p>
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export default getLoginOTPTemplate;