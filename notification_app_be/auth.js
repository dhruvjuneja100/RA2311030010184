const axios = require('axios');
const fs = require('fs');

async function getToken() {
  try {
    const response = await axios.post(
      'http://20.207.122.201/evaluation-service/auth',
      {
        email: "dj9506@srmist.edu.in",
        name: "dhruv juneja",
        rollNo: "RA2311030010184",
        accessCode: "QkbpxH",
        clientID: "9a66ed87-200d-4488-a4f8-f3ac882489bd",
        clientSecret: "syvezcrDgyMTGwXJ"
      }
    );
    const token = response.data.access_token;
    fs.writeFileSync('../token.txt', token);
    console.log("Token saved to token.txt!");
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
  }
}

getToken();