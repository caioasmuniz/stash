import Mpris from "gi://AstalMpris";
import Apps from "gi://AstalApps"
import { For, createBinding } from "ags";
import { Gtk } from "ags/gtk4";

const mpris = Mpris.get_default();
const apps = new Apps.Apps()

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

const PlaybackButtons = ({ player }: { player: Mpris.Player }) => <Gtk.Box>
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
        (s => s === Mpris.PlaybackStatus.PLAYING
          ? "media-playback-pause-symbolic"
          : "media-playback-start-symbolic")} />
  </Gtk.Button>
  <Gtk.Button
    onClicked={() => player.next()}
    visible={player.canGoNext}>
    <Gtk.Image iconName={"media-skip-forward-symbolic"} />
  </Gtk.Button>
</Gtk.Box>

export default () => <Gtk.Box
  orientation={Gtk.Orientation.VERTICAL}
  spacing={4}
  visible={createBinding(mpris, "players")(p => p.length > 0)}>
  <For each={createBinding(mpris, "players")}>
    {(player: Mpris.Player) =>
      <Gtk.Box
        cssClasses={["media"]}
        orientation={Gtk.Orientation.VERTICAL}
        hexpand>
        <Gtk.Box>
          <Gtk.Image
            file={player.coverArt}
            cssClasses={["thumbnail"]}
            hexpand
          />
          <Gtk.Label
            wrap
            maxWidthChars={10}
            cssClasses={["heading"]}
            label={createBinding(player, "title")} />
          <Gtk.Image
            cssClasses={["icon"]}
            hexpand
            tooltipText={createBinding(player, "identity")
              (id => id || "")}
            iconName={createBinding(player, "entry")
              (entry => apps.exact_query(entry)[0]!.iconName)} />
        </Gtk.Box>
        <Gtk.Label
          cssClasses={["artist"]}
          label={createBinding(player, "artist")} />
        <Astal.Slider
          cssClasses={["position"]}
          drawValue={false}
          // onDragged={({ value }) => player.position = value}
          min={0}
          max={createBinding(player, "length")}
          visible={createBinding(player, "canSeek")}
          value={createBinding(player, "position")} />
        <Gtk.CenterBox>
          <Gtk.Label
            label={createBinding(player, "position")(lengthStr)} />
          <PlaybackButtons player={player} />
          <Gtk.Label label={createBinding(player, "length")(lengthStr)} />
        </Gtk.CenterBox>
      </Gtk.Box>
    }
  </For>
</Gtk.Box >
