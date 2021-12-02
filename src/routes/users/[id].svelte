<script lang='ts' context='module'>
  export async function load({ page, fetch, session, stuff }) {
    return {
      props: {
        userId: page.params.id
      }
    };
	}
</script>

<script lang='ts'>
  import { apiGet } from "$src/api/api.svelte";
  import ProfileAttribute from "$src/components/ProfileAttribute.svelte";
  import RecommendationCard from "$src/components/RecommendationCard.svelte";
  import { toTitleCase } from "$src/helpers";

  export let userId

  let userRecommendations = []

  const fetchUser = async () => {
    const obj = {
      endpoint: `users/${userId}`
    }

    const resp = await apiGet(obj)
    
    if (resp.status === 200) {
      const body = await resp.json()
      return body
    }
  }

  const handleShowUserRecommendations = async () => {

    const obj = {
      endpoint: 'user-recommended-by',
      params: {
        user_id: userId
      }
    }

    const resp = await apiGet(obj)
    
    if (resp.status === 200) {
      const body = await resp.json()
      return body
    }
  }

  let recommendedByPromise = handleShowUserRecommendations()
  let promise = fetchUser()

  $: console.log(userId)
</script>

<div class='flex w-full flex-col items-center sm:flex-row sm:items-start justify-between sm:space-x-4'>
  {#await promise}
    <p>loading</p>
  {:then user}
    <div class='flex flex-col min-w-1/3 space-y-3 w-full sm:w-auto bg-white px-3 py-3 rounded-md flex-1'>
      <div class='flex flex-col items-center justify-center space-y-2'>
        <div class='rounded-full h-50 w-50 overflow-hidden'>
          <img class='w-70 h-auto' src={user.image} alt="Profile" />
        </div>
        <div class='space-y-2'>
          <ProfileAttribute
            label='Name'
            displayValue={user.name}
            hideEdit
          />
          <ProfileAttribute
            label='Username'
            displayValue={user.username}
            hideEdit
          />
          <ProfileAttribute
            label='Email'
            displayValue={user.email}
            hideEdit
          />
          <ProfileAttribute
            label='Discord Username'
            displayValue={user.discord_username}
            hideEdit
          />
          <ProfileAttribute
            label='Music Streaming Preference'
            displayValue={toTitleCase(user.music_streaming_preference)}
            hideEdit
          />
        </div>
      </div>
    </div>

    <div>
      {#await recommendedByPromise}
        <p>loading</p>
      {:then userRecommendations}
        <span class='text-xl font-semibold'>{user.name}'s Recommendations</span>
        <div class='space-y-2 mt-2'>
          {#each userRecommendations as recommendation}
            <RecommendationCard
              {recommendation}
              hideActions
            />
          {/each}
        </div>
      {:catch error}
        <p>Error fetching your recommendations</p>
      {/await}
    </div>
  {/await}
</div>