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
    in
    {
      packages.${system} = {
        default = ags.lib.bundle {
          inherit pkgs;
          src = ./.;
          name = "stash";
          entry = "app.ts";

          # additional libraries and executables to add to gjs' runtime
          extraPackages = [
            # ags.packages.${system}.battery
            # pkgs.fzf
          ];
        };
      };

      devShells.${system} = {
        default = pkgs.mkShell {
          buildInputs = [
            (ags.packages.${system}.default.override {
              extraPackages = with ags.packages.${pkgs.system}; [
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
                pkgs.libgtop
                pkgs.libadwaita
              ];
            })
            pkgs.nixd
            pkgs.nixfmt-rfc-style
            pkgs.inter
          ];
        };
      };
    };
}
