import { writable } from 'svelte/store'

export const message = createMessageStore()

let timer;

function createMessageStore() {
  const { subscribe, set } = writable(null)

  function show(message) {
    if (timer) clearTimeout(timer)
    set(message)
  }

  function showNClose(message) {
    set(message)
    if (timer) clearTimeout(timer)
    timer = setTimeout(close, 3500)
  }

  function close() {
    if (timer) clearTimeout(timer)
    timer = null
    set(null)
  }

  return {
    subscribe,
    show,
    showNClose,
    close
  }
}