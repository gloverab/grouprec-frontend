<script lang='ts' context='module'>
   export async function load() {
    // Determine if user is logged in or not
    // For now, let's assume they need to sign up
    return {
      redirect: '/recommendations',
      status: 302
    }
  }
</script>