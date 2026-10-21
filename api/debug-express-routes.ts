import express from 'express';

const app = express();
app.use(['/api/gemini', '/gemini'], (_request, _response, next) => next());
app.post(['/api/gemini/call-flash', '/gemini/call-flash'], (_request, response) => {
  response.status(200).json({ ok: true });
});
app.get(['/api/health', '/health'], (_request, response) => {
  response.status(200).json({ ok: true });
});

export default app;
