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
      entry = "app.ts";
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
        pkgs.brightnessctl
        pkgs.darkman
        pkgs.libgtop
        pkgs.libadwaita
      ];
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        inherit name;
        src = ./.;

        nativeBuildInputs = [
          ags.packages.${system}.default
          pkgs.wrapGAppsHook
          pkgs.gobject-introspection
        ];

        buildInputs = extraPackages ++ [
          pkgs.gjs
          ags.packages.${system}.astal4
        ];

        installPhase = ''
          runHook preInstall

          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r * $out/share
          ags bundle ${entry} $out/bin/${name} -d "SRC='$out/share'"

          runHook postInstall
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
          pkgs.nixd
          pkgs.brightnessctl
          pkgs.nixfmt-rfc-style
        ];
      };
    };
}
