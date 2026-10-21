type DebugResponse = {
  status: (code: number) => DebugResponse;
  json: (body: unknown) => void;
};

export default async function handler(_request: unknown, response: DebugResponse): Promise<void> {
  try {
    const module = await import('../src/server/geminiHandlers');
    response.status(200).json({
      ok: true,
      exports: Object.keys(module),
      handlerType: typeof module.createGeminiHandler,
    });
  } catch (error: unknown) {
    const record = typeof error === 'object' && error !== null
      ? error as { name?: unknown; message?: unknown; stack?: unknown }
      : {};
    response.status(500).json({
      ok: false,
      name: typeof record.name === 'string' ? record.name : 'UnknownError',
      message: typeof record.message === 'string' ? record.message.slice(0, 500) : 'Unknown handler module failure',
      stack: typeof record.stack === 'string' ? record.stack.slice(0, 1_000) : undefined,
    });
  }
}
