const { Log } = require('./index');

async function testLogging() {
  // test 1 - info log
  await Log("backend", "info", "middleware", "Logging middleware initialized successfully");
  
  // test 2 - error log
  await Log("backend", "error", "handler", "received string, expected bool");
  
  // test 3 - debug log
  await Log("backend", "debug", "db", "Database connection established");
  
  // test 4 - fatal log
  await Log("backend", "fatal", "db", "Critical database connection failure");
  
  // test 5 - warn log
  await Log("backend", "warn", "service", "Service response time exceeding threshold");
}

testLogging();