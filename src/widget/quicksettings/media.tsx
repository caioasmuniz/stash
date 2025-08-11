import Mpris from "gi://AstalMpris";
import Apps from "gi://AstalApps"
import { For, createBinding } from "ags";
import { Astal, Gtk } from "ags/gtk4";

const mpris = Mpris.get_default();
const apps = new Apps.Apps()

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

const PlayerApp = ({ player }: { player: Mpris.Player }) =>
  <box
    halign={Gtk.Align.START}
    spacing={4}>
    <image
      cssClasses={["icon"]}
      hexpand
      tooltipText={createBinding(player, "identity")
        .as(id => id || "")}
      iconName={createBinding(player, "entry")
        .as(entry => apps.exact_query(entry)[0]!.iconName)} />
    <label label={createBinding(player, "identity")
      .as(id => id || "")} />
  </box>

const CoverArt = ({ player }: { player: Mpris.Player }) =>
  <image
    file={createBinding(player, "coverArt")}
    cssClasses={["thumbnail"]}
    hexpand
  />

const TitleArtist = ({ player }: { player: Mpris.Player }) =>
  <box
    orientation={Gtk.Orientation.VERTICAL}
    hexpand>
    <label
      wrap
      maxWidthChars={10}
      cssClasses={["heading"]}
      label={createBinding(player, "title")}
    />
    <label
      cssClasses={["artist"]}
      label={createBinding(player, "artist")} />
  </box>

const PlaybackButtons = ({ player }: { player: Mpris.Player }) =>
  <box>
    <button
      onClicked={() => player.previous()}
      visible={player.canGoPrevious}>
      <image iconName={"media-skip-backwiconNameard-symbolic"} />
    </button>

    <button
      onClicked={() =>
        player.playbackStatus === Mpris.PlaybackStatus.PAUSED
          ? player.play() : player.pause()}>
      <image
        iconName={createBinding(player, "playbackStatus")
          (s => s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic")} />
    </button>
    <button
      onClicked={() => player.next()}
      visible={player.canGoNext}>
      <image iconName={"media-skip-forward-symbolic"} />
    </button>
  </box>

const PlaybackStatus = ({ player }: { player: Mpris.Player }) =>
  <box orientation={Gtk.Orientation.VERTICAL}>
    <slider
      cssClasses={["position"]}
      drawValue={false}
      onNotifyValue={({ value }) =>
        player.position = value}
      min={0}
      max={createBinding(player, "length")}
      visible={createBinding(player, "canSeek")}
      value={createBinding(player, "position")} />
    <centerbox>
      <label $type="start"
        label={createBinding(player, "position")
          .as(lengthStr)} />
      <PlaybackButtons $type="center" player={player} />
      <label $type="end"
        label={createBinding(player, "length")
          .as(lengthStr)} />
    </centerbox>
  </box>

export default () => <box
  orientation={Gtk.Orientation.VERTICAL}
  spacing={4}
  visible={createBinding(mpris, "players")(p => p.length > 0)}>
  <For each={createBinding(mpris, "players")}>
    {(player: Mpris.Player) =>
      <Gtk.Box
        cssClasses={["media"]}
        orientation={Gtk.Orientation.VERTICAL}
        hexpand>
        <PlayerApp player={player} />
        <box>
          <CoverArt player={player} />
          <TitleArtist player={player} />
        </box>
        <PlaybackStatus player={player} />
      </box>
    }
  </For>
</Gtk.Box >
