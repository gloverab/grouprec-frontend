<script lang='ts'>
  import { apiPost } from "$src/api/api.svelte";
  import { groupUsers } from "$src/stores/main";
  import ModalOrSheet from "./ModalOrSheet.svelte";

  export let onClose
  export let recommendation
  
  let selected = []

  $: selectedIds = selected.map(s => s.id)

  const handleClickUser = (user) => {
    if (selectedIds.includes(user.id)) {
      const index = selectedIds.indexOf(user.id)
      const arr = [...selected]
      arr.splice(index, 1)
      selected = [...arr]
    } else {
      const arr = [...selected, user]
      selected = arr
    }
  }

  $: handleSubmit = async () => {
    const obj = {
      endpoint: 'user-specific-recommendations',
      body: {
        recommendation_id: recommendation.id,
        user_ids: JSON.stringify(selectedIds)
      }
    }

    const resp = await apiPost(obj)

    if (resp.status === 200) {
      onClose()
    }
  }

  $: bottomButtons = [
    {
      text: 'Close',
      type: 'secondary',
      onClick: onClose
    },
    {
      text: 'Submit',
      onClick: handleSubmit
    }
  ]
</script>

<ModalOrSheet {bottomButtons} {onClose}>
  <div class='flex flex-col'>
    <div class='relative flex flex-col h-12 mb-1 items-start'>
      <h1 class='text-xl font-semibold'>Select Specific People to Recommend {recommendation.title} to:</h1>
      {#if selected.length > 0}
        <button on:click={() => selected = []} class='absolute left-0 bottom-0 text-sm text-indigo-700 hover:text-indigo-900'>Clear all</button>
      {/if}
    </div>

    <div class='flex flex-col sm:flex-row sm:flex-wrap'>
      {#each $groupUsers as user}
        <button on:click={() => handleClickUser(user)} class:selected={selectedIds.includes(user.id)} class='flex items-center w-full sm:w-2/9 border-1 border-solid hover:border-indigo-300 shadow-md hover:shadow-lg active:shadow-sm px-2 py-1.5 rounded-md mr-1/36 mb-2'>
          <div class='rounded-full w-8 h-8 overflow-hidden mr-1'>
            <img src={user.image} />
          </div>
          <div class='flex flex-col items-start'>
            <span class='text-sm'>{user.name}</span>
            <span class='text-xs text-gray-600'>{user.username}</span>
          </div>
        </button>
      {/each}
    </div>
  </div>
</ModalOrSheet>

<style>
  .selected {
    @apply border-indigo-800 hover:border-indigo-900;
  }
</style>