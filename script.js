
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

VanillaTilt.init(document.querySelectorAll(".glass-card"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.5
});

gsap.timeline()
    .from('.intro h1', { y: -50, opacity: 0, duration: 1.5, ease: "power3.out" })
    .from('.intro p', { y: 50, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=1");

gsap.utils.toArray('section').forEach((section, index) => {
    gsap.from(section, {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});
