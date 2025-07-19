import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { code } = await req.json();

    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_CLIENT_ID!);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET!);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const data = await tokenRes.json();

    return NextResponse.json(data);
}
