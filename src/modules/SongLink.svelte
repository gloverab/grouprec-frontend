<script lang='ts' context='module'>
  const songlinkBaseUrl = 'https://api.song.link/v1-alpha.1/links'
  const songlinkApiKey = 'cf41be7b-09f9-4ac3-abea-ed4adb419d32'
  
  export const getLinks = async (link: string) => {
    const linkEncode = encodeURIComponent(link)
    const resp = await fetch(`${songlinkBaseUrl}?url=${linkEncode}&key=${songlinkApiKey}`)
    return resp
  }

</script>