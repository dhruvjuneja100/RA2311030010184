const axios = require('axios');

async function register() {
  try {
    const response = await axios.post(
      'http://20.207.122.201/evaluation-service/register',
      {
        email: "dj9506@srmist.edu.in",
        name: "Dhruv Juneja",
        mobileNo: "7015649670",
        githubUsername: "dhruvjuneja100",
        rollNo: "RA2311030010184",
        accessCode: "QkbpxH"
      }
    );
    console.log("Registration successful!");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
  }
}

register();