/* ==========================================
   PROFESSIONAL BIRTHDAY WEBSITE
   PART 3
========================================== */

const cake = document.getElementById("cake");
const knife = document.getElementById("knife");
const message = document.getElementById("message");
const replay = document.getElementById("replay");
const music = document.getElementById("music");

let startX = 0;
let startY = 0;
let cutting = false;
let finished = false;

/* ==========================
   START SWIPE
========================== */

function beginCut(x, y) {

    if (finished) return;

    cutting = true;

    startX = x;
    startY = y;
}

/* ==========================
   MOVE
========================== */

function moveKnife(x, y) {

    if (!cutting || finished) return;

    const rect = cake.getBoundingClientRect();

    knife.style.left = (x - rect.left - 110) + "px";
    knife.style.top = (y - rect.top) + "px";
}

/* ==========================
   END
========================== */

function finishCut(x) {

    if (!cutting || finished) return;

    cutting = false;

    const distance = Math.abs(x - startX);

    if (distance > 180) {

        finished = true;

        cake.classList.add("cut");

        setTimeout(() => {

            music.play().catch(() => {});

            message.style.display = "block";

            if (typeof startConfetti === "function")
                startConfetti();

            if (typeof startFireworks === "function")
                startFireworks();

        }, 1200);

    }
}

/* ==========================
   TOUCH EVENTS
========================== */

cake.addEventListener("touchstart", e => {

    const t = e.touches[0];

    beginCut(t.clientX, t.clientY);

});

cake.addEventListener("touchmove", e => {

    const t = e.touches[0];

    moveKnife(t.clientX, t.clientY);

});

cake.addEventListener("touchend", e => {

    finishCut(
        e.changedTouches[0].clientX
    );

});

/* ==========================
   MOUSE EVENTS
========================== */

cake.addEventListener("mousedown", e => {

    beginCut(e.clientX, e.clientY);

});

window.addEventListener("mousemove", e => {

    moveKnife(e.clientX, e.clientY);

});

window.addEventListener("mouseup", e => {

    finishCut(e.clientX);

});

/* ==========================
   REPLAY
========================== */

replay.onclick = () => {

    location.reload();

};



/* ==========================================
   PART 5 - FIREWORKS ENGINE
========================================== */

const fireCanvas = document.getElementById("fireworks");
const fctx = fireCanvas.getContext("2d");

function resizeFireCanvas() {
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
}

resizeFireCanvas();
window.addEventListener("resize", resizeFireCanvas);

const fireworks = [];

class FireParticle {

    constructor(x, y, color) {
        this.x = x;
        this.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 100;
        this.color = color;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.05; // gravity
        this.life--;
    }

    draw() {
        fctx.beginPath();
        fctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fctx.fillStyle = this.color;
        fctx.fill();
    }
}

function explode(x, y) {

    const colors = [
        "#ff1744",
        "#ffea00",
        "#00e5ff",
        "#00e676",
        "#ff9100",
        "#e040fb",
        "#ffffff"
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 80; i++) {
        fireworks.push(new FireParticle(x, y, color));
    }
}

function startFireworks() {

    explode(
        fireCanvas.width * 0.25,
        fireCanvas.height * 0.30
    );

    setTimeout(() => {
        explode(
            fireCanvas.width * 0.75,
            fireCanvas.height * 0.35
        );
    }, 500);

    setTimeout(() => {
        explode(
            fireCanvas.width * 0.50,
            fireCanvas.height * 0.20
        );
    }, 1000);

    // Continuous fireworks
    setInterval(() => {

        explode(
            Math.random() * fireCanvas.width,
            Math.random() * (fireCanvas.height * 0.5)
        );

    }, 1200);

}

function animateFireworks() {

    fctx.clearRect(
        0,
        0,
        fireCanvas.width,
        fireCanvas.height
    );

    for (let i = fireworks.length - 1; i >= 0; i--) {

        fireworks[i].update();
        fireworks[i].draw();

        if (fireworks[i].life <= 0) {
            fireworks.splice(i, 1);
        }

    }

    requestAnimationFrame(animateFireworks);

}

animateFireworks();





/* ==========================================
   PART 6 - PREMIUM CELEBRATION
========================================== */

const celebrationEmojis = [
    "🎉","🎊","✨","🎈","🎁","🥳","💖","🎂"
];

function createEmoji() {

    const emoji = document.createElement("div");

    emoji.innerHTML =
        celebrationEmojis[
            Math.floor(
                Math.random() *
                celebrationEmojis.length
            )
        ];

    emoji.style.position = "fixed";
    emoji.style.left = Math.random() * window.innerWidth + "px";
    emoji.style.top = "-50px";

    emoji.style.fontSize =
        (20 + Math.random() * 30) + "px";

    emoji.style.zIndex = "9999";
    emoji.style.pointerEvents = "none";

    document.body.appendChild(emoji);

    let y = -50;
    let rotate = 0;

    const fall = setInterval(() => {

        y += 4;
        rotate += 6;

        emoji.style.top = y + "px";

        emoji.style.transform =
            `rotate(${rotate}deg)`;

        if (y > window.innerHeight + 50) {

            clearInterval(fall);

            emoji.remove();

        }

    }, 16);

}

/* ==========================
   PARTY RAIN
========================== */

function startPartyRain() {

    setInterval(() => {

        for (let i = 0; i < 6; i++) {

            createEmoji();

        }

    }, 500);

}

/* ==========================
   PREMIUM MESSAGE
========================== */

function premiumMessage() {

    message.style.display = "block";

    message.animate([
        {
            transform: "scale(.4)",
            opacity: 0
        },
        {
            transform: "scale(1.15)",
            opacity: 1
        },
        {
            transform: "scale(1)"
        }
    ], {

        duration: 900,

        easing: "ease-out"

    });

}

/* ==========================
   REPLAY
========================== */

replay.onclick = () => {

    cake.classList.remove("cut");

    message.style.display = "none";

    finished = false;

    knife.style.left = "95px";
    knife.style.top = "110px";

};

/* ==========================
   UPGRADE EXISTING FUNCTIONS
========================== */

const oldConfetti = startConfetti;
const oldFireworks = startFireworks;

startConfetti = function () {

    oldConfetti();

    startPartyRain();

};

startFireworks = function () {

    oldFireworks();

    premiumMessage();

};

console.log("🎉 Premium Birthday Celebration Loaded!");
