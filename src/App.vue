<template>
  <div id="app">
    <canvas id="canvas" height="500" width="500"></canvas>
  </div>
</template>

<script>
import Node from "./node";
import Player from "./player";

export default {
  name: "app",
  data() {
    return {
      canvas: null,
      ctx: null,
      mazeSize: 10,
      nodeSize: null,
      maze: null,
      player: null,
      directions: {
        LEFT: 0b0001,
        RIGHT: 0b0010,
        UP: 0b0100,
        DOWN: 0b1000
      }
    };
  },
  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.nodeSize = 500 / this.mazeSize;

    this.initNodes();
    this.draw();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.dfs(0, 0);
    this.initPlayer();
  },
  methods: {
    initNodes() {
      this.maze = [];
      for (let y = 0; y < this.mazeSize; y++) {
        this.maze[y] = [];
        for (let x = 0; x < this.mazeSize; x++) {
          this.maze[y][x] = new Node(x, y, false);
        }
      }
    },
    draw() {
      for (let i = 0; i <= this.mazeSize; i++) {
        this.ctx.moveTo(0, i * this.nodeSize);
        this.ctx.lineTo(500, i * this.nodeSize);
        this.ctx.stroke();

        this.ctx.moveTo(i * this.nodeSize, 0);
        this.ctx.lineTo(i * this.nodeSize, 500);
        this.ctx.stroke();
      }
    },
    dfs(x, y, parent) {
      let node = this.maze[y][x];
      console.log(node);

      if (node.visited) return false;
      else {
        if (parent) {
          node.parent = parent;
          this.breakWall(node);
        }
        node.visited = true;
      }

      let visitedDirs = [];
      while (1) {
        let direction = this.srand(node, visitedDirs);
        console.log(direction);
        if (!direction) break;
        if (direction == this.directions.LEFT) {
          this.dfs(x - 1, y, node);
        }
        if (direction == this.directions.RIGHT) {
          this.dfs(x + 1, y, node);
        }
        if (direction == this.directions.UP) {
          this.dfs(x, y - 1, node);
        }
        if (direction == this.directions.DOWN) {
          this.dfs(x, y + 1, node);
        }
        visitedDirs.push(direction);
      }
      return true;
    },
    breakWall(node) {
      const parent = node.parent;
      const { point0, point1 } = this.getWallToBreak(node, parent);
      console.log({ point0, point1 });

      this.ctx.moveTo(point0.x, point0.y);
      this.ctx.lineTo(point1.x, point1.y);
      this.ctx.stroke();
    },
    getWallToBreak(node, parent) {
      const differentDimension = ["x", "y"].filter(
        dim => node[dim] !== parent[dim]
      )[0];

      const isWallHorizontal = differentDimension === "y";
      const isNodeFurther =
        node[differentDimension] > parent[differentDimension];

      let point0 = {};
      let point1 = {};

      if (isNodeFurther) {
        point0 = {
          x: node.x * this.nodeSize + 1,
          y: node.y * this.nodeSize + 1
        };
        if (isWallHorizontal)
          point1 = {
            x: node.x * this.nodeSize + this.nodeSize - 1,
            y: node.y * this.nodeSize - 1
          };
        else
          point1 = {
            x: node.x * this.nodeSize - 1,
            y: node.y * this.nodeSize + this.nodeSize - 1
          };
      } else {
        point0 = {
          x: parent.x * this.nodeSize + 1,
          y: parent.y * this.nodeSize + 1
        };
        if (isWallHorizontal)
          point1 = {
            x: parent.x * this.nodeSize + this.nodeSize - 1,
            y: parent.y * this.nodeSize - 1
          };
        else
          point1 = {
            x: parent.x * this.nodeSize,
            y: parent.y * this.nodeSize + this.nodeSize
          };
      }
      const wall = { point0, point1 };
      return wall;
    },
    srand(node, visitedDirs) {
      const directionsArray = Object.values(this.directions);
      let leftDirs = directionsArray.filter(dir => !visitedDirs.includes(dir));

      if (node.x === 0)
        leftDirs.splice(leftDirs.indexOf(this.directions.LEFT), 1);
      if (node.x === this.mazeSize - 1)
        leftDirs.splice(leftDirs.indexOf(this.directions.RIGHT), 1);
      if (node.y === 0)
        leftDirs.splice(leftDirs.indexOf(this.directions.UP), 1);
      if (node.y === this.mazeSize - 1)
        leftDirs.splice(leftDirs.indexOf(this.directions.DOWN), 1);

      if (leftDirs.length === 1) return leftDirs[0];

      const r = Math.floor(Math.random() * leftDirs.length);
      return leftDirs[r];
    },
    initPlayer() {
      const color = this.getRandomColor();
      this.player = new Player(0, 0, this.nodeSize, color, this.ctx);
      window.addEventListener("keydown", e => {
        let key = e.keyCode;
        if (key == 37) {
          if (this.player.x !== 0) this.player.goLeft();
        }
        if (key == 39) {
          if (this.player.x !== this.mazeSize - 1) this.player.goRight();
        }
        if (key == 38) {
          if (this.player.y !== 0) this.player.goUp();
        }
        if (key == 40) {
          if (this.player.y !== this.mazeSize - 1) this.player.goDown();
        }
      });
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
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
