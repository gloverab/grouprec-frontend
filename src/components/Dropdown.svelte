<script lang='ts'>
  import ChevronDown from "$src/assets/ChevronDown.svelte";
  import { clickOutside } from "../helpers";


  export let options: any[]
  export let selected = options[0]
  export let displayKey: string
  export let addNewName = ''
  export let addNewAction = undefined
  export let createSuccess = false
  export let showAddNew = false
  export let textClasses = ''

  let buttonH
  let showOptions
  let value

  $:console.log(selected)

  const handleOptionClick = (option: any) => {
    showOptions = false
    showAddNew = false
    selected = option
  }

  const handleAddNewClick = () => {
    showAddNew = true
    showOptions = false
  }

  $: if (createSuccess) {
    showAddNew = false
  }
</script>

<div class='relative w-full'>
  <button bind:clientHeight={buttonH} on:click={() => showOptions = true} class='relative w-full text-left input-border py-1 pl-2 pr-8 min-h-9.5'>
    <span class={textClasses}>
      {showAddNew ? `New ${addNewName}` : selected[displayKey]}
    </span>
    <div class='absolute right-0 top-0 flex w-8 h-8 px-2 items-center h-full'>
      <ChevronDown />
    </div>
  </button>

  {#if showOptions}
    <div use:clickOutside on:click_outside={() => showOptions = false} class='z-1 w-full flex flex-col items-start bg-white absolute left-0 p-2 rounded-lg shadow-2xl flex flex-col' style="top: {buttonH}px">
      {#each options as option}
        <button class:selected={option[displayKey] === selected[displayKey]} class='w-full flex justify-between items-center text-left rounded-md hover:bg-gray-200 active:bg-gray-300 p-2' on:click={() => handleOptionClick(option)}>
          <div class='flex items-center'>
            {#if option.icon}
              <div class='w-4 flex justify-center mr-2'>
                <span class='{option.icon}' />
              </div>
            {/if}
            <span>
              {option[displayKey]}
            </span>
          </div>
          {#if option[displayKey] === selected[displayKey]}
            <span class='fas fa-check' />
          {/if}
        </button>
      {/each}
      {#if addNewName}
        <button class='w-full text-left rounded-md hover:bg-gray-200 active:bg-gray-300 p-2' on:click={handleAddNewClick}>
          Create New {addNewName}
        </button>
      {/if}
      
    </div>
  {/if}
</div>

{#if showAddNew}
  <div class='flex flex-col mt-4'>
    <span class='text-xs'>Category Name</span>
    <div>
      <input class='border-1 border-solid rounded-lg p-2 mb-2' type='text' bind:value={value} />
    </div>
  </div>
  <div>
    <button class='rounded-full outline-none bg-indigo-800 py-3 px-4 text-white' on:click={() => addNewAction(value)}>
      Create Category
    </button>
  </div>
{/if}

<style>
  .selected {
    @apply font-bold text-indigo-800;
  }
</style>