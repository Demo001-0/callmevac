/* عمق الهيرو بالماوس:
   بنحسب مكان الماوس من -1 (شمال/فوق) لـ 1 (يمين/تحت)
   ونكتبه في --mx و --my، والـ CSS هو اللي بيحرّك الطبقات بيهم. */
(function heroDepth() {
    const hero = document.getElementById("home");
    if (!hero) return;

    // مفيش ماوس (تاتش) أو الشخص عايز حركة أقل: نسيب الهيرو ثابت
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let rafId = 0;

    function loop() {
        // بنقرّب القيمة الحالية من الهدف شوية شوية = حركة ناعمة
        curX += (targetX - curX) * 0.08;
        curY += (targetY - curY) * 0.08;
        hero.style.setProperty("--mx", curX.toFixed(3));
        hero.style.setProperty("--my", curY.toFixed(3));

        const moving = Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001;
        rafId = moving ? requestAnimationFrame(loop) : 0;
    }

    function wake() {
        if (!rafId) rafId = requestAnimationFrame(loop);
    }

    hero.addEventListener("pointermove", function (e) {
        const r = hero.getBoundingClientRect();
        targetX = ((e.clientX - r.left) / r.width) * 2 - 1;
        targetY = ((e.clientY - r.top) / r.height) * 2 - 1;
        wake();
    });

    hero.addEventListener("pointerleave", function () {
        targetX = 0;
        targetY = 0;
        wake();
    });
})();
