<script>
  import { fly } from "svelte/transition";
  import LockScroll from "./LockScroll.svelte";
  import Overlay from "./Overlay.svelte";

</script>

<div transition:fly={{ y: 25, duration: 50 }} class='fixed h-screen w-screen top-0 left-0 z-900 flex justify-center items-center'>
  <LockScroll />
  <Overlay all />
  <div class="loader"></div>
</div>

<style global>
  .loader {
    width:50px;
    height:50px;
    display:inline-block;
    padding:0px;
    opacity:0.5;
    border:3px solid #09acfd;
    -webkit-animation: loader 1s ease-in-out infinite alternate;
    animation: loader 1s ease-in-out infinite alternate;
  }

  .loader:before {
    content: " ";
    position: absolute;
    z-index: -1;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 3px solid #09acfd;
  }

  .loader:after {
    content: " ";
    position: absolute;
    z-index: -1;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 3px solid #09acfd;
  }

  @keyframes loader {
    from {transform: rotate(0deg) scale(1,1);border-radius:0px;}
    to {transform: rotate(360deg) scale(0, 0);border-radius:50px;}
  }
  @-webkit-keyframes loader {
    from {-webkit-transform: rotate(0deg) scale(1, 1);border-radius:0px;}
    to {-webkit-transform: rotate(360deg) scale(0,0 );border-radius:50px;}
  }
</style>