// object of screen about
const profile = {
    title: "Hello!",
    bio: "I'm mdSabry a web developer who builds sites from scratch. I'm passionate about back-end and cybersecurity, dealing with some shit .. You know",
    image: "images/me.png",
    imageAlt: "Portrait of Callmevac",
    tech: [
        { name: "HTML", icon: "images/icons/html.svg" },
        { name: "CSS", icon: "images/icons/css.svg" },
        { name: "JavaScript", icon: "images/icons/js.svg" },
        { name: "Node.js", icon: "images/icons/node.svg" },
        { name: "Express", icon: "images/icons/express.svg" },
    ],
};

// fetching about screen data
function renderProfile(data){
    const title = document.getElementById("about-title");
    title.textContent = data.title

    const bio = document.getElementById("about-bio")
    bio.textContent = data.bio

    const image = document.getElementById("aboutImage")
    image.src = data.image
}
renderProfile(profile);

// // بتاخد الداتا وترسمها. مش فارق معاها الداتا جاية منين.
// function renderProfile(data) {
//     const title = document.getElementById("about-title");
//     const bio = document.getElementById("about-bio");
//     const img = document.querySelector(".about-bg img");
//     const techList = document.getElementById("tech-list");

//     title.textContent = data.title;

//     bio.textContent = "";
//     const nameSpan = document.createElement("span");
//     nameSpan.className = "name";
//     nameSpan.textContent = data.name;
//     bio.append(data.intro, nameSpan, data.bio);

//     img.src = data.image;
//     img.alt = data.imageAlt;

//     techList.replaceChildren();
//     data.tech.forEach(function (tech) {
//         const item = document.createElement("div");
//         item.className = "tech-item";

//         const icon = document.createElement("img");
//         icon.src = tech.icon;
//         icon.alt = "";

//         const label = document.createElement("span");
//         label.textContent = tech.name;

//         item.append(icon, label);
//         techList.appendChild(item);
//     });
// }

// renderProfile(profile);

/* =====================================================
   2) التابلت المعلّق: بندول + ميل 3D + دفعة بالضغط
   ===================================================== */
function initTablet() {
    const section = document.getElementById("about");
    const tablet = section.querySelector(".tablet");
    const frame = section.querySelector(".about-bg");

    // لو الشخص مفعّل "تقليل الحركة" نسيب التابلت ثابت
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const W0 = 2.0;      // سرعة التأرجح (أكبر = أسرع)
    const DAMP = 0.35;   // الاحتكاك (أكبر = يهدى أسرع)
    const WIND = 0.8;    // نسمة خفيفة بتخليه يتحرك دايمًا
    const MAX = 28;      // أقصى زاوية بالدرجات

    let angle = 16;      // بيبدأ مايل، فيتأرجح أول ما القسم يظهر
    let vel = 0;
    let time = 0;
    let tiltX = 0, tiltY = 0;
    let targetX = 0, targetY = 0;
    let last = 0;
    let rafId = 0;

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    function draw() {
        tablet.style.transform = "rotate(" + angle + "deg)";
        frame.style.transform =
            "rotateX(" + tiltX + "deg) rotateY(" + (tiltY + angle * 0.5) + "deg)";
    }

    function step(now) {
        const dt = Math.min((now - last) / 1000, 0.032);
        last = now;
        time += dt;

        // معادلة البندول: رجوع للنص + احتكاك + نسمة
        const acc = -W0 * W0 * angle - DAMP * vel + WIND * Math.sin(time * W0);
        vel += acc * dt;
        angle = clamp(angle + vel * dt, -MAX, MAX);

        const k = Math.min(1, dt * 6);
        tiltX += (targetX - tiltX) * k;
        tiltY += (targetY - tiltY) * k;

        draw();
        rafId = requestAnimationFrame(step);
    }

    draw();

    // شغّل الحركة بس لما القسم ظاهر
    new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            last = performance.now();
            rafId = requestAnimationFrame(step);
        } else {
            cancelAnimationFrame(rafId);
        }
    }).observe(section);

    // الماوس: التابلت يميل ناحيته واللمعة تمشي معاه
    section.addEventListener("pointermove", function (e) {
        const r = frame.getBoundingClientRect();
        const nx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
        const ny = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
        targetY = nx * 10;
        targetX = -ny * 8;
        frame.style.setProperty("--gx", 50 + nx * 45 + "%");
        frame.style.setProperty("--gy", 30 + ny * 35 + "%");
    });

    function resetTilt() {
        targetX = 0;
        targetY = 0;
    }
    section.addEventListener("pointerleave", resetTilt);
    section.addEventListener("pointerup", function (e) {
        if (e.pointerType !== "mouse") resetTilt();
    });

    // الضغط على الشاشة: دفعة، واتجاهها حسب مكان الضغطة
    function push(side) {
        const dir = side === 0 ? 1 : Math.sign(side);
        vel += dir * (30 + Math.abs(side) * 25);
    }

    frame.addEventListener("click", function (e) {
        const r = frame.getBoundingClientRect();
        push((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    });

    frame.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            push(1);
        }
    });
}

initTablet();

/* =====================================================
   3) اللينك النشط في النافبار حسب القسم اللي على الشاشة
   ===================================================== */
(function highlightActiveLink() {
    const links = document.querySelectorAll("nav a[href^='#']");
    const sections = document.querySelectorAll("main section[id]");

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
                link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
            });
        });
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach(function (section) { observer.observe(section); });
})();
