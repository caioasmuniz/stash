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

const PlaybackButtons = ({ player }: { player: Mpris.Player }) => <box>
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

export default () => <box
  orientation={Gtk.Orientation.VERTICAL}
  spacing={4}
  visible={createBinding(mpris, "players")(p => p.length > 0)}>
  <For each={createBinding(mpris, "players")}>
    {(player: Mpris.Player) =>
      <box
        cssClasses={["media"]}
        orientation={Gtk.Orientation.VERTICAL}
        hexpand>
        <box>
          <image
            file={player.coverArt}
            cssClasses={["thumbnail"]}
            hexpand
          />
          <label
            wrap
            maxWidthChars={10}
            cssClasses={["heading"]}
            label={createBinding(player, "title")} />
          <image
            cssClasses={["icon"]}
            hexpand
            tooltipText={createBinding(player, "identity")
              (id => id || "")}
            iconName={createBinding(player, "entry")
              (entry => apps.exact_query(entry)[0]!.iconName)} />
        </box>
        <label
          cssClasses={["artist"]}
          label={createBinding(player, "artist")} />
        <slider
          cssClasses={["position"]}
          drawValue={false}
          // onDragged={({ value }) => player.position = value}
          min={0}
          max={createBinding(player, "length")}
          visible={createBinding(player, "canSeek")}
          value={createBinding(player, "position")} />
        <centerbox>
          <label
            label={createBinding(player, "position")(lengthStr)} />
          <PlaybackButtons player={player} />
          <label label={createBinding(player, "length")(lengthStr)} />
        </centerbox>
      </box>
    }
  </For>
</box >
