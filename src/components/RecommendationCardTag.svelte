<script lang='ts'>
  import { fly } from "svelte/transition";
  import { apiDelete } from "$src/api/api.svelte";
  import { currentUser } from "$src/stores/main";
  import Modal from "./Modal.svelte";
  export let tagJoin

  let showDetails = false
  let showOptionsModal = false
  let removalSuccess = false

  const handleTagClick = () => {
    if (tagJoin.added_by?.id === $currentUser.id) {
      showOptionsModal = true
    }
  }

  const handleCloseModal = () => {
    showOptionsModal = false
  }

  const handleRemoveTag = async () => {
    const resp = await apiDelete(`recommendation_tag_joins/${tagJoin.id}`)

    if (resp.status === 200) {
      removalSuccess = true
      
      setTimeout(() => handleCloseModal(), 300)
    }
  }
</script>

<div class:hidden={removalSuccess} class='relative mr-2 mt-1'>
  <button class='flex items-center px-2 border-1 border-solid rounded-lg text-xs'>
    {tagJoin.tag?.name}
    {tagJoin.added_by?.id === $currentUser.id ? 'x' : ''}
  </button>
  {#if tagJoin.added_by?.name && showDetails}
    <div class="z-1 w-25 p-2 absolute top-6 left-4 bg-white border-solid border-1 rounded-lg">
      <span class='text-xs'>Added by {tagJoin.added_by.name}</span>
    </div>
  {/if}
  <button on:mouseenter={() => showDetails = true} on:mouseleave={() => showDetails = false} on:click={handleTagClick} class='z-1 absolute top-0 left-0 w-full h-full rounded-lg cursor-pointer' />
</div>

{#if showOptionsModal}
  <Modal hideCloseX onHideModal={handleCloseModal} noFullWidth>
    {#if !removalSuccess}
      <h1 class='mb-4'>Would you like to remove this tag?</h1>
      <div class='flex space-x-2 w-full'>
        <button on:click={handleRemoveTag} class='flex-1 rounded-lg px-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white'>Remove Tag</button>
        <button on:click={handleCloseModal} class='flex-1 rounded-lg px-2 py-2 border-indigo-400 hover:border-indigo-700 border-1'>Cancel</button>
      </div>

    {:else}
      <h1 transition:fly={{ duration: 100, y: 25 }}>Success! Tag removed</h1>
    {/if}
  </Modal>
{/if}