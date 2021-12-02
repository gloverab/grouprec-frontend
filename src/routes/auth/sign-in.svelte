<script lang='ts'>
  import { onMount } from 'svelte';
  import { baseURL } from '$src/api/api.svelte';
  import { fly } from "svelte/transition";
  import GroupRecLogo from '$assets/grouprec-gr.png'
  import { apiFetching, currentUser, token } from '$src/stores/main';
  import { goto } from '$app/navigation';
import Loader from '$src/components/Loader.svelte';

  let showForm = false
  let emailUsernameVal
  let passwordVal

  onMount(() => {
    setTimeout(() => showForm = true, 0)
  })

  const handleSubmit = async () => {
    const obj = {
      email: emailUsernameVal,
      password: passwordVal
    }

    const url = `${baseURL}/users/sign_in`
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })

    if (resp.status === 200) {
      const body = await resp.json()
      token.set(body.token)
      localStorage.setItem('token', body.token)
      currentUser.set(body.user)
      goto('/recommendations')
    }
  }

  const handleKeydown = (e) => {
    if (emailUsernameVal && passwordVal && e.which === 13) {
      handleSubmit()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class='flex w-screen h-screen items-center justify-center'>
  <div class='gradient absolute w-full h-1/2 top-0 left-0' />
  {#if showForm}
    <div transition:fly={{ y: 25, duration: 300 }} class='flex flex-col justify-center items-center rounded-xl border-2 border-indigo-600 p-4 mx-6 -mt-8 max-w-120 z-1 bg-white'>
      <img class='w-2/3 mb-10' src={GroupRecLogo} alt='Logo' />


      <div class='w-full max-w-80 space-y-6'>
        <div class='flex flex-col items-start'>
          <span class='text-xs mb-1 font-semibold'>Username</span>
          <input
            class='w-full py-1 border-b border-solid outline-none hover:border-b-indigo-300 focus:border-b-indigo-700'
            type='text'
            bind:value={emailUsernameVal}
          />
        </div>

        <div class='flex flex-col items-start'>
          <span class='text-xs mb-1 font-semibold'>Password</span>
          <input
            class='w-full py-1 border-b border-solid outline-none hover:border-b-indigo-300 focus:border-b-indigo-700'
            type='password'
            bind:value={passwordVal}
          />
        </div>

        <div class='flex justify-end'>
          <button on:click={handleSubmit} class='rounded-lg bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2'>
            Log In
          </button>
        </div>

      </div>
    </div>
    <footer class='absolute bottom-0 w-full flex flex-col items-center justify-center border-1 border-t py-2'>
      <p class='text-xs text-center italic mb-2'>"I hope you never use your skills for anything useful. I'd be downright disappointed in you."<span class='not-italic'>&nbsp;-Jon McKinley</span></p>
      <p class='text-xxs'>Copyright © 2021 Alex Glover. All rights reserved.</p>
    </footer>
  {/if}
</div>

<style>
  .gradient {
    background: linear-gradient(45deg, #c7d2fe, #cffafe);
  }

  .text-xxs {
    font-size: 10px;
  }
</style>