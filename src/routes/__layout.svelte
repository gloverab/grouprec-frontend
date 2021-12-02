<script context='module'>
  import { api, apiGet, baseURL } from "../api/api.svelte";
  import { onMount } from "svelte";
</script>

<script lang='ts'>
  import CreateRecommendation from '../components/CreateRecommendation.svelte';
  import 'virtual:windi.css';
  import { apiFetching, currentUser, groupCategories, groupUsers, hideMenuIcon, localTags, recommendToRecommendation, showCreateNewGroup, showCreateRecommendation, showMobileMenu, showRecommendToMenu, showUserRecommendations, token, windowHeight } from '../stores/main'
  import Header from '../components/Header.svelte';
  import { browser } from '$app/env';
  import Modal from "$src/components/Modal.svelte";
  import RecommendationCard from "$src/components/RecommendationCard.svelte";
  import { goto } from '$app/navigation';
  import Drawer from '$src/components/Drawer.svelte';
  import Overlay from "$src/components/Overlay.svelte";
  import MenuIcon from "$src/components/MenuIcon.svelte";
  import Loader from "$src/components/Loader.svelte";
  import BottomSheet from '$src/components/BottomSheet.svelte';
  import CreateRecommendationFlow from "$src/components/CreateRecommendationFlow.svelte";
  import { bottomButtons } from "$src/stores/submitRecommendation";
  import ModalOrSheet from '$src/components/ModalOrSheet.svelte';
  import RecommendToMenu from "$src/components/RecommendToMenu.svelte";
  import CreateGroup from '$src/components/CreateGroup.svelte';
import { groupBottomButtons } from "$src/stores/createGroup";

  export let tags
  export let auth

  let loadingUserRecommendations = false
  let userRecommendations = []
  let notHideId
  let recommendationCount = $currentUser?.recommended_count

  const fetchTags = async () => {
    const obj = {
      endpoint: 'tags'
    }

    const resp = await api(fetch, obj)
    const body = await resp

    localTags.set(body)
  }

  const fetchCategories = async () => {
    const obj = {
      endpoint: 'categories-by-group',
      params: {
        group_id: $currentUser.groups[0].id
      }
    }

    const resp = await apiGet(obj)
    
    if (resp.status === 200) {
      const body = await resp.json()
      console.log(body)
      groupCategories.set(body)
    }
  }

  const fetchGroupUsers = async () => {
    const obj = {
      endpoint: 'group-users',
      params: {
        group_id: 1
      }
    }
    
    const resp = await apiGet(obj, true)

    if (resp.status === 200) {
      const body = await resp.json()
      groupUsers.set(body)
    }
  }

  const checkTokenAndLogin = async () => {
    if (browser) {
      const lsToken = localStorage.getItem("token")
      
      if (lsToken) {
        token.set(lsToken)

        const resp = await apiGet({ endpoint: 'current-user' })

        if (resp.status === 200) {
          const user = await resp.json()
          currentUser.set(user)
          fetchTags()
          fetchCategories()
          fetchGroupUsers()
        } else {
          // HANDLE ERROR
        }
      } else {
        goto('/auth/sign-in')
      }
    }
  }

  const handleShowUserRecommendations = async () => {
    loadingUserRecommendations = true
    showUserRecommendations.set(true)

    const obj = {
      endpoint: '/user-recommended-by',
      params: {
        user_id: $currentUser?.id
      }
    }

    const resp = await apiGet(obj)
    
    if (resp.status === 200) {
      const body = await resp.json()
      console.log(body)
      loadingUserRecommendations = false
      userRecommendations = body
    }
  }

  const handleAddRecommendation = () => {
    showMobileMenu.set(false)
    showCreateRecommendation.set(true)
  }

  const handleMyRecommendations = () => {
    showMobileMenu.set(false)
    handleShowUserRecommendations()
  }

  const hideAllButOne = (id = undefined) => {
    notHideId = id
  }

  const handleCloseEditModal = () => {
    notHideId = undefined
    showUserRecommendations.set(false)
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

  const handleShowMobileMenu = () => {
    if ($showMobileMenu) {
      showMobileMenu.set(false)
    } else {
      showMobileMenu.set(true)
    }
  }

  const logOut = () => {
    currentUser.set(undefined)
    token.set(undefined)
    localStorage.removeItem('token')
    goto('/auth/sign-in')
  }

  const hideRecommendToMenu = () => {
    recommendToRecommendation.set(undefined)
    showRecommendToMenu.set(false)
  }

  let promise = checkTokenAndLogin()
</script>

<svelte:head>
  <script src="https://kit.fontawesome.com/2a900224f0.js" crossorigin="anonymous"></script>
</svelte:head>

<svelte:window bind:innerHeight={$windowHeight} />

{#if $currentUser?.id}
  <Header
    {handleShowUserRecommendations}
  />

  <button on:click={handleShowMobileMenu} class='fixed h-17 flex items-center top-0 right-0 {($showCreateRecommendation || $hideMenuIcon) ? 'z-1000' : 'z-2000'}'>
    <MenuIcon
      isActive={$showMobileMenu}
    />
  </button>

  <main class='layout-background min-h-screen'>
    <div class='w-screen flex justify-center'>
      <div class='w-full max-w-250 min-h-screen pt-20 px-3 sm:px-8'>
        {#await promise}
          <p>loading</p>
        {:then}
          <slot />
        {:catch error}
          <p>Sign in error</p>
        {/await}

      </div>
    </div>
  </main>

  {#if $showCreateRecommendation}
    <ModalOrSheet
      bottomButtons={$bottomButtons}
      onClose={() => showCreateRecommendation.set(false)}
    >
      <CreateRecommendationFlow />
    </ModalOrSheet>
  {/if}

  {#if $showRecommendToMenu && $recommendToRecommendation}
    <RecommendToMenu
      onClose={() => showRecommendToMenu.set(false)}
      recommendation={$recommendToRecommendation}
    />
  {/if}

  {#if $showUserRecommendations}
    <ModalOrSheet onClose={handleCloseEditModal}>
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
    </ModalOrSheet>
  {/if}

  {#if $showCreateNewGroup}
    <ModalOrSheet bottomButtons={$groupBottomButtons} onClose={() => showCreateNewGroup.set(false)}>
      <CreateGroup />
    </ModalOrSheet>
  {/if}

  {#if $showMobileMenu}
    <Overlay all onClick={() => showMobileMenu.set(false)} />
    <Drawer>
      <div>
        <button class='absolute w-14 h-14 border-2 border-solid left-4 top-4 border-indigo-900 rounded-full flex items-center justify-center overflow-hidden bg-indigo-300'>
          {#if $currentUser?.image}
            <img class='h-full w-auto' src={$currentUser.image} />
          {:else if $currentUser?.name}
            <span>{$currentUser.name.charAt(0).toUpperCase()}</span>
          {/if}
        </button>
        <div class='flex flex-col items-end pt-22'>
          <button on:click={handleAddRecommendation} class='mobile-menu-item highlighted justify-end shadow-md mb-4 flex items-center' href='/profile/watchlist'>
            Add a Recommendation
            <div class='w-8 h-8 ml-2 flex items-center justify-center rounded-full border-1 border-indigo-700'>
              <span class='text-sm'>
                ✏️
              </span>
            </div>
          </button>
          <div class='flex flex-col w-full items-end'>
            <a on:click={() => showMobileMenu.set(false)} class='mobile-menu-item' href='/recommendations'>Browse Recommendations</a>
            <a on:click={() => showMobileMenu.set(false)} class='mobile-menu-item' href='/profile'>My Profile</a>
            <button on:click={handleMyRecommendations} class='mobile-menu-item'>My Recommendations</button>
            <a on:click={() => showMobileMenu.set(false)} class='mobile-menu-item' href='/profile/watchlist'>My Watchlist</a>
          </div>

          <div class='w-full shadow-md-reverse flex justify-end mt-4'>
            <button on:click={logOut} class='mobile-menu-item'>Log Out</button>
          </div>
        </div>
      </div>
    </Drawer>
  {/if}
{/if}

{#if $apiFetching}
  <Loader />
{/if}

<style global>
  h2 {
    @apply text-lg;
  }

  h3 {
    @apply text-sm;
  }

  .layout-background {
    @apply bg-gray-200;
  }

  .mobile-menu-item {
    @apply text-indigo-800 text-lg font-semibold py-2 px-4;
  }

  .mobile-menu-item.highlighted {
    @apply w-full text-right py-4;
  }

  .shadow-md-reverse {
    box-shadow: 0 -4px 1px 0 rgba(0,0,0, 0.1)
  }

  .btn-primary {
    @apply w-full h-12 rounded-full bg-indigo-800 text-white shadow-md;
  }

  .btn-primary:not(.disabled) {
    @apply hover:bg-indigo-900 hover:shadow-lg active:shadow-sm;
  }

  .btn-secondary {
    @apply w-full h-12 rounded-full bg-white text-indigo-800 shadow-md border-2 border-indigo-800;
  }

  .btn-secondary:not(.disabled) {
    @apply hover:border-indigo-900 hover:text-indigo-900 hover:shadow-lg active:shadow-sm;
  }

  .btn-tertiary {
    @apply w-full h-12 rounded-md bg-white text-indigo-800 shadow-sm border-2 border-indigo-800;
  }

  .btn-tertiary:not(.disabled) {
    @apply hover:border-indigo-900 hover:text-indigo-900 hover:shadow-lg active:shadow-none;
  }

  .btn-primary.disabled,
  .btn-secondary.disabled,
  .btn-tertiary.disabled {
    @apply cursor-default opacity-70;
  }

  .input-border {
    @apply outline-none border-1 border-indigo-700 border-opacity-40 hover:border-opacity-80 focus:border-opacity-100 rounded-lg;
  }

  .text-input {
    @apply px-2 py-1.5;
  }

  .search-input {
    @apply w-full bg-gray-200 rounded-full px-4 py-1 mb-2;
  }

  .pop-out-menu {
    @apply z-1 absolute bg-white p-2 rounded-lg shadow-2xl flex flex-col;
  }

  .pop-out-menu-item {
    @apply rounded-md hover:bg-gray-200 active:bg-gray-300;
  }
</style>