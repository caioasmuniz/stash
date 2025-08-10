{
  description = "Stash - Skill's terrific astal shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    astal.url = "github:aylur/astal";
    gnim = {
      url = "github:aylur/gnim";
      flake = false;
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
      inputs.gnim.follows = "gnim";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
      ...
    }@inputs:
    let
      name = "stash";
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      astalPackages = with ags.packages.${system}; [
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
      ];

      extraPackages =
        with pkgs;
        [
          libadwaita
          libgtop
          libgweather
          glib-networking
        ]
        ++ astalPackages;

      wrapperPackages = with pkgs; [
        brightnessctl
        darkman
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
        buildInputs =
          with pkgs;
          [
            (inputs.ags.packages.${pkgs.system}.default.override {
              inherit extraPackages;
            })
            libnotify
            nixd
            nixfmt-rfc-style
            nix-output-monitor
          ]
          ++ astalPackages
          ++ wrapperPackages;
      };
    };
}
