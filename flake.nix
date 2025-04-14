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
        pkgs.darkman
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
        stash = import ./hm-module.nix self;
      };

      devShells.${system} = {
        default = pkgs.mkShell {
          buildInputs = [
            (ags.packages.${pkgs.system}.default.override {
              extraPackages = deps;
            })
            pkgs.nixd
            pkgs.brightnessctl
            pkgs.nixfmt-rfc-style
          ];
        };
      };
    };
}
