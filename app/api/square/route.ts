// app/api/square/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response(`Method Not Allowed`, { status: 405 });
    }

    try {
        const response = await axios.get('https://connect.squareupsandbox.com/v2/catalog/list', {
            headers: {
                'Square-Version': '2024-04-17',
                'Authorization': 'Bearer EAAAl-Kdj11vesbZ7IgOjBAuzuFfMzwbRRk_VnO8SCILMwPQ7OXmc8pQf6yAgfDx', // Replace with your actual bearer token
                'Content-Type': 'application/json'
            }
        });
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('API call error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Square' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
