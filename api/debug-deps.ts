import express from 'express';
import { GoogleGenAI } from '@google/genai';

type DebugResponse = {
  status: (code: number) => DebugResponse;
  json: (body: unknown) => void;
};

const app = express();

export default function handler(_request: unknown, response: DebugResponse): void {
  response.status(200).json({
    expressType: typeof app,
    genaiType: typeof GoogleGenAI,
  });
}
