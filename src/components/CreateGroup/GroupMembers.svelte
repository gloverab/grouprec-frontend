<script lang='ts'>
  import { groupBottomButtons, groupName, step } from "$src/stores/createGroup";

  let newUserEmail = ''
  let invitees = []

  const handleSendInviteClick = () => {
    const newArr = [...invitees]
    invitees = [newUserEmail, ...newArr]
    newUserEmail = ''
  }

  $: groupBottomButtons.set([
    {
      text: 'Back',
      type: 'secondary',
      onClick: () => step.set('name')
    },
    {
      disabled: invitees.length === 0,
      text: 'Send Invites',
      onClick: () => step.set('members')
    }
  ])
</script>

<div class='flex flex-col'>
  <h1 class='mb-4 text-2xl font-semibold'>Add Members to {$groupName}</h1>
  <div class='flex flex-col mb-4'>
    <span class='text-xs font-medium mb-0.5'>Search</span>
    <input
      class='search-input'
      placeholder='Search for an existing GroupRec user'
    
    />
  </div>

  <span class='text-sm mb-4'>OR</span>

  <div class='flex flex-col space-y-4'>
    <div class='flex flex-col'>
      <span class='text-xs font-medium mb-0.5'>Invite by Email Address</span>
      <input
        bind:value={newUserEmail}
        type='text'
        class='text-input input-border'
      />
    </div>
    <div class='w-full flex justify-end'>
      <div class='w-1/3'>
        <button disabled={!newUserEmail} on:click={handleSendInviteClick} class='btn-tertiary' class:disabled={!newUserEmail}>
          <span>Add User</span>
        </button>
      </div>
    </div>
  </div>

</div>
<div class='flex flex-col space-y-2'>
  {#each invitees as invitee}
    <div class='p-2 rounded-lg shadow-sm border-1 border-solid w-1/2 flex items-center space-x-2'>
      <div class='w-8 h-8 rounded-full flex justify-center items-center border-solid border-1'>
        <span class='fas fa-user' />
      </div>
      <span>{invitee}</span>
    </div>
  {/each}
</div>