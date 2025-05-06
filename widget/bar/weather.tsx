import { fetch, URL } from "ags/fetch"
import { Gtk } from "ags/gtk4"
import { bind, Poll } from "ags/state"

const url = new URL("http://api.open-meteo.com/v1/forecast?latitude=-23.1811&longitude=-50.6467&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day,cloud_cover&forecast_days=1")

type weather = {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: number,
  timezone_abbreviation: number,
  elevation: number,
  current_units: {
    time: string,
    interval: string,
    temperature_2m: string,
    relative_humidity_2m: string,
    apparent_temperature: string,
    weather_code: string,
    is_day: string,
    cloud_cover: string
  },
  current: {
    time: string,
    interval: number,
    temperature_2m: number,
    relative_humidity_2m: number,
    apparent_temperature: number,
    weather_code: number,
    is_day: number,
    cloud_cover: number
  }
}

const decodeWeatherCode = (code: number, isDay: boolean) => {
  switch (code) {
    case 0:
      return isDay ?
        "weather-clear-symbolic" :
        "weather-clear-night-symbolic"

    case 1:
    case 2:
      return isDay ?
        "weather-few-clouds-symbolic" :
        "weather-few-clouds-night-symbolic"

    case 3:
      return "weather-overcast-symbolic"

    case 45:
    case 48:
      return "weather-fog-symbolic"

    case 51:
    case 53:
    case 55:
      return "weather-showers-scattered-symbolic"

    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "weather-showers-symbolic"

    case 95:
    case 96:
    case 99:
      return "weather-storm-symbolic"


    default:
      return "image-missing-symbolic"
  }
}

const weather = new Poll<weather>({
  current: {
    apparent_temperature: 0,
    weather_code: 100
  },
  current_units: {
    apparent_temperature: ""
  }
} as weather, 360000,
  async () => (await fetch(url)).json())

export default ({ vertical }: { vertical: boolean }) =>
  <button
    cssClasses={["pill", "weather"]}>
    <box orientation={Gtk.Orientation.VERTICAL}>
      <image
        pixelSize={22}
        iconName={bind(weather).as(weather =>
          decodeWeatherCode(
            weather.current.weather_code,
            weather.current.is_day === 1
          )
        )} />
      <label
        cssClasses={["body"]}
        css={"font-size:0.7rem"}
        label={bind(weather).as(weather => weather.current.apparent_temperature + weather.current_units.apparent_temperature)} />
    </box>
  </button>