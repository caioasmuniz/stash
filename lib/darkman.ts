import GObject, { register, property } from "ags/gobject";
import { exec, execAsync } from "ags/process";

const get = () => exec(`darkman get`);

@register({ GTypeName: "Darkman" })
export default class Darkman extends GObject.Object {
  static instance: Darkman;
  static get_default() {
    if (!this.instance) this.instance = new Darkman();
    return this.instance;
  }

  #mode = get();
  #icon = get() === "light"
    ? "weather-clear-symbolic"
    : "weather-clear-night-symbolic";

  @property(String)
  get mode() {
    return this.#mode;
  }

  set mode(mode) {
    execAsync(`darkman set ${mode}`).then(() => {
      this.#mode = mode;
      this.notify("mode");
    });
  }

  @property(String)
  get icon_name() {
    return this.#icon;
  }

  constructor() {
    super();
  }
}
