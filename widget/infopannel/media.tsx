import Mpris from "gi://AstalMpris";
import Apps from "gi://AstalApps"
import { bind } from "astal";

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
      iconName={bind(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
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
  vertical
  spacing={4}
  visible={bind(mpris, "players").as(p => p.length > 0)}>
  {bind(mpris, "players").as(p => p.map(player =>
    <box>
      <image
        file={player.coverArt}
        hexpand />
      <box
        vertical
        hexpand>
        <box>
          <label
            wrap
            maxWidthChars={30}
            cssClasses={["title-4"]}
            label={bind(player, "title")} />
          <image
            cssClasses={["icon"]}
            hexpand
            tooltipText={bind(player, "identity").as(id => id || "")}
            iconName={bind(player, "entry").as(entry =>
              apps.exact_query(entry)[0]!.iconName)} />
        </box>
        <label
          cssClasses={["artist"]}
          label={bind(player, "artist")} />
        <slider
          cssClasses={["position"]}
          drawValue={false}
          // onDragged={({ value }) => player.position = value}
          min={0}
          max={bind(player, "length")}
          visible={bind(player, "canSeek")}
          value={bind(player, "position")} />
        <centerbox>
          <label
            label={bind(player, "position").as(lengthStr)} />
          <PlaybackButtons player={player} />
          <label label={bind(player, "length").as(lengthStr)} />
        </centerbox>
      </box>
    </box >
  ))}
</box >
