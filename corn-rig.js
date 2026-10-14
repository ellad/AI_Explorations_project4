/* A continuous strip mesh bends the original stalk pixels. Adjacent strips
   share edge offsets, keeping the stem connected and the base stationary. */
class CornRig {
  constructor(stalks, canMove, onMotion = () => {}) {
    this.canMove = canMove;
    this.onMotion = onMotion;
    this.frameId = 0;
    this.lastTime = null;
    this.rigs = stalks.map((element, index) => this.build(element, index));
    this.tick = this.tick.bind(this);
  }

  build(element, index) {
    const svg = element.ownerSVGElement;
    const defs = svg.querySelector("defs");
    const top = Number(element.dataset.top);
    const base = Number(element.dataset.base);
    const count = 20;
    const height = (base - top) / count;
    const bands = [];
    const create = (name, attributes = {}) => {
      const node = document.createElementNS("http://www.w3.org/2000/svg", name);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };

    element.replaceChildren();
    for (let i = 0; i < count; i += 1) {
      const y = top + height * i;
      const id = `corn-band-${index}-${i}`;
      const clip = create("clipPath", { id, clipPathUnits: "userSpaceOnUse" });
      // A small overlap covers raster anti-aliasing at shared mesh edges.
      clip.append(create("rect", { x: 0, y: y - .2, width: 941, height: height + .4 }));
      defs.append(clip);
      const bone = create("g");
      const strip = create("g", { "clip-path": `url(#${id})` });
      strip.append(create("use", { href: "#original-art", "clip-path": `url(#${element.dataset.cutout})` }));
      bone.append(strip);
      element.append(bone);
      bands.push({ bone, y });
    }

    return { element, top, base, height, bands, phase: index * .8, stem: 0, stemVelocity: 0, leaf: 0, leafVelocity: 0 };
  }

  start() {
    if (!this.frameId) this.frameId = requestAnimationFrame(this.tick);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.lastTime = null;
  }

  tick(now) {
    const dt = this.lastTime === null ? 0 : Math.min((now - this.lastTime) / 1000, .025);
    this.lastTime = now;
    if (this.canMove()) {
      this.rigs.forEach((rig) => this.update(rig, dt));
      const active = this.rigs.findIndex((rig) => rig.element.classList.contains("is-active"));
      const remainingMotion = this.rigs.map((rig) => Math.max(
        Math.abs(rig.stem), Math.abs(rig.leaf),
        Math.abs(rig.stemVelocity) * .02, Math.abs(rig.leafVelocity) * .02
      ));
      const settling = remainingMotion.indexOf(Math.max(...remainingMotion));
      this.onMotion(active >= 0 ? active : remainingMotion[settling] > .2 ? settling : -1);
    }
    this.frameId = requestAnimationFrame(this.tick);
  }

  update(rig, dt) {
    rig.phase += dt;
    const active = rig.element.classList.contains("is-active");
    // Uneven gusts, rather than constant metronomic rotation.
    const gust = Math.sin(rig.phase * 8.5) + .3 * Math.sin(rig.phase * 14.3);
    const target = active ? gust * 16.15 : 0;
    rig.stemVelocity += ((target - rig.stem) * 125 - rig.stemVelocity * 15) * dt;
    rig.stem += rig.stemVelocity * dt;
    // Softer secondary spring follows the stem with visible delay.
    rig.leafVelocity += ((rig.stem - rig.leaf) * 65 - rig.leafVelocity * 10) * dt;
    rig.leaf += rig.leafVelocity * dt;

    const offset = (y) => {
      const p = Math.max(0, Math.min(1, (rig.base - y) / (rig.base - rig.top)));
      return rig.stem * p * p + (rig.leaf - rig.stem) * Math.sin(p * Math.PI) * p;
    };

    rig.bands.forEach(({ bone, y }) => {
      const a = offset(y);
      const b = offset(y + rig.height);
      const slope = (b - a) / rig.height;
      bone.setAttribute("transform", `matrix(1 0 ${slope.toFixed(6)} 1 ${(a - slope * y).toFixed(5)} 0)`);
    });
  }
}
