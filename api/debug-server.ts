type DebugResponse = {
  status: (code: number) => DebugResponse;
  json: (body: unknown) => void;
};

export default async function handler(_request: unknown, response: DebugResponse): Promise<void> {
  try {
    const serverModule = await import('../server');
    response.status(200).json({
      ok: true,
      exports: Object.keys(serverModule),
    });
  } catch (error: unknown) {
    const record = typeof error === 'object' && error !== null
      ? error as { name?: unknown; message?: unknown }
      : {};
    response.status(500).json({
      ok: false,
      name: typeof record.name === 'string' ? record.name : 'UnknownError',
      message: typeof record.message === 'string' ? record.message.slice(0, 300) : 'Unknown server import failure',
    });
  }
}
