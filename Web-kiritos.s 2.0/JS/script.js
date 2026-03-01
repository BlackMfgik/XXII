const langSwitch = document.getElementById("langSwitch");
if (langSwitch) {
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

document.addEventListener("DOMContentLoaded", () => {
  const second = document.querySelector(".second-image");
  if (!second) return;

  const configs = [
    { relY: 0.1, rotate: 4, repeat: 25, speed: 18, reverse: false },
    { relY: 0.62, rotate: 8, repeat: 25, speed: 22, reverse: true },
    { relY: 0.45, rotate: -6, repeat: 25, speed: 28, reverse: false },
    { relY: 0.3, rotate: 15, repeat: 25, speed: 24, reverse: true },
    { relY: 0.27, rotate: -9, repeat: 25, speed: 20, reverse: false },
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
});

const lenis = new Lenis({
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

document.addEventListener("DOMContentLoaded", () => {
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
});

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navBar = document.querySelector(".nav-bar");

  body.classList.add("stop-scrolling");

  setTimeout(() => {
    if (navBar) {
      navBar.classList.add("show");
    }

    body.classList.remove("stop-scrolling");
  }, 2500);
});

document.addEventListener("DOMContentLoaded", () => {
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

      window.scrollTo({
        top: targetPos[idx],
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", updateSideNav);
  updateSideNav(); // Запуск при старті
});
