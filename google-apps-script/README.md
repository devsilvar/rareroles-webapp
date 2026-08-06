# Google Apps Script Integration

This folder contains the complete Google Apps Script webhook handler for backing up RareRoles form submissions to Google Sheets.

## 📁 Files

- **`webhook-handler.gs`** - Complete Google Apps Script code (copy this into Google Apps Script editor)
- **`SETUP-GUIDE.md`** - Step-by-step setup instructions

## ⚡ Quick Start

1. Read `SETUP-GUIDE.md` for detailed instructions
2. Copy the contents of `webhook-handler.gs` into Google Apps Script
3. Change the SECRET_KEY on line 18
4. Deploy as web app
5. Update your `.env` with the deployment URL and secret

## 🆕 What's New in This Version

### Updated for Latest Features:
- ✅ **Phone number capture** for both hiring enquiries and talent submissions
- ✅ **Custom role support** for talent submissions (when "Other" is selected)
- ✅ **9 new role options** fully supported
- ✅ **Automatic email confirmations** 📧 NEW!
  - Sends beautiful branded HTML emails to employers
  - Includes personalized Calendly booking link
  - Professional, inviting tone
  - Automatic on every hiring submission
- ✅ Auto-creates sheets with proper formatting
- ✅ Includes test functions for easy verification

## 🔄 Upgrading from Old Version?

If you have an existing Google Apps Script webhook:

1. **Backup your existing script** (copy the code somewhere safe)
2. **Note your current SECRET_KEY** (you'll need to use the same one)
3. Replace the entire script with the new `webhook-handler.gs` code
4. **Configure the settings at the top:**
   - Put back your SECRET_KEY
   - Add your CALENDLY_LINK
   - Add your REPLY_TO_EMAIL
   - Update COMPANY_NAME (optional)
5. Save and redeploy
6. Run `checkEmailConfig()` to verify settings
7. Run `testEmail()` to test email sending (update email first!)
8. Run `testSetup()` to verify data saving
9. Done! ✅

The new columns will automatically be added to your sheets, and employers will now receive automatic confirmation emails with your Calendly link!

## 📊 Sheet Columns

### Hiring Enquiries (13 columns)
Timestamp, Company, Contact Name, Email, **Phone**, Location, Roles, Seniority, Timeline, Details, Contacted, Contacted At, Contacted By

### Talent Submissions (15 columns)
Timestamp, Name, Email, **Phone**, Desired Role, **Custom Role**, Experience, Location, Links, About, CV URL, CV File Name, Contacted, Contacted At, Contacted By

### Contacts (9 columns)
Timestamp, Name, Email, Company, Message, Source, Contacted, Contacted At, Contacted By

**Bold** = New columns added in this version

## 🧪 Testing

Run these functions from the Apps Script editor:

- **`checkEmailConfig()`** - Verifies your email settings are configured
- **`testEmail()`** - Sends a test confirmation email (change email first!)
- **`testSetup()`** - Creates test data in all sheets
- **`cleanTestData()`** - Removes test data but keeps headers

## 🔐 Security

- Uses secret key verification to prevent unauthorized access
- Runs under your Google account permissions
- Data is stored securely in your private Google Sheet
- You can revoke access anytime

## 📝 Notes

- This is a **backup system** - Supabase is the primary database
- If Google Sheets fails, submissions still succeed in Supabase
- The webhook is called asynchronously with retry logic
- Check Apps Script execution logs if you need to debug

---

**Ready to deploy?** Follow the `SETUP-GUIDE.md` for complete instructions! 🚀
