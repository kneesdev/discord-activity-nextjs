'use client';

import { useDiscord } from '@/lib/useDiscord';

export default function Home() {
  const { channelName, guildIconUrl } = useDiscord();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-2">
      <h1 className="text-4xl font-semibold tracking-tight">Discord Activity Next.js Boilerplate</h1>
      {guildIconUrl && channelName && (
        <div className="flex justify-center items-center rounded-lg shadow gap-2 px-2 py-1 bg-zinc-800 border border-zinc-700">
          <img
            src={guildIconUrl}
            alt=""
            className="size-8 rounded-md"
          />
          <span
            className="text-zinc-100 text-base font-medium"
          >
            {channelName}
          </span>
        </div>
      )}
    </main>
  );
}