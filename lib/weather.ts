import GObject, { property, register } from "ags/gobject"
import { Poll } from "ags/state"
import GLib from "gi://GLib?version=2.0"
import GWeather from "gi://GWeather?version=4.0"

@register({ GTypeName: "Weather" })
export default class Weather extends GObject.Object {
  static instance: Weather;
  static get_default() {
    if (!this.instance) this.instance =
      new Weather({ weatherInfo: undefined });
    return this.instance;
  }

  #weather: GWeather.Info
  #unit = {
    temp: GWeather.TemperatureUnit.CENTIGRADE,
    pressure: GWeather.PressureUnit.ATM,
    distance: GWeather.DistanceUnit.KM,
    speed: GWeather.SpeedUnit.KPH
  }

  #apparent = Number()
  #attribution = String()
  #conditions = String()
  #dew = Number()
  #forecast = [] as Weather[]
  #humidity = String()
  #iconName = String()
  #lastUpdated = new GLib.DateTime
  #location = new GWeather.Location
  #moon = {
    phase: Number(),
    lat: Number()
  }
  #pressure = Number()
  #sunrise = new GLib.DateTime
  #sunset = new GLib.DateTime
  #temp = Number()
  // #tempMax: number,
  // #tempMin: number,
  #tempSummary = String()
  #visibility = Number()
  #wind = {
    direction: Number(),
    speed: Number(),
    summary: String()
  }

  @property(Number)
  get apparent() {
    return this.#apparent
  }


  @property(Weather)
  get forecast() {
    return this.#forecast
  }

  @property(String)
  get iconName() {
    return this.#iconName
  }

  @property(String)
  get tempSummary() {
    return this.#tempSummary
  }

  private toDate(time: number) {
    return GLib.DateTime.new_from_unix_local(time)
  }

  public update() {
    this.#weather.update()
  }

  constructor({ weatherInfo = undefined }:
    { weatherInfo: GWeather.Info | undefined }
  ) {
    super()
    if (weatherInfo) {
      this.#weather = weatherInfo
    } else {
      this.#weather = GWeather.Info.new(
        GWeather.Location.get_world()
          ?.find_nearest_city(-23.1, -50.6))

      this.#weather.set_enabled_providers(GWeather.Provider.MET_NO)
      this.#weather.set_contact_info("caiomuniz888@gmail.com")
      this.update()
    }
    new Poll<void>(undefined,
      1 * 3600000,
      () => this.#weather.update()
    )
    this.#weather.connect("updated", weather => {
      this.#apparent = weather.get_value_apparent(this.#unit.temp)[1]
      this.notify("apparent")
      this.#attribution = this.#weather.get_attribution()
      // this.notify("attribution")
      this.#conditions = this.#weather.get_conditions()
      // this.notify("conditions")
      this.#dew = this.#weather.get_value_dew(this.#unit.temp)[1]
      // this.notify("dew")
      if (weatherInfo) {
        this.#forecast = [] as Weather[]
      } else {
        this.#forecast = this.#weather.get_forecast_list()
          .map(w => {
            return new Weather({ weatherInfo: w })
          })
        this.notify("forecast")
      }
      this.#humidity = this.#weather.get_humidity()
      // this.notify("humidity")
      this.#iconName = this.#weather.get_symbolic_icon_name()
      this.notify("icon-name")
      this.#lastUpdated = this.toDate(this.#weather.get_value_update()[1])
      // this.notify("last-updated")
      this.#location = this.#weather.get_location()
      // this.notify("location")
      this.#moon = {
        phase: this.#weather.get_value_moonphase()[1],
        lat: this.#weather.get_value_moonphase()[2]
      }
      // this.notify("moon")
      this.#pressure = this.#weather.get_value_pressure(this.#unit.pressure)[1]
      // this.notify("pressure")
      this.#sunrise = this.toDate(this.#weather.get_value_sunrise()[1])
      // this.notify("sunrise")
      this.#sunset = this.toDate(this.#weather.get_value_sunset()[1])
      // this.notify("sunset")
      this.#temp = this.#weather.get_value_temp(this.#unit.temp)[1]
      // this.notify("temp")
      // #tempMax: number,
      // #tempMin: number,
      this.#tempSummary = this.#weather.get_temp_summary()
      this.notify("temp-summary")
      this.#visibility = this.#weather.get_value_visibility(this.#unit.distance)[1]
      // this.notify("visibility")
      this.#wind = {
        direction: this.#weather.get_value_wind(this.#unit.speed)[2],
        speed: this.#weather.get_value_wind(this.#unit.speed)[1],
        summary: this.#weather.get_wind()
      }
      // this.notify("wind")
    })
  }
}