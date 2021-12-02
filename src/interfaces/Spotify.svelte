<script lang='ts' context='module'>
  interface IImage {
    height: number
    url: string
    width: number
  }

  interface IArtist {
    href: string
    id: string
    name: string
  }

  interface IAlbum {
    album_type: 'single' | 'album' | 'compilation'
    name: string
    href: string
    id: string
    images: IImage[]
    type: string,
    release_date: string
  }

  interface ITrack {
    artists: IArtist[]
    explicit: boolean
    duration_ms: number
    id: string
    name: string
  }

  export interface ISpotifySongResult {
    album: IAlbum
    artists: IArtist[]
    duration_ms: number
    external_ids: {
      isrc: string
    }
    explicit: boolean
    id: string
    name: string
  }

  export interface ISpotifyAlbumResult {
    artists: IArtist[]
    images: IImage[]
    name: string
    release_date: string
    tracks: {
      href: string
      items: ITrack[]
      limit: number
      offset: number
      total: number
    }
  }

  export interface ISpotifyArtistResult {
    followers: {
      href: string
      total: number
    }
    genres: string[]
    id: string
    images: IImage[]
    name: string
    popularity: number
  }
</script>