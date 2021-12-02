<script lang='ts'>
  import { camelCaseToTitleCase, toTitleCase } from "$src/helpers";
  import { createMusicRecommendation } from "$src/modules/GroupRecApi.svelte";
  import { currentUser, justAdded, showCreateRecommendation } from "$src/stores/main";
  import { backStep, bottomButtons, catsHate, ernestRating, format, image, linksByPlatform, medium, orionSeen, category, spotifyResult, step, tags, title, year, nextStep } from "$src/stores/submitRecommendation";

  $: services = Object.keys($linksByPlatform)
  $: console.log($spotifyResult)

  const handleAddDetailsClick = () => {

  }

  const handleAddCategoryClick = () => {
    step.set('tags')
    nextStep.set('reviewMusicSubmission')
  }

  const handleSubmit = async () => {
    const recommendation = {
      group_id: $currentUser.groups[0].id,
      image: $image,
      title: $title,
      year: $year,
      format: $format,
      medium: $medium,
      do_journeys_cats_hate: $catsHate,
      has_orion_seen: $orionSeen,
      ernest_rating: $ernestRating
    }

    const resp = await createMusicRecommendation(recommendation, $tags, $linksByPlatform, $category.id)

    if (resp.status === 200) {
      const body = await resp.json()
      justAdded.set(body)
      showCreateRecommendation.set(false)
    }
  }

  $: bottomButtons.set([
    {
      text: 'Back',
      type: 'secondary',
      onClick: () => step.set($backStep)
    },
    {
      text: 'Submit',
      onClick: handleSubmit
    }
  ])
</script>

<div class='flex items-end mb-8'>
  <div class='w-1/3 h-1/3 shadow-2xl mr-4'>
    <img src={$image} alt='Album Cover' />
  </div>

  <div class='flex flex-col'>
    <span class='text-xs font-medium'>{$medium.toUpperCase()}</span>
    <span class='text-4xl font-semibold mb-1'>{$title}</span>
    <div class='flex'>
      {#each $spotifyResult.artists as artist, i}
        <span class='text-xs font-semibold'>{i + 1 === $spotifyResult.artists.length ? artist.name : `${artist.name} • `}</span>
      {/each}
      <span class='text-xs text-gray-700'>&nbsp;•&nbsp;{$year}</span>
    </div>
  </div>
</div>

<div class='flex'>
  <div class='flex flex-col flex-1'>
    <div class='flex flex-col mb-4'>
      <span class='label'>Share to</span>
      <span>{$currentUser.groups[0].name}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='label'>Category</span>
        <button on:click={handleAddCategoryClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{toTitleCase($category.name)}</span>
    </div>

    <div class='flex flex-col mb-4'>
      <span class='label'>Tags</span>
      {#if $tags.length === 0}
        <button on:click={handleAddCategoryClick} class='block w-30 border-1 border-solid rounded-md'>+ Add Tags</button>
      {:else}
        <span>{$tags}</span>
      {/if}
    </div>

    <div class='flex flex-col mb-4'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Has Orion Heard This?</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$orionSeen}</span>
    </div>

    <div class='flex flex-col'>
      <div class='flex space-x-2'>
        <span class='text-xs font-semibold'>Do Journey's Cats Hate This?</span>
        <button on:click={handleAddDetailsClick} class='text-xs font-semibold text-indigo-800'>Edit</button>
      </div>
      <span>{$catsHate}</span>
    </div>
  </div>

  <div class='flex flex-col flex-1'>
    <div class='flex flex-col mb-4'>
      <span class='label'>Streaming Links Found</span>
      {#each services as service}
        <a class='text-indigo-700 font-medium hover:underline' target='blank' href={$linksByPlatform[service]?.url}>{camelCaseToTitleCase(service)}</a>
      {/each}
    </div>

    <div class='flex flex-col'>
      <span class='label'>Tags</span>
      {#if $tags.length === 0}
        <button class='block w-30 border-1 border-solid rounded-md'>+ Add Tags</button>
      {:else}
        <span>{$tags}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .label {
    @apply text-sm font-semibold;
  }
</style>