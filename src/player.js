export default class Player {
    constructor(x, y, size, color, ctx) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.ctx = ctx;

        this.draw();
    }

    clear() {
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        let x = this.x * this.size + this.size / 2;
        let y = this.y * this.size + this.size / 2;
        this.ctx.arc(x, y, this.size / 2 * 0.8 + 1, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        let x = this.x * this.size + this.size / 2;
        let y = this.y * this.size + this.size / 2;
        this.ctx.arc(x, y, this.size / 2 * 0.8, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    goLeft() {
        this.clear();
        this.x--;
        this.draw();
    }
    goRight() {
        this.clear();
        this.x++;
        this.draw();
    }
    goUp() {
        this.clear();
        this.y--;
        this.draw();
    }
    goDown() {
        this.clear();
        this.y++
        this.draw();
    }
};
