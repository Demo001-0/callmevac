const nav = document.querySelector('nav');
window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

// Toggle mobile menu
const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('nav ul');

menuBtn.addEventListener('click',function(){
    navList.classList.toggle('open');
});

// slide drawer
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(function(link){
    link.addEventListener('click' , function () {
        navList.classList.remove('open');
    })
})

document.addEventListener('click', function(event) {
    const clickedInsideMenu = navList.contains(event.target) || menuBtn.contains(event.target);
    if (!clickedInsideMenu) {
        navList.classList.remove('open');
    }
})

// play button functionality
const playBtn = document.querySelector('.play-btn');
const video = document.querySelector('.hero-video');
playBtn.addEventListener('click',function(){
    video.currentTime = 0;
    video.play();
    playBtn.style.display = 'none';
})

video.addEventListener('ended',function(){
    playBtn.style.display = '';
})

// lastScrollY variable to store the last scroll position
const header = document.querySelector('header');
let lastScrolly = window.scrollY;
window.addEventListener('scroll',function (){
    const currentY = window.scrollY;
    if (currentY > lastScrolly && currentY > 80 && !navList.classList.contains('open')){
        header.classList.add('hide');
    } else if (currentY < lastScrolly || navList.classList.contains('open')){
        header.classList.remove('hide');
    }
    lastScrolly = currentY;
})