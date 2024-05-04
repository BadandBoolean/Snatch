# WELCOME TO SNATCH

## Basic Info/Quick Start

1. This is a Next.js project.
2. **Pushing to main branch triggers a deployment to production**
3. Production is hosted on Vercel.
4. Use branch named `snatch-preview` or `snatch-preview-2` for preview deployments. Any other deployments are not authorised by Google Cloud console so some features will not work.
5. Don't work directly on main! Unless you are publishing a hotfix. but even then please don't :)

### Run locally:

`npm run dev` in **snatch/** folder
This should launch on localhost:3000/

### Interact with database via prisma studio:

First make sure to run `npm install` to get all node dependencies.

Then run `npx prisma studio`

This should launch on localhost:5555/

---

## More details

### Databases (General)

2 databases, both hosted on supabase. Refer to env for urls.

1. PROD ONLY. Known as `snatch-db-prod` [Located here](https://supabase.com/dashboard/project/svcbftyheqgzillqonol)

- **IMPORTANT: DO NOT `npx prisma migrate deploy` locally.** All prod db changes are down in the Vercel deployment pipeline. In theory you shouldn't even be able to change it locally.

2. Development and Preview. Known as `snatch-db` [Located here](https://supabase.com/dashboard/project/togptyibypxfzbmbbsmi)

In source code, we use Prisma as our ORM to interact with the database. See below:

### Prisma

Prisma is goated and very easy to use. Interact with database with it, Here's how:

1. **Changing the schema (schema.prisma)?** `npx prisma migrate dev` in the CLI.

#### Prisma Accelerate

Accelerate is a global database cache and scalable connection pool that helps improve database performance in Serverless and Edge applications. Since Vercel is Serverless, it has MASSIVELY helped us with speed, and database timeouts. It is fully up and running and shouldn't need any touching at all.

#### Quick Resource Links

[Docs - ORM](https://www.prisma.io/docs/orm)
[Docs - Accelerate](https://www.prisma.io/docs/accelerate)
[CRUD](https://www.prisma.io/docs/orm/prisma-client/queries/crud)

### Cloudflare Workers

We have a cloudflare worker calling 3 API endpoints every minute to perform various functions:

1. https://wearesnatch.com/ <= Keeps site warm, prevents cold starts
2. https://wearesnatch.com/api/deloodappt <= deloodappt = **D**elete **O**ut **O**f **D**ate **A**ppointments. Cleans server of all appointments in the past.
3. https://wearesnatch.com/api/synccals <= Pulls changes from calendars of businesses and processes them.

To do changes 2. and 3. in development you will need to manually hit **_localhost:3000/_ \***

[Link to cloudflare workers (you'll need a login)](https://dash.cloudflare.com/8a3bef4a1c3448a7b59a6b517ddd2932/workers-and-pages)

### More documentation coming soon.
