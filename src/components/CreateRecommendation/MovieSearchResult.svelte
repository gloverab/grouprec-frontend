<script lang='ts'>
  import { backStep, imdbId, movieResult, step, title, trailerLink, year } from "$src/stores/submitRecommendation"

  export let result

  const getTrailerLink = async (id: string) => {
    const imdbURL = 'https://imdb-api.com/en/API/Trailer'
    const apiKey = 'k_y1jaq5j5'
    
    const url = `${imdbURL}/${apiKey}/${id}`
    console.log(url)
    const resp = await fetch(url)
    if (resp.status === 200) {
      const body = await resp.json()
      trailerLink.set(body.linkEmbed)
      title.set(body.title)
      year.set(body.year)
      imdbId.set(body.imDbId)
    } else {
      console.log('problem')
    }
  }

  const handleClick = () => {
    console.log(result)
    getTrailerLink(result.id)
    title.set(result.title)
    imdbId.set(result.id)
    movieResult.set(result)
    backStep.set('title')
    step.set('tags')
  }
</script>

<button on:click={handleClick} class='w-full flex justify-between py-2'>
  <div class='flex items-center space-x-3'>
    <div class='h-8 w-6 overflow-hidden'>
      <img class='h-full' src={result.image} alt={result.title} />
    </div>
    <span class='text-sm font-medium text-left'>{result.title} <span>{result.description}</span></span>
  </div>
</button>