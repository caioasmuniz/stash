{
  description = "Stash - Skill's terrific astal shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    astal.url = "github:aylur/astal";
  };

  outputs =
    {
      self,
      nixpkgs,
      astal,
    }:
    let
      pname = "stash";
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      astalPackages = with astal.packages.${system}; [
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
        astal4
      ];

      nativeBuildInputs = with pkgs; [
        wrapGAppsHook
        pnpm.configHook
        pnpm
        gobject-introspection
        meson
        pkg-config
        ninja
        desktop-file-utils
      ];

      buildInputs =
        with pkgs;
        [
          gsettings-desktop-schemas
          glib
          libadwaita
          libgtop
          gtk4
          gjs
          esbuild
        ]
        ++ astalPackages;

      wrapperPackages = with pkgs; [
        brightnessctl
        darkman
      ];
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        inherit pname;
        meta.mainProgram = "${pname}";
        version = "0.1.0";
        src = ./.;

        inherit buildInputs nativeBuildInputs;

        pnpmDeps = pkgs.pnpm.fetchDeps {
          inherit (self.packages.${system}.default) pname version src;
          hash = "";
        };

        preFixup = ''
          gappsWrapperArgs+=(
            --prefix PATH : ${pkgs.lib.makeBinPath wrapperPackages}
          )
        '';
      };

      homeManagerModules = {
        default = self.homeManagerModules.stash;
        stash = import ./hm-module.nix self;
      };

      devShells.${system}.default = pkgs.mkShell {

        ENV = "dev";
        inherit nativeBuildInputs;
        buildInputs =
          with pkgs;
          [
            libnotify
            nixd
            nixfmt-rfc-style
            nix-output-monitor
          ]
          ++ buildInputs
          ++ wrapperPackages;
      };
    };
}
