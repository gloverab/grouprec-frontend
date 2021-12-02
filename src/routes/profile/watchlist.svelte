<script context='module'>

</script>

<script lang='ts'>
  import RecommendationCard from '../../components/RecommendationCard.svelte'
  import SortDropdowns from '../../components/SortDropdowns.svelte'
  import { api, apiGet } from "../../api/api.svelte";
  import { onMount } from 'svelte';
  import { currentUser } from '../../stores/main';
  export let recommendations = []

  const fetchRecommendations = async (sortObj) => {
    const obj = {
      endpoint: 'user-watch-list',
      params: {
        user_id: $currentUser?.id
      }
    }

    const response = await apiGet(obj)
    const body = await response.json()

    recommendations = body
  }

  onMount(() => {
    fetchRecommendations()
  })
</script>

<div class='flex mb-4'>
  <h1 class='text-xl font-bold'>My Watchlist (for me!)</h1>
</div>

<div class='space-y-2'>
  {#each recommendations as recommendation (recommendation.id) }
    <RecommendationCard
      {recommendation}
      watchlistMode
    />
  {/each}
</div>