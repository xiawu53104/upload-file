<template>
  <div>
    <input type="file" @change="handlerFileChange($event)">
    <el-button>上传</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component
export default class UploadFile extends Vue {
  selectedFile!: File | null;

  handlerFileChange (e: HTMLInputEvent) {
    this.selectedFile = e.target.files && e.target.files[0]
    console.log(this.selectedFile)
  };
}
</script>

<style lang="less">

</style>