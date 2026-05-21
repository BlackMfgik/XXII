class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initTextScramble() {
  const container = document.querySelector(".text-about-me");
  const trigger = document.querySelector(".image-disgust");
  if (!container || !trigger) return;

  const phrase = (text, center = false, gap = false) => ({ text, center, gap });

  const phrases = [
    phrase("Hey, guys and gals.", true),
    phrase("This is Kirill, or more canonically Kiritos/Pryanik."),
    phrase("And this is the portfolio website for my project called 22."),
    phrase("I've been working in this field for over three years now,"),
    phrase("and I'm not planning on stopping."),
    phrase("My project is aimed at developing the underground scene"),
    phrase("of music covers, car posters, and other visual services"),
    phrase("for those looking for something unusual and unique."),
    phrase("Feel free to make yourself at home on this page"),
    phrase("and check out my work, listen to music, or order something."),
    phrase("I am always happy to chat with anyone who writes to me."),
    phrase("P.S. Don't forget to smile.", false, true),
  ];
  let triggered = false;

  trigger.addEventListener("click", () => {
    if (triggered) return;
    triggered = true;
    container.innerHTML = "";
    runLines(container, phrases);
  });
}

function runLines(container, phrases) {
  let cumulativeDelay = 0;

  phrases.forEach((phrase) => {
    const { text, center, gap } = phrase;
    const currentDelay = cumulativeDelay;

    if (gap) {
      setTimeout(() => {
        const spacer = document.createElement("div");
        spacer.className = "scramble-line scramble-spacer";
        container.appendChild(spacer);
      }, currentDelay);
      cumulativeDelay += 50;
    }

    setTimeout(() => {
      const line = document.createElement("div");
      line.className = "scramble-line" + (center ? " scramble-center" : "");
      container.appendChild(line);

      const fx = new TextScramble(line);
      fx.setText(text);
    }, cumulativeDelay);

    cumulativeDelay += text.length * 4;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollSpy();
  initMarquees();
  initImageAnimation();
  initNavBar();
  initLanguageSwitch();
  initLenis();
  initTextScramble();
});

function initLenis() {
  lenis = new Lenis({
    duration: 3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initScrollSpy() {
  const sideNav = document.querySelector(".scroll-spy");
  const starBtns = document.querySelectorAll(".scroll-spy-star");
  const secondImage = document.querySelector(".second-image");
  const thirdImage = document.querySelector(".third-image");

  if (!sideNav || !secondImage || !thirdImage) return;

  function updateSideNav() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const startTrigger = secondImage.offsetTop - windowHeight / 2;
    const endTrigger =
      thirdImage.offsetTop + thirdImage.offsetHeight - windowHeight / 2;

    if (scrollY >= startTrigger && scrollY <= endTrigger) {
      sideNav.classList.add("visible");
    } else {
      sideNav.classList.remove("visible");
    }

    const currentPoint = scrollY + windowHeight / 2;
    const vPage = secondImage.offsetHeight / 3;
    const positions = [
      secondImage.offsetTop,
      secondImage.offsetTop + vPage * 2,
      thirdImage.offsetTop,
    ];

    let activeIndex = -1;
    positions.forEach((pos, index) => {
      if (currentPoint >= pos - 50) {
        activeIndex = index;
      }
    });

    starBtns.forEach((btn, index) => {
      btn.classList.toggle("active", index === activeIndex);
    });
  }

  starBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-index");
      const vPage = secondImage.offsetHeight / 3;
      const targetPos = [
        secondImage.offsetTop,
        secondImage.offsetTop + vPage * 2,
        thirdImage.offsetTop,
      ];

      btn.classList.add("rotating");
      setTimeout(() => {
        btn.classList.remove("rotating");
      }, 600);
      if (lenis) {
        lenis.scrollTo(targetPos[idx], {
          duration: 1.5,
        });
      } else {
        window.scrollTo({
          top: targetPos[idx],
          behavior: "smooth",
        });
      }
    });
  });

  window.addEventListener("scroll", updateSideNav);
  window.addEventListener("resize", updateSideNav);
  updateSideNav();
}

function initMarquees() {
  const second = document.querySelector(".second-image");
  if (!second) return;

  const configs = [
    { relY: 0.1, rotate: 4, repeat: 6, speed: 49, reverse: false },
    { relY: 0.62, rotate: 8, repeat: 6, speed: 48, reverse: true },
    { relY: 0.45, rotate: -6, repeat: 6, speed: 44, reverse: false },
    { relY: 0.3, rotate: 15, repeat: 6, speed: 44, reverse: true },
    { relY: 0.27, rotate: -9, repeat: 6, speed: 40, reverse: false },
  ];

  const baseText = " inc.xxii inc.xxii inc.xxii inc.xxii inc.xxii ";

  function createMarquees() {
    document.querySelectorAll(".dyn-marquee").forEach((n) => n.remove());
    const rect = second.getBoundingClientRect();
    const offsetY = window.scrollY || window.pageYOffset;

    configs.forEach((c) => {
      const m = document.createElement("div");
      m.className = "dyn-marquee";
      m.style.position = "absolute";
      m.style.width = "150vw";
      m.style.left = "50%";
      m.style.top = rect.top + offsetY + rect.height * c.relY + "px";
      m.style.transform = `translateX(-50%) rotate(${c.rotate}deg)`;
      m.style.overflow = "hidden";
      m.style.pointerEvents = "none";
      m.style.zIndex = "2";

      const content = document.createElement("div");
      content.className = "dyn-marquee-content";
      content.style.animationName = c.reverse ? "scroll-right" : "scroll-left";
      content.style.animationDuration = `${c.speed}s`;
      content.style.animationTimingFunction = "linear";
      content.style.animationIterationCount = "infinite";
      content.style.display = "inline-flex";
      content.style.whiteSpace = "nowrap";
      content.style.willChange = "transform";

      const textSpan = document.createElement("span");
      textSpan.textContent = baseText.repeat(c.repeat);
      content.appendChild(textSpan);
      content.appendChild(textSpan.cloneNode(true));
      m.appendChild(content);
      document.body.appendChild(m);
    });
  }

  createMarquees();
  window.addEventListener("resize", createMarquees);
}

function initImageAnimation() {
  const loxImage = document.querySelector(".image-disgust");

  if (loxImage) {
    loxImage.addEventListener("mouseenter", () => {
      const randomScale = 1.02 + Math.random() * 0.03;
      const randomRotate = Math.floor(Math.random() * 11) - 5;
      loxImage.style.transform = `translate(-50%, -50%) scale(${randomScale}) rotate(${randomRotate}deg)`;
    });

    loxImage.addEventListener("mouseleave", () => {
      loxImage.style.transform = `translate(-50%, -50%) scale(1) rotate(0deg)`;
    });
  }
}

function initNavBar() {
  const body = document.body;
  const navBar = document.querySelector(".nav-bar");

  body.classList.add("stop-scrolling");

  setTimeout(() => {
    if (navBar) {
      navBar.classList.add("show");
    }
    body.classList.remove("stop-scrolling");
  }, 2500);
}

function initLanguageSwitch() {
  const langSwitch = document.getElementById("langSwitch");
  if (!langSwitch) return;

  const currentLangSpan = langSwitch.querySelector(".current-lang");
  const langOptions = langSwitch.querySelectorAll(".lang-list li");

  function updateListVisibility(selectedValue) {
    langOptions.forEach((opt) => {
      if (opt.dataset.value === selectedValue) {
        opt.classList.add("selected-hidden");
      } else {
        opt.classList.remove("selected-hidden");
      }
    });
  }

  updateListVisibility("eng");

  langSwitch.addEventListener("click", (e) => {
    langSwitch.classList.toggle("open");
    e.stopPropagation();
  });

  langOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = option.dataset.value;
      if (currentLangSpan) currentLangSpan.innerText = val.toUpperCase();
      updateListVisibility(val);
      langSwitch.classList.remove("open");
    });
  });

  document.addEventListener("click", () => {
    langSwitch.classList.remove("open");
  });
}
