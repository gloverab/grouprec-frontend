<script lang='ts'>
  import { checkIfImageExists } from "$src/helpers";

  import { groupBottomButtons, groupImage, groupName, step } from "$src/stores/createGroup";
  import { showCreateNewGroup } from "$src/stores/main";

  let imageValid = false

  $: groupBottomButtons.set([
    {
      text: 'Cancel',
      type: 'secondary',
      onClick: () => showCreateNewGroup.set(false)
    },
    {
      disabled: !$groupImage || !$groupName,
      text: 'Next',
      onClick: () => step.set('members')
    }
  ])

  const onImageCheck = (exists: boolean) => {
    if (exists) {
      imageValid = true
    }
  }

  $: checkIfImageExists($groupImage, onImageCheck)
</script>

<div class='flex flex-col'>
  <h1 class='mb-4 text-2xl font-semibold'>Create New Group</h1>
  <div class='space-y-4'>
    <div class='flex flex-col'>
      <span class='text-xs font-medium mb-0.5'>Group Name</span>
      <input
        class='text-input input-border'
        placeholder='Name'
        type='text'
        bind:value={$groupName}
      />
    </div>
    <div class='flex flex-col'>
      <span class='text-xs font-medium mb-0.5'>Group Img</span>
      <input
        class='text-input input-border'
        placeholder='Paste a URL to an image'
        type='text'
        bind:value={$groupImage}
      />
    </div>

    {#if imageValid}
      <div class='w-20 h-20 rounded-md overflow-hidden'>
        <img src={$groupImage} alt='group logo' />
      </div>
    {/if}
  </div>
</div>