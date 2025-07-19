# Discord Activity Next.js Boilerplate

Because Discord only provides an example using **Vite**, and not everybody uses Vite or wants to rewrite their project to fit that stack, this boilerplate offers a clean **Next.js** implementation for building [Discord Activities](https://discord.com/developers/docs/activities/overview).

## Why This Boilerplate?

Discord's official example uses Vite, which is great but not universal. Many developers work with Next.js, which offers many wonderful features like built-in API routes. This project fills that gap by showing how to:

- Use the Discord Embedded App SDK on the client
- Handle Discord OAuth2 code exchange on the server

## Getting Started

### 1. Clone this repository

Open a terminal window and clone the repository:

```bash
git clone https://github.com/kneesdev/discord-activity-nextjs.git
```

### 2. Install dependencies

Navigate to the repository directory you just cloned:

```bash
cd discord-activity-nextjs
```

Then install the dependencies and start up the Next.js development server:

```
# install deps
npm i

# start server
npm run dev
```

If you visit [http://localhost:3000/](http://localhost:3000/) you should see "Discord Activity Next.js Boilerplate", with a client-side error opening right after. **Don't worry, this is normal.**

### 3. Set up a public endpoint

In order for your activity to work properly (even in development), you need to expose it to the internet. To do that, create a tunnel with a reverse proxy such as [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/).

Open another terminal window *(do __not__ close the one running the server)* and start a tunnel that listens to the server port (usually `3000`):
```bash
cloudflared tunnel --url http://localhost:3000
```

Once you run that command, a publicly-accessible URL will be created and you'll see something like that in the terminal:
```
Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://evaluated-sk-hostel-cases.trycloudflare.com
```

### 4. Setup your Discord Application

* Go to the [Discord Developer Portal](https://discord.com/developers/applications)
* Create or select an existing application
* Go to the **Installation** tab, and make sure only **Guild Install** is enabled under **Installation Contexts**. If **User Install** is enabled, disable it.
* Under **Activities**:
  * Go to **URL Mappings** and set **Root Mapping** `/` target to the publicly-accessible URL from earlier.
  * Go to **Settings** and enable **Enable Activities**
* Under **OAuth2 → Redirects**, add a redirect URI:  
  * `https://127.0.0.1` (Discord recommends this exact URI as a placeholder in development)
* Go to the **OAuth2** tab, and note your **Client ID** and **Client Secret** under **Client Information**

### 5. Configure environment variables

Copy the existing `example.env` to `.env` and edit `NEXT_PUBLIC_DISCORD_CLIENT_ID`, `DISCORD_CLIENT_ID`, and `DISCORD_CLIENT_SECRET` to the **Client ID** and **Client Secret** values you copied earlier from the **OAuth2** tab.

```env
NEXT_PUBLIC_DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID_HERE
DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID_HERE # enter exact same client id
DISCORD_CLIENT_SECRET=YOUR_DISCORD_CLIENT_SECRET
```

#### Go to a server you manage, join a voice channel, and launch the Activity!

## How It Works

1. `useDiscord` hook initializes the Discord SDK and attempts silent OAuth with `prompt: "none"`.

2. Discord returns an OAuth2 code, exchanged server-side via `/api/token` using your client secret.

3. After retrieving the access token, the SDK calls `commands.authenticate()` with that token.

4. The hook fetches and displays the voice channel name (`getChannel()`) and guild icon via the Discord API.

## References

* [Discord Activity Guide](https://discord.com/developers/docs/activities/building-an-activity)
* [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
* [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)