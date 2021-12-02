<script lang='ts'>
  export let label
  export let displayValue
  export let hideEdit = false
  export let icon = ''
  export let editText = 'edit'
</script>

<div class='flex flex-col'>
  <div class='flex flex-row items-center space-x-2'>
    <span class='text-xs font-semibold'>{label}</span>
  </div>
  <div class='flex flex-row items-center space-x-2'>
    {#if icon}
      <span class={icon} />
    {/if}
    <span>{displayValue}</span>
  </div>
</div>