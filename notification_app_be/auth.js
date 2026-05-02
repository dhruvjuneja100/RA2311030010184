const axios = require('axios');

async function getToken() {
  try {
    const response = await axios.post(
      'http://20.207.122.201/evaluation-service/auth',
      {
        email: "dj9506@srmist.edu.in",
        name: "Dhruv Juneja",
        rollNo: "RA2311030010184",
        accessCode: "QkbpxH",  
        clientID: "9a66ed87-200d-4488-a4f8-f3ac882489bd", 
        clientSecret: "syvezcrDgyMTGwXJ" 
      }
    );
    console.log("Token received!");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
  }
}

getToken();