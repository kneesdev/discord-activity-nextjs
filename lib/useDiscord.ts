'use client';

import { useEffect, useState } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';

const discordSdk = new DiscordSDK(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!);

export function useDiscord() {
    const [channelName, setChannelName] = useState('');
    const [guildIconUrl, setGuildIconUrl] = useState<string | null>(null);

    useEffect(() => {
        async function setup() {
            await discordSdk.ready();

            let accessToken = sessionStorage.getItem('discord_access_token');

            if (!accessToken) {
                const { code } = await discordSdk.commands.authorize({
                    client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
                    response_type: 'code',
                    state: '',
                    prompt: 'none',
                    scope: ['identify', 'guilds', 'applications.commands'],
                });

                const res = await fetch('/.proxy/api/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });

                const data = await res.json();
                accessToken = data.access_token;

                if (!accessToken) {
                    throw new Error('Failed to obtain access token');
                }

                sessionStorage.setItem('discord_access_token', accessToken);
            }

            await discordSdk.commands.authenticate({ access_token: accessToken });

            if (discordSdk.channelId && discordSdk.guildId) {
                const channel = await discordSdk.commands.getChannel({
                    channel_id: discordSdk.channelId,
                });

                setChannelName(channel.name || 'Unknown');

                const guilds = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }).then((res) => res.json());

                const currentGuild = guilds.find((g: any) => g.id === discordSdk.guildId);

                if (currentGuild?.icon) {
                    setGuildIconUrl(
                        `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`
                    );
                }
            }
        }

        setup();
    }, []);

    return { channelName, guildIconUrl };
}