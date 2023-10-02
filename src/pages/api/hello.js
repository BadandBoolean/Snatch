// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// LOGGER HELP
// log.debug('Login attempt', { user: 'j_doe', status: 'success' }); // results in {"message": "Login attempt", "fields": {"user": "j_doe", "status": "success"}}
// log.info('Payment completed', { userID: '123', amount: '25USD' });
// log.warn('API rate limit exceeded', { endpoint: '/users/1', rateLimitRemaining: 0 });
// log.error('System Error', { code: '500', message: 'Internal server error' });

// CLIENT

// 'use client';
// import { useLogger } from 'next-axiom';

// export default function ClientComponent() {
//   const log = useLogger();
//   log.debug('User logged in', { userId: 42 });
//   return <h1>Logged in</h1>;
// }

// SERVER

// import { Logger } from 'next-axiom';

// export default async function ServerComponent() {
//   const log = new Logger();
//   log.info('User logged in', { userId: 42 });

//   // ...

//   await log.flush();
//   return <h1>Logged in</h1>;
// }

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

// HELLO FUTURE ME THIS IS WHAT WE DID AND WHATWE HAVE TO CONSIDER TOMORROW:

// 1. we are doing the entire distance/sorting by dist process in HomeAppointmentsView.js. The handle functions for filterbylocation
// and picksalon simply set the states which determine the activity in HomeAppointmentsView.js.
// 2. how do we await the useStates to change before we do any of the conditional fetching?
