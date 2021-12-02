<script lang='ts'>
  import { currentUser, showUserMenu, token } from "../stores/main";
  import { clickOutside } from "../helpers";
  import { goto } from "$app/navigation";

  const logOut = () => {
    currentUser.set(undefined)
    token.set(undefined)
    localStorage.removeItem('token')
    goto('/auth/sign-in')
  }

</script>

<div use:clickOutside on:click_outside={() => showUserMenu.set(false)} class='fixed top-22 right-4 bg-white shadow-md z-100'>
  <div class='flex flex-col p-4 space-y-2'>
    <a href='/profile'>View Profile</a>
    <a href='/profile/watchlist'>View Group</a>
    <a href='/profile/my-recommendations'>My Recommendations</a>
    <button on:click={logOut} class='text-left'>Log Out</button>
  </div>
</div>