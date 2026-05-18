import request from '@/utils/request'
import type { Response } from '@/types/axios'

export const initUpload = (params: { key: string }): Promise<Response<string>> => {
  return request({
    url: '/upload/init',
    method: 'get',
    params
  })
}

export const getUploadedChunk = (params: {
  key: string
  uploadId: string
}): Promise<Response<Array<{ partNumber: number; etag: string }>>> => {
  return request({
    url: '/upload/getUploadedChunk',
    method: 'get',
    params
  })
}

export const partUpload = (
  data: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  controller?: AbortController
): Promise<Response<{ partNumber: number; etag: string }>> => {
  return request({
    url: '/upload/partUpload',
    method: 'post',
    data,
    onUploadProgress,
    signal: controller?.signal
  })
}

export const completeUpload = (data: {
  uploadId: string
  key: string
  partETags: Array<{ partNumber: number; etag: string }>
}): Promise<Response<string>> => {
  return request({
    url: '/upload/complete',
    method: 'post',
    data
  })
}

export const getUploadingFile = (): Promise<Response<string>> => {
  return request({
    url: '/upload/getUploadingFile',
    method: 'get'
  })
}
