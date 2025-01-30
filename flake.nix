{
  description = "Stash - Skill's terrific astal shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      deps = with ags.packages.${system}; [
        apps
        battery
        bluetooth
        hyprland
        mpris
        network
        notifd
        powerprofiles
        tray
        wireplumber
        pkgs.brightnessctl
        pkgs.libgtop
        pkgs.libadwaita
      ];
    in
    {
      packages.${system} = {
        default = ags.lib.bundle {
          inherit pkgs;
          src = ./.;
          name = "stash";
          entry = "app.ts";
          gtk4 = true;
          extraPackages = deps;
        };
      };
      homeManagerModules = {
        default = self.homeManagerModules.stash;
        stash = {
          options.programs.stash = {
            enable = pkgs.mkEnableOption "stash";
            hyprland.blur.enable = pkgs.mkOption {
              type = pkgs.types.bool;
              default = false;
              example = true;
              description = ''
                Enable layer rules to blur the widget's background in hyprland.
              '';
            };
            systemd.enable = pkgs.mkOption {
              type = pkgs.types.bool;
              default = false;
              example = true;
              description = ''
                Enable systemd integration.
              '';
            };
          };
          config = pkgs.mkIf self.config.programs.stash.enable (
            pkgs.mkMerge [
              { home.packages = [ self.packages.${system}.default ]; }
              (pkgs.mkIf self.config.programs.stash.systemd.enable {
                systemd.user.services.stash = {
                  Unit = {
                    Description = "Stash - Skill's terrific astal shell";
                    # Documentation = "https://github.com/Aylur/ags";
                    PartOf = [ "graphical-session.target" ];
                    After = [ "graphical-session-pre.target" ];
                  };

                  Service = {
                    ExecStart = "${pkgs.lib.getExe self.packages.${system}.default}";
                    Restart = "on-failure";
                    KillMode = "mixed";
                  };

                  Install = {
                    WantedBy = [ "graphical-session.target" ];
                  };
                };
              })
              (pkgs.mkIf self.config.programs.stash.hyprland.blur.enable {
                wayland.windowManager.hyprland.extraConfig = ''
                  layerrule=blur,gtk-layer-shell
                  layerrule=ignorezero,gtk-layer-shell

                  layerrule=blur,gtk4-layer-shell
                  layerrule=ignorezero,gtk4-layer-shell
                   
                    
                  bind=SUPER,Space,exec, ags toggle applauncher
                  bind=SUPER,n,exec, ags toggle quicksettings
                  bind=SUPERSHIFT,n,exec, ags toggle infopannel
                '';
              })
            ]
          );
        };
      };

      devShells.${system} = {
        default = pkgs.mkShell {
          buildInputs = [
            (ags.packages.${pkgs.system}.default.override {
              extraPackages = deps;
            })
            pkgs.nixd
            pkgs.nixfmt-rfc-style
          ];
        };
      };
    };
}
