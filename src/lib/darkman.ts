import AstalIO from "gi://AstalIO?version=0.1";
import { register, Object, getter, setter } from "gnim/gobject";

const get = () => AstalIO.Process.exec(`darkman get`);

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
    AstalIO.Process.exec_async(`darkman set ${mode}`, () => {
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
