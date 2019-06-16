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
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.lineWidth = 4;
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
      const node = this.maze[y][x];
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
      const { point0, point1, direction } = this.getWallToBreak(node, parent);
      const invertedDirection =
        direction === this.directions.UP
          ? this.directions.DOWN
          : direction === this.directions.DOWN
          ? this.directions.UP
          : direction === this.directions.LEFT
          ? this.directions.RIGHT
          : this.directions.LEFT;

      parent.brokenWalls.push(direction);
      node.brokenWalls.push(invertedDirection);

      this.ctx.moveTo(point0.x + 1, point0.y + 1);
      this.ctx.lineTo(point1.x - 1, point1.y - 1);
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
      let direction = null;

      if (isNodeFurther) {
        point0 = {
          x: node.x * this.nodeSize,
          y: node.y * this.nodeSize
        };
        if (isWallHorizontal) {
          direction = this.directions.DOWN;
          point1 = {
            x: node.x * this.nodeSize + this.nodeSize,
            y: node.y * this.nodeSize
          };
        } else {
          direction = this.directions.RIGHT;
          point1 = {
            x: node.x * this.nodeSize,
            y: node.y * this.nodeSize + this.nodeSize
          };
        }
      } else {
        point0 = {
          x: parent.x * this.nodeSize,
          y: parent.y * this.nodeSize
        };
        if (isWallHorizontal) {
          direction = this.directions.UP;
          point1 = {
            x: parent.x * this.nodeSize + this.nodeSize,
            y: parent.y * this.nodeSize
          };
        } else {
          direction = this.directions.LEFT;
          point1 = {
            x: parent.x * this.nodeSize,
            y: parent.y * this.nodeSize + this.nodeSize
          };
        }
      }
      const wall = { point0, point1, direction };
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
      const self = this;
      window.addEventListener("keydown", e => {
        const key = e.keyCode;
        const x = self.player.x;
        const y = self.player.y;
        const node = self.maze[y][x];
        const brokenWalls = node.brokenWalls;
        if (key == 37) {
          if (x !== 0 && brokenWalls.includes(self.directions.LEFT))
            self.player.goLeft();
        }
        if (key == 39) {
          if (
            x !== self.mazeSize - 1 &&
            brokenWalls.includes(self.directions.RIGHT)
          )
            self.player.goRight();
        }
        if (key == 38) {
          if (y !== 0 && brokenWalls.includes(self.directions.UP))
            self.player.goUp();
        }
        if (key == 40) {
          if (
            y !== self.mazeSize - 1 &&
            brokenWalls.includes(self.directions.DOWN)
          )
            self.player.goDown();
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
