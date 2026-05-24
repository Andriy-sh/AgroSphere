import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const { task_id } = await params;
    const EOSDA_API_KEY = process.env.EOSDA_API_KEY;

    const response = await axios.get(
      `https://api-connect.eos.com/api/gdw/api/${task_id}`,
      {
        headers: {
          'x-api-key': EOSDA_API_KEY || '',
        },
        responseType: 'arraybuffer',
      }
    );

    const contentType = response.headers['content-type'] || '';

    if (contentType.includes('application/json')) {
      const textDecoder = new TextDecoder();
      const jsonText = textDecoder.decode(response.data);
      const jsonData = JSON.parse(jsonText);
      return NextResponse.json(jsonData);
    } else {
      const buffer = Buffer.from(response.data);
      const signature = buffer.slice(0, 4);

      if (
        signature[0] === 0x89 &&
        signature[1] === 0x50 &&
        signature[2] === 0x4e &&
        signature[3] === 0x47
      ) {
        const base64 = buffer.toString('base64');
        return NextResponse.json({
          status: 'completed',
          result: {
            url: `data:image/png;base64,${base64}`,
            data: base64,
            contentType: 'image/png',
          },
        });
      } else {
        try {
          const textDecoder = new TextDecoder();
          const jsonText = textDecoder.decode(response.data);
          const jsonData = JSON.parse(jsonText);
          return NextResponse.json(jsonData);
        } catch {
          const base64 = buffer.toString('base64');
          const detectedType = contentType.includes('image/')
            ? contentType
            : 'image/png';
          return NextResponse.json({
            status: 'completed',
            result: {
              url: `data:${detectedType};base64,${base64}`,
              data: base64,
              contentType: detectedType,
            },
          });
        }
      }
    }
  } catch (error: unknown) {
    const errorObj = error as {
      response?: {
        status?: number;
        data?: unknown;
        headers?: Record<string, string>;
      };
    };

    if (errorObj.response?.data instanceof ArrayBuffer) {
      try {
        const textDecoder = new TextDecoder();
        const jsonText = textDecoder.decode(errorObj.response.data);
        const jsonData = JSON.parse(jsonText);
        return new NextResponse(JSON.stringify(jsonData), {
          status: errorObj.response.status || 500,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {
        return new NextResponse(JSON.stringify(errorObj.response.data), {
          status: errorObj.response.status || 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new NextResponse(
      JSON.stringify({
        status: 'error',
        error: 'Failed to fetch task status',
        details: errorObj.response?.data,
      }),
      {
        status: errorObj.response?.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
