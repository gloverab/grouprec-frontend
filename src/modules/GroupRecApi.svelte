<script lang='ts' context='module'>
  import { apiPost } from "$src/api/api.svelte";
  
  export const createMusicRecommendation = async (recObject: any, tags: any, linksByPlatform: any, categoryId?: number) => {
    const services = Object.keys(linksByPlatform)

    const recommendation = recObject as any

    services.forEach(s => {
      switch(s) {
        case 'amazonMusic':
          recommendation.amazon_music_link = linksByPlatform[s].url
          break
        case 'appleMusic':
          recommendation.apple_music_link = linksByPlatform[s].url
          break
        case 'deezer':
          recommendation.deezer_link = linksByPlatform[s].url
          break
        case 'pandora':
          recommendation.pandora_link = linksByPlatform[s].url
          break
        case 'spotify':
          recommendation.spotify_link = linksByPlatform[s].url
          break
        case 'tidal':
          recommendation.tidal_link = linksByPlatform[s].url
          break
        case 'youtube':
          recommendation.youtube_link = linksByPlatform[s].url
          break
        case 'youtubeMusic':
          recommendation.youtube_music_link = linksByPlatform[s].url
          break
      }
    })

    const body = {
      recommendation,
      tags,
    }

    if (categoryId) {
      body.category_id = categoryId
    }

    const obj = {
      endpoint: 'recommendations',
      body
    }

    const resp = await apiPost(obj)
    return resp
  }

</script>