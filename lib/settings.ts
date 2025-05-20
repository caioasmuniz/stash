import { readFile, writeFileAsync } from "ags/file";
import GObject, { register, property } from "ags/gobject";
import { Gtk } from "ags/gtk4";

const PATH = "/run/user/1000/stash.json"

@register({ GTypeName: "Settings" })
export default class Settings extends GObject.Object {
  static instance: Settings;
  static get_default() {
    if (!this.instance) this.instance = new Settings();
    return this.instance;
  }

  #barOrientation = Gtk.Orientation.VERTICAL

  @property(Number)
  get barOrientation() {
    return this.#barOrientation;
  }

  #updateFile(key: string, value: any) {
    writeFileAsync(PATH, JSON.stringify({
      ...JSON.parse(readFile(PATH)),
      [key]: value
    }))
  }

  set barOrientation(orientation) {
    this.#updateFile("barOrientation", orientation)
    this.#barOrientation = orientation;
    this.notify("bar-orientation")
  }

  constructor() {
    super();
    const file = JSON.parse(readFile(PATH))
    this.barOrientation = file.barOrientation
  }
}
