#!@gjs@ -m

import { exit, programArgs, programInvocationName } from "system"

imports.package.init({
  name: import.meta.domain,
  version: "@version@",
  prefix: "@prefix@",
  libdir: "@libdir@",
})

pkg.initGettext()
pkg.initFormat()

const { App } = await import("../src/App")
const exitCode = await new App().runAsync([programInvocationName, ...programArgs])
exit(exitCode)
