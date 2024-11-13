# Replate

https://replate.food

Replate is a food recipe generation app and semi-social media platform for recipes. Images are from Unsplash and recipes are generated via OpenAI.

This is our entry into the SolidJS hackathon 2024.

Team is [Paul](https://x.com/paulpopus) and [Shelly](https://www.instagram.com/shellsterstudios/profilecard/).

This project was started on Oct 19 2024.

## API

The backend and API we used for authentication, ORM, holding data and endpoints is [Payload](https://payloadcms.com/).

Images are fetched from Unsplash via their API. Recipes are generated via OpenAI. Images are stored on R2 from Cloudflare.

## App

Frontend is built with SolidJS. We tried to build to best practices but this was my first project with SolidJS and hit some weird hurdles towards the end trying to get it deployed in time for the hackathon deadline.

## Local development

We've kept the two apps installed separately due to interfering ts configurations. I recommend using `pnpm` as a package manager as you'll likely have peer dependency issues installing with npm or yarn.

### Backend

Copy the `.env.example` to `.env` and fill in the missing keys for Unsplash, OpenAI and R2. All of which have free tiers.

> Note that R2 is technically optional, if you disable the s3Storage plugin in Payload you should be able to host these on your local filesystem.

The database is mongodb. I've supplied a docker-compose that I use for local development with mongo. You can run it with `docker compose up -d` or you can instead use a mongo db connection string to a cloud service.

Install dependencies

```bash
pnpm i
```

Then run dev

```bash
pnpm dev
```

Payload should begin compiling and should be accessible at `localhost:3000/admin`.

You can now create your first user and give them the admin role to be able to access the admin panel.

### Frontend

Copy the `.env.example` to `.env` and fill in the missing keys. You will need to provide the DB connection string here as well since we use the local API of Payload in the backend of SolidJS directly, sorry it's gonna be a bit messy...

Install dependencies

```bash
pnpm i
```

Then run dev

```bash
pnpm dev
```

Your frontend should now run at `localhost:3001` as it bumps the port if it's use. You can specify specific ports for either service via `--port 3005`
