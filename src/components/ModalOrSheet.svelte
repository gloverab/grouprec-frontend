<script lang='ts'>
  import BottomSheet from "./BottomSheet.svelte"
  import Modal from "./Modal.svelte"

  export let onClose: () => void
  export let bottomButtons = []
</script>

<div class='hidden md:block'>
  <Modal {bottomButtons} onHideModal={onClose} hideCloseX>
    <slot />
  </Modal>
</div>

<div class='md:hidden'>
  <BottomSheet {bottomButtons} onHideSheet={onClose}>
    <slot />
  </BottomSheet>
</div>