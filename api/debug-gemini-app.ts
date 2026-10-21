type DebugResponse = {
  status: (code: number) => DebugResponse;
  json: (body: unknown) => void;
};

export default async function handler(_request: unknown, response: DebugResponse): Promise<void> {
  try {
    const module = await import('./[...path]');
    response.status(200).json({
      ok: true,
      exports: Object.keys(module),
      appType: typeof module.default,
    });
  } catch (error: unknown) {
    const record = typeof error === 'object' && error !== null
      ? error as { name?: unknown; message?: unknown }
      : {};
    response.status(500).json({
      ok: false,
      name: typeof record.name === 'string' ? record.name : 'UnknownError',
      message: typeof record.message === 'string' ? record.message.slice(0, 500) : 'Unknown API module failure',
    });
  }
}
