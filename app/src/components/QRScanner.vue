<template>
  <div>
    <h1>Scanner le code QR:</h1>
    <video
    width="320" height="240"
      ref="video"
      disablepictureinpicture=""
      playsinline=""
      style="transform: scaleX(-1)"
    ></video>
    
  </div>
</template>

<script>
import QrScanner from "qr-scanner";

export default {
  name: "scanner",
  data() {
    return {};
  },
  methods: {


    qrScan() {
      const video = this.$refs.video;
      QrScanner.WORKER_PATH = "../qr-scanner-worker.min.js";
      const scanner = new QrScanner(
        video,
        (result) => console.log(result),
        (error) => {
          console.log(error);
        }
      );
      scanner.start()
    },
  },

  mounted() {
    this.qrScan();
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>