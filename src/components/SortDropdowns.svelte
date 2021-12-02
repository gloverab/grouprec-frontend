<script lang='ts'>

  const sortOptions = [
    {
      key: 'title',
      name: 'Alphabetical'
    },
    {
      key: 'created_at',
      name: 'Chronological'
    },
    {
      key: 'recommended_by_name',
      name: 'Recommended By'
    },
    {
      key: 'medium',
      name: 'Medium'
    },
    {
      key: 'do_journeys_cats_hate',
      name: "Cat Preference"
    },
    {
      key: 'has_orion_seen',
      name: "Orion Viewership"
    },
    {
      key: 'ernest_rating',
      name: 'Ernest Rating'
    }
  ]
  
  let primarySelected = sortOptions[0].key
  let primaryDirectionAsc = true
  let secondarySelected = sortOptions[0].key
  let secondaryDirectionAsc = true
  let tertiarySelected = sortOptions[0].key
  let tertiaryDirectionAsc = true

  export let sortObj = {
    primaryString: `${primarySelected} ${primaryDirectionAsc ? 'ASC' : 'DESC'}`,
    secondaryString: `${secondarySelected} ${secondaryDirectionAsc ? 'ASC' : 'DESC'}`,
    tertiaryString: `${tertiarySelected} ${tertiaryDirectionAsc ? 'ASC' : 'DESC'}`
  }

  const handlePrimarySelect = (e) => {
    primarySelected = e.target.value
  }

  const handleSecondarySelect = (e) => {
    secondarySelected = e.target.value
  }

  const handleTertiarySelect = (e) => {
    tertiarySelected = e.target.value
  }

  $: sortObj = {
    primaryString: `${primarySelected} ${primaryDirectionAsc ? 'ASC' : 'DESC'}`,
    secondaryString: `${secondarySelected} ${secondaryDirectionAsc ? 'ASC' : 'DESC'}`,
    tertiaryString: `${tertiarySelected} ${tertiaryDirectionAsc ? 'ASC' : 'DESC'}`
  }

</script>

<div class='flex justify-between w-full flex-col space-y-2 sm:space-y-0 sm:flex-row'>
  <div class='flex flex-col'>
    <span class='text-xs'>Primary Sort</span>
    <div class='flex'>
      <select bind:value={primarySelected} on:change={handlePrimarySelect} name='primary'>
        {#each sortOptions as option}
          <option value={option.key}>{option.name}</option>
        {/each}
      </select>
      <button on:click={() => primaryDirectionAsc = !primaryDirectionAsc}>{primaryDirectionAsc ? 'ASC⇡' : 'DSC⇣'}</button>
    </div>
  </div>
  <div class='flex flex-col'>
    <span class='text-xs'>Secondary Sort</span>
    <div class='flex'>
      <select bind:value={secondarySelected} on:change={handleSecondarySelect} name='secondary'>
        {#each sortOptions as option}
          <option value={option.key}>{option.name}</option>
        {/each}
      </select>
      <button on:click={() => secondaryDirectionAsc = !secondaryDirectionAsc}>{secondaryDirectionAsc ? 'ASC⇡' : 'DSC⇣'}</button>
    </div>
  </div>
  <div class='flex flex-col'>
    <span class='text-xs'>Tertiary Sort</span>
    <div class='flex'>
      <select bind:value={tertiarySelected} on:change={handleTertiarySelect} name='tertiary'>
        {#each sortOptions as option}
          <option value={option.key}>{option.name}</option>
        {/each}
      </select>
      <button on:click={() => tertiaryDirectionAsc = !tertiaryDirectionAsc}>{tertiaryDirectionAsc ? 'ASC⇡' : 'DSC⇣'}</button>
    </div>
  </div>
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    @apply rounded-md border-1 w-full border-solid border-blue-300 h-8 px-2 mr-2 cursor-pointer hover:border-blue-800;
  }

  button {
    @apply rounded-md border-1 border-solid border-blue-300 h-8 px-2 mr-2 cursor-pointer hover:border-blue-800;
  }
</style>