<script lang='ts'>
  import { toTitleCase } from '../helpers'
  export let selected
  const mediums = [
    'movie',
    'film',
    'tv series',
    'tv episode',
    'tv episodes',
    'miniseries',
    'album',
    'song',
    'video game'
  ]
</script>

<div>
  <span class='text-xs'>Medium*</span>
  <div class='flex flex-wrap'>
    {#each mediums as medium}
      <button on:click={() => selected = medium} class='border-1 border-solid {selected === medium ? 'border-black' : ''} rounded-lg px-2 h-8 flex items-center flex-wrap mb-2 mr-2'>
        <span>{toTitleCase(medium)}</span>
      </button>
    {/each}
  </div>
</div>