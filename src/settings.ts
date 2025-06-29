import { createContext, createSettings } from "gnim"

type Todo = {
  label: string
  done: boolean
}

export function isTodo(todo: Record<string, unknown>): todo is Todo {
  const label = "label" in todo && typeof todo.label === "string"
  const done = "done" in todo && typeof todo.done === "boolean"
  return label && done
}

export const schema = Object.freeze({
  todos: "aa{sv}",
})

type Settings = ReturnType<typeof createSettings<typeof schema>>

export const SettingsContext = createContext<Settings | null>(null)

export function useSettings() {
  const settings = SettingsContext.use()
  if (!settings) throw Error("settings not in scope")
  return settings
}
