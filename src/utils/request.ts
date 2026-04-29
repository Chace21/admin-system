import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10 * 1000
})

instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use((response) => {
  return response
})

export default instance
