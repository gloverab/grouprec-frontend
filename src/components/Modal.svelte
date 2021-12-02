<script lang='ts'>
  import { fly } from "svelte/transition";
  import Overlay from "./Overlay.svelte";

  export let onHideModal: () => void
  export let hideCloseX = false
  export let noFullWidth = false
  export let bottomButtons = []

</script>

<div class='fixed w-screen h-screen top-0 left-0 flex items-center justify-center px-6 z-1001'>
  <Overlay
    all
    duration={200}
    onClick={onHideModal}
  />
  
  <div transition:fly={{ y: 25, duration: 200 }} class='relative rounded-xl bg-white shadow-5 px-4.5 pt-6 pb-24 h-150 {!noFullWidth ? 'w-full' : ''} max-w-170 max-h-5/6 z-1300'>
    <div class='w-full {hideCloseX ? 'hidden' : 'flex'} justify-end'>
      <button on:click={onHideModal}>
        X
      </button>
    </div>
    <div class='scrollable-content h-125'>
      <slot />
    </div>
    <div class='absolute bottom-0 left-0 w-full h-20 flex items-center px-8 space-x-2'>
      {#if bottomButtons.length > 0}
        {#each bottomButtons as button}
          <button
            disabled={button.disabled}
            on:click={button.onClick}
            class='{button.type === 'secondary' ? 'btn-secondary' : 'btn-primary'}'
            class:disabled={button.disabled}
          >
            {button.text}
          </button>
        {/each}
      {/if}
    </div>

  </div>

</div>

<style>
  .scrollable-content {
    padding: 0 18px;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>