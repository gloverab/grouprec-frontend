<script lang='ts' context='module'>
  import moment from "moment";
  import { spotifyAuthString, spotifyTokenExpiryTime } from "$src/stores/main";

  const spotifyClientID = 'e6ab4f0efd8740eab4ce74c4bb15d3d1'
  const spotifyClientSecret = '047c1a47189f40938e5bfbd76ced292d'

  export const spotifyBaseUrl = 'https://api.spotify.com/v1'

  export const getSpotifyToken = async () => {
    const stringToEncode = `${spotifyClientID}:${spotifyClientSecret}`
    const url = 'https://accounts.spotify.com/api/token'
    const headers = {
      'Authorization': `Basic ${btoa(stringToEncode)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      })
    })

    if (resp.status === 200) {
      const body = await resp.json()
      const expiresAt = moment().add(body.expires_in, 'seconds')

      spotifyAuthString.set(`${body.token_type} ${body.access_token}`)
      spotifyTokenExpiryTime.set(expiresAt.format())
    }
  }
</script>