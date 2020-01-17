<template>
  <div>
    <input type="file" @change="handlerFileChange($event)">
    <el-button @click="uploadHandler">上传</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ajax from '../..//utils/ajax';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

interface FileChunk {
  file: Blob;
  hash: string;
  filename: string;
}

@Component
export default class UploadFile extends Vue {
  readonly LENGTH: number = 1;
  selectedFile!: File;
  datas: FileChunk[] = [];

  handlerFileChange (e: HTMLInputEvent) {
    if (e.target.files) {
      this.selectedFile = e.target.files[0];
    }
  };

  createFileChunks (file: File, len: number = this.LENGTH): FileChunk[] {
    const chunkList: Array<any> = [];
    const chunkSize = Math.ceil(file.size / len);
    let cur: number = 0;
    let idx: number = 0;
    while (cur < file.size) {
      let chunk: FileChunk = {
        file: file.slice(cur, cur + chunkSize),
        hash: file.name + '-' + idx,
        filename: file.name,
      }
      chunkList.push(chunk);
      cur += chunkSize;
      idx++;
    };
    return chunkList;
  };

  async uploadChunks () {
    const requestList = this.datas.map(({file, hash, filename}: FileChunk) => {
      const formData = new FormData();
      formData.append('chunk', file);
      formData.append('hash', hash);
      formData.append('filename', filename);
      return { formData };
    }).map(({ formData }) => {
      return ajax({
        url: `/api/upload`,
        method: 'post',
        data: formData
      })
    })
    await Promise.all(requestList);
  };

  async uploadHandler () {
    this.datas = this.selectedFile && this.createFileChunks(this.selectedFile);
    console.log(this.datas);
    let res = await this.uploadChunks();
    // const formData = new FormData();
    // formData.append('file', this.selectedFile)
    // let res = await ajax({
    //   url: `/api/upload`,
    //   method: 'post',
    //   data: formData
    // })
    console.log(res);
  };
}
</script>

<style lang="less">

</style>