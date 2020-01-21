<template>
  <div>
    <input type="file" @change="handlerFileChange($event)">
    <el-button @click="uploadHandler">上传</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ajax from '../../utils/ajax';

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
  readonly LENGTH: number = 3;
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
    let res = await Promise.all(requestList);
    return res;
  };

  async uploadHandler () {
    try {
      this.datas = this.selectedFile && this.createFileChunks(this.selectedFile) || [];
      let res = await this.uploadChunks();
      await this.mergeReq();
    } catch (err) {
      console.log(err);
    }
  };

  async mergeReq () {
    let data = JSON.stringify({
      filename: this.selectedFile.name
    });
    let res = await ajax({
      url: '/api/merge',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: data
    });
    return res;
  }
}
</script>

<style lang="less">

</style>