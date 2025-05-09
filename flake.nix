{
  description = "Stash - Skill's terrific astal shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    astal.url = "github:aylur/astal";
    gjsx = {
      url = "github:aylur/gjsx";
      flake = false;
    };
    ags = {
      url = "github:aylur/ags/v3";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
      inputs.gjsx.follows = "gjsx";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
      ...
    }:
    let
      name = "stash";
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      extraPackages = with ags.packages.${system}; [
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
        pkgs.libadwaita
        pkgs.libgtop
        pkgs.libgweather
        pkgs.glib-networking
      ];
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        inherit name;
        meta.mainProgram = "${name}";
        src = ./.;

        nativeBuildInputs = [
          pkgs.wrapGAppsHook
          pkgs.gobject-introspection
          ags.packages.${system}.default
        ];

        buildInputs = extraPackages ++ [
          pkgs.gjs
          pkgs.glib
          ags.packages.${system}.astal4
        ];

        installPhase = ''
          mkdir -p $out/bin
          ags bundle app.ts $out/bin/${name}
        '';

        preFixup = ''
          gappsWrapperArgs+=(
            --prefix PATH : ${
              pkgs.lib.makeBinPath [
                pkgs.brightnessctl
                pkgs.darkman
                pkgs.libgtop
                pkgs.libadwaita
              ]
            }
          )
        '';
      };

      homeManagerModules = {
        default = self.homeManagerModules.stash;
        stash = import ./hm-module.nix self;
      };

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${pkgs.system}.default.override {
            inherit extraPackages;
          })
          pkgs.libnotify
          pkgs.nixd
          pkgs.nixfmt-rfc-style
          pkgs.brightnessctl
        ] ++ extraPackages;
      };
    };
}
