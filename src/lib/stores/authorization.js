import { writable } from 'svelte/store'
import { session } from '$app/stores'

export const authorization = createAuthorizationStore()

let token, timer;

function createAuthorizationStore() {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    request,
    get: async loginToken => await get(loginToken, set),
    refresh: async () => await refresh(set),
    use,
    revoke: async email => await revoke(email, set)
  }
}

async function request(email) {
  return await fetch('/api/auth/login.json', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
}

async function get(loginToken, set) {
  const url = `/api/auth/login.json?token=${loginToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (res.ok) {
    token = data.token;
    timer = startRefreshTimer(set);
    set(true);
    return { ok: true, user: data.user }
  }

  set(false)
  return { ok: false, authError: data.message }
}

async function refresh(set) {
  const res = await fetch('/api/auth/refresh.json')
  const data = await res.json()

  if (res.ok) {
    token = data.token;
    (timer && clearTimeout(timer))
    timer = startRefreshTimer(set)
    set(true)
    return { ok: true, user: data.user }
  }

  token = null;
  (timer && clearTimeout(timer))
  timer = null
  set(false)
  return { ok: false, authError: data.message }
}

async function use(url, fetchOpts) {
  const authHeader = { Authorization: `Bearer: ${token}` }
  fetchOpts.headers = fetchOpts.hasOwnProperty('headers')
    ? { ...fetchOpts.headers, ...authHeader }
    : authHeader;

  const res = await fetch(url, fetchOpts);
  const data = await res.json()

  return { status: res.status, data }
}

async function revoke(email, set) {
  const res = await fetch('/api/auth/logout.json', {
    method: 'POST',
    body: JSON.stringify({ email })
  })

  token = null;
  (timer && clearTimeout(timer))
  timer = null
  set(false)
  return { ok: res.ok }
}

function startRefreshTimer(set) {
  return setTimeout(async () => {
    const res = await refresh(set)
    if (!res.ok) {
      window.dispatchEvent(
        new CustomEvent('authorizationFailed', { detail: { message: res.authError } })
      )
    }
  }, (1000 * 60 * 5) - 5000);
}