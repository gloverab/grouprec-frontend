<script lang='ts'>
import { musicStreamingOptions } from "$src/constants";

  import { currentUser } from "$src/stores/main";
  import Dropdown from "./Dropdown.svelte";

  export let name
  export let image
  export let username
  export let email
  export let discordUsername
  export let musicStreamingPreference

</script>

<div class='w-full space-y-4'>
  <div class='flex flex-col'>
    <span class='text-xs font-medium mb-0.5'>Name</span>
    <input
      autocomplete='name'
      class='text-input input-border'
      placeholder='Name'
      type='text'
      bind:value={name}
    />
  </div>
  <div class='flex flex-col'>
    <span class='text-xs font-medium mb-0.5'>Image URL</span>
    <input
      class='text-input input-border'
      placeholder='Image URL'
      type='text'
      bind:value={image}
    />
  </div>
  <div class='flex flex-col'>
    <span class='text-xs font-medium mb-0.5'>Username</span>
    <input
      class='text-input input-border'
      placeholder='Username'
      type='text'
      bind:value={username}
    />
  </div>
  <div class='flex flex-col'>
    <span class='text-xs font-medium mb-0.5'>Email</span>
    <input
      autocomplete='email'
      class='text-input input-border'
      placeholder='Email'
      type='email'
      bind:value={email}
    />
  </div>
  <div class='flex flex-col'>
    <span class='text-xs font-medium mb-0.5'>Discord Username</span>
    <input
      class='text-input input-border'
      placeholder='Discord Username'
      type='text'
      bind:value={discordUsername}
    />
  </div>
  <div class='flex flex-col'>
    <span class='text-xs font-medium mb-0.5'>Music Streaming Preference</span>
    <Dropdown
      options={musicStreamingOptions}
      displayKey='name'
      bind:selected={musicStreamingPreference}
    />
  </div>
</div>

<style>
</style>