<script lang='ts'>
  import { toTitleCase } from "../helpers";

  export let classes = ''
  export let text
  export let selected
  export let onClick
</script>

<button on:click={onClick} class='{classes} radio-input h-6 px-2 rounded-lg border-1 border-indigo-200 hover:border-indigo-400 flex items-center text-sm' class:selected>
  <div class='circle h-2 w-2 rounded-full border-solid border-1 border-indigo-200 mr-2' class:selected />
  {toTitleCase(text)}
</button>

<style>
  .radio-input.selected {
    @apply border-indigo-600;
  }
  .circle.selected {
    @apply bg-indigo-600 border-indigo-700;
  }
</style>