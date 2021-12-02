<script lang='ts'>
  export let password
  export let passwordConfirmation
</script>

<div class='w-full space-y-4'>
  <div class='flex flex-col'>
    <span class='text-xs font-semibold'>New Password</span>
    <input
      placeholder='Name'
      type='password'
      bind:value={password}
    />
  </div>
  <div class='flex flex-col'>
    <span class='text-xs font-semibold'>New Password Confirmation</span>
    <input
      placeholder='Username'
      type='password'
      bind:value={passwordConfirmation}
    />
  </div>
</div>