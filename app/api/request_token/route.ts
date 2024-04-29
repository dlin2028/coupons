// pages/api/request_token.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    // Generate a cryptographic random state
    const state = crypto.randomBytes(32).toString('hex');
    const clientId = process.env.SQ_APPLICATION_ID;
    const scopes = [
        "ITEMS_READ",
        "MERCHANT_PROFILE_READ",
        "PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS",
        "PAYMENTS_WRITE",
        "PAYMENTS_READ"
    ].join('+');

    const basePath = (process.env.SQ_ENVIRONMENT?.toLowerCase() === 'production')
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    const url = `${basePath}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=${scopes}&state=${state}`;

    const headers = new Headers();
    headers.append('Set-Cookie', `Auth_State=${state}; Max-Age=300; Path=/; HttpOnly; SameSite=Strict`);
    headers.append('Location', url);

    return new Response(null, {
        status: 302,
        headers: headers
    });
}
