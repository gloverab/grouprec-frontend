<script lang='ts'>
  import { currentUser } from "$src/stores/main";
  import { backStep, bottomButtons, catsHate, colorization, ernestRating, nextStep, orionSeen, step } from "$src/stores/submitRecommendation";
  import RadioInput from "../RadioInput.svelte";

  let showOrionError = false

  const catOptions = ['Yes', 'No', 'Maybe']
  const orionSeenOptions = ['Seen', 'Want to see',  'Do not want to see', "Seen so you don't have to", "?", "???", "Not Sure", "huh"]
  const colorOptions = ['Color', 'Black and White', 'Blue', 'Color but like really low chroma-keyed', 'Neon', 'Nightcam', 'Varied']

  const ernestPhotoLinks = [
    'https://lh6.googleusercontent.com/_LW0Bz4dAW5_5-Y1rRnPhrj1FkP3J4oJq7wzrDcm4XFHFf6xaD9dWTCf_qeW6l4tXAsJN7UWHD_6uHWBhbxhnPaLHuvqA5MohWsyLPQ0LNk9T7vfHiRfAHTH1fnpb6csW2slEK4dAA=s0',
    'https://lh3.googleusercontent.com/G9D7tb-WrbFNcXd5531tOKMpR6pa4dkOvFkBGwkthlXuZy44GGY2u8meFlznDBQXWR1rDPkZ0fFsfKlDdJ_NxTJbLITkHo3kVYVdqh25AxvIMjRp0NnQmZKqCG6hvffshcg4CkWuyA=s0',
    'https://lh5.googleusercontent.com/nCdhhIY7TQW9l2blKWzbdFhMlo6e3Js0YCJjId88MZE8E3XJ_5wAwJvr5ln5FQNSCpc_oTgT_ZvY3eqDnHg5E6tbXO1P8d8W9taToMZFOCRD51g4nLBWN55xjTmQ6tu5rsbwFh8SOQ=s0',
    'https://lh3.googleusercontent.com/kHs8JOatiCodtjrHjpyv9Zmn2pd_Vna1aldOFXST88UTNwVLpYNWjh3X8WJ-7etIgkDxpEdd42xDrVhj1IrfEbAkTM_e0nWnZ2A_mKVasNmS5lnOQp00PzHhcLzztcrgs24Gi7ZJaw=s0',
    'https://lh6.googleusercontent.com/oht67JP_emMwFTjEGyQ9H7qTezVT6SJNA4Qtndn74pxgZalYDepCAFuo_zaXxNcdTntPjSsF3DOU2SMH9pMbLAzDdlfm-xRI4ocYSYlHfBIuLF6jCchMQm9PUeKGGJNqw77Ul1Y0OA=s0',
    'https://lh6.googleusercontent.com/Wp9wFKBCSjE_9-lMRSQ6Q8_OTNXg3DCxn50ahU2ESgBP_z6v74CjDTACMOwbhk52SO3IWKj6gLPQbMVaH7pykNJIFx0cTLopk7ifFoyq62pgd9bicu_NIjtNfZuPKg1RSV4csiNqdw=s0',
    'https://lh3.googleusercontent.com/GSzaxovkjK9MlAGK-wQC-fjcQFP0E51t1XI4PJLeqQ4RIlqbUefUp92Rp5lG-heXAyd0KDzw2z5QVae6klUAu-cfQt86_7FIP-sPhk8OoM3acbzrlkHT-CwFhz2DEGlxIkCN8XY4LQ=s0',
    'https://lh5.googleusercontent.com/4JMEyf8cZHhfm4NUKYDqo7uGYHvNjWAmXlrcnmbNW2_7b60PhOQ7PmIIu53taNotib_IWa_a0vfwuykler06AFinBwFtuX_sZ2R9JTRu-sl_psv4_FN-oxKgf-aLJS1UaFERJk-b-g=s0'
  ]

  const handleOrionSeen = (option: string) => {
    if (!$currentUser.name.toLowerCase().includes('orion')) {
      showOrionError = true
    } else {
      orionSeen.set(option)
    }
  }

  const handleNext = () => {
    step.set('reviewSubmission')
  }

  $: bottomButtons.set([
    {
      text: 'Back',
      onClick: () => step.set($backStep),
      type: 'secondary'
    },
    {
      text: 'Review Submission',
      onClick: handleNext
    }
  ])
</script>

<h1 class='text-xl font-semibold mb-2'>Add Details</h1>
<div class='flex flex-col space-y-4'>
  <div>
    <span class='form-label'>Do Journey's cats hate this?*</span>
    <div class='flex space-x-2'>
      {#each catOptions as option}
        <RadioInput
          text={option}
          onClick={() => $catsHate = option}
          selected={$catsHate === option}
        />
      {/each}
    </div>
  </div>

  <div class='w-full'>
    <div class='flex flex-col mb-1'>
      <span class='form-label'>Has Orion seen this?</span>
      {#if showOrionError}
        <span class='text-xs text-red-600'>Oops! Only Orion can update this. If you feel you're seeing this message in error, please contact Orion for his login information.</span>
      {/if}
    </div>
    <div class='flex flex-wrap -mt-2'>
      {#each orionSeenOptions as option}
        <RadioInput
          classes='mr-2 mt-2'
          text={option}
          onClick={() => handleOrionSeen(option)}
          selected={$orionSeen === option}
        />
      {/each}
    </div>
  </div>

  <div class='flex flex-col'>
    <span class='form-label'>Colorization</span>
    <div class='flex flex-wrap -mt-2'>
      {#each colorOptions as option}
        <RadioInput
          classes='mt-2 mr-2'
          text={option}
          onClick={() => colorization.set(option)}
          selected={$colorization === option}
        />
      {/each}
    </div>
  </div>

  <div class='flex flex-col'>
    <span class='mb-1 text-xs font-semibold'>Ernest Rating</span>
    <div class='flex'>
      <span class='text-xs mr-2'>Select</span>
      {#if ernestPhotoLinks.includes($ernestRating)}
        <button class='text-xs text-red-500' on:click={() => ernestRating.set('')}>clear</button>
      {/if}
    </div>
    <div class='flex flex-wrap'>
      {#each ernestPhotoLinks as photoLink}
        <button class='rounded-lg img-wrap mr-1 mb-2 border-3 border-solid border-transparent hover:border-indigo-200' class:selected={$ernestRating === photoLink} on:click={() => ernestRating.set(photoLink)}>
          <img class='h-20 w-auto' alt='ernest' src={photoLink} />
        </button>
      {/each}
    </div>
    <span class='text-xs mb-1'>Or paste a link</span>
    <input
      class='recommendation-input'
      placeholder='If none of these fit, paste a link to a photo here'
      type='text'
      bind:value={$ernestRating}
    >
  </div>
</div>

<style>
  .form-label {
    @apply text-xs mb-1 font-semibold;
  }

  .selected {
    @apply border-indigo-600 hover:border-indigo-600;
  }
</style>