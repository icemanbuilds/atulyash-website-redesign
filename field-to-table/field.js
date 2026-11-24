const stage = document.querySelector(".stage");
const journey = document.querySelector(".journey");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const landscape = stage.querySelector(".landscape");
const pouch = stage.querySelector(".pouch");
const stations = [...stage.querySelectorAll(".vignette")];
const row = stage.querySelector(".crop-row");

const clamp = value => Math.min(1, Math.max(0, value));
function smooth(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

// Positions are fixed in the field. Scrolling changes camera distance.
const plants = [];
function layOutWheat() {
  if (plants.length) return;
  for (let n = 0; n < 26; n++) {
    const side = n % 2 ? 1 : -1;
    const stalk = new Image();
    stalk.alt = "";
    stalk.src = "images/wheat-clump.webp";
    stalk.style.filter = "brightness(" + (.65 + .23 * Math.abs(Math.sin(n * 4))) + ")";
    row.append(stalk);
    plants.push({
      stalk, side, depth: 3.2 - n * .37,
      lateral: .47 + .26 * Math.abs(Math.sin(n * 2.9)),
      height: .35 + .24 * Math.abs(Math.sin(n * 1.7)),
      lean: side * (3 + 9 * Math.sin(n * 3.7))
    });
  }
}

let pending = false;
function render() {
  pending = false;
  if (reduced.matches) return;
  layOutWheat();
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const travel = 5.4;
  const fraction = clamp(-journey.getBoundingClientRect().top /
    Math.max(1, journey.offsetHeight - document.documentElement.clientHeight));
  const camera = fraction * travel;
  const chapter = fraction * 3;
  const horizon = height * .405;
  const centre = width * .62;
  const sway = Math.sin(fraction * Math.PI) * .055;

  // The cottage is far away. Nearby objects obey the same perspective
  // projection but cover much more screen space over the same camera travel.
  landscape.style.transform = "scale(" + (1.075 * 90 / (90 + camera)) + ")";
  const packRatio = 1.48 / (1.48 + camera);
  const packX = (centre - (pouch.offsetLeft + pouch.offsetWidth / 2)) * (1 - packRatio);
  const packY = (horizon - (pouch.offsetTop + pouch.offsetHeight)) * (1 - packRatio);
  pouch.style.transform = `translate3d(${packX}px,${packY}px,0) scale(${packRatio}) rotate(4deg)`;
  pouch.style.opacity = 1 - smooth((chapter - .6) / .6);

  stations.forEach((plane, i) => {
    const offset = chapter - i - 1;
    const distance = 2.5 + offset * 1.8;
    const scale = 2.5 / Math.max(.5, distance);
    plane.style.transform = `translate3d(0,${(scale - 1) * height * .14}px,0) scale(${scale})`;
    plane.style.opacity = smooth((offset + .93) / .66) *
      (i === 2 ? 1 : 1 - smooth((offset - .16) / .84));
  });

  for (const plant of plants) {
    const depth = plant.depth + camera;
    if (depth < .43 || depth > 4.2) {
      plant.stalk.style.visibility = "hidden";
      continue;
    }
    const baseX = centre + (plant.side * plant.lateral - sway) * width / depth;
    const baseY = horizon + .99 * height / depth;
    const size = plant.height * height / depth;
    const scale = size / 240;
    plant.stalk.style.visibility = "visible";
    plant.stalk.style.opacity = smooth((4.2 - depth) / 1.65);
    plant.stalk.style.transform = `translate3d(${baseX - 80}px,${baseY - 240}px,0) rotate(${plant.lean}deg) scale(${plant.side * scale},${scale})`;
  }
}
function schedule() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(render);
}
addEventListener("scroll", schedule, {passive:true});
addEventListener("resize", schedule);
addEventListener("pageshow", schedule);
reduced.addEventListener("change", schedule);
render();
