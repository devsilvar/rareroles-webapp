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
  
  var subject = '🎯 Your Talent Request is In - Let\'s Find Your Perfect Match!';
  
  var htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
    .content { background: white; padding: 40px 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
    .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 20px; }
    .roles-box { background: #f8f9fa; border-left: 4px solid #E91E63; padding: 20px; margin: 25px 0; border-radius: 5px; }
    .roles-box h3 { margin: 0 0 15px 0; color: #1a1a2e; font-size: 16px; }
    .roles-list { margin: 0; color: #555; font-size: 15px; line-height: 1.8; white-space: pre-line; }
    .cta-section { background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0; }
    .cta-section h2 { color: white; margin: 0 0 15px 0; font-size: 22px; }
    .cta-section p { color: white; margin: 0 0 20px 0; font-size: 15px; opacity: 0.95; }
    .cta-button { display: inline-block; background: white; color: #E91E63; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; transition: transform 0.2s; }
    .cta-button:hover { transform: scale(1.05); }
    .what-next { background: #fff8e1; border-radius: 8px; padding: 20px; margin: 25px 0; }
    .what-next h3 { margin: 0 0 15px 0; color: #f57c00; font-size: 18px; }
    .what-next ul { margin: 0; padding-left: 20px; color: #555; }
    .what-next li { margin: 8px 0; }
    .footer { background: #f5f5f5; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; }
    .footer p { margin: 5px 0; font-size: 14px; color: #666; }
    .footer a { color: #E91E63; text-decoration: none; }
    .emoji { font-size: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>✨ We Got Your Request!</h1>
      <p>Your search for exceptional talent starts now</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <div class="greeting">
        Hey ${recipientName}! 👋
      </div>
      
      <p>
        Thanks for trusting <strong>${COMPANY_NAME}</strong> to help ${companyName} find the perfect talent. 
        We're pumped to get started! 🚀
      </p>
      
      <!-- Roles Summary -->
      <div class="roles-box">
        <h3>🎯 What You're Looking For:</h3>
        <div class="roles-list">${rolesText || '  • Custom requirements as discussed'}</div>
      </div>
      
      <p>
        Our team is already on it, scouring our network of top-tier professionals who match your needs. 
        We specialize in finding those <strong>rare roles</strong> that make all the difference. 💎
      </p>
      
      <!-- CTA Section -->
      <div class="cta-section">
        <h2>🗓️ Want to Fast-Track This?</h2>
        <p>
          Book a quick 15-30 minute consultation call with our talent experts. 
          We'll discuss your requirements in detail and create a custom hiring strategy.
        </p>
        <a href="${CALENDLY_LINK}" class="cta-button">
          📅 Book Your Free Consultation
        </a>
      </div>
      
      <!-- What Happens Next -->
      <div class="what-next">
        <h3>⚡ What Happens Next:</h3>
        <ul>
          <li><strong>Within 24 hours:</strong> We'll review your requirements and start matching</li>
          <li><strong>Within 48-72 hours:</strong> You'll receive curated candidate profiles</li>
          <li><strong>Throughout:</strong> We'll keep you updated on our progress</li>
          <li><strong>Optional:</strong> Book a consultation call above for immediate strategy session</li>
        </ul>
      </div>
      
      <p>
        Got questions in the meantime? Just hit reply to this email - we're here to help! 💪
      </p>
      
      <p style="margin-top: 30px;">
        <strong>Let's find you some amazing talent!</strong><br>
        The ${COMPANY_NAME} Team
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>${COMPANY_NAME}</strong></p>
      <p>Finding Rare Talent for Extraordinary Teams</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        This is an automated confirmation. We'll be in touch soon with personalized updates.
      </p>
    </div>
  </div>
</body>
</html>
  `;
  
  var plainBody = `
Hey ${recipientName}! 👋

Thanks for trusting ${COMPANY_NAME} to help ${companyName} find the perfect talent. We're pumped to get started! 🚀

🎯 WHAT YOU'RE LOOKING FOR:
${rolesText || '• Custom requirements as discussed'}

Our team is already on it, scouring our network of top-tier professionals who match your needs. We specialize in finding those rare roles that make all the difference. 💎

🗓️ WANT TO FAST-TRACK THIS?

Book a quick 15-30 minute consultation call with our talent experts. We'll discuss your requirements in detail and create a custom hiring strategy.

📅 Book Your Free Consultation:
${CALENDLY_LINK}

⚡ WHAT HAPPENS NEXT:

• Within 24 hours: We'll review your requirements and start matching
• Within 48-72 hours: You'll receive curated candidate profiles  
• Throughout: We'll keep you updated on our progress
• Optional: Book a consultation call above for immediate strategy session

Got questions in the meantime? Just hit reply to this email - we're here to help! 💪

Let's find you some amazing talent!

The ${COMPANY_NAME} Team

---
${COMPANY_NAME} - Finding Rare Talent for Extraordinary Teams
This is an automated confirmation. We'll be in touch soon with personalized updates.
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
