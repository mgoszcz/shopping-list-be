const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const teardown = require("./jest.teardown");

const DB_PATH = "./db/database.sqlite";
const TEST_DB = "./tests/assets/test_database.sqlite";

beforeEach((done) => {
  if (fs.existsSync(DB_PATH)) {
    console.log("Removing DB file");
    fs.unlinkSync(DB_PATH);
  }
  console.log("Copy test database");
  fs.copyFileSync(TEST_DB, DB_PATH);

  console.log("Start server");
  // Start the server
  global.serverProcess = exec("node index.js", {});

  // global.serverProcess.stdout.on("data", (data) => {
  //   console.log(`Server Output: ${data}`);
  // });

  // Capture standard error (errors, warnings, etc.)
  global.serverProcess.stderr.on("data", (data) => {
    console.error(`Server Error: ${data}`);
    throw new Error("Server failed");
  });

  // Handle server exit
  // global.serverProcess.on("close", (code) => {
  //   console.log(`Server process exited with code ${code}`);
  // });

  // Wait for the server to start (adjust the delay if needed)
  setTimeout(() => done(), 1000);
});

afterEach((done) => {
  // Stop the server
  if (serverProcess) {
    serverProcess.kill();
  }

  done();
});
