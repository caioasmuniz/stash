# FIXME: rename
project('todo-demo', version: '0.0.0')
domain = 'me.example.todoDemo'
resource = '/me/example/todoDemo'

name = meson.project_name()
version = meson.project_version()

prefix = get_option('prefix')
libdir = prefix / get_option('libdir')
datadir = prefix / get_option('datadir')
bindir = prefix / get_option('bindir')
pkgdatadir = datadir / name

custom_target(
  input: configure_file(
    input: 'src/main.ts',
    output: 'main.ts',
    configuration: {
      'gjs': find_program('gjs').full_path(),
      'version': version,
      'prefix': prefix,
      'libdir': libdir,
    },
  ),
  command: [
    find_program('esbuild'),
    '--bundle', '@INPUT@',
    '--outfile=@OUTPUT@',
    '--external:gi://*',
    '--external:resource://*',
    '--external:system',
    '--format=esm',
    '--sourcemap=inline',
    '--target=firefox116',
    '--define:import.meta.domain="' + domain + '"',
    '--define:import.meta.resource="' + resource + '"',
    '--define:import.meta.name="' + name + '"',
  ],
  output: name,
  install: true,
  install_dir: bindir,
)

configure_file(
  input: 'data/desktop.in.desktop',
  output: domain + '.desktop',
  configuration: {'exe': bindir / name},
  install: true,
  install_dir: datadir / 'applications',
)

configure_file(
  input: 'data/gschema.in.xml',
  output: domain + '.gschema.xml',
  configuration: {'resource': resource, 'domain': domain},
  install: true,
  install_dir: datadir / 'glib-2.0' / 'schemas',
)

test(
  'validate-gschema',
  find_program('glib-compile-schemas'),
  args: [
    '--strict',
    '--dry-run', meson.current_source_dir(),
  ],
)

import('gnome').post_install(
  # gtk_update_icon_cache: true,
  glib_compile_schemas: true,
  update_desktop_database: true,
)
