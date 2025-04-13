const express = require("express");
const app = express();

// This works for both local development and Vercel
app.get("/", (req, res) => {
  res.send("Hello World from Node.js server deployed on Vercel!");
});

// Export the Express app for Vercel
module.exports = app;

// Start local server if not on Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
