<script lang='ts'>
  import { apiPost } from "$src/api/api.svelte";
  import { currentUser, groupCategories } from "$src/stores/main";
  import { backStep, bottomButtons, category, movieResult, nextStep, step, tags, title } from "$src/stores/submitRecommendation";
  import Dropdown from "../Dropdown.svelte";
  import TagsInput from "../TagsInput.svelte";

  let tagValue
  let createCategorySuccess = false
  let expanded

  $: categories = [{ name: 'Any' }, ...$groupCategories]

  const handleNext = () => {
    backStep.set('tags')
    step.set($nextStep || 'availableOn')
  }

  $: bottomButtons.set([
    {
      text: 'Back',
      type: 'secondary',
      onClick: () => step.set($backStep)
    },
    {
      disabled: expanded,
      text: $nextStep ? 'Review Submission' : 'Next',
      onClick: handleNext
    }
  ])

  const handleCreateCategory = async (name: string) => {
    const categoryObj = {
      name,
      group_id: $currentUser.groups[0].id
    }

    const obj = {
      endpoint: '/categories',
      body: {
        category: categoryObj
      }
    }
    
    const resp = await apiPost(obj)

    if (resp.status === 201) {
      const body = await resp.json()
      createCategorySuccess = true
      category.set(body)
      const arr = [...$groupCategories]
      arr.push(body)
      groupCategories.set(arr)
    }
  }

  $: labelText = tagValue ? 'Press Enter or Comma to Submit' : 'Enter tags'

</script>

{#if $movieResult}
  <h1 class='text-xl font-semibold mb-4'>{$movieResult.title} {$movieResult.description}</h1>
{:else}
  <h1 class='text-xl font-semibold mb-4'>{$title}</h1>
{/if}

<div class='space-y-4'>
  <div class='flex flex-col'>
    <span class='text-xs font-semibold'>Category <span class='font-normal'>(Halloween, Christmas, etc...)</span></span>
    <Dropdown
      options={categories}
      displayKey='name'
      addNewName='Category'
      addNewAction={handleCreateCategory}
      createSuccess={createCategorySuccess}
      bind:selected={$category}
      bind:showAddNew={expanded}
    />
  </div>
  <div class=''>
    <span class='text-xs font-semibold'>{labelText}</span>
    <TagsInput
      bind:tags={$tags}
      bind:value={tagValue}
    />
  </div>
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    @apply rounded-md border-1 w-full border-solid border-indigo-300 h-10 px-2 mr-2 cursor-pointer hover:border-indigo-800;
  }
</style>