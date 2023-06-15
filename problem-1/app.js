//Initialising express framework and axios library
//They perform HTTP requests
const express = require('express');
 const axios = require('axios');

const app = express();
const port_no = 8008; //port number on which the services runs

app.get('/numbers', async (req, res) => {
  
  try {
    const { url } = req.query; //This will hold the params given the URL
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' }); //For invalid URL requests
    }

    const urlList = Array.isArray(url) ? url : [url];
    const results = await Promise.all(
      urlList.map(async (url) => {
        try {
          const response = await Promise.race([
            axios.get(url),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 5000))
          ]);

          return response.data;
        } catch (error) {
          return { error: `Failed to fetch data from ${url}` };
        }
      })
    );


    res.json(results); //Fetching the data if there is no error.
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }); //For any error, this will be displayed
  }
});

app.listen(port_no, () => {
  console.log(`Listening at port ${port_no}...`);
});
