import { writable } from "svelte/store";

export const step = writable('name')
export const groupBottomButtons = writable([])

export const groupName = writable('')
export const groupImage = writable('')