import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10 * 1000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return Promise.reject('接口请求失败')
    }
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default instance
