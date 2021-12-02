<script lang='ts'>
  import { apiPost } from "$src/api/api.svelte";
  import { toTitleCase } from "$src/helpers";
  import { currentUser, justAdded, showCreateRecommendation } from "$src/stores/main";

  import { availableOn, backStep, bottomButtons, catsHate, colorization, ernestRating, format, imdbId, medium, movieResult, nextStep, orionSeen, category, step, tags, title, trailerLink, year } from "$src/stores/submitRecommendation";

  const handleNext = async () => {
    const body = {
      recommendation: {
        group_id: $currentUser.groups[0].id,
        title: $title,
        format: $format,
        medium: $medium,
        year: $year,
        trailer_link: $trailerLink,
        imdb_id: $imdbId,
        available_on: $availableOn.key,
        do_journeys_cats_hate: $catsHate,
        has_orion_seen: $orionSeen,
        ernest_rating: $ernestRating,
        colorization: $colorization
      },
      tags: $tags
    }

    if ($category.id) {
      body.category_id = $category.id
    }

    const obj = {
      endpoint: 'recommendations',
      body
    }
    const resp = await apiPost(obj)

    if (resp.status === 200) {
      const body = await resp.json()
      justAdded.set(body)
      showCreateRecommendation.set(false)
    } else {
      console.log('shit')
    }

  }

  $: bottomButtons.set([
    {
      text: 'Back',
      onClick: () => step.set($backStep),
      type: 'secondary'
    },
    {
      text: 'Submit',
      onClick: handleNext,
      disabled: !$availableOn
    }
  ])

  const handleAddDetailsClick = () => {
    nextStep.set('reviewSubmission')
    step.set('addDetails')
  }

  const handleEditAvailableOnClick = () => {
    nextStep.set('reviewSubmission')
    step.set('availableOn')
  }

  const handleEditTagsClick = () => {
    nextStep.set('reviewSubmission')
    step.set('tags')
  }
</script>

<div class='flex space-x-2 mb-4'>
  <div class='w-1/2'>
    <h1 class='text-xl font-semibold mb-4'>{$movieResult.title} {$movieResult.description}</h1>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Available On</span>
        <button on:click={handleEditAvailableOnClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$availableOn.name}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Category</span>
        <button on:click={handleEditTagsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$category.name}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Colorization</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$colorization}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Medium</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{toTitleCase($medium)}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Has Orion Seen This?</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$orionSeen}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Do Journey's Cats Hate This?</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$catsHate}</span>
    </div>

    <div class='flex flex-col'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Ernest Rating</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      {#if $ernestRating}
        <div>
          <img class='h-12 w-auto' src={$ernestRating} alt='ernest rating' />
        </div>
      {:else}
        <div class='w-14 h-10 bg-red-600' />
      {/if}
    </div>
  </div>

  <div class='flex-1'>
    <div class='overflow-hidden shadow-md'>
      <img src={$movieResult.image} />
    </div>
  </div>
  <div>
    
  </div>
</div>

<div class='mb-3'>
  <div class='flex space-x-2'>
    <span class='text-xs font-semibold'>Tags</span>
    <button on:click={handleEditTagsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
  </div>
  <div class='flex flex-wrap'>
    {#each $tags as tag}
      <div class='border-1 border-indigo-300 rounded-full flex items-center px-2 mr-2 mb-1'>
        <span class='text-xs'>
          {tag.name}
        </span>
      </div>
    {/each}
  </div>
</div>