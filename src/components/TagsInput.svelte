<script lang='ts'>
  import { onMount } from "svelte";

  import { localTags } from "../stores/main";
  export let tags = []
  export let hideNewTags
  export let handleSubmitTag = undefined
  export let autoFocus
  export let value = ''

  let inputEl
  let autocompleteTagValue = undefined
  let showAllTags = false
  let lowercaseMatch

  let disableTabComplete = false

  onMount(() => {
    if (autoFocus) {
      inputEl?.focus
    }
  })

  const handleChange = (e) => {
    value = e.target.value

    const compare = (tag) => {
      const lcTagName = tag.name.toLowerCase()
      const lcVal = value.toLowerCase()

      const matchFound = lcTagName.includes(lcVal) && lcTagName.startsWith(lcVal)

      const strictMatchFound = tag.name.includes(value) && tag.name.startsWith(value)
      if (matchFound && !strictMatchFound) {
        lowercaseMatch = true
      }

      return lcTagName.includes(lcVal) && lcTagName.startsWith(lcVal)
    }

    autocompleteTagValue = $localTags.find(compare)
    
  }

  const handleKeyup = (e) => {
    if (e.which === 16) {
      disableTabComplete = false
    }
  }

  const handleDeleteTag = (tagName: string) => {
    const tagNames = tags.map(t => t.name)
    const toDeleteIndex = tagNames.indexOf(tagName)
    console.log(toDeleteIndex)
    const oldArr = [...tags]
    oldArr.splice(toDeleteIndex, 1)
    tags = [...oldArr]

  }

  const handleKeydown = (e) => {
    if (e.which === 16) {
      disableTabComplete = true
    }
    if ((e.which === 13 || e.which === 188) && value) {
      e.preventDefault()
      const newTag = autocompleteTagValue?.id ? autocompleteTagValue : { name: value }
      tags = [...tags, newTag]
      value = ''
      autocompleteTagValue = undefined

      if (handleSubmitTag) {
        handleSubmitTag(newTag)
      }
    }
    if (e.which === 9 && !disableTabComplete && autocompleteTagValue?.id) {
      e.preventDefault()
      lowercaseMatch = false
      value = autocompleteTagValue.name
    }
  }

  const handleAddTag = (tag) => {
    tags = [...tags, tag]
  }
</script>

<div class='flex flex-col'>
  <div class='flex flex-row items-center'>
    <div class='relative h-8 w-60'>
      {#if value && autocompleteTagValue}
        <span class='absolute top-0 text-gray-400'>
          {lowercaseMatch ? autocompleteTagValue.name.toLowerCase() : autocompleteTagValue.name}
        </span>
        {/if}
      <input
        class='absolute top-0 recommendation-input bg-transparent border-b border-solid outline-none w-full hover:border-b-indigo-300 focus:border-b-indigo-700'
        placeholder='Type a tag here and press enter'
        type='text'
        on:input={handleChange}
        on:keydown={handleKeydown}
        on:keyup={handleKeyup}
        autofocus={autoFocus}
        bind:value={value}
      >
    </div>
    <button on:click={() => showAllTags = !showAllTags} class='h-8 flex items-center text-xs ml-2 text-indigo-700'>{showAllTags ? 'Hide inspiration' : 'Need inspiration?'}</button>
  </div>
  {#if !hideNewTags}
    <div class='flex flex-row flex-wrap'>
      {#each tags as tag}
        <button on:click={() => handleDeleteTag(tag.name)} class='text-xs rounded-full border-solid border-1 px-2 mr-1 mb-1 border-indigo-600'>{tag.name} x</button>
      {/each}
    </div>
  {/if}

  {#if showAllTags}
    <div class='flex flex-wrap mt-2'>
      {#each $localTags as tag}
        <button on:click={() => handleAddTag(tag)} class='text-xs rounded-full border-solid border-1 px-2 mr-1 mb-1'>+ {tag.name}</button>
      {/each}
    </div>
  {/if}
</div>
