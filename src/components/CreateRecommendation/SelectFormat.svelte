<script lang='ts'>
  import { backStep, bottomButtons, format, medium, step } from "$src/stores/submitRecommendation"

  let recommendationTypes = [
    {
      key: 'movie',
      name: "Movie"
    },
    {
      key: 'music',
      name: "Music"
    },
    // {
    //   key: 'tv-show',
    //   name: "TV Show"
    // },
    // {
    //   key: 'tv-episode',
    //   name: "TV Episode"
    // },
    // {
    //   key: 'graphic-novel',
    //   name: "Graphic Novel"
    // },
    // {
    //   key: 'book',
    //   name: "Book"
    // }
  ]

  const handleMediumClick = (key: string) => {
    step.set('title')
    backStep.set('format')
    format.set(key)

    if (key === 'movie') {
      medium.set('movie')
    }
  }

  $: bottomButtons.set([])
</script>

<h1 class='text-xl font-semibold mb-2'>Submit a Recommendation</h1>
<div class='flex flex-col w-full'>
  {#each recommendationTypes as recType}
    <button on:click={() => handleMediumClick(recType.key)} class='w-full flex justify-between h-12 items-center border-b border-indigo-200'>
      <span>
        {recType.name}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </button>
  {/each}
</div>