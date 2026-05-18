<template>
  <button @click="getUploadingFileList">获取上传中的文件列表</button>
  <el-upload
    :file-list="fileList"
    action="#"
    list-type="picture-card"
    :accept="acceptFileTypeStr"
    :before-upload="beforeUpload"
    :http-request="upload"
    :limit="maxFileCount"
    multiple
  >
    +
  </el-upload>
  <div v-for="(item, key) in fileObj" :key="key">
    {{ item.file?.name }}
    <button @click="abort(key)">{{ item.pause ? '继续' : '暂停' }}</button>
    <el-progress :percentage="item.uploadedProgress"></el-progress>
  </div>
</template>

<script setup lang="ts">
import type { UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus'
import {
  initUpload,
  getUploadedChunk,
  partUpload,
  completeUpload,
  getUploadingFile
} from '@/api/file/upload'
import SparkMD5 from 'spark-md5'

const {
  fileList = [],
  acceptFileType = [],
  maxFileSize = 0,
  maxFileCount = 3
} = defineProps<{
  fileList?: UploadUserFile[]
  acceptFileType?: string[]
  maxFileSize?: number
  maxFileCount?: number
}>()

interface FileConfig {
  file: UploadRawFile | null
  fileKey: string
  uploadId: string
  chunkBlobArr: Array<Blob>
  partETags: Array<{ partNumber: number; etag: string }>
  uploadedSize: number
  uploadedProgress: number
  totalSize: number
  pause: boolean
  controller?: AbortController
}

const fileObj = ref<Record<string, FileConfig>>({})

const acceptFileTypeStr = computed(() => {
  return acceptFileType.map((item) => '.' + item).join(',')
})

function beforeUpload(rawFile: UploadRawFile) {
  const { name, size } = rawFile
  const uid = String(rawFile.uid)

  const ext = name.substring(name.lastIndexOf('.') + 1) || ''

  const isInValidType = acceptFileType.indexOf(ext.toLocaleLowerCase()) === -1

  const isExceedSize = maxFileSize && size > maxFileSize * 1024 * 1024

  if (isInValidType) {
    ElMessage.error(`文件类型只支持${acceptFileType.join('、')}格式`)
    return false
  }
  if (isExceedSize) {
    ElMessage.error(`文件大小不能超过${maxFileSize}MB`)
    return false
  }

  fileObj.value[uid] = {
    file: rawFile,
    fileKey: '',
    uploadId: '',
    chunkBlobArr: [],
    partETags: [],
    uploadedProgress: 0,
    uploadedSize: 0,
    totalSize: rawFile.size,
    pause: false
  }

  return true
}

function getUploadingFileList() {
  getUploadingFile().then((res) => {
    console.log(res)
  })
}

function abort(key: string) {
  const item = fileObj.value[key]
  if (!item) return

  item.pause = !item.pause
  if (item.pause) {
    item.controller?.abort()
  } else {
    uploadChunks(key)
  }
}

// 生成文件对应的key
async function generateFileKey(file: UploadRawFile, chunkBlobArr: Blob[]): Promise<string> {
  const hash = await getFileHash(chunkBlobArr)
  const fileName = file.name
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1) || ''
  let fileKey = `${hash}`
  if (ext) {
    fileKey += '.' + ext
  }
  return fileKey
}

async function upload(options: UploadRequestOptions) {
  const file = options.file
  const uid = String(file.uid)
  const item = fileObj.value[uid]
  if (!item) return

  item.chunkBlobArr = createFileChunks(file)

  const fileKey = await generateFileKey(file, item.chunkBlobArr)

  item.fileKey = fileKey

  const res = await initUpload({ key: fileKey })
  const uploadId = res.data

  if (!uploadId) {
    item.uploadedProgress = 100
    return
  }

  item.uploadId = uploadId

  await uploadChunks(uid)
}

async function uploadChunks(uid: string) {
  const item = fileObj.value[uid]
  if (!item) return

  const res = await getUploadedChunk({ key: item.fileKey, uploadId: item.uploadId })
  item.partETags = res.data || []
  const length = item.partETags.length
  let startIndex = 0
  if (length) {
    item.uploadedSize = 0
    startIndex = item.partETags[length - 1]?.partNumber || 0
    item.partETags.forEach((_, index) => {
      item.uploadedSize += (item.chunkBlobArr[index] as Blob).size
    })
    item.uploadedProgress = Number(((item.uploadedSize / item.totalSize) * 100).toFixed(2))
  }

  for (let index = startIndex; index < item.chunkBlobArr.length; index++) {
    if (item.pause) {
      return
    }
    const chunkBlob = item.chunkBlobArr[index] as Blob
    const formData = new FormData()
    formData.append('file', chunkBlob)
    formData.append('uploadId', item.uploadId)
    formData.append('partNumber', (index + 1).toString())
    formData.append('key', item.fileKey)
    item.controller = new AbortController()
    try {
      const partRes = await partUpload(
        formData,
        (progressEvent) => {
          const size = Math.min(progressEvent.loaded, chunkBlob.size)
          item.uploadedProgress = Number(
            (((size + item.uploadedSize) / item.totalSize) * 100).toFixed(2)
          )
        },
        item.controller
      )
      item.uploadedSize += chunkBlob.size
      item.uploadedProgress = Number(((item.uploadedSize / item.totalSize) * 100).toFixed(2))
      item.partETags.push(partRes.data)
    } catch (error) {
      console.log(uid, ':', error)
    }
  }

  completeUpload({ uploadId: item.uploadId, key: item.fileKey, partETags: item.partETags })
    .then((res) => {
      console.log(res)
      if (res.data) {
        ElMessage.success('文件上传成功')
      }
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('文件上传失败')
    })
}

function createFileChunks(file: UploadRawFile): Blob[] {
  const chunkSize = 5 * 1024 * 1024
  const chunkBlobArr: Blob[] = []
  let start = 0

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    chunkBlobArr.push(file.slice(start, end))
    start = end
  }

  return chunkBlobArr
}

function getFileHash(chunkBlobArr: Blob[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    if (chunkBlobArr.length === 0) {
      resolve(spark.end())
      return
    }

    fileReader.onload = function (e) {
      if (!(e.target?.result instanceof ArrayBuffer)) {
        reject(new Error('Failed to read file chunk as ArrayBuffer'))
        return
      }

      spark.append(e.target.result) // Append array buffer
      currentChunk++

      if (currentChunk < chunkBlobArr.length) {
        loadNext()
      } else {
        const hash = spark.end()
        resolve(hash)
      }
    }

    fileReader.onerror = function () {
      reject(fileReader.error ?? new Error('Failed to read file'))
    }

    function loadNext() {
      fileReader.readAsArrayBuffer(chunkBlobArr[currentChunk] as Blob)
    }

    loadNext()
  })
}
</script>

<style scoped></style>
