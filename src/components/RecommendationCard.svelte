<script lang='ts'>
  import { api, apiDelete, apiPost, baseURL } from "../api/api.svelte";
  import { currentUser, localTags, recommendToRecommendation, showRecommendToMenu, token } from "../stores/main";
  import TagsInput from "./TagsInput.svelte";
  import RecommendationCardTag from "./RecommendationCardTag.svelte";
  import { toTitleCase, clickOutside } from "../helpers";
  import { streamingOptions } from "../constants";
  import Modal from "./Modal.svelte";
  import CreateRecommendation from "./CreateRecommendation.svelte";
  import PlayIcon from "$src/assets/PlayIcon.svelte";
  import moment from 'moment'
  import ThreeDotsIcon from "$src/assets/ThreeDotsIcon.svelte";
  import { image } from "$src/stores/submitRecommendation";
  import { onMount } from "svelte";

  export let recommendation
  export let hideActions = false
  export let hideRecommendedBy = false
  export let showEditButton = false
  export let editClickCallback = undefined as (id?: number | undefined) => void
  export let deleteClickCallback = undefined as (id: number | undefined) => void
  export let insertUpdatedRecommendation = undefined
  export let hide = false
  export let i
  export let justAdded = false
  export let recommendedForMode = false

  // const existingTags = recommendation.tags.map(t => t.id)
  let tagIds = []
  let showAddTag
  let tagsToAdd = []
  let newTagVal
  let hideWatchlistButton
  let userRankLocal
  let userSeenStatusLocal
  let editMode
  let submitTagSuccess
  let showRatingMenu
  let showThreeDotsMenu
  let showTrailer

  const handleSubmitTagSuccess = () => {
    submitTagSuccess = true

    setTimeout(() => submitTagSuccess = false, 300)
  }

  const submitTagId = async (id) => {
    const obj = {
      endpoint: 'recommendation_tag_joins',
      params: {
        recommendation_id: recommendation.id,
        tag_id: id
      }
    }
      
    const resp = await apiPost(obj)

    if (resp.status === 200) {
      handleSubmitTagSuccess()
    }
  }

  const createTagAndAssociate = async (name: string) => {
    const body = {
      name,
      recommendation_id: recommendation.id
    }

    const url = baseURL + '/tags/create-and-associate'

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (resp.status !== 200) {
      console.log('error')
    } else {
      const data = await resp.json()
    }
  }

  const handleSubmitTag = (tag) => {
    if (tag.id) {
      submitTagId(tag.id)
    } else {
      createTagAndAssociate(tag.name)
    }
  }

  const emoji = () => {
    switch(recommendation.medium) {
      case 'movie':
        return "🍿"
      case 'film':
        return "🎩"
      case 'tv':
        return "📺"
      case 'album':
        return "💿"
      case 'miniseries':
        return "📺"
      case 'song':
        return "🎵"
      case 'graphic novel':
        return "📖"
      default:
        return ""
    }
  }

  const ratings = [
    {
      apiValue: 'fuck',
      buttonText: 'Fuck this',
      readable: 'You hated this'
    },
    {
      apiValue: 'meh',
      buttonText: 'Meh',
      readable: "Meh"
    },
    {
      apiValue: 'like',
      buttonText: 'Liked it',
      readable: 'You liked this'
    },
    {
      apiValue: 'love',
      buttonText: 'Loved it',
      readable: 'You loved this'
    }
  ]

  const ratingsApiVals = ratings.map(r => r.apiValue)

  $: userRankingIds = recommendation.user_recommendation_rankings?.map(r => r.user_id)
  $: userRankingIndex = userRankingIds?.indexOf($currentUser?.id)
  $: userRankObj = userRankingIndex > -1 && recommendation.user_recommendation_rankings[userRankingIndex]
  $: userRank = userRankLocal || userRankObj?.rank
  $: ratingsIndex = userRank && ratingsApiVals.indexOf(userRank)
  $: userRankDisplay = ratingsIndex > -1 && ratings[ratingsIndex]?.readable
  $: userSeenStatus = userSeenStatusLocal || userRankObj?.seen_status
  $: additionalRecommenderIds = recommendation.additional_recommenders.length > 0 ? recommendation.additional_recommenders.map(u => u.id) : []
  $: userHasRecommended = additionalRecommenderIds.includes($currentUser?.id)

  const availableOn = recommendation.available_on && streamingOptions.find(opt => opt.key === recommendation.available_on)

  const handlePostRank = async (field: string, value: string) => {
    const body = {
      recommendation_id: recommendation.id,
      [field]: value
    }

    const url = baseURL + '/user-recommendation-ranking'

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  const handlePatchRank = async (field: string, value: string) => {
    const body = {
      user_recommendation_ranking: {
        id: userRankObj.id,
        [field]: value
      }
    }

    const url = baseURL + '/user-recommendation-ranking'

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${$token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  const postOrPatch = (field: string, value: string) => {
    userRankObj?.id ? handlePatchRank(field, value) : handlePostRank(field, value)
    if (field === 'rank') {
      userRankLocal = value
    } else if (field === 'seen_status') {
      userSeenStatusLocal = value
    }

    showRatingMenu = false
  }

  const handleAdditionalRecommendation = async() => {
    const params = {
      recommendation_id: recommendation.id
    }
    const obj = {
      endpoint: 'user-seconded-recommendation',
      body: params
    }
    const resp = await apiPost(obj, true)
    if (resp.status === 200) {
      const body = await resp.json()
      insertUpdatedRecommendation(body, i)
    }
  }

  const deleteAdditionalRecommendation = async() => {
    const index = additionalRecommenderIds.indexOf($currentUser?.id)
    const id = recommendation.additional_recommenders[index].id

    const resp = await apiDelete(`user-seconded-recommendation/${recommendation.id}/${id}`, true)

    if (resp.status === 200) {
      const body = await resp.json()
      insertUpdatedRecommendation(body, i)
    }
  }

  const handleEditClick = () => {
    editMode = true
    if (editClickCallback) {
      editClickCallback(recommendation.id)
    }
  }

  const handleDeleteClick = async () => {
    const resp = await apiDelete(`recommendations/${recommendation.id}`)

    if (resp.status === 200) {
      deleteClickCallback(recommendation.id)
    }
  }

  const handleCancelEditMode = () => {
    editMode = false
    if (editClickCallback) {
      editClickCallback()
    }
  }

  const editModeCallback = (body) => {
    recommendation = body
    handleCancelEditMode()
  }

  const handleClickThreeDots = () => {
    showThreeDotsMenu = true
  }

  const handleClickRecommendTo = () => {
    recommendToRecommendation.set(recommendation)
    showRecommendToMenu.set(true)
  }

  $: recommendedForByString = () => {
    let string = ''
    recommendation.recommended_for_bys.forEach((u, i, arr) => {
      string += u.name
      if (i +1 !== arr.length) {
        string += ', '
      }
    })
    return string
  }

  $: additionalRecommendersString = () => {
    let string = ''
    recommendation.additional_recommenders.forEach((u, i, arr) => {
      string += u.name
      if (i +1 !== arr.length) {
        string += ', '
      }
    })
    return string
  }

  $: handleClearRating = () => {
    showRatingMenu = false
    postOrPatch('rank', 'none')
  }

</script>

<div class:hide class:odd={i % 2 === 1} class:justAdded class='bg-white relative flex justify-between rounded-md border-1 px-4 pt-2 sm:pt-3 pb-1 shadow-md'>
  {#if !editMode}
    <div class='flex flex-col w-full'>
      <div class='flex mb-1 justify-between flex-col sm:flex-row'>
        <div class='mr-2 flex flex-col'>
          <div class='flex justify-between items-center'>
            {#if recommendation.format === 'music' && recommendation.image}
              <div class='w-12 h-12 mr-2'>
                <img src={recommendation.image} alt='album cover' />
              </div>
            {/if}
            <span class='text-lg font-semibold'>
              {recommendation.title} |
              {toTitleCase(recommendation.medium)}
              {emoji()}
            </span>
            <div class='flex block sm:hidden'>
              <span class='font-light text-xs mr-1'>Added {moment(recommendation.created_at).fromNow()}</span>
              <button on:click={handleClickThreeDots} class='h-7 w-7 rounded-full hover:bg-gray-200 active:bg-gray-300 p-1.5'>
                <ThreeDotsIcon />
              </button>
            </div>
          </div>
          {#if recommendation.format === 'movie'}
            <div class='flex items-center'>
              <span class='text-xs font-semibold'>{recommendation.colorization ? toTitleCase(recommendation.colorization) : 'Color'}</span>
              {#if recommendation.trailer_link}
                <button on:click={() => showTrailer = true} class='flex space-x-1 items-center text-xs font-semibold text-indigo-900'>
                  <span>
                    &nbsp;|&nbsp;Trailer
                  </span>
                  <div class='w-5 h-5'>
                    <PlayIcon />
                  </div>
                </button>
              {/if}
            </div>
          {/if}
        </div>

        <div class='flex-1 mr-2 py-1 sm:py-0'>
          <div class='flex flex-wrap flex-1 items-center h-full -mt-1'>
            {#each recommendation.recommendation_tag_joins as tagJoin}
              <RecommendationCardTag
                {tagJoin}
              />
            {/each}
            {#each tagsToAdd as tag}
              <RecommendationCardTag
                tagJoin={{ tag, added_by: { name: $currentUser?.name } }}
              />
            {/each}
            {#if !showEditButton}
              <button on:click={() => showAddTag = true} class='text-xs rounded-full border-solid border-1 px-2 mr-1 border-indigo-300 mt-1 hover:border-indigo-500'>+ Add Tag(s)</button>
            {/if}
          </div>
        </div>



        <div class='flex flex-col relative'>
          {#if !hideRecommendedBy}
            <div class='hidden sm:flex space-x-1 items-center'>
              <span class='font-light text-xs'>{moment(recommendation.created_at).fromNow()}</span>
              <button on:click={handleClickThreeDots} class='h-7 w-7 rounded-full hover:bg-gray-200 active:bg-gray-300 p-1.5'>
                <ThreeDotsIcon />
              </button>
              <!-- <div class='rounded-full w-8 h-8 overflow-hidden'>
                <img src={recommendation.recommended_by?.image} />
              </div> -->
            </div>
          {/if}

          {#if showEditButton}
            <div class='flex space-x-1'>
              <button on:click={handleEditClick} class='text-indigo-600 text-sm font-semibold'>Edit</button>
              <span>|</span>
              <button on:click={handleDeleteClick} class='text-red-600 text-sm font-semibold'>Delete</button>
            </div>
          {/if}

          {#if (recommendation.available_on)}
            <div class='absolute top-6 right-0 flex space-x-2'>
              <img class='h-8 w-auto' alt={availableOn.name} src={availableOn.img} />
            </div>
          {/if}
        </div>

        {#if showThreeDotsMenu}
            <div use:clickOutside on:click_outside={() => showThreeDotsMenu = false} class='top-5 right-2 pop-out-menu'>
              <button on:click={handleClickRecommendTo} class='text-left text-sm pop-out-menu-item'>Recommend to...</button>
              <button on:click={() => postOrPatch('seen_status', 'want')} class='text-left text-sm pop-out-menu-item'>Add to Watchlist</button>
              <button class='text-left text-sm pop-out-menu-item'>Edit Details</button>
              {#if $currentUser?.id === recommendation.recommended_by.id || $currentUser?.id === 30}
                <button on:click={handleDeleteClick} class='text-left text-sm pop-out-menu-item'>Delete</button>
              {/if}
            </div>
          {/if}
      </div>

      <div class='flex flex-row justify-between items-center w-full mb-1 pt-1'>
        {#if !recommendedForMode}
          <div class='flex flex-col'>
            <span class='text-xs'>Recommended by:</span>
            <div class='flex'>
              <a href='/users/{recommendation.recommended_by?.id}'>{recommendation.recommended_by?.name}</a>
              {#if recommendation.additional_recommenders?.length > 0}
                <span>, {additionalRecommendersString()}</span>
              {/if}
            </div>
          </div>

          <div class='flex flex-col'>
            <span class='text-xs'>Has Orion Seen It?</span>
            <span>{recommendation.has_orion_seen ? toTitleCase(recommendation.has_orion_seen) : 'N/A'}</span>
          </div>

          <div class='hidden sm:flex flex-col'>
            <span class='text-xs'>Do Journey's Cats Hate It?</span>
            <span>{recommendation.do_journeys_cats_hate ? toTitleCase(recommendation.do_journeys_cats_hate) : 'Maybe'}</span>
          </div>

          <div class='flex flex-col'>
            <span class='text-xs'>Ernest Rating</span>
            {#if recommendation.ernest_rating}
              <img class='h-12 w-auto' src={recommendation.ernest_rating} />
            {:else}
              <div class='w-14 h-10 bg-red-600' />
            {/if}
          </div>
        {:else}
          <div class='flex flex-col'>
            <span class='text-xs'>Originally Recommended By</span>
            <span>{recommendation.recommended_by?.id ? toTitleCase(recommendation.recommended_by?.name) : 'N/A'}</span>
          </div>
          <div class='flex flex-col'>
            <span class='text-xs'>Recommended For You By</span>
            <span>{recommendedForByString()}</span>
          </div>
        {/if}
      </div>

      {#if !hideActions}
        <div class='border-t border-solid pt-1 flex flex-row space-x-2 space-y-0'>
          {#if !showRatingMenu}
            <button class:selected={!!userRankDisplay} class='btn rating-btn negative' on:click={() => showRatingMenu = true}>
              {userRankDisplay ? `${userRankDisplay}` : "❤️ Rate It!"}
            </button>

            {#if $currentUser?.id !== recommendation.recommended_by.id}
              {#if userHasRecommended}
                <button class:selected={userHasRecommended} class='btn rating-btn' on:click={deleteAdditionalRecommendation}>
                  Also Recommended
                </button>
              {:else}
                <button class:selected={userRank === 'liked'} class='btn rating-btn' on:click={handleAdditionalRecommendation}>
                  👍&nbsp;Also Recommend
                </button>
              {/if}
            {/if}

            {#if !hideWatchlistButton}
              {#if userSeenStatus === 'want'}
                <button class='btn watchlist-added' on:click={() => postOrPatch('seen_status', 'wanted')}>
                  Added to Watch List
                </button>
              {:else}
                <button class='btn watchlist' on:click={() => postOrPatch('seen_status', 'want')}>
                  + Watch List
                </button>
              {/if}
            {/if}
          {:else}
            <div class='w-full'>
              <div class='flex w-full border-b mb-2 pb-1'>
                {#each ratings as r}
                  <button class:selected={userRank === r.apiValue} class='btn rank-btn flex-1' on:click={() => postOrPatch('rank', r.apiValue)}>{r.buttonText}</button>
                {/each}
              </div>
              <div class='flex w-full space-x-2 justify-center'>
                <button class='max-w-1/5 btn rank-btn neutral-border flex-1 border-1' on:click={() => showRatingMenu = false}>Cancel</button>
                {#if userRankDisplay}
                  <button class='max-w-1/5 btn rank-btn cancel flex-1 border-1' on:click={handleClearRating}>Clear Rating</button>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <button on:click={handleCancelEditMode} class='absolute top-2 right-4 text-indigo-700 text-sm font-semibold'>Cancel</button>
    <CreateRecommendation
      editMode
      editModeCallback={editModeCallback}
      existingRecommendation={recommendation}
      title={recommendation.title}
      medium={recommendation.medium}
      catsHate={recommendation.do_journeys_cats_hate}
      orionSeen={recommendation.has_orion_seen}
      ernestRating={recommendation.ernest_rating}
      colorization={recommendation.colorization}
      availableOn={recommendation.available_on}
      trailerLink={recommendation.youtube_link}
      spotifyLink={recommendation.spotify_link}
      bandcampLink={recommendation.bandcamp_link}
      soundcloudLink={recommendation.soundcloud_link}
    />
  {/if}
</div>

{#if showAddTag}
  <Modal onHideModal={() => showAddTag = false} noFullWidth hideCloseX>
    <div class='flex flex-col'>
      <div class='mb-8'>
        <span class='text-lg font-semibold'>
          {recommendation.title} |
          {toTitleCase(recommendation.medium)}
          {emoji()}
        </span>
      </div>
      <div class='w-full flex justify-center'>
        <div>
          <p class='text-xs mb-1 font-semibold'>{newTagVal ? "Hit enter to submit" : "Enter a new tag"}</p>
          <TagsInput
            bind:tags={tagsToAdd}
            bind:value={newTagVal}
            hideNewTags
            autoFocus
            {handleSubmitTag}
          />
        </div>
      </div>
    </div>
  </Modal>
{/if}

{#if showTrailer}
  <Modal onHideModal={() => showTrailer = false} noFullWidth hideCloseX>
    <div class='flex w-full justify-center'>
      <iframe src={recommendation.trailer_link} width="600" height="300" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" frameborder="no" scrolling="no"></iframe>
    </div>
  </Modal>
{/if}

<style>
  .btn {
    @apply text-xs font-semibold flex justify-center items-center flex-1 py-1.5 border-1 border-transparent text-gray-500 rounded-md transition-all;
  }

  .btn:not(.selected) {
    @apply hover:shadow-md active:shadow-sm;
  }

  .btn.watchlist {
    @apply text-green-700;
  }

  .btn.watchlist-added {
    @apply text-white bg-green-700 text-center;
  }

  .rank-btn.neutral-border {
    @apply border-indigo-300 hover:border-indigo-700 active:bg-indigo-800;
  }

  .rank-btn.selected {
    @apply bg-gray-200 border-gray-900 text-gray-700;
  }

  .rank-btn.cancel {
    @apply border-red-300 hover:border-red-400 active:border-red-500;
  }

  .rating-btn.selected {
    @apply text-indigo-700 border-none;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .2) inset;
  }

  .rating-btn.selected:hover {
    box-shadow: 1px 1px 10px rgba(0, 0, 0, .2) inset;
  }

  .hide {
    @apply hidden;
  }

  .odd {
    @apply bg-gray-50;
  }

  .justAdded {
    @apply border-green-700;
  }
</style>