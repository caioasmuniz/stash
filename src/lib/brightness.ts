import AstalIO from "gi://AstalIO?version=0.1";
import { register, Object, getter, setter } from "gnim/gobject";

const get = (args: string) => Number(AstalIO.Process.exec(`brightnessctl ${args}`));
const screen = AstalIO.Process.exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`);
const kbd = AstalIO.Process.exec(`bash -c "ls -w1 /sys/class/leds | head -1"`);

@register({ GTypeName: "Brightness" })
export default class Brightness extends Object {
  static instance: Brightness;
  static get_default() {
    if (!this.instance) this.instance = new Brightness();

    return this.instance;
  }

  #kbdMax = get(`--device ${kbd} max`);
  #kbd = get(`--device ${kbd} get`);
  #screenMax = get("max");
  #screen = get("get") / (get("max") || 1);

  @getter(Number)
  get kbd() {
    return this.#kbd;
  }

  @setter(Number)
  set kbd(value) {
    if (value < 0 || value > this.#kbdMax) return;

    AstalIO.Process.exec_async(
      `brightnessctl -d ${kbd} s ${value} -q`,
      () => {
        this.#kbd = value;
        this.notify("kbd");
      }
    );
  }

  @getter(Number)
  get screen() {
    return this.#screen;
  }

  @setter(Number)
  set screen(percent) {
    if (percent < 0) percent = 0;

    if (percent > 1) percent = 1;

    AstalIO.Process.exec_async(
      `brightnessctl set ${Math.floor(percent * 100)}% -q`,
      () => {
        this.#screen = percent;
        this.notify("screen");
      }
    );
  }

  constructor() {
    super();

    const screenPath = `/sys/class/backlight/${screen}/brightness`;
    const kbdPath = `/sys/class/leds/${kbd}/brightness`;

    AstalIO.monitor_file(screenPath, async (f) => {
      const v = await AstalIO.read_file_async(f);
      this.#screen = Number(v) / this.#screenMax;
      this.notify("screen");
    });

    AstalIO.monitor_file(kbdPath, async (f) => {
      const v = await AstalIO.read_file_async(f);
      this.#kbd = Number(v) / this.#kbdMax;
      this.notify("kbd");
    });
  }
}
