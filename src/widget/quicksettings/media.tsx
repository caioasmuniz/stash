import Astal from "gi://Astal?version=4.0";
import Mpris from "gi://AstalMpris";
import Apps from "gi://AstalApps"
import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding } from "gnim";

const mpris = Mpris.get_default();
const apps = new Apps.Apps()

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

const PlayerApp = ({ player }: { player: Mpris.Player }) =>
  <Gtk.Box
    halign={Gtk.Align.START}
    spacing={4}>
    <Gtk.Image
      cssClasses={["icon"]}
      hexpand
      tooltipText={createBinding(player, "identity")
        .as(id => id || "")}
      iconName={createBinding(player, "entry")
        .as(entry => apps.exact_query(entry)[0]!.iconName)} />
    <Gtk.Label label={createBinding(player, "identity")
      .as(id => id || "")} />
  </Gtk.Box>

const CoverArt = ({ player }: { player: Mpris.Player }) =>
  <Gtk.Image
    file={createBinding(player, "coverArt")}
    cssClasses={["thumbnail"]}
    hexpand
  />

const TitleArtist = ({ player }: { player: Mpris.Player }) =>
  <Gtk.Box
    orientation={Gtk.Orientation.VERTICAL}
    hexpand>
    <Gtk.Label
      wrap
      maxWidthChars={10}
      cssClasses={["heading"]}
      label={createBinding(player, "title")}
    />
    <Gtk.Label
      cssClasses={["artist"]}
      label={createBinding(player, "artist")} />
  </Gtk.Box>

const PlaybackButtons = ({ player }: { player: Mpris.Player }) =>
  <Gtk.Box>
    <Gtk.Button
      onClicked={() => player.previous()}
      visible={player.canGoPrevious}>
      <Gtk.Image iconName={"media-skip-backwiconNameard-symbolic"} />
    </Gtk.Button>

    <Gtk.Button
      onClicked={() =>
        player.playbackStatus === Mpris.PlaybackStatus.PAUSED
          ? player.play() : player.pause()}>
      <Gtk.Image
        iconName={createBinding(player, "playbackStatus")
          .as(s => s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic")} />
    </Gtk.Button>
    <Gtk.Button
      onClicked={() => player.next()}
      visible={player.canGoNext}>
      <Gtk.Image iconName={"media-skip-forward-symbolic"} />
    </Gtk.Button>
  </Gtk.Box>

const PlaybackStatus = ({ player }: { player: Mpris.Player }) =>
  <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
    <Astal.Slider
      cssClasses={["position"]}
      drawValue={false}
      onNotifyValue={({ value }) =>
        player.position = value}
      min={0}
      max={createBinding(player, "length")}
      visible={createBinding(player, "canSeek")}
      value={createBinding(player, "position")} />
    <Gtk.CenterBox>
      <Gtk.Label $type="start"
        label={createBinding(player, "position")
          .as(lengthStr)} />
      <PlaybackButtons $type="center" player={player} />
      <Gtk.Label $type="end"
        label={createBinding(player, "length")
          .as(lengthStr)} />
    </Gtk.CenterBox>
  </Gtk.Box>

export default () => <Gtk.Box
  orientation={Gtk.Orientation.VERTICAL}
  spacing={4}
  visible={createBinding(mpris, "players")(p => p.length > 0)}>
  <For each={createBinding(mpris, "players")}>
    {(player: Mpris.Player) =>
      <Gtk.Box
        cssClasses={["card"]}
        orientation={Gtk.Orientation.VERTICAL}
        hexpand>
        <PlayerApp player={player} />
        <Gtk.Box>
          <CoverArt player={player} />
          <TitleArtist player={player} />
        </Gtk.Box>
        <PlaybackStatus player={player} />
      </Gtk.Box>
    }
  </For>
</Gtk.Box >
