<script context='module'>

</script>

<script lang='ts'>
  import RecommendationCard from '../../components/RecommendationCard.svelte'
  import SortDropdowns from '../../components/SortDropdowns.svelte'
  import { api, apiGet } from "../../api/api.svelte";
  import { currentUser, groupCategories, justAdded } from '../../stores/main';
  import Dropdown from '$src/components/Dropdown.svelte';
  export let recommendations = []

  const options = [
    {
      key: 'all',
      name: 'All'
    },
    {
      key: 'movie',
      name: 'Movies'
    },
    {
      key: 'music',
      name: 'Music'
    },
    {
      key: 'tv',
      name: 'Television'
    }
  ]

  $: categories = [{ name: 'All' }, ...$groupCategories]
  let selectedCategory
  let selectedFormat = options[0]
  let sortObj = {
    primaryString: "title ASC",
    secondaryString: "created_at ASC",
    tertiaryString: "medium ASC"
  }

  const removeRecommendation = (id = undefined) => {
    const ids = recommendations.map(r => r.id)
    const index = ids.indexOf(id)

    if (index > -1) {
      const oldArr = [...recommendations]
      oldArr.splice(index, 1)
      recommendations = [...oldArr]
    }
  }

  const fetchRecommendations = async (sort, format) => {
    const obj = {
      endpoint: 'recommendations',
      params: {
        user_id: $currentUser?.id,
        primary_sort: sort?.primaryString,
        secondary_sort: sort?.secondaryString,
        tertiary_sort: sort?.tertiaryString,
        format: format.key
      } as any
    }

    if (selectedCategory?.id) {
      obj.params.category_id = selectedCategory.id
    }

    const resp = await apiGet(obj)

    if (resp.status === 200) {
      const body = await resp.json()
      console.log(body)
      recommendations = body
    }
  }

  const handleInsertUpdatedRecommendation = (recommendation, index) => {
    recommendations[index] = recommendation
  }

  $: fetchRecommendations(sortObj, selectedFormat, selectedCategory)

</script>

{#if $justAdded}
  <div class='mb-8'>
    <div class='flex w-full justify-between items-center mb-1'>
      <h1 class='font-semibold'>Recently Added</h1>
      <button class='text-sm font-semibold text-indigo-800' on:click={() => justAdded.set(undefined)}>Hide</button>
    </div>
    <RecommendationCard
      justAdded
      recommendation={$justAdded}
    />
  </div>
{/if}

<div class='flex'>
  {#each options as option, i}
    <button class:selected={selectedFormat.key === option.key} on:click={() => selectedFormat = option} class='flex bg-gray-300 text-sm w-25 text-center justify-center py-1.5 rounded-t-lg border-b-0 mr-0.25'>{option.name}</button>
  {/each}
</div>
<div class='bg-white px-4 py-3 rounded-b-md mb-3'>
  <div class='flex mb-4 items-center'>
    <h1 class='text-xl font-bold mr-1'>Recommendations for</h1>
    {#if $groupCategories}
      <Dropdown
        options={categories}
        displayKey='name'
        bind:selected={selectedCategory}
      />
    {/if}
    
  </div>

  <SortDropdowns
    bind:sortObj={sortObj}
  />
</div>

<div class='space-y-3'>
  {#each recommendations as recommendation, i (recommendation.id)}
    <RecommendationCard
      {recommendation}
      {i}
      insertUpdatedRecommendation={handleInsertUpdatedRecommendation}
      deleteClickCallback={removeRecommendation}
    />
  {/each}
</div>

<style>
  .selected {
    @apply bg-white;
  }
</style>