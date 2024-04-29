// pages/api/callback.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { state, code, error, error_description } = req.nextUrl.searchParams;
    const savedState = req.cookies.get('Auth_State');

    // Verify the state to prevent CSRF attacks
    if (!code || state !== savedState) {
        return new Response('Invalid request or state mismatch', { status: 403 });
    }

    // Handle any errors returned by the OAuth provider
    if (error) {
        return new Response(JSON.stringify({ error, error_description }), { status: 401 });
    }

    try {
        // Request to exchange the code for an access token
        const response = await axios.post('https://connect.squareup.com/oauth2/token', {
            client_id: process.env.SQ_APPLICATION_ID,
            client_secret: process.env.SQ_APPLICATION_SECRET,
            code,
            grant_type: 'authorization_code'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Return the access token securely
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        // Log the error and handle API call failures
        console.error('API call error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to obtain token from Square',
            detail: error.response?.data || 'No additional error information provided'
        }), {
            status: error.response?.status || 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
