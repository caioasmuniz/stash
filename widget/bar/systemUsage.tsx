import { bind, Binding, execAsync, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";
import GTop from "gi://GTop";
import Pango from "gi://Pango?version=1.0";

const lastCpuTop = Variable(new GTop.glibtop_cpu())
const INTERVAL = 1000;

const cpu = Variable(0)
  .poll(INTERVAL, () => {
    const cpuTop = new GTop.glibtop_cpu()
    GTop.glibtop_get_cpu(cpuTop);
    const total = cpuTop.total - lastCpuTop.get().total;
    const user = cpuTop.user - lastCpuTop.get().user;
    const sys = cpuTop.sys - lastCpuTop.get().sys;
    const nice = cpuTop.nice - lastCpuTop.get().nice;
    lastCpuTop.set(cpuTop)
    return (user + sys + nice) / total;
  })

const memory = Variable(0)
  .poll(INTERVAL, () => {
    const memTop = new GTop.glibtop_mem()
    GTop.glibtop_get_mem(memTop);
    return memTop.user / memTop.total;
  })

const disk = Variable(0)
  .poll(INTERVAL, () => {
    const diskTop = new GTop.glibtop_fsusage()
    GTop.glibtop_get_fsusage(diskTop, "/");
    return diskTop.bavail / diskTop.bfree;
  })

const temp = Variable(0)
  .poll(1000,
    `cat /sys/class/hwmon/hwmon3/temp1_input`,
    out => parseInt(out) / 100000)


const Indicator = ({ value, label, unit, vertical }:
  {
    value: Binding<number>,
    label: string,
    unit: string,
    vertical: boolean
  }) => <levelbar
    orientation={vertical ?
      Gtk.Orientation.VERTICAL :
      Gtk.Orientation.HORIZONTAL}
    inverted={vertical}
    value={bind(value)}
    widthRequest={vertical ? -1 : 50}
    heightRequest={vertical ? 50 : -1}>
    <box
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      spacing={2}
      vertical={vertical}>
      <label
        label={label}
        cssClasses={["title"]} />
      <label
        cssClasses={["body"]}
        label={bind(value)
          .as(v => (v * 100)
            .toFixed(0)
            .concat(unit))} />
    </box>
  </levelbar >

export default ({ vertical }: { vertical: boolean }) =>
  <button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    onClicked={() => execAsync(["resources"])}
    cssClasses={["pill", "sys-usage"]}>
    <box
      hexpand={vertical}
      vexpand={!vertical}
      vertical={vertical}
      spacing={4}>
      <Indicator
        vertical={vertical}
        value={bind(cpu)}
        label="CPU"
        unit="%" />
      <Indicator
        vertical={vertical}
        value={bind(memory)}
        label="RAM"
        unit="%" />
      <Indicator
        vertical={vertical}
        value={bind(temp)}
        label="TEMP"
        unit="°C" />
      {/* <Indicator
        vertical={vertical}
        value={bind(disk)}
        label="DISK"
        unit="%" /> */}
    </box>
  </button >
