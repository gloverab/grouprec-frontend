<script context='module' lang='ts'>
  import { get } from 'svelte/store';
  import { apiFetching, token } from "../stores/main";

  // export const baseURL = "http://localhost:3001"
  export const baseURL = "https://desolate-basin-67919.herokuapp.com"

  export const createURLString = (obj: any) => {
    let params = ''
    for (const key in obj.params) {
      params += `${key}=${obj.params[key]}&`
    }

    let string = `${baseURL}/${obj.endpoint}`
    if (params) {
      string += `?${params}`
    }

    return string
  }

  export const api = async (fetch, queryObject, method = 'GET') => {
    apiFetching.set(true)
    const url = createURLString(queryObject)
    const resp = await fetch(url, {mode: 'cors', method})
    const data = await resp.json()

    apiFetching.set(false)
    return data
  }

  export const apiGet = async (queryObject, suppressLoading = false) => {
    if (!suppressLoading) apiFetching.set(true)
    const url = createURLString(queryObject)

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${get(token)}`,
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers,
      mode: 'cors',
    })

    apiFetching.set(false)
    return resp
  }

  export const apiPost = async (queryObject, suppressLoading = false) => {
    if (!suppressLoading) apiFetching.set(true)
    const url = `${baseURL}/${queryObject.endpoint}`

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${get(token)}`,
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(queryObject.body)
    })

    apiFetching.set(false)
    return resp
  }

  export const apiPatch = async (queryObject, suppressLoading = false) => {
    if (!suppressLoading) apiFetching.set(true)
    const url = `${baseURL}/${queryObject.endpoint}`

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${get(token)}`,
    }
    const resp = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(queryObject.body)
    })

    apiFetching.set(false)
    return resp
  }

  export const apiDelete = async (endpoint, suppressLoading = false) => {
    if (!suppressLoading) apiFetching.set(true)
    const url = `${baseURL}/${endpoint}`

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${get(token)}`,
    }

    const resp = await fetch(url, {
      method: 'DELETE',
      headers
    })

    apiFetching.set(false)
    return resp
  }
</script>