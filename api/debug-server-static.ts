import app from '../server';

type DebugResponse = {
  status: (code: number) => DebugResponse;
  json: (body: unknown) => void;
};

export default function handler(_request: unknown, response: DebugResponse): void {
  response.status(200).json({
    ok: true,
    appType: typeof app,
  });
}
