<script lang='ts'>
  import { onDestroy } from "svelte";
  import { availableOn, backStep, imdbId, format, movieResult, step, year, title, trailerLink, category, tags, bottomButtons, nextStep, catsHate, orionSeen, image, linksByPlatform, medium } from "$src/stores/submitRecommendation"
  import SelectFormat from "./CreateRecommendation/SelectFormat.svelte";
  import MovieTitle from "./CreateRecommendation/MovieTitle.svelte";
  import Tags from "./CreateRecommendation/Tags.svelte";
  import AvailableOn from "./CreateRecommendation/AvailableOn.svelte";
  import ReviewSubmission from "./CreateRecommendation/ReviewSubmission.svelte";
  import AddDetails from "./CreateRecommendation/AddDetails.svelte";
  import MusicTitle from "./CreateRecommendation/MusicTitle.svelte";
  import ReviewMusicSubmission from "./CreateRecommendation/ReviewMusicSubmission.svelte";

  onDestroy(() => {
    step.set('format')
    backStep.set('')
    nextStep.set('')
    medium.set('')
    format.set('')
    movieResult.set(undefined)
    title.set('')
    year.set('')
    image.set('')
    imdbId.set('')
    trailerLink.set('')
    category.set({ name: 'Any' })
    tags.set([])
    availableOn.set('')
    bottomButtons.set([])
    catsHate.set('Maybe')
    orionSeen.set('Not Sure')
    linksByPlatform.set(undefined)
  })
</script>

{#if $step === 'format'}
  <SelectFormat />
{:else}
  {#if $format === 'movie'}
    {#if $step === 'title'}
      <MovieTitle />
    {:else if $step === 'tags'}
      <Tags />
    {:else if $step === 'availableOn'}
      <AvailableOn />
    {:else if $step === 'reviewSubmission'}
      <ReviewSubmission />
    {:else if $step === 'addDetails'}
      <AddDetails />
    {/if}
  {:else if $format === 'music'}
    {#if $step === 'title'}
      <MusicTitle

      />
    {:else if $step === 'tags'}
      <Tags />
    {:else if $step === 'reviewMusicSubmission'}
      <ReviewMusicSubmission />
    {/if}
  {/if}
{/if}
