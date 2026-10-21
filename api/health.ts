type HealthResponse = {
  status: number;
  json: (body: { status: string; hasGeminiKey: boolean }) => void;
};

export default function handler(_request: unknown, response: HealthResponse): void {
  response.status(200);
  response.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}
