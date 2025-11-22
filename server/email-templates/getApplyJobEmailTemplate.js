const getReportIssueEmailTemplate = (
  userName,
  issueTitle,
  issueDescription,
  issueId
) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Issue Report Confirmation</title>
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
                            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: bold;">Issue Report Received</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Ticket ID: #${issueId}</p>
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
                                        We have received your issue report regarding: <span style="color: #dc2626; font-weight: bold;">"${issueTitle}"</span>
                                    </td>
                                </tr>
                                
                                <!-- Issue Details Box -->
                                <tr>
                                    <td style="padding: 20px; background-color: #fef2f2; border-left: 4px solid #dc2626; margin: 20px 0;">
                                        <p style="color: #333333; margin: 0 0 10px 0; font-weight: bold;">Issue Description:</p>
                                        <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 24px;">
                                            ${issueDescription}
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Status Timeline -->
                                <tr>
                                    <td style="padding-top: 30px;">
                                        <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Issue Resolution Timeline:</p>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0 10px;">
                                            <tr>
                                                <td width="20" style="vertical-align: top;">
                                                    <div style="width: 12px; height: 12px; background-color: #22c55e; border-radius: 50%;"></div>
                                                </td>
                                                <td style="padding-left: 10px; color: #333333;">
                                                    <p style="margin: 0; font-weight: bold;">Issue Received</p>
                                                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Our team has been notified</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="20" style="vertical-align: top;">
                                                    <div style="width: 12px; height: 12px; background-color: #e5e7eb; border-radius: 50%;"></div>
                                                </td>
                                                <td style="padding-left: 10px; color: #333333;">
                                                    <p style="margin: 0; font-weight: bold;">Under Review</p>
                                                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Technical team assessment</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="20" style="vertical-align: top;">
                                                    <div style="width: 12px; height: 12px; background-color: #e5e7eb; border-radius: 50%;"></div>
                                                </td>
                                                <td style="padding-left: 10px; color: #333333;">
                                                    <p style="margin: 0; font-weight: bold;">Resolution</p>
                                                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Implementation of solution</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Response Time Notice -->
                                <tr>
                                    <td style="padding-top: 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 15px; border-radius: 4px;">
                                            <tr>
                                                <td>
                                                    <p style="color: #333333; margin: 0; font-size: 14px;">
                                                        <strong>Expected Response Time:</strong> We aim to respond to all issues within 24 hours during business days.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Support Info -->
                                <tr>
                                    <td style="padding-top: 30px; color: #333333; font-size: 16px; line-height: 24px;">
                                        If you need to provide additional information or have questions about your report, please reply to this email with your ticket ID (#${issueId}).
                                    </td>
                                </tr>
                                
                                <!-- Signature -->
                                <tr>
                                    <td style="padding-top: 30px;">
                                        <p style="color: #333333; margin: 0 0 5px 0;">Best regards,</p>
                                        <p style="color: #333333; font-weight: bold; margin: 0;">Support Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; color: #64748b; font-size: 14px;">
                                For urgent issues, please contact our support hotline: <span style="color: #dc2626;">1-800-SUPPORT</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export default getReportIssueEmailTemplate;
