const getApplicationStatusEmailTemplate = (application, status) => {
  const isAccepted = status.toLowerCase() === "accepted";
  const accentColor = isAccepted ? "#22c55e" : "#dc2626"; // green for accept, red for reject

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Application ${status}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
          <tr>
              <td align="center" style="padding: 20px 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                          <td align="center" bgcolor="${accentColor}" style="padding: 40px 20px;">
                              <img src="${
                                isAccepted
                                  ? "https://cdn3.iconfinder.com/data/icons/basic-ui-82/60/2-512.png"
                                  : "https://cdn0.iconfinder.com/data/icons/revamp-3/24/interface_decline_reject_close_delete_failed_circle-92-256.png"
                              }" 
                                   alt="Status Icon" 
                                   width="64" 
                                   height="64" 
                                   style="display: block; margin-bottom: 20px;" />
                              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: bold;">
                                  Application ${
                                    isAccepted ? "Accepted" : "Status Update"
                                  }
                              </h1>
                          </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                          <td style="padding: 40px 30px;">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <!-- Greeting -->
                                  <tr>
                                      <td style="color: #333333; font-size: 16px; padding-bottom: 20px;">
                                          Dear ${
                                            application.applicant.fullName
                                          },
                                      </td>
                                  </tr>
                                  
                                  <!-- Main Message -->
                                  <tr>
                                      <td style="padding: 20px; background-color: ${
                                        isAccepted ? "#f0fdf4" : "#fef2f2"
                                      }; border-left: 4px solid ${accentColor}; margin: 20px 0;">
                                          <p style="color: #333333; margin: 0; font-size: 16px; line-height: 24px;">
                                              ${
                                                isAccepted
                                                  ? `<span style="font-size: 18px; font-weight: bold; color: #22c55e;">Congratulations!</span><br/><br/>`
                                                  : `<span style="font-size: 18px; font-weight: bold;">Thank you for your interest</span><br/><br/>`
                                              }
                                              ${
                                                isAccepted
                                                  ? `We are pleased to inform you that your application for the position of <strong>${application.job.title}</strong> at <strong>${application.job.company.name}</strong> has been accepted.`
                                                  : `After careful consideration of your application for the position of <strong>${application.job.title}</strong> at <strong>${application.job.company.name}</strong>, we regret to inform you that we have decided to move forward with other candidates.`
                                              }
                                          </p>
                                      </td>
                                  </tr>
                                  
                                  <!-- Next Steps -->
                                  <tr>
                                      <td style="padding-top: 30px;">
                                          <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0;">
                                              ${
                                                isAccepted
                                                  ? "Next Steps:"
                                                  : "What's Next?"
                                              }
                                          </p>
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                              ${
                                                isAccepted
                                                  ? `
                                              <tr>
                                                  <td style="padding: 0 0 10px 20px; color: #333333;">• Our HR team will contact you shortly with additional details</td>
                                              </tr>
                                              <tr>
                                                  <td style="padding: 0 0 10px 20px; color: #333333;">• You will receive information about onboarding procedures</td>
                                              </tr>
                                              <tr>
                                                  <td style="padding: 0 0 10px 20px; color: #333333;">• Please prepare necessary documentation for the hiring process</td>
                                              </tr>
                                              `
                                                  : `
                                              <tr>
                                                  <td style="padding: 0 0 10px 20px; color: #333333;">• Your profile remains active in our database</td>
                                              </tr>
                                              <tr>
                                                  <td style="padding: 0 0 10px 20px; color: #333333;">• You can apply for other positions that match your skills</td>
                                              </tr>
                                              <tr>
                                                  <td style="padding: 0 0 10px 20px; color: #333333;">• Consider setting up job alerts for similar positions</td>
                                              </tr>
                                              `
                                              }
                                          </table>
                                      </td>
                                  </tr>
                                  
                                  <!-- Additional Information -->
                                  <tr>
                                      <td style="padding-top: 30px;">
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 4px;">
                                              <tr>
                                                  <td style="padding: 20px;">
                                                      <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 24px;">
                                                          ${
                                                            isAccepted
                                                              ? "We are excited to welcome you to our team and look forward to your contributions to our organization."
                                                              : "We appreciate the time and effort you invested in applying to our organization. We encourage you to apply for future positions that align with your qualifications."
                                                          }
                                                      </p>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                                  
                                  <!-- Contact Information -->
                                  ${
                                    isAccepted
                                      ? `
                                  <tr>
                                      <td style="padding-top: 30px;">
                                          <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0;">Important Contacts:</p>
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 4px;">
                                              <tr>
                                                  <td style="padding: 15px;">
                                                      <p style="margin: 0 0 10px 0;"><strong>HR Department:</strong> hr@${application.job.company.name.toLowerCase()}.com</p>
                                                      <p style="margin: 0;"><strong>Onboarding Team:</strong> onboarding@${application.job.company.name.toLowerCase()}.com</p>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                                  `
                                      : ""
                                  }
                                  
                                  <!-- Signature -->
                                  <tr>
                                      <td style="padding-top: 30px;">
                                          <p style="color: #333333; margin: 0 0 5px 0;">Best regards,</p>
                                          <p style="color: #333333; font-weight: bold; margin: 0;">${
                                            application.job.company.name
                                          } Team</p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                          <td style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                              <p style="margin: 0; color: #64748b; font-size: 14px;">
                                  © ${new Date().getFullYear()} ${
    application.job.company.name
  }. All rights reserved.
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
};

export default getApplicationStatusEmailTemplate;
