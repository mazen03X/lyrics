// animation.js

const animationPresets = {
  calm: () => {
    gsap.to(window.currentLineMesh.scale, {
      x: 1.05,
      y: 1.05,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  },

  energetic: () => {
    gsap.to(window.currentLineMesh.rotation, {
      y: "+=" + Math.PI * 2,
      duration: 2,
      repeat: -1,
      ease: "power2.inOut"
    });
    gsap.to(window.currentLineMesh.position, {
      y: 0.5,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "bounce.out"
    });
  },

  wavey: () => {
    if (window.currentLineMesh) {
      window.currentLineMesh.children.forEach((child, i) => {
        if (child.isMesh && child.userData.type === "preview") {
          gsap.to(child.position, {
            x: 0.5,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.2
          });
        }
      });
    }
  },

  neonGlow: () => {
    if (window.currentLineMesh) {
      window.currentLineMesh.children.forEach(child => {
        if (child.isMesh) {
          gsap.to(child.material.color, {
            r: 0,
            g: 1,
            b: 1,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        }
      });
    }
  }
};


let activeTweens = [];

window.setPreset = (name) => {
  // kill old tweens
  activeTweens.forEach(t => t.kill());
  activeTweens = [];

  if (animationPresets[name]) {
    animationPresets[name]();
    // GSAP automatically registers tweens, but you can track them if needed
    activeTweens = gsap.globalTimeline.getChildren();
  }
};

window.clearPresets = () => {
  activeTweens.forEach(t => t.kill());
  activeTweens = [];
};