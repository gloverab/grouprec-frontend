<script lang='ts'>
  import { onMount } from "svelte";
  import { getSpotifyToken, spotifyBaseUrl } from "$src/modules/Spotify.svelte";
  import { spotifyAuthString } from "$src/stores/main";
  import SongResult from "$src/components/SongResult.svelte";
  import AlbumResult from "$src/components/AlbumResult.svelte";
  import ArtistResult from "$src/components/ArtistResult.svelte";
  import { getLinks } from "$src/modules/SongLink.svelte";
  import { backStep, bottomButtons, image, linksByPlatform, medium, spotifyResult, step, title, year } from "$src/stores/submitRecommendation";
  import moment from "moment";
import { apiGet } from "$src/api/api.svelte";
import { toTitleCase } from "$src/helpers";

  onMount(() => {
    getSpotifyToken()
  })

  let value
  let result
  let resultType
  let loadingMessage = ''
  let trackResults = []
  let albumResults = []

  let timeSinceKeystroke = 0
  let interval

  const handleChange = () => {
    timeSinceKeystroke = 0
    clearInterval(interval)
    interval = setInterval(() => timeSinceKeystroke += 200, 200)
  }

  const handleMusicClick = async (obj: { title: string, id: string, image: string, medium: string, year: string }) => {
    if (result) {
      spotifyResult.set(result)
    }
    title.set(obj.title)
    image.set(obj.image)
    medium.set(obj.medium)
    year.set(obj.year)

    loadingMessage = 'Generating Links...'
    const apiObj = {
      endpoint: 'get-links',
      params: {
        platform: 'spotify',
        resource_type: obj.medium,
        resource_id: obj.id
      }
    }
    const songLinkResponse = await apiGet(apiObj)

    if (songLinkResponse.status === 200) {
      const songLinks = await songLinkResponse.json()
      linksByPlatform.set(songLinks)
      step.set('reviewMusicSubmission')
      backStep.set('title')
      loadingMessage = ''
    } else {
      console.log("ERRRRR")
    }
  }

  const getSpotifyEndpointQuery = (link: string) => {
    if (link.includes('/track/')) {
      const trackId = link.split('/track/')[1]
      resultType = 'track'
      return `tracks/${trackId}`
    } else if (link.includes('/album/')) {
      const splitLink = link.split('/album/')[1]
      let albumId
      if (splitLink.includes('?')) {
        albumId = splitLink.split('?')[0]
      } else {
        albumId = splitLink
      }
      resultType = 'album'
      return `albums/${albumId}`
    } else if (link.includes('/artist/')) {
      const splitLink = link.split('/artist/')[1]
      let artistId
      if (splitLink.includes('?')) {
        artistId = splitLink.split('?')[0]
      } else {
        artistId = splitLink
      }
      resultType = 'artist'
      return `artists/${artistId}`
    }
  }

  const searchSpotifyByLink = async (link: string) => {
    result = undefined
    const url = `${spotifyBaseUrl}/${getSpotifyEndpointQuery(link)}`
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': $spotifyAuthString
    }
    loadingMessage = `Identifying ${toTitleCase(resultType)}...`
    const resp = await fetch(url, {
      method: "GET",
      headers
    })

    if (resp.status === 200) {
      const body = await resp.json()
      result = body
      if (resultType === 'track') {
        const obj = {
          id: result.id,
          title: result.name,
          image: result.album.images[0].url,
          medium: 'track',
          year: moment(result.album.release_date).format('YYYY')
        }
        handleMusicClick(obj)
      } else if (resultType === 'album') {
        const obj = {
          id: result.id,
          title: result.name,
          image: result.images[0].url,
          medium: result.album_type,
          year: moment(result.release_date).format('YYYY')
        }
        handleMusicClick(obj)
      }
    }
  }

  const searchSpotifyByQuery = async (query: string) => {
    const url = `${spotifyBaseUrl}/search?q=${query}&type=track%2Calbum`
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': $spotifyAuthString
    }
    loadingMessage = 'Searching...'
    const resp = await fetch(url, {
      method: "GET",
      headers
    })

    if (resp.status === 200) {
      const body = await resp.json()
      console.log(body)
      loadingMessage = ''
      trackResults = body.tracks.items
      albumResults = body.albums.items
    }
  }

  $: if (value) {
    if (value.includes('spotify.com')) {
      searchSpotifyByLink(value)
      timeSinceKeystroke = 0
      clearInterval(interval)
    } else if (timeSinceKeystroke > 600 && !value.includes('spotify.com')) {
      searchSpotifyByQuery(value)
      timeSinceKeystroke = 0
      clearInterval(interval)
    }
  }

  $: if (value === '') {
    trackResults = []
    albumResults = []
  }

  $: bottomButtons.set([
    {
      text: 'Back',
      type: 'secondary',
      onClick: () => step.set($backStep)
    }
  ])
</script>

<div class='flex flex-col'>
  <span class='text-xs font-medium mb-1'>Search for music or paste a link from Spotify</span>
  <input class='border-1 border-gray-300 outline-none hover:border-indigo-400 focus:border-indigo-800 rounded-md p-2' type='text' on:keydown={handleChange} bind:value={value} />
</div>

{#if loadingMessage}
  <div class='absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex flex-col justify-center items-center'>
    <span>{loadingMessage}</span>
    <div class="loader"></div>
  </div>
{/if}
{#if result}
  {#if resultType === 'track'}
    <SongResult
      onClick={handleMusicClick}
      songResult={result}
    />
  {:else if resultType === 'album'}
    <AlbumResult
      albumResult={result}
    />
  {:else if resultType === 'artist'}
    <ArtistResult
      artistResult={result}
    />
  {/if}
{/if}

<div class='flex justify-between'>
  {#if trackResults.length > 0}
    <div class='flex flex-col space-y-2 mt-2'>
      <h1 class='text-lg font-semibold'>Tracks</h1>
      {#each trackResults as result}
        <SongResult
          onClick={handleMusicClick}
          songResult={result}
        />
      {/each}
    </div>
  {/if}

  {#if albumResults.length > 0}
    <div class='flex flex-col space-y-2 mt-2'>
      <h1 class='text-lg font-semibold'>Albums</h1>
      {#each albumResults as result}
        <AlbumResult
          onClick={handleMusicClick}
          albumResult={result}
        />
      {/each}
    </div>
    {/if}
</div>
