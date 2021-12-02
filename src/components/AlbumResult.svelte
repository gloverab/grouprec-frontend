<script lang='ts'>
  import { millisToMinutesAndSeconds } from "$src/helpers";
  import type { ISpotifyAlbumResult, ISpotifySongResult } from "$src/interfaces/Spotify.svelte";
  import { spotifyResult } from "$src/stores/submitRecommendation";
  import moment from "moment";
  
  export let albumResult: ISpotifyAlbumResult
  export let onClick: any

  let imageW
  let detailsW

  const handleClick = () => {
    spotifyResult.set(albumResult)
    onClick({
      id: albumResult.id,
      title: albumResult.name,
      image: albumResult.images[0].url,
      medium: albumResult.album_type,
      year: moment(albumResult.release_date).format('YYYY')
    })
  }

  const totalValue = albumResult?.tracks ? albumResult.tracks.total : albumResult?.total_tracks
  const tracksText = totalValue > 1 || totalValue === 0 ? 'Tracks' : 'Track'
  // const millisArr = albumResult.tracks.items.map(t => t.duration_ms)
  // const totalTime = millisArr.reduce((a, b ) => a + b)
</script>
  
  <button on:click={handleClick} class='flex border-1 border-solid rounded-lg p-2 w-75 bg-white justify-between items-center shadow-sm hover:shadow-md active:shadow-none'>
    <div bind:clientWidth={imageW} class='flex'>
      <div class='w-12 h-12 rounded-sm overflow-hidden mr-2'>
        <img src={albumResult.images[0].url} alt='Album Cover' />
      </div>
    </div>
    <div class='flex flex-col items-start justify-center' style='width: calc(100% - {imageW + detailsW}px - .5rem)'>
      <span class='font-medium text-left overflow-ellipsis truncate w-full'>{albumResult.name}</span>
      <span class='text-sm text-gray-700'>{albumResult.artists[0].name}</span>
    </div>
    <div bind:clientWidth={detailsW} class='flex flex-col items-end justify-center'>
      <span class='text-xs'>{moment(albumResult.release_date).format('YYYY')}</span>
      <span class='text-xs whitespace-nowrap text-gray-700'>{totalValue} {tracksText}</span>
      <!-- <span class='text-xs text-gray-700'>{millisToMinutesAndSeconds(totalTime)}</span> -->
    </div>
  </button>