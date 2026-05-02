const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      'http://20.207.122.201/evaluation-service/logs',
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );
    console.log(`[LOG SUCCESS] ${stack} | ${level} | ${pkg} | ${message}`);
    return response.data;
  } catch (error) {
    console.error(`[LOG FAILED]`, error.response?.data || error.message);
  }
}

module.exports = { Log };