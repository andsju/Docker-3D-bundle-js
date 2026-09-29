export class LoadingRing {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.progress = 0;
        this.target = 0;

        this.resize();
        window.addEventListener("resize", () => this.resize());

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setProgress(p) {
        this.target = p;
    }

    animate() {
        const ctx = this.ctx;

        this.progress += (this.target - this.progress) * 0.08;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;
        const r = 50;

        const start = -Math.PI / 2;
        const end = start + (this.progress / 100) * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, r, start, end);
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(this.progress)}%`, x, y);

        requestAnimationFrame(() => this.animate());
    }
}