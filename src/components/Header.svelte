<script lang='ts'>
  import { page } from "$app/stores";
  import { currentUser, groupCategories, groupUsers, localTags, showCreateNewGroup, showCreateRecommendation, showMobileMenu, showUserMenu, showUserRecommendations, token } from '../stores/main'
  import ProfileIconMenu from "./ProfileIconMenu.svelte";
  import Logo from '../assets/grouprec-logo.png';
  import { clickOutside } from "../helpers";

  export let handleShowUserRecommendations

  let showUserGroups

  const handleAddRecommendation = () => {
    showCreateRecommendation.set(true)
  }

  const handleUserIconClick = () => {
    showUserMenu.set(true)
  }

  const handleGroupIconClick = () => {
    showUserGroups = true
  }

  const hideUserGroups = () => {
    showUserGroups = false
  }

  const handleCreateNewGroupClick = () => {
    showCreateNewGroup.set(true)
  }
</script>

<div class='fixed top-0 w-screen z-100'>
  <header class='flex items-center justify-between h-17 px-4 bg-white shadow-md'>
    <div class='flex items-center space-x-4 relative'>
      <button use:clickOutside on:click_outside={hideUserGroups} on:click={handleGroupIconClick} class='rounded-lg h-10 w-10 overflow-hidden border-2 border-solid border-indigo-900 shadow-md'>
        <img src={$currentUser.groups[0]?.image} alt='group logo' />
      </button>
      <a href='/recommendations'>
        <img src={Logo} class='h-12 w-auto' />
      </a>
    </div>
    {#if true}
      <div class='pop-out-menu left-2 top-16'>
        {#each $currentUser.groups as group}
          <button class='pop-out-menu-item flex items-center space-x-2 p-2'>
            <div class='rounded-md overflow-hidden w-10'>
              <img src={group.image} alt='group logo'/>
            </div>
            <span class='whitespace-nowrap'>{group.name}</span>
          </button>
          <button on:click={handleCreateNewGroupClick} class='pop-out-menu-item flex items-center space-x-2 p-2'>
            <div class='rounded-md overflow-hidden w-10 border-2 border-solid border-gray-700 h-10 flex items-center justify-center'>
              <span class='fas fa-plus text-gray-700'/>
            </div>
            <span class='whitespace-nowrap'>Create New Group</span>
          </button>
        {/each}
      </div>
    {/if}

    <div class='hidden h-full items-center space-x-2'>
      <div class='flex h-full items-center'>
        <a class:active={$page?.path?.includes('/recommendations')} class='relative h-full flex items-center px-4 hover:bg-indigo-50' href='/recommendations'>
          Browse All
        </a>
        <a class:active={$page?.path?.includes('/profile/watchlist')} class='relative h-full flex items-center px-4 hover:bg-indigo-50' href='/profile/watchlist'>
          My Watchlist
        </a>
        <button on:click={handleShowUserRecommendations} class:modalOut={$showUserRecommendations} class='relative h-full flex items-center px-4 hover:bg-indigo-50'>
          My Recommendations
        </button>
      </div>
      <button on:click={handleAddRecommendation} class='flex px-4 py-2 border-1 border-indigo-900 items-center rounded-lg hover:bg-indigo-50'>
        + Add Recommendation
      </button>
    </div>

    <div class='flex items-center space-x-4 mr-10'>
      <button on:click={handleAddRecommendation} class='border-1 h-8 w-8 border-indigo-700 flex justify-center items-center rounded-md text-indigo-700 p-2'>
        <svg class='fill-indigo-700' width="100%" height="100%" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
      </button>
      <a href='/profile' class='w-10 h-10 border-2 border-solid border-indigo-900 rounded-full flex items-center justify-center overflow-hidden bg-indigo-300'>
        {#if $currentUser?.image}
          <img class='h-full w-auto' src={$currentUser.image} />
        {:else if $currentUser?.name}
          <span>{$currentUser.name.charAt(0).toUpperCase()}</span>
        {/if}
      </a>
    </div>
  </header>

  {#if $showUserMenu}
    <ProfileIconMenu

    />
  {/if}
</div>

<style>
  .active {
    @apply rounded-none bg-white;
  }

  .active:after {
    content: '';
    width: 100%;
    height: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
    @apply bg-blue-900;
  }

  .modalOut {
    @apply bg-indigo-50;
  }
</style>