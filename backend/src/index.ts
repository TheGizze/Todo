import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (_req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(port, () => console.log(`Backend running on port ${port}`));
}

// Export the app for testing
export default app;