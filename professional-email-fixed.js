/**
 * Professional Spam-Proof Confirmation Email
 * FIXED: Removes spam triggers, professional tone, clean HTML
 */
function sendHiringConfirmationEmail(data) {
  // Safety checks
  if (!data) {
    Logger.log('ERROR: No data provided');
    return;
  }
  
  if (!data.email) {
    Logger.log('ERROR: No email in data');
    return;
  }
  
  var recipientEmail = data.email;
  var recipientName = data.contact_name || 'there';
  var companyName = data.company || 'your company';
  
  // Format roles professionally
  var rolesText = '';
  var rolesHtml = '';
  if (data.roles && Array.isArray(data.roles)) {
    rolesText = data.roles.map(function(role) {
      return role.title + (role.count > 1 ? ' (' + role.count + ' positions)' : '');
    }).join('\n');
    
    rolesHtml = data.roles.map(function(role) {
      return '<li>' + role.title + (role.count > 1 ? ' (' + role.count + ' positions)' : '') + '</li>';
    }).join('');
  }
  
  // PROFESSIONAL SUBJECT LINE (No emojis!)
  var subject = 'Your Hiring Request Received - ' + COMPANY_NAME;
  
  // CLEAN, PROFESSIONAL HTML (Minimal styling, no gradients)
  var htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 3px solid #E91E63;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1a1a2e;
      font-size: 24px;
      margin: 0 0 10px 0;
      font-weight: normal;
    }
    .content {
      margin-bottom: 30px;
    }
    .content p {
      margin: 15px 0;
    }
    .info-box {
      background-color: #f5f5f5;
      border-left: 4px solid #E91E63;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #1a1a2e;
      font-size: 16px;
    }
    .info-box ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .info-box li {
      margin: 5px 0;
      color: #555555;
    }
    .timeline {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      padding: 15px;
      margin: 20px 0;
    }
    .timeline h3 {
      margin: 0 0 15px 0;
      color: #1a1a2e;
      font-size: 16px;
    }
    .timeline-item {
      margin: 10px 0;
      padding-left: 20px;
      border-left: 2px solid #E91E63;
    }
    .timeline-item strong {
      color: #1a1a2e;
    }
    .cta-button {
      display: inline-block;
      background-color: #E91E63;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
      margin-top: 40px;
      font-size: 12px;
      color: #666666;
      text-align: center;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${COMPANY_NAME}</h1>
    <p style="margin: 0; color: #666666;">Talent Acquisition Confirmation</p>
  </div>
  
  <div class="content">
    <p>Dear ${recipientName},</p>
    
    <p>Thank you for submitting your hiring request with ${COMPANY_NAME}. We have received your requirements for ${companyName} and our team is reviewing them.</p>
    
    <div class="info-box">
      <h3>Position Requirements Received:</h3>
      <ul>
        ${rolesHtml || '<li>Custom requirements as specified</li>'}
      </ul>
    </div>
    
    <p>Our recruitment specialists are currently reviewing your requirements and will begin sourcing qualified candidates from our network of professionals.</p>
    
    <div class="timeline">
      <h3>Next Steps:</h3>
      <div class="timeline-item">
        <strong>Within 24-48 hours:</strong> Initial review of requirements and candidate search begins
      </div>
      <div class="timeline-item">
        <strong>Within 3-5 business days:</strong> First round of candidate profiles delivered to your inbox
      </div>
      <div class="timeline-item">
        <strong>Ongoing:</strong> Regular updates on candidate pipeline and screening progress
      </div>
    </div>
    
    <p>If you would like to discuss your requirements in more detail, you can schedule a consultation call with our team:</p>
    
    <p style="text-align: center;">
      <a href="${CALENDLY_LINK}" class="cta-button">Schedule Consultation Call</a>
    </p>
    
    <p>Should you have any questions or need to update your requirements, please reply to this email or contact us directly.</p>
    
    <div class="signature">
      <p>Best regards,<br>
      <strong>The ${COMPANY_NAME} Team</strong><br>
      Talent Acquisition Services</p>
    </div>
  </div>
  
  <div class="footer">
    <p><strong>${COMPANY_NAME}</strong><br>
    Professional Talent Acquisition Services</p>
    <p>This is an automated confirmation. Your request has been logged and will be processed by our team.</p>
  </div>
</body>
</html>
  `;
  
  // PROFESSIONAL PLAIN TEXT VERSION (Important for spam filters!)
  var plainBody = `
Dear ${recipientName},

Thank you for submitting your hiring request with ${COMPANY_NAME}. We have received your requirements for ${companyName} and our team is reviewing them.

POSITION REQUIREMENTS RECEIVED:
${rolesText || 'Custom requirements as specified'}

Our recruitment specialists are currently reviewing your requirements and will begin sourcing qualified candidates from our network of professionals.

NEXT STEPS:

Within 24-48 hours: Initial review of requirements and candidate search begins

Within 3-5 business days: First round of candidate profiles delivered to your inbox

Ongoing: Regular updates on candidate pipeline and screening progress


If you would like to discuss your requirements in more detail, you can schedule a consultation call with our team: ${CALENDLY_LINK}

Should you have any questions or need to update your requirements, please reply to this email or contact us directly.

Best regards,
The ${COMPANY_NAME} Team
Talent Acquisition Services

---
${COMPANY_NAME}
Professional Talent Acquisition Services

This is an automated confirmation. Your request has been logged and will be processed by our team.
  `;
  
  try {
    // Send the email with proper headers
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: htmlBody,
      body: plainBody,
      replyTo: REPLY_TO_EMAIL,
      name: COMPANY_NAME,
      noReply: false  // Allow replies
    });
    
    Logger.log('✅ Professional confirmation email sent to: ' + recipientEmail);
  } catch (emailError) {
    Logger.log('❌ Failed to send email: ' + emailError.toString());
  }
}
