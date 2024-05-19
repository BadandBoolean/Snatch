# Technical Super Task List

The following is a rough split of all the technical (i.e coding) work items that need to be done, split roughly into feature/experience categories. Open for discussion.

User Experience:

1. Deprecate Market side (i.e simplify)
2. UI redesign to prototype design
3. Add other auth providers for better sign in experience.
4. QR code screen per salon (todo prototype mockup for this)
5. add terms of service, privacy policy for texting.
6. better provider sign up experience

Notification System:

1. Integrate API call to LLM model for text message generation.
2. Customer interaction with text to secure appointment
3. Message customization for provider
4. payment/secure appointment via text
5. integrate LLM model into customer insight for recurring clients for personalised text messaging
6. "no spam" logic - customize repetitiveness of text messaging to specific clients.
7. number of texts sent meter

Database:

1. refactor
2. simplify
3. delete deprecated models

DevOps:

1. Better logging.

BUGS:

1. Fix time stamps for automatically listed appointments not switching to user's local time (stored in UTC in database). Visible in UI in prod.
