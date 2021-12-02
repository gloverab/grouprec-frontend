<script lang='ts'>
  import NetflixLogo from '$assets/netflix-logo.jpg'
  import HboMaxLogo from '$assets/hbo-max-logo.png'
  import HuluLogo from '$assets/hulu-logo.png'
  import PrimeVideoLogo from '$assets/prime-video-logo.jpeg'
  import DisneyPlusLogo from '$assets/disney-plus-logo.jpeg'
  import { availableOn, backStep, bottomButtons, nextStep, step } from '$src/stores/submitRecommendation';

  const streamingOptions = [
    {
      key: 'netflix',
      name: 'Netflix',
      img: NetflixLogo
    },
    {
      key: 'hulu',
      name: 'Hulu',
      img: HuluLogo
    },
    {
      key: 'prime-video',
      name: 'Prime Video',
      img: PrimeVideoLogo
    },
    {
      key: 'disney-plus',
      name: 'Disney Plus',
      img: DisneyPlusLogo
    },
    {
      key: 'hbo-max',
      name: 'HBO Max',
      img: HboMaxLogo
    },
    {
      key: 'other',
      name: 'Other/None',
      img: ''
    }
  ]

  const handleNext = () => {
    backStep.set('availableOn')
    step.set($nextStep || 'reviewSubmission')
  }

  $: bottomButtons.set([
    {
      text: 'Back',
      onClick: () => step.set($backStep),
      type: 'secondary'
    },
    {
      text: $nextStep ? 'Review Submission' : 'Next',
      onClick: handleNext,
      disabled: !$availableOn
    }
  ])
</script>

<div class='w-full flex flex-col'>
  <h1 class='text-xl font-semibold mb-4'>Available On</h1>
  <div class='flex flex-wrap'>
    {#each streamingOptions as option}
      <button class:selected={$availableOn?.key === option?.key} class='w-1/3 sm:w-1/4 md:w-1/5 rounded-lg overflow-hidden border-3 border-solid border-transparent hover:border-indigo-200' on:click={() => availableOn.set(option)}>
        <img alt={option.name} src={option.img} />
      </button>
    {/each}
  </div>
</div>

<style>
  .selected {
    @apply border-indigo-600 hover:border-indigo-600;
  }
</style>