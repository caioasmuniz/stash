import Adw from "gi://Adw?version=1"
import { astalify, Gtk, Widget } from "astal/gtk4"

export const ButtonContent = astalify<Adw.ButtonContent, Adw.ButtonContent.ConstructorProps>(Adw.ButtonContent, {})
export const SplitButton = astalify<Adw.SplitButton, Adw.SplitButton.ConstructorProps>(Adw.SplitButton, {})
export const BottomSheet = astalify<Adw.BottomSheet, Adw.BottomSheet.ConstructorProps>(Adw.BottomSheet, {})
export const StatusPage = astalify<Adw.StatusPage, Adw.StatusPage.ConstructorProps>(Adw.StatusPage, {})

export const CheckButton = astalify<Gtk.CheckButton,Gtk.CheckButton.ConstructorProps>(Gtk.CheckButton,{})
export const ScrolledWindow = astalify<Gtk.ScrolledWindow,Gtk.ScrolledWindow.ConstructorProps>(Gtk.ScrolledWindow,{})

export const ToggleButton = astalify<Gtk.ToggleButton, Gtk.ToggleButton.ConstructorProps>(Gtk.ToggleButton, {
    // getChildren(self) { return [] },
    // setChildren(self, children) { },
})
