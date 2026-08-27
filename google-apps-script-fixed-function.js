/**
 * Send confirmation email to employer after hiring enquiry
 * FIXED VERSION with safety checks
 */
function sendHiringConfirmationEmail(data) {
  // ===== SAFETY CHECKS - ADDED =====
  if (!data) {
    Logger.log('ERROR: sendHiringConfirmationEmail called with no data');
    return;
  }
  
  if (!data.email) {
    Logger.log('ERROR: No email in data object: ' + JSON.stringify(data));
    return;
  }
  // ===== END SAFETY CHECKS =====
  
  var recipientEmail = data.email;
  var recipientName = data.contact_name || 'there';
  var companyName = data.company || 'your company';
  
  // Format the roles list for email
  var rolesText = '';
  if (data.roles && Array.isArray(data.roles)) {
    rolesText = data.roles.map(function(role) {
      return '  • ' + role.title + (role.count > 1 ? ' (x' + role.count + ')' : '');
    }).join('\n');
  }
  
  var subject = 'Talent Acquisition Request Confirmed - ' + companyName;
  
  var htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
      line-height: 1.7; 
      color: #2c3e50;
      background-color: #f4f4f4;
    }
    .email-wrapper { 
      background-color: #f4f4f4; 
      padding: 40px 20px; 
    }
    .container { 
      max-width: 650px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .header { 
      background: #1a1a2e; 
      padding: 45px 50px; 
      border-bottom: 3px solid #2d4059;
    }
    .header h1 { 
      color: white; 
      font-size: 26px; 
      font-weight: 400; 
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .header .subtitle { 
      color: #b8c1cc; 
      font-size: 14px; 
      font-weight: 300;
      letter-spacing: 0.3px;
    }
    .content { 
      padding: 50px 50px 40px 50px; 
      background: white;
    }
    .greeting { 
      font-size: 16px; 
      color: #2c3e50; 
      margin-bottom: 25px;
      font-weight: 400;
    }
    .section { 
      margin: 30px 0; 
    }
    .section p {
      margin-bottom: 16px;
      color: #34495e;
      font-size: 15px;
    }
    .info-box { 
      background: #fafbfc; 
      border: 1px solid #e1e4e8;
      border-left: 4px solid #2d4059; 
      padding: 25px 30px; 
      margin: 30px 0;
    }
    .info-box h3 { 
      color: #1a1a2e; 
      font-size: 15px; 
      font-weight: 600;
      margin-bottom: 18px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .roles-list { 
      color: #34495e; 
      font-size: 15px; 
      line-height: 1.9; 
      white-space: pre-line;
      font-family: 'Courier New', monospace;
    }
    .consultation-box {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      padding: 35px 40px;
      margin: 35px 0;
      text-align: center;
    }
    .consultation-box h2 {
      color: #1a1a2e;
      font-size: 19px;
      font-weight: 600;
      margin-bottom: 15px;
      letter-spacing: -0.3px;
    }
    .consultation-box p {
      color: #495057;
      margin-bottom: 25px;
      font-size: 15px;
      line-height: 1.6;
    }
    .cta-button { 
      display: inline-block; 
      background: #1a1a2e; 
      color: white !important; 
      padding: 14px 45px; 
      text-decoration: none; 
      font-weight: 600; 
      font-size: 15px;
      border: 2px solid #1a1a2e;
      transition: all 0.3s ease;
      letter-spacing: 0.3px;
    }
    .cta-button:hover { 
      background: #2d4059;
      border-color: #2d4059;
    }
    .timeline-box { 
      background: white;
      border: 1px solid #e1e4e8;
      padding: 30px 35px; 
      margin: 30px 0;
    }
    .timeline-box h3 { 
      color: #1a1a2e; 
      font-size: 16px; 
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .timeline-box ul { 
      list-style: none;
      padding: 0;
    }
    .timeline-box li { 
      padding: 12px 0 12px 25px;
      color: #34495e;
      font-size: 14px;
      border-left: 2px solid #dee2e6;
      margin-left: 10px;
      position: relative;
    }
    .timeline-box li:before {
      content: '';
      position: absolute;
      left: -6px;
      top: 18px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #2d4059;
    }
    .timeline-box li strong { 
      color: #1a1a2e;
      font-weight: 600;
    }
    .signature {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e1e4e8;
      color: #2c3e50;
      font-size: 15px;
    }
    .signature-name {
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 4px;
    }
    .signature-title {
      color: #6c757d;
      font-size: 14px;
    }
    .footer { 
      background: #1a1a2e; 
      padding: 40px 50px; 
      text-align: center;
      border-top: 3px solid #2d4059;
    }
    .footer .company-name {
      color: white;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .footer .tagline {
      color: #b8c1cc;
      font-size: 13px;
      margin-bottom: 20px;
      font-style: italic;
    }
    .footer .disclaimer { 
      color: #8a939b; 
      font-size: 12px; 
      line-height: 1.6;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #2d4059;
    }
    .divider {
      height: 1px;
      background: #e1e4e8;
      margin: 35px 0;
    }
    @media only screen and (max-width: 600px) {
      .content, .header, .footer { 
        padding: 30px 25px !important; 
      }
      .consultation-box {
        padding: 25px 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Talent Acquisition Request Confirmed</h1>
        <div class="subtitle">Reference: ${companyName} | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <div class="greeting">
          Dear ${recipientName},
        </div>
        
        <div class="section">
          <p>
            Thank you for selecting <strong>${COMPANY_NAME}</strong> as your strategic talent acquisition partner. 
            We have received your hiring requirements for ${companyName} and have commenced the candidate identification process.
          </p>
        </div>
        
        <!-- Roles Summary -->
        <div class="info-box">
          <h3>Position Requirements</h3>
          <div class="roles-list">${rolesText || '  • Custom requirements as specified'}</div>
        </div>
        
        <div class="section">
          <p>
            Our recruitment specialists are conducting a comprehensive search across our vetted professional network 
            to identify candidates who align precisely with your organizational needs and cultural requirements.
          </p>
        </div>
        
        <!-- Consultation Invitation -->
        <div class="consultation-box">
          <h2>Schedule a Strategic Consultation</h2>
          <p>
            We invite you to schedule a 30-minute consultation with our senior talent advisors to discuss 
            your requirements in depth and develop a customized recruitment strategy.
          </p>
          <a href="${CALENDLY_LINK}" class="cta-button">Schedule Consultation</a>
        </div>
        
        <!-- Timeline -->
        <div class="timeline-box">
          <h3>Process Timeline</h3>
          <ul>
            <li><strong>Within 24 Hours:</strong> Requirements review and talent mapping initiation</li>
            <li><strong>48-72 Hours:</strong> Delivery of preliminary candidate profiles for review</li>
            <li><strong>Ongoing:</strong> Regular progress updates and communication</li>
            <li><strong>Optional:</strong> Immediate strategic consultation available via scheduling link above</li>
          </ul>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
          <p>
            Should you have any questions or require additional information, please do not hesitate to respond 
            directly to this email. Our team is available to assist you throughout the recruitment process.
          </p>
        </div>
        
        <!-- Signature -->
        <div class="signature">
          <div class="signature-name">Talent Acquisition Team</div>
          <div class="signature-title">${COMPANY_NAME}</div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="company-name">${COMPANY_NAME}</div>
        <div class="tagline">Executive Talent Acquisition & Strategic Recruitment Solutions</div>
        <div class="disclaimer">
          This is an automated confirmation. A member of our team will contact you within 24 business hours 
          with personalized updates regarding your talent acquisition request.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  var plainBody = `
TALENT ACQUISITION REQUEST CONFIRMED

Dear ${recipientName},

Thank you for selecting ${COMPANY_NAME} as your strategic talent acquisition partner. We have received your hiring requirements for ${companyName} and have commenced the candidate identification process.

POSITION REQUIREMENTS:
${rolesText || '• Custom requirements as specified'}

Our recruitment specialists are conducting a comprehensive search across our vetted professional network to identify candidates who align precisely with your organizational needs and cultural requirements.

SCHEDULE A STRATEGIC CONSULTATION

We invite you to schedule a 30-minute consultation with our senior talent advisors to discuss your requirements in depth and develop a customized recruitment strategy.

Schedule Consultation: ${CALENDLY_LINK}

PROCESS TIMELINE:

• Within 24 Hours: Requirements review and talent mapping initiation
• 48-72 Hours: Delivery of preliminary candidate profiles for review
• Ongoing: Regular progress updates and communication
• Optional: Immediate strategic consultation available via scheduling link above

Should you have any questions or require additional information, please do not hesitate to respond directly to this email. Our team is available to assist you throughout the recruitment process.

Sincerely,

Talent Acquisition Team
${COMPANY_NAME}

---

${COMPANY_NAME}
Executive Talent Acquisition & Strategic Recruitment Solutions

This is an automated confirmation. A member of our team will contact you within 24 business hours with personalized updates regarding your talent acquisition request.
  `;
  
  try {
    // Send the email
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: htmlBody,
      body: plainBody,
      replyTo: REPLY_TO_EMAIL,
      name: COMPANY_NAME
    });
    
    Logger.log('✅ Confirmation email sent successfully to: ' + recipientEmail);
  } catch (emailError) {
    Logger.log('❌ Failed to send email: ' + emailError.toString());
    // Don't throw - email failure shouldn't break the webhook
  }
}
