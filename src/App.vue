<template>
  <div id="app">
    <canvas id="canvas" height="500" width="500"></canvas>
  </div>
</template>

<script>
import Node from "./node";

export default {
  name: "app",
  data() {
    return {
      canvas: null,
      ctx: null,
      mazeSize: 10,
      maze: null
    };
  },
  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.init();
    this.draw();
  },
  methods: {
    init() {
      this.maze = new Array(this.mazeSize);
      for (let y = 0; y < this.mazeSize; y++) {
        this.maze[y] = new Array(this.mazeSize);
        for (let x = 0; x < this.mazeSize; x++) {
          this.maze[y][x] = new Node(x, y, false);
        }
      }
    },
    draw() {
      for (let i = 0; i <= this.mazeSize; i++) {
        this.ctx.moveTo(0, i * (500 / this.mazeSize));
        this.ctx.lineTo(500, i * (500 / this.mazeSize));
        this.ctx.stroke();
      }
      for (let i = 0; i <= this.mazeSize; i++) {
        this.ctx.moveTo(i * (500 / this.mazeSize), 0);
        this.ctx.lineTo(i * (500 / this.mazeSize), 500);
        this.ctx.stroke();
      }
    },
    breakWall(){

    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#canvas {
  border: 1px solid #000;
}
</style>
