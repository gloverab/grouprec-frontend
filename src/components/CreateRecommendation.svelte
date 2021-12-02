<script lang='ts'>
  import { api, apiPatch, baseURL } from "../api/api.svelte";
  import { currentUser, showCreateRecommendation, token } from "../stores/main";
  import TagsInput from "./TagsInput.svelte";
  import RadioInput from "./RadioInput.svelte";
  import NetflixLogo from '../assets/netflix-logo.jpg'
  import HboMaxLogo from '../assets/hbo-max-logo.png'
  import HuluLogo from '../assets/hulu-logo.png'
  import PrimeVideoLogo from '../assets/prime-video-logo.jpeg'
  import DisneyPlusLogo from '../assets/disney-plus-logo.jpeg'

  const catOptions = ['Yes', 'No', 'Maybe']
  const orionSeenOptions = ['Seen', 'Want to see',  'Do not want to see', "Seen so you don't have to", "?", "???", "Not Sure", "huh"]
  const colorOptions = ['Color', 'Black and White', 'Blue', 'Color but like really low chroma-keyed', 'Neon', 'Nightcam', 'Varied']
  const mediumOptions = [
    'movie',
    'film',
    'tv series',
    'tv episode',
    'tv episodes',
    'miniseries',
    'album',
    'song',
    'video game'
  ]
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
  ]

  export let editMode = false
  export let existingRecommendation = undefined
  export let editModeCallback = undefined
  export let onHideModal = undefined
  export let title = ''
  export let medium = ''
  export let catsHate = ''
  export let orionSeen = 'Not Sure'
  export let ernestRating = ''
  export let colorization = ''
  export let tags = []
  export let availableOn = ''
  export let trailerLink = ''
  export let spotifyLink = ''
  export let bandcampLink = ''
  export let soundcloudLink = ''

  let showOrionError = false

  const handleSubmit = async () => {
    const body = {
      recommendation: {
        title,
        medium,
        do_journeys_cats_hate: catsHate,
        has_orion_seen: orionSeen,
        ernest_rating: ernestRating,
        colorization: colorization,
        youtube_link: trailerLink,
        available_on: availableOn
      },
      tags
    }

    const url = baseURL + '/recommendations'

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (resp.status === 200) {
      const data = await resp.json()
      onHideModal()
    }
  }

  const handlePatchRecommendation = async () => {
    const recommendation = {}
    
    if (title !== existingRecommendation.title) {
      recommendation.title = title
    }

    if (medium !== existingRecommendation.medium) {
      recommendation.medium = medium
    }

    if (catsHate !== existingRecommendation.do_journeys_cats_hate) {
      recommendation.do_journeys_cats_hate = catsHate
    }

    if (orionSeen !== existingRecommendation.has_orion_seen) {
      recommendation.has_orion_seen = orionSeen
    }

    if (ernestRating !== existingRecommendation.ernest_rating) {
      recommendation.ernest_rating = ernestRating
    }

    if (colorization !== existingRecommendation.colorization) {
      recommendation.colorization = colorization
    }

    if (availableOn !== existingRecommendation.available_on) {
      recommendation.available_on = availableOn
    }

    if (trailerLink !== existingRecommendation.youtube_link) {
      recommendation.youtube_link = trailerLink
    }

    if (spotifyLink !== existingRecommendation.spotify_link) {
      recommendation.spotify_link = spotifyLink
    }

    if (bandcampLink !== existingRecommendation.bandcamp_link) {
      recommendation.bandcamp_link = bandcampLink
    }

    if (soundcloudLink !== existingRecommendation.soundcloud_link) {
      recommendation.soundcloud_link = soundcloudLink
    }

    const obj = {
      endpoint: `recommendations/${existingRecommendation.id}`,
      body: {
        recommendation
      }
    }

    const resp = await apiPatch(obj)

    if (resp.status === 200) {
      const body = await resp.json()
      if (editModeCallback) {
        editModeCallback(body)
      }
    }
  }

  const handleOrionSeen = (option: string) => {
    if (!$currentUser.name.toLowerCase().includes('orion')) {
      showOrionError = true
    } else {
      orionSeen = option
    }
  }

  $: isVisualMedia = medium === 'movie' || medium === 'film' || medium === 'tv series' || medium === 'tv episode' || medium === 'tv episodes' || medium === 'miniseries'
  $: disableSubmit = !title || !medium || !colorization || (!editMode && tags.length === 0)
  
</script>

<div class='space-y-5'>
  <div class='flex flex-col'>
    <span class='text-xs mb-1'>Title*</span>
    <input
      class='recommendation-input'
      placeholder='Enter Movie Name'
      type='text'
      bind:value={title}
    >
  </div>

  {#if !editMode}
    <div>
      <span class='text-xs mb-1'>Tags (hit "enter" or "tab" to submit)*</span>
      <TagsInput
        bind:tags={tags}
      />
    </div>
  {/if}

  <div>
    <span class='form-label'>Medium:*</span>
    <div class='flex flex-wrap -mt-2'>
      {#each mediumOptions as option}
        <RadioInput
          classes='mt-2 mr-2'
          text={option}
          onClick={() => medium = option}
          selected={medium === option}
        />
      {/each}
    </div>
  </div>

  {#if isVisualMedia}
    <div class='w-full flex flex-col'>
      <span class='form-label'>Add Trailer Link</span>
      <input
        class='recommendation-input'
        placeholder='Paste a Youtube Link Here'
        type='text'
        bind:value={trailerLink}
      >
    </div>
    
    <div class='w-full flex flex-col'>
      <span class='form-label'>Available On</span>
      <div class='flex space-x-2'>
        {#each streamingOptions as option}
          <button class:selected={availableOn === option.key} class='rounded-lg overflow-hidden border-3 border-solid border-transparent hover:border-indigo-200' on:click={() => availableOn = option.key}>
            <img alt={option.name} src={option.img} />
          </button>
        {/each}
      </div>
    </div>

    <div class='flex flex-col'>
      <span class='form-label'>Colorization*</span>
      <div class='flex flex-wrap -mt-2'>
        {#each colorOptions as option}
          <RadioInput
            classes='mt-2 mr-2'
            text={option}
            onClick={() => colorization = option}
            selected={colorization === option}
          />
        {/each}
      </div>
    </div>
  {/if}

  {#if colorization}
    <div>
      <span class='form-label'>Do Journey's cats hate this?*</span>
      <div class='flex space-x-2'>
        {#each catOptions as option}
          <RadioInput
            text={option}
            onClick={() => catsHate = option}
            selected={catsHate === option}
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
            selected={orionSeen === option}
          />
        {/each}
      </div>
    </div>

    <div class='flex flex-col'>
      <span class='mb-1 text-xs font-semibold'>Ernest Rating</span>
      <div class='flex'>
        <span class='text-xs mr-2'>Select</span>
        {#if ernestPhotoLinks.includes(ernestRating)}
          <button class='text-xs text-red-500' on:click={() => ernestRating = ''}>clear</button>
        {/if}
      </div>
      <div class='flex flex-wrap'>
        {#each ernestPhotoLinks as photoLink}
          <button class='rounded-lg img-wrap mr-1 mb-2 border-3 border-solid border-transparent hover:border-indigo-200' class:selected={ernestRating === photoLink} on:click={() => ernestRating = photoLink}>
            <img class='h-20 w-auto' alt='ernest' src={photoLink} />
          </button>
        {/each}
      </div>
      <span class='text-xs mb-1'>Or paste a link</span>
      <input
        class='recommendation-input'
        placeholder='If none of these fit, paste a link to a photo here'
        type='text'
        bind:value={ernestRating}
      >
    </div>
  {/if}

  <div class='w-full flex justify-center'>
    <button disabled={disableSubmit} class:disabled={disableSubmit} on:click={editMode ? handlePatchRecommendation : handleSubmit} class='submit-btn bg-indigo-600 hover:bg-indigo-700 h-12 flex items-center px-4 text-white rounded-lg'>
      {editMode ? "Save Changes" : "Submit this Recommendation"}
    </button>
  </div>
  
</div>

<style>
  .recommendation-input {
    @apply border-b border-solid outline-none hover:border-b-indigo-300 focus:border-b-indigo-700;
  }

  .selected {
    @apply border-indigo-600 hover:border-indigo-600;
  }

  .submit-btn.disabled {
    @apply cursor-default opacity-50;
  }

  .form-label {
    @apply text-xs mb-1 font-semibold;
  }
</style>