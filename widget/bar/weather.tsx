import { Gdk, Gtk } from "ags/gtk4"
import { bind } from "ags/state"
import Weather from "../../lib/weather"

const weather = Weather.get_default()

const Popover = () => <Gtk.Popover
  valign={Gtk.Align.CENTER}
  halign={Gtk.Align.CENTER}
  hasArrow={false}>
  <box
    orientation={Gtk.Orientation.VERTICAL}
    css={"padding:4px;"}>
    <label
      cssClasses={["title-1"]}
      label="Weather" />
    <box>
      <image
        pixelSize={84}
        iconName={bind(weatherInfo)
          .as(w => w.iconName || "")}
      />
      <box orientation={Gtk.Orientation.VERTICAL}>
        <label label={bind(weatherInfo)
          .as(w => w.conditions || "")} />
        <box>
          <image iconName={"go-top-symbolic"} />
          <label label={bind(weatherInfo)
            .as(w => w.tempMax?.toString() || "")} />
        </box>
        <box>
          <image iconName={"go-bottom-symbolic"} />
          <label label={bind(weatherInfo)
            .as(w => w.tempMin?.toString() || "")} />
        </box>

        <box>
          <image iconName={"daytime-sunrise-symbolic"} />
          <label label={bind(weatherInfo)
            .as(w => w.sunrise?.format("%H:%M") || "")} />
        </box>
        <box>
          <image iconName={"daytime-sunset-symbolic"} />
          <label label={bind(weatherInfo)
            .as(w => w.sunset?.format("%H:%M") || "")} />
        </box>

        <box>
          <image iconName={"weather-windy-symbolic"} />
          <label label={bind(weatherInfo)
            .as(w => w.wind?.summary || "")} />
        </box>

        <label useMarkup label={bind(weatherInfo)
          .as(w => w.attribution || "")} />

        <button iconName={"view-refresh-symbolic"}
          $clicked={() => updateWeather()} />
      </box>
    </box>
  </box>

</Gtk.Popover> as Gtk.Popover

export default ({ vertical }: { vertical: boolean }) =>
  <Gtk.MenuButton
    direction={vertical ?
      Gtk.ArrowType.RIGHT :
      Gtk.ArrowType.UP}
    cssClasses={["pill"]}
    cursor={Gdk.Cursor
      .new_from_name("pointer", null)}
    // popover={Popover()}
    popover={
      <popover>
        <label label={"Weather"} />
      </popover> as Gtk.Popover}>
    <box>
      <box orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}
        cssClasses={["weather", vertical ? "vert" : ""]}
      // visible={bind(weatherInfo).as(w => w !== undefined)}
      >
        <image
          pixelSize={22}
          iconName={bind(weather, "iconName")}
        />
        <label
          cssClasses={["body"]}
          css={"font-size:0.75rem"}
          label={bind(weather, "tempSummary")}
        />
      </box>
    </box>
  </Gtk.MenuButton>