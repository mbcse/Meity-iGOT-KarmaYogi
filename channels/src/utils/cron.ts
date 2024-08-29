const cron = require('node-cron');
const express = require('express');
const { syncEmailController } = require('./controllers/syncEmailController'); // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Define the cron job to run every 5 minutes (adjust as needed)
cron.schedule('*/5 * * * *', async () => {
  try {
    // Example emailID; you might want to loop through all email accounts
    await syncEmailController({ params: { emailID: 'example@example.com' } }, { status: (code:any) => ({ json: (data) => console.log(data) }) });
  } catch (error) {
    console.error('Error during scheduled email sync:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
