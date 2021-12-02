<script lang='ts'>
  import { backStep, bottomButtons, medium, movieResult, step } from "$src/stores/submitRecommendation"
  import MovieSearchResult from "./MovieSearchResult.svelte"
  const imdbURL = 'https://imdb-api.com/en/API/SearchMovie'
  const apiKey = 'k_y1jaq5j5'

  let searchVal
  let timeSinceKeystroke = 0
  let interval
  let searchResults = []

  const handleSearch = async () => {
    const url = `${imdbURL}/${apiKey}/${searchVal}`
    const resp = await fetch(url)
    if (resp.status === 200) {
      const body = await resp.json()
      searchResults = body.results
    }
  }

  const handleChange = () => {
    timeSinceKeystroke = 0
    clearInterval(interval)
    interval = setInterval(() => timeSinceKeystroke += 200, 200)
  }

  $: if (timeSinceKeystroke > 600) {
    handleSearch()
    timeSinceKeystroke = 0
    clearInterval(interval)
  }

  $: bottomButtons.set([
    {
      text: 'Back',
      type: 'secondary',
      onClick: () => step.set($backStep)
    }
  ])

  $: if (searchVal === '') {
    searchResults = []
  }
</script>

<h1 class='text-xl font-semibold mb-2'>Title</h1>
<input
  class='search-input'
  type='search'
  placeholder='Search for a title'
  on:keydown={handleChange}
  bind:value={searchVal}
/>
{#if searchResults.length > 0}
  {#each searchResults as result}
    <MovieSearchResult
      {result}
    />
  {/each}
{/if}
{#if $movieResult && searchResults.length === 0}
  <MovieSearchResult
    result={$movieResult}
  />
{/if}