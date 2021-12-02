<script lang='ts'>
  import { millisToMinutesAndSeconds } from "$src/helpers";
  import type { ISpotifySongResult } from "$src/interfaces/Spotify.svelte";
  import { spotifyResult } from "$src/stores/submitRecommendation";
  import moment from "moment";

  export let songResult: ISpotifySongResult
  export let onClick: ({}) => void

  const handleClick = () => {
    spotifyResult.set(songResult)
    onClick({
      id: songResult.id,
      title: songResult.name,
      image: songResult.album.images[0].url,
      medium: 'track',
      year: moment(songResult.album.release_date).format('YYYY')
    })
  }
</script>

<button on:click={handleClick} class='flex border-1 border-solid rounded-lg p-2 w-75 bg-white justify-between items-center shadow-sm hover:shadow-md active:shadow-none'>
  <div class='flex'>
    <div class='w-12 h-12 rounded-full overflow-hidden mr-2'>
      <img src={songResult.album.images[0].url} alt='Album Cover' />
    </div>
    <div class='flex flex-col items-start justify-center'>
      <span class='font-medium text-left'>{songResult.name}</span>
      <span class='text-sm text-gray-700'>{songResult.artists[0].name}</span>
    </div>
  </div>
  <span class='text-sm text-gray-700'>{millisToMinutesAndSeconds(songResult.duration_ms)}</span>
</button>