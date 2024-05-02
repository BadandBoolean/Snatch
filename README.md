## Basic info

1. This is a Next.js project.
2. **Pushing to main branch triggers a deployment to production**
3. Production is hosted on Vercel.
4. Use branch named `snatch-preview` or `snatch-preview-2` for preview deployments. Any other deployments are not authorised by Google Cloud console so some features will not work.
5. Don't work directly on main! Unless you are publishing a hotfix. but even then please don't :)

### Run locally:

`npm run dev` in **snatch/** folder

### Interact with database via prisma studio:

First make sure to run `npm install` to get all node dependencies.

Then run `npx prisma studio`

### More documentation to be added
