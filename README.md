# Sveltekit Password-less Login Demo

Github: https://github.com/Co1eCas3/sveltekit-auth-play

## The Goal

An authentication system using Sveltkit + MongoDB Atlas allowing users to provide only their email, no passwords. Upon login, user receives an email with a link containing a login token as a query parameter. They are logged in once they navigate to that link.

## The Process

1. Every route is checked for authentication in `hooks.js`
a. 

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
