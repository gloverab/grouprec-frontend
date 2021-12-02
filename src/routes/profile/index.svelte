<script lang='ts'>
  import { apiGet, apiPatch } from "$src/api/api.svelte";
  import EditPassword from "$src/components/EditPassword.svelte";
  import EditProfile from "$src/components/EditProfile.svelte";

  import Modal from "$src/components/Modal.svelte";
  import ProfileAttribute from "$src/components/ProfileAttribute.svelte";
  import RecommendationCard from "$src/components/RecommendationCard.svelte";
import { musicStreamingOptions } from "$src/constants";
  import { toTitleCase } from "$src/helpers";
  import { currentUser } from "$stores/main";

  let loadingUserRecommendations = false
  let showUserRecommendations = false
  let userRecommendations = []
  let userRecommendedFor = []
  let notHideId
  let recommendationCount = $currentUser.recommended_count
  let editProfileMode = false
  let editPasswordMode = false

  let name = $currentUser.name
  let image = $currentUser.image
  let username = $currentUser.username
  let email = $currentUser.email
  let discordUsername = $currentUser.discord_username
  let musicStreamingPreference = musicStreamingOptions.find(s => s.key === $currentUser.music_streaming_preference) || musicStreamingOptions[0]

  let password
  let passwordConfirmation

  const handleShowUserRecommendations = async () => {
    loadingUserRecommendations = true
    showUserRecommendations = true

    const obj = {
      endpoint: 'user-recommended-by',
      params: {
        user_id: $currentUser.id
      }
    }

    const resp = await apiGet(obj)
    
    if (resp.status === 200) {
      const body = await resp.json()
      loadingUserRecommendations = false
      userRecommendations = body
    }
  }

  const handleShowUserRecommendedFor = async () => {
    loadingUserRecommendations = true
    showUserRecommendations = true

    const obj = {
      endpoint: 'user-recommended-for',
      params: {
        user_id: $currentUser.id
      }
    }

    const resp = await apiGet(obj)
    
    if (resp.status === 200) {
      const body = await resp.json()
      loadingUserRecommendations = false
      userRecommendedFor = body
    }
  }

  let recommendedForPromise = handleShowUserRecommendedFor()
  let recommendedByPromise = handleShowUserRecommendations()

  const hideAllButOne = (id = undefined) => {
    notHideId = id
  }

  const removeRecommendation = (id = undefined) => {
    const ids = userRecommendations.map(r => r.id)
    const index = ids.indexOf(id)

    if (index > -1) {
      const oldArr = [...userRecommendations]
      oldArr.splice(index, 1)
      userRecommendations = [...oldArr]
      recommendationCount = recommendationCount - 1
    }
  }

  const handleEditProfileClick = () => {
    editProfileMode = true
  }

  const handleUpdatePasswordClick = () => {
    editPasswordMode = true
  }

  const updateProfile = async () => {
    const body = {
      user: {
        name,
        image,
        username,
        email,
        discord_username: discordUsername,
        music_streaming_preference: musicStreamingPreference.key
      }
    }

    const obj = {
      endpoint: `users/${$currentUser.id}`,
      body
    }

    const resp = await apiPatch(obj)

    if (resp.status === 200) {
      const body = await resp.json()
      editProfileMode = false
      currentUser.set(body)
    }
  }

  const updatePassword = async () => {
    const body = {
      user: {
        password,
        password_confirmation: passwordConfirmation
      }
    }

    const obj = {
      endpoint: 'users/password',
      body
    }

    const resp = await apiPatch(obj)

    if (resp.status === 200) {
      const body = await resp.json()
      editPasswordMode = false
    }
  }

</script>

<div class='flex w-full flex-col items-center sm:flex-row sm:items-start justify-between sm:space-x-4'>
  {#if !notHideId}
    <div class='flex flex-col min-w-1/3 space-y-3 w-full sm:w-auto bg-white px-3 py-3 rounded-md flex-1'>
      <div class='flex flex-col items-center justify-center space-y-2'>
        <div class='rounded-full h-50 w-50 overflow-hidden'>
          <img class='w-70 h-auto' src={$currentUser.image} alt="Profile" />
        </div>
        {#if !editProfileMode && !editPasswordMode}
          <div class='flex w-full justify-between space-x-2'>
            <button on:click={handleEditProfileClick} class='text-indigo-700 font-semibold'>Edit Profile</button>
            <button on:click={handleUpdatePasswordClick} class='text-indigo-700 font-semibold'>Update Password</button>
          </div>
        {/if}
      </div>
      {#if editProfileMode}
        <EditProfile
          bind:name={name}
          bind:image={image}
          bind:email={email}
          bind:username={username}
          bind:discordUsername={discordUsername}
          bind:musicStreamingPreference={musicStreamingPreference}
        />
        <div class='flex w-full justify-between space-x-2'>
          <button on:click={() => editProfileMode = false} class='btn-secondary'>Cancel</button>
          <button on:click={updateProfile} class='btn-primary'>Save</button>
        </div>
      {:else if editPasswordMode}
        <EditPassword
          bind:password={password}
          bind:passwordConfirmation={passwordConfirmation}
        />
        <div class='flex w-full justify-between space-x-2'>
          <button on:click={() => editPasswordMode = false} class='btn-secondary'>Cancel</button>
          <button on:click={updatePassword} class='btn-primary'>Save</button>
        </div>
      {:else}
        <ProfileAttribute
          label='Name'
          displayValue={$currentUser.name}
          hideEdit
        />
        <ProfileAttribute
          label='Username'
          displayValue={$currentUser.username}
        />
        <ProfileAttribute
          label='Email'
          displayValue={$currentUser.email}
        />
        <ProfileAttribute
          label='Password'
          displayValue='**********'
          editText='reset'
        />
        <ProfileAttribute
          label='Discord Username'
          displayValue={$currentUser.discord_username}
        />
        <ProfileAttribute
          label='Music Streaming Preference'
          icon={musicStreamingPreference.icon}
          displayValue={musicStreamingPreference.name}
        />
      {/if}
    </div>
  {/if}

  <div class='w-full'>
    <div class='mb-4'>
      {#await recommendedForPromise}
      <p>loading</p>
      {:then}
        {#if userRecommendedFor.length > 0}
          <h1>Recommended for you:</h1>
          <div class='space-y-2'>
            {#each userRecommendedFor as recommendation}
              <RecommendationCard
                {recommendation}
                hideActions
                recommendedForMode
                hide={notHideId && notHideId !== recommendation.id }
                editClickCallback={hideAllButOne}
                deleteClickCallback={removeRecommendation}
              />
            {/each}
          </div>
        {/if}
      {:catch error}
        <p>Error fetching your recommendations</p>
      {/await}
    </div>

    {#if !notHideId}
      <h1>Recommended by you:</h1>
    {/if}
    {#await recommendedByPromise}
      <p>loading</p>
    {:then}
      <div class='space-y-2'>
        {#each userRecommendations as recommendation}
          <RecommendationCard
            {recommendation}
            hideActions
            hide={notHideId && notHideId !== recommendation.id }
            editClickCallback={hideAllButOne}
            deleteClickCallback={removeRecommendation}
          />
        {/each}
      </div>
    {:catch error}
      <p>Error fetching your recommendations</p>
    {/await}
  </div>
</div>

<!-- {#if showUserRecommendations}
  <Modal hideCloseX onHideModal={handleCloseEditModal}>
    <div class='space-y-2'>
      {#each userRecommendations as recommendation}
        <RecommendationCard
          {recommendation}
          hideActions
          hideRecommendedBy
          showEditButton
          hide={notHideId && notHideId !== recommendation.id }
          editClickCallback={hideAllButOne}
          deleteClickCallback={removeRecommendation}
        />
      {/each}
    </div>
  </Modal>
{/if} -->