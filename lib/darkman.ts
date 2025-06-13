import { register, Object, getter, setter } from "ags/gobject";
import { exec, execAsync } from "ags/process";

const get = () => exec(`darkman get`);

@register({ GTypeName: "Darkman" })
export default class Darkman extends Object {
  static instance: Darkman;
  static get_default() {
    if (!this.instance) this.instance = new Darkman();
    return this.instance;
  }

  #mode = get();
  #icon = get() === "light"
    ? "weather-clear-symbolic"
    : "weather-clear-night-symbolic";

  @getter(String)
  get mode() {
    return this.#mode;
  }

  @setter(String)
  set mode(mode) {
    execAsync(`darkman set ${mode}`).then(() => {
      this.#mode = mode;
      this.notify("mode");
    });
  }

  @getter(String)
  get icon_name() {
    return this.#icon;
  }

  constructor() {
    super();
  }
}
