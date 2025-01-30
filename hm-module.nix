self:
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.programs.stash;
  pkg = self.packages.${pkgs.system}.default;
in
{
  options.programs.stash = {
    enable = lib.mkEnableOption "stash";
    hyprland.blur.enable = lib.mkOption {
      type = lib.types.bool;
      default = false;
      example = true;
      description = ''
        Enable layer rules to blur the widget's background in hyprland.
      '';
    };
    systemd.enable = lib.mkOption {
      type = lib.types.bool;
      default = false;
      example = true;
      description = ''
        Enable systemd integration.
      '';
    };
  };
  config = lib.mkIf cfg.enable (
    lib.mkMerge [
      { home.packages = [ pkg ]; }
      (lib.mkIf cfg.systemd.enable {
        systemd.user.services.stash = {
          Unit = {
            Description = "Stash - Skill's terrific astal shell";
            # Documentation = "https://github.com/Aylur/ags";
            PartOf = [ "graphical-session.target" ];
            After = [ "graphical-session-pre.target" ];
          };

          Service = {
            ExecStart = "${lib.getExe pkg}";
            Restart = "on-failure";
            KillMode = "mixed";
          };

          Install = {
            WantedBy = [ "graphical-session.target" ];
          };
        };
      })
      (lib.mkIf cfg.hyprland.blur.enable {
        wayland.windowManager.hyprland.extraConfig = ''
          layerrule=blur,gtk4-layer-shell
          layerrule=ignorezero,gtk4-layer-shell
           
          bind=SUPER,Space,exec, ags toggle applauncher
          bind=SUPER,n,exec, ags toggle quicksettings
          bind=SUPERSHIFT,n,exec, ags toggle infopannel
        '';
      })
    ]
  );
}
