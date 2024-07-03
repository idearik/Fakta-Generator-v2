const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');
const base64 = require('base-64');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

const serviceAccount = JSON.parse(base64.decode(process.env.GOOGLE_SERVICE_ACCOUNT));

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

app.get('/', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1rUWXBFW6f_rlJlUgKADpo_Bag0lkDSxKsTRobOPguZ8',
      range: 'Sheet1!A2:B',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in the spreadsheet.');
    }

    const randomIndex = Math.floor(Math.random() * rows.length);
    const randomRow = rows[randomIndex];
    const year = randomRow[0];
    const fact = randomRow[1];

    res.render('index', { year, fact });
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).send('Error retrieving data');
  }
});

app.get('/fact', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1rUWXBFW6f_rlJlUgKADpo_Bag0lkDSxKsTRobOPguZ8',
      range: 'Sheet1!A2:B',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in the spreadsheet.');
    }

    const randomIndex = Math.floor(Math.random() * rows.length);
    const randomRow = rows[randomIndex];
    const year = randomRow[0];
    const fact = randomRow[1];

    res.json({ year, fact });
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).send('Error retrieving data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
