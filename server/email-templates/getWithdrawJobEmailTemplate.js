const getWithdrawJobEmailTemplate = (userName, jobTitle, companyName,logo) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Application Withdrawal Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <!-- Wrapper Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Email Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" bgcolor="#dc2626" style="padding: 40px 20px;">
                        <img src=${logo} alt="Company Logo" width="150" style="display: block; margin-bottom: 20px;" />
                            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: bold;">Application Withdrawal Confirmation</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Greeting -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #333333; font-size: 16px; padding-bottom: 20px;">
                                        Dear ${userName},
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #333333; font-size: 16px; padding-bottom: 20px; line-height: 24px;">
                                        This email confirms that your application for the position of <span style="color: #dc2626; font-weight: bold;">"${jobTitle}"</span> at <span style="font-weight: bold;">${companyName}</span> has been successfully withdrawn.
                                    </td>
                                </tr>
                                
                                <!-- Next Steps -->
                                <tr>
                                    <td style="padding-top: 30px;">
                                        <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0;">What this means:</p>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="padding: 0 0 10px 20px; color: #333333;">• Your application has been removed from consideration</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 0 10px 20px; color: #333333;">• You will no longer receive updates about this position</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 0 10px 20px; color: #333333;">• You can apply for other positions that match your interests</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Future Opportunities -->
                                <tr>
                                    <td style="padding: 20px; background-color: #f8fafc; border-left: 4px solid #64748b; margin: 20px 0; margin-top: 30px;">
                                        <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 24px;">
                                            We encourage you to explore other opportunities on our platform that better align with your career goals. Your profile remains active for future applications.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Thank You Note -->
                                <tr>
                                    <td style="padding-top: 30px; color: #333333; font-size: 16px; line-height: 24px;">
                                        Thank you for your interest in ${companyName}. We wish you the best in your job search.
                                    </td>
                                </tr>
                                
                                <!-- Signature -->
                                <tr>
                                    <td style="padding-top: 30px;">
                                        <p style="color: #333333; margin: 0 0 5px 0;">Best regards,</p>
                                        <p style="color: #333333; font-weight: bold; margin: 0;">${companyName} Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; color: #64748b; font-size: 14px;">This is an automated email. Please do not reply to this message.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export default getWithdrawJobEmailTemplate;
