import GTop from "gi://GTop";
import { useSettings } from "../../lib/settings";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import AstalIO from "gi://AstalIO?version=0.1";
import { Accessor, createState } from "gnim";


export default ({ vertical }: { vertical: Accessor<boolean> }) => {
  const settings = useSettings()

  const [lastCpuTop, setLastCpuTop] = createState(new GTop.glibtop_cpu())
  const [cpu, setCpu] = createState(0)
  const [memory, setMemory] = createState(0)
  const [disk, setDisk] = createState(0)
  const [temp, setTemp] = createState(0)
  const INTERVAL = 1000;

  setInterval(() => {
    const cpuTop = new GTop.glibtop_cpu()
    GTop.glibtop_get_cpu(cpuTop);
    const total = cpuTop.total - lastCpuTop.get().total;
    const user = cpuTop.user - lastCpuTop.get().user;
    const sys = cpuTop.sys - lastCpuTop.get().sys;
    const nice = cpuTop.nice - lastCpuTop.get().nice;
    setLastCpuTop(cpuTop)
    setCpu((user + sys + nice) / total);

    const memTop = new GTop.glibtop_mem()
    GTop.glibtop_get_mem(memTop);
    setMemory(memTop.user / memTop.total);

    const diskTop = new GTop.glibtop_fsusage()
    GTop.glibtop_get_fsusage(diskTop, "/");
    setDisk(diskTop.bavail / diskTop.bfree);

    if (settings.bar.tempPath.get())
      setTemp(parseInt(
        AstalIO.Process.exec(`cat ${settings.bar.tempPath}`)
      ) / 100000)
    else
      setTemp(-1)
  }, INTERVAL)

  const Indicator = ({ value, label, unit, vertical, visible = true }:
    {
      value: Accessor<number>,
      label: string,
      unit: string,
      vertical: Accessor<boolean>,
      visible?: Accessor<boolean> | boolean
    }) => <Gtk.Box
      visible={visible}
      spacing={2}
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}>
      <Gtk.Label
        label={label}
        cssClasses={["caption-heading"]} />
      <Gtk.LevelBar
        orientation={vertical.as(v => v ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL)}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        inverted={vertical}
        value={value}
        widthRequest={vertical.as(v => v ? -1 : 50)}
        heightRequest={vertical.as(v => v ? 50 : -1)}
      />
      <Gtk.Label
        cssClasses={["caption"]}
        label={value(v => (v * 100)
          .toFixed(0)
          .concat(unit))} />
    </Gtk.Box>

  return <Gtk.Button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    onClicked={() =>
      settings.bar.systemMonitor ?
        AstalIO.Process.exec_async((
          settings.bar.systemMonitor as Accessor<any>)
          .get()
        ) : null}>
    <Gtk.Box
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}
      spacing={4}>
      <Indicator
        vertical={vertical}
        value={cpu}
        label="CPU"
        unit="%" />
      <Indicator
        vertical={vertical}
        value={memory}
        label="RAM"
        unit="%" />
      <Indicator
        visible={temp.as(t => t >= 0)}
        vertical={vertical}
        value={temp}
        label="TEMP"
        unit="°C" />
      <Indicator
        vertical={vertical}
        visible={false}
        value={disk}
        label="DISK"
        unit="%" />
    </Gtk.Box>
  </Gtk.Button >
}