import { createExternal } from "gnim"

type T = any

export const createPoll = (init: T, interval: number, callback: (v:T) => T) => {
  return createExternal(init, set => {
    const interval = setInterval(() => set(callback))
    return () => clearInterval(interval)
  })
}