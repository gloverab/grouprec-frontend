<script lang='ts'>
  import { millisToMinutesAndSeconds, toTitleCase } from "$src/helpers";
  import type { ISpotifyArtistResult } from "$src/interfaces/Spotify.svelte";
import { getSpotifyToken } from "$src/modules/Spotify.svelte";
  import moment from "moment";
  
  export let artistResult: ISpotifyArtistResult

  let imageW
  let detailsW

  const getGenresString = () => {
    let string = ''
    artistResult.genres.forEach((genre, i, arr) => {
      if (i + 1 !== arr.length) {
        string += `${toTitleCase(genre)}, `
      } else {
        string += toTitleCase(genre)
      }
    })
    return string
  }
</script>
  
  <button class='flex border-1 border-solid rounded-lg p-2 w-full max-w-100 bg-white items-center'>
    <div bind:clientWidth={imageW} class='flex'>
      <div class='w-12 h-12 rounded-full overflow-hidden mr-2'>
        <img src={artistResult.images[0].url} alt='Album Cover' />
      </div>
    </div>
    <div class='flex flex-col items-start justify-center' style='width: calc(100% - {imageW + detailsW}px - .5rem)'>
      <span class='font-medium text-left overflow-ellipsis truncate w-full'>{artistResult.name}</span>
      <span class='text-sm text-left text-gray-700'>{getGenresString()}</span>
    </div>
  </button>