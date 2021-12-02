import { writable } from 'svelte/store'

// const storedToken = localStorage.getItem("token")
export const token = writable('')
// token.subscribe(val => {
//   localStorage?.setItem("token", val)
// })
export const localTags = writable([])
export const groupCategories = writable([])
export const showCreateRecommendation = writable(false)
export const showRecommendToMenu = writable(false)
export const showCreateNewGroup = writable(false)
export const recommendToRecommendation = writable(undefined)
export const currentUser = writable()
export const showUserMenu = writable(false)
export const showMobileMenu = writable(false)
export const showUserRecommendations = writable(false)
export const apiFetching = writable(false)
export const windowHeight = writable(undefined as number)
export const justAdded = writable()
export const groupUsers = writable([])

export const spotifyAuthString = writable('')
export const spotifyTokenExpiryTime = writable('')

export const hideMenuIcon = writable(false)