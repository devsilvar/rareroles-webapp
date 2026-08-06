/**
 * Google Apps Script Web App
 * Receives webhook POST requests and saves to Google Sheets
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Spreadsheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy this entire code into Code.gs
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Deploy and copy the web app URL
 * 9. Go to Project Settings > Script Properties
 * 10. Add property: SECRET_KEY = your_secret_key_here
 */

// Configuration
const SHEET_NAMES = {
  hiring: 'Hiring Enquiries',
  talent: 'Talent Submissions',
  contact: 'Contact Forms'
};

const COLUMNS = {
  hiring: [
    'Timestamp',
    'Company',
    'Contact Name',
    'Email',
    'Location',
    'Roles (JSON)',
    'Seniority',
    'Timeline',
    'Details',
    'ID',
    'Status'
  ],
  talent: [
    'Timestamp',
    'Name',
    'Email',
    'Desired Role',
    'Experience',
    'Location',
    'Links',
    'About',
    'CV URL',
    'CV File Name',
    'ID',
    'Status'
  ],
  contact: [
    'Timestamp',
    'Name',
    'Email',
    'Company',
    'Message',
    'Source',
    'ID',
    'Status'
  ]
};

/**
 * Main webhook handler - receives POST requests
 */
function doPost(e) {
  try {
    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      console.error('Invalid request: no postData');
      return createErrorResponse('Invalid request: missing postData', 400);
    }
    
    // Parse incoming data
    const payload = JSON.parse(e.postData.contents);
    
    // Verify secret key
    const SECRET_KEY = PropertiesService.getScriptProperties().getProperty('SECRET_KEY');
    if (!SECRET_KEY) {
      return createErrorResponse('Server not configured', 500);
    }
    
    if (payload.secret !== SECRET_KEY) {
      return createErrorResponse('Unauthorized', 401);
    }
    
    // Validate payload
    if (!payload.type || !payload.data) {
      return createErrorResponse('Invalid payload', 400);
    }
    
    // Get or create sheet
    const sheet = getOrCreateSheet(payload.type);
    
    // Format and append data
    const row = formatRow(payload.type, payload.data, payload.timestamp);
    sheet.appendRow(row);
    
    // Generate unique ID
    const rowId = Utilities.getUuid();
    
    // Log success
    console.log(`Successfully saved ${payload.type} submission: ${rowId}`);
    
    return createSuccessResponse(rowId);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createErrorResponse(error.toString(), 500);
  }
}

/**
 * Get or create sheet for specific type
 */
function getOrCreateSheet(type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = SHEET_NAMES[type];
  
  if (!sheetName) {
    throw new Error(`Unknown type: ${type}`);
  }
  
  let sheet = ss.getSheetByName(sheetName);
  
  // Create sheet if doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    // Add headers
    const headers = COLUMNS[type];
    sheet.appendRow(headers);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Format data into row array based on type
 */
function formatRow(type, data, timestamp) {
  const ts = timestamp || new Date().toISOString();
  const status = 'New';
  
  switch (type) {
    case 'hiring':
      return [
        ts,
        data.company || '',
        data.contact_name || '',
        data.email || '',
        data.location || '',
        JSON.stringify(data.roles || []),
        data.seniority || '',
        data.timeline || '',
        data.details || '',
        Utilities.getUuid(),
        status
      ];
      
    case 'talent':
      return [
        ts,
        data.name || '',
        data.email || '',
        data.desired_role || '',
        data.experience || '',
        data.location || '',
        data.links || '',
        data.about || '',
        data.cv_url || '',
        data.cv_file_name || '',
        Utilities.getUuid(),
        status
      ];
      
    case 'contact':
      return [
        ts,
        data.name || '',
        data.email || '',
        data.company || '',
        data.message || '',
        data.source || 'contact_form',
        Utilities.getUuid(),
        status
      ];
      
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

/**
 * Create success response
 */
function createSuccessResponse(id) {
  const response = {
    success: true,
    id: id,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create error response
 */
function createErrorResponse(message, statusCode) {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function (can be run from Apps Script editor)
 */
function testWebhook() {
  const testPayload = {
    type: 'contact',
    secret: PropertiesService.getScriptProperties().getProperty('SECRET_KEY'),
    timestamp: new Date().toISOString(),
    data: {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test message from Apps Script',
      source: 'test'
    }
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}

/**
 * Get stats (can be called via URL parameters or from dashboard)
 */
function getStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = {};
  
  Object.keys(SHEET_NAMES).forEach(function(type) {
    const sheetName = SHEET_NAMES[type];
    const sheet = ss.getSheetByName(sheetName);
    
    if (sheet) {
      // -1 to exclude header row
      stats[type] = sheet.getLastRow() - 1;
    } else {
      stats[type] = 0;
    }
  });
  
  return stats;
}

/**
 * Handle GET requests (for testing/status check)
 */
function doGet(e) {
  const stats = getStats();
  
  const response = {
    success: true,
    message: 'RareRoles Webhook is running',
    stats: stats,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
