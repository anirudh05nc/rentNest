# Firebase Cloud Functions (Email Alerts)

To implement the automated email system, follow these steps:

1. **Initialize Functions**:
   Run `firebase init functions` in the project root.

2. **Install Dependencies**:
   ```bash
   cd functions
   npm install nodemailer
   ```

3. **Function Code (`functions/index.js`)**:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Configure SMTP (Gmail/SendGrid)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});

exports.onNewMessageNotifyOwner = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    
    // Get owner email from users collection
    const ownerDoc = await admin.firestore().collection('users').doc(messageData.receiverId).get();
    const ownerEmail = ownerDoc.data().email;

    const mailOptions = {
      from: 'RentNest <noreply@rentnest.com>',
      to: ownerEmail,
      subject: `New Inquiry for ${messageData.propertyTitle}`,
      html: `
        <h3>New Message from ${messageData.senderName}</h3>
        <p><strong>Property:</strong> ${messageData.propertyTitle}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #666;">
          ${messageData.message}
        </blockquote>
        <p>Log in to RentNest to reply.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to:', ownerEmail);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
```

4. **Deploy**:
   Run `firebase deploy --only functions`.
