<script lang='ts'>
  import { step } from "$src/stores/createGroup";
  import GroupMembers from "./CreateGroup/GroupMembers.svelte";
  import GroupName from "./CreateGroup/GroupName.svelte";
</script>

{#if $step === 'name'}
  <GroupName />
{:else if $step === 'members'}
  <GroupMembers />
{/if}



