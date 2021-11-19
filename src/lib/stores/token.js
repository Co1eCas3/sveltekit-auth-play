import { writable } from 'svelte/store'

let curToken,
  curTimer,
  error

const createTokenStore = () => {
  const { subscribe, set } = writable(false)

  return {
    subscribe,
    set: token => {
      curToken = token
      curTimer = startRefreshTimer(set)
      set(true)
    },
    use: () => ({
      Authorization: `Bearer: ${curToken}`
    }),
    unset: () => {
      curToken = null;
      (curTimer && clearTimeout(curTimer))
      curtimer = null
      set(false)
    },
    getError: () => error
  }
}

export const token = createTokenStore()

function startRefreshTimer(set) {
  return setTimeout(() => silentRefresh(set), /*(1000 * 60 * 5) -*/ 5000)
}

async function silentRefresh(set) {
  console.log('refreshing...')
  const refreshRes = await fetch('/api/auth/refresh.json')
  const data = await refreshRes.json()

  if (!refreshRes.ok) {
    console.log('didnt work')
    curToken = null;
    (curTimer && clearTimeout(curTimer))
    curTimer = null
    set(false)
    error = data
  } else {
    console.log('worked!')
    curToken = data.token;
    (curTimer && clearTimeout(curTimer))
    curTimer = startRefreshTimer(set)
    set(true)
  }
}

