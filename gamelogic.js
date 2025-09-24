const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const bgm = document.getElementById("bgm");
document.addEventListener("click", () => { bgm.muted = false; bgm.play(); }, { once: true });

function load(src) { const i = new Image(); i.src = src; return i; }

// ---------- style control ----------
let currentStyle = "purple";
function setStyle(style) {
  currentStyle = style;
  refreshSeedbank();
}

// ---------- images ----------
const imgs = {
  bg: load("./background.png"),
  bg2: load("./background2.png"),

  // styled units
  peaShooter: load("./pea.png"),
  wallnut: load("./wallnut.png"),
  zombie: load("./zombie.png"),

  peaShooter_pink: load("./peaShooter_pink.png"),
  peaShooter_green: load("./peaShooter_green.png"),
  peaShooter_3d: load("./peaShooter_3d.png"),

  wallnut_pink: load("./wallnut_pink.png"),
  wallnut_green: load("./wallnut_green.png"),
  wallnut_3d: load("./wallnut_3d.png"),

  zombie_pink: load("./zombie_pink.png"),
  zombie_green: load("./zombie_green.png"),
  zombie_3d: load("./zombie_3d.png"),

  // styled packets
  peaShooter_packet: load("./peaShooter_packet.png"),
  peaShooter_packet_pink: load("./peaShooter_packet_pink.png"),
  peaShooter_packet_green: load("./peaShooter_packet_green.png"),
  peaShooter_packet_3d: load("./peaShooter_packet_3d.png"),

  wallnut_packet: load("./wallnut_packet.png"),
  wallnut_packet_pink: load("./wallnut_packet_pink.png"),
  wallnut_packet_green: load("./wallnut_packet_green.png"),
  wallnut_packet_3d: load("./wallnut_packet_3d.png"),

  zombie_packet: load("./zombie_packet.png"),
  zombie_packet_pink: load("./zombie_packet_pink.png"),
  zombie_packet_green: load("./zombie_packet_green.png"),
  zombie_packet_3d: load("./zombie_packet_3d.png"),

  // plants
  solarpea: load("./solarpea.png"),
  beatchoy: load("./beatchoy.png"),
  bonkchoy: load("./bonkchoy.png"),
  cabbarage: load("./cabbarage.png"),
  bop: load("./bop.png"),
  mine: load("./mine.png"),
  yukon: load("./yukon.png"),
  bombtater: load("./bombtater.png"),
  lob: load("./lob.png"),
  hazelnut: load("./hazelnut.png"),
  sunflower: load("./sunflower.png"),
  strikehorn: load("./strikehorn.png"),
  scratchbuster: load("./scratchbuster.png"),
  quillerqueen: load("./quillerqueen.png"),
  // zombies
  cone: load("./cone.png"),
  bucket: load("./bucket.png"),
  imp: load("./imp.png"),

  // projectiles
  pea: load("./pea_proj.png"),
  lobProj: load("./lob_proj.png"),
  sun: load("./sun.png"),
  boom: load("./boom.png"),

  // packets
  solarpea_packet: load("./solarpea_packet.png"),
  beatchoy_packet: load("./beatchoy_packet.png"),
  bonkchoy_packet: load("./bonkchoy_packet.png"),
  cabbarage_packet: load("./cabbarage_packet.png"),
  bop_packet: load("./bop_packet.png"),
  mine_packet: load("./mine_packet.png"),
  yukon_packet: load("./yukon_packet.png"),
  bombtater_packet: load("./bombtater_packet.png"),
  lob_packet: load("./lob_packet.png"),
  hazelnut_packet: load("./hazelnut_packet.png"),
  sunflower_packet: load("./sunflower_packet.png"),
  strikehorn_packet: load("./strikehorn_packet.png"),
  scratchbuster_packet: load("./scratchbuster_packet.png"),
  quillerqueen_packet: load("./quillerqueen_packet.png"),
  cone_packet: load("./cone_packet.png"),
  bucket_packet: load("./bucket_packet.png"),
  imp_packet: load("./imp_packet.png"),
  delete_packet: load("./delete_packet.png")
};

// ---------- style resolver ----------
function getStyledImage(e, isPacket = false) {
  let base = e.type;
  if (["peaShooter", "wallnut", "zombie"].includes(base)) {
    let suffix = isPacket ? "_packet" : "";
    if (currentStyle === "pink") return imgs[base + suffix + "_pink"] || imgs[base + suffix] || imgs[base];
    if (currentStyle === "green") return imgs[base + suffix + "_green"] || imgs[base + suffix] || imgs[base];
    if (currentStyle === "maroon") return imgs[base + suffix + "_3d"] || imgs[base + suffix] || imgs[base];
    return imgs[base + suffix] || imgs[base];
  }
  return imgs[base + (isPacket ? "_packet" : "")] || imgs[base];
}

let entities = [];
let currentBg = "bg";

// ---------- seed bank ----------
const seeds = [
  { type: "peaShooter", packet: "peaShooter_packet" },
  { type: "solarpea", packet: "solarpea_packet" },
  { type: "beatchoy", packet: "beatchoy_packet" },
  { type: "bonkchoy", packet: "bonkchoy_packet" },
  { type: "cabbarage", packet: "cabbarage_packet" },
  { type: "bop", packet: "bop_packet" },
  { type: "mine", packet: "mine_packet" },
  { type: "yukon", packet: "yukon_packet" },
  { type: "bombtater", packet: "bombtater_packet" },
  { type: "lob", packet: "lob_packet" },
  { type: "wallnut", packet: "wallnut_packet" },
  { type: "hazelnut", packet: "hazelnut_packet" },
  { type: "sunflower", packet: "sunflower_packet" },
  { type: "strikehorn", packet: "strikehorn_packet" },
  { type: "scratchbuster", packet: "scratchbuster_packet" },
  { type: "quillerqueen", packet: "quillerqueen_packet" },
  { type: "zombie", packet: "zombie_packet" },
  { type: "cone", packet: "cone_packet" },
  { type: "bucket", packet: "bucket_packet" },
  { type: "imp", packet: "imp_packet" },
  { type: "delete", packet: "delete_packet" }
];

let selected = null;
const ui = document.getElementById("seedbank");

function refreshSeedbank() {
  [...ui.children].forEach((img, i) => {
    const seed = seeds[i];
    img.src = getStyledImage({ type: seed.type }, true).src;
  });
}

seeds.forEach(seed => {
  const img = document.createElement("img");
  img.src = getStyledImage({ type: seed.type }, true).src;
  img.onclick = () => {
    [...ui.children].forEach(c => c.classList.remove("selected"));
    img.classList.add("selected");
    selected = seed.type;
  };
  ui.appendChild(img);
});

document.getElementById("changeScene").onclick = () => {
  currentBg = currentBg === "bg" ? "bg2" : "bg";
};

// ---------- spawn ----------
function spawn(type, x, y) {
  const e = { type, x, y, hp: 100, t: 0, armed: false, vy: 0 };
  if (type === "cone") e.hp = 250;
  if (type === "bucket") e.hp = 600;
  if (type === "imp") { e.hp = 80; e.speed = 60; }
  if (type === "beatchoy") e.hp = 400;
  if (type === "bonkchoy") e.hp = 250;
  if (type === "cabbarage") e.hp = 500;
  if (type === "bop") e.hp = 150;
  if (type === "wallnut") e.hp = 1200;
  if (type === "hazelnut") e.hp = 600;
  if (type === "solarpea") e.hp = 300;
  if (type === "sunflower") e.hp = 300;
  if (type === "strikehorn") { e.hp = 350; e.clones = 0; }
  if (type === "scratchbuster") e.hp = 250;
  if (type === "quillerqueen") e.hp = 300;
  if (type === "bombtater") { e.hp = 150; e.armed = true; e.uses = 3; }
  if (type === "lobProj") e.vy = -250;
  entities.push(e);
}

// ---------- mouse placement ----------
canvas.addEventListener("click", e => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  if (!selected) return;
  if (selected === "delete") {
    entities = entities.filter(en => Math.hypot(en.x - x, en.y - y) > 40);
  } else {
    if (selected === "hazelnut" && currentBg !== "bg2") return;
    spawn(selected, x, y);
  }
});

// ---------- update ----------
function update(dt) {
  for (const e of entities) {
    e.t += dt;

    // peas
    if (e.type === "pea") {
      e.x += 200 * dt;
      for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) {
        if (!z.dead && Math.abs(z.x - e.x) < 20 && Math.abs(z.y - e.y) < 25) { z.hp -= 50; e.dead = true; }
      }
      if (e.x > canvas.width) e.dead = true;
    }

    // lobProj
    if (e.type === "lobProj") {
      e.x += 150 * dt; e.y += e.vy * dt; e.vy += 400 * dt;
      if (e.y > canvas.height - 50) { spawn("boom", e.x, canvas.height - 50); e.dead = true; }
      for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) {
        if (!z.dead && Math.abs(z.x - e.x) < 30 && Math.abs(z.y - e.y) < 40) { spawn("boom", e.x, e.y); z.hp -= 150; e.dead = true; }
      }
    }

    // zombies
    if (["zombie", "cone", "bucket", "imp"].includes(e.type)) {
      if (e.mirrored) {
        e.x += 50 * dt;
        let target = entities.find(z => ["zombie", "cone", "bucket", "imp"].includes(z.type) && !z.dead && !z.mirrored && Math.abs(z.x - e.x) < 35 && Math.abs(z.y - e.y) < 40);
        if (target) { target.hp -= 40 * dt; if (target.hp <= 0) target.dead = true; }
        if (e.x > canvas.width + 50) e.dead = true;
        continue;
      }
      let colliding = entities.find(p => ["peaShooter", "solarpea", "beatchoy", "bonkchoy", "cabbarage", "bop", "mine", "yukon", "bombtater", "lob", "wallnut", "hazelnut", "sunflower", "strikehorn", "scratchbuster", "quillerqueen"].includes(p.type) && !p.dead && Math.abs(p.x - e.x) < 35 && Math.abs(p.y - e.y) < 40);
      if (colliding) { colliding.hp -= 20 * dt; if (colliding.hp <= 0) colliding.dead = true; } else {
        const speed = e.type === "imp" ? e.speed : (e.type === "zombie" ? 30 : (e.type === "cone" ? 28 : 25));
        if (e.fling) { e.x += e.vx * dt; e.vx -= 200 * dt; if (e.vx <= 0) { delete e.fling; } } else { e.x -= speed * dt; }
      }
      if (e.hp <= 0) e.dead = true;
    }

    // shooters
    if (e.type === "peaShooter" && e.t >= 2) {
      const lane = entities.some(z => ["zombie", "cone", "bucket", "imp"].includes(z.type) && !z.dead && !z.mirrored && Math.abs(z.y - e.y) < 30);
      if (lane) { e.t = 0; spawn("pea", e.x + 20, e.y); }
    }
    if (e.type === "solarpea" && e.t >= 2) {
      const lane = entities.some(z => ["zombie", "cone", "bucket", "imp"].includes(z.type) && !z.dead && !z.mirrored && Math.abs(z.y - e.y) < 30);
      if (lane) { e.t = 0; spawn("pea", e.x + 20, e.y); spawn("sun", e.x, e.y - 40); }
    }
    if (e.type === "lob" && e.t >= 3) {
      const lane = entities.some(z => ["zombie", "cone", "bucket", "imp"].includes(z.type) && !z.dead && !z.mirrored && Math.abs(z.y - e.y) < 30);
      if (lane) { e.t = 0; spawn("lobProj", e.x, e.y); }
    }
    if (e.type === "sunflower" && e.t >= 10) { e.t = 0; spawn("sun", e.x, e.y - 40); }

    // melee plants
    if (e.type === "beatchoy" && e.t > 1) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.x - e.x) < 50 && Math.abs(z.y - e.y) < 30) z.hp -= 120; } }
    if (e.type === "bonkchoy" && e.t > 1.5) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.x - e.x) < 45 && Math.abs(z.y - e.y) < 30) z.hp -= 80; } }
    if (e.type === "cabbarage" && e.t > 2) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.x - e.x) < 55 && Math.abs(z.y - e.y) < 30) z.hp -= 150; } }
    if (e.type === "bop" && e.t > 1.2) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.x - e.x) < 40 && Math.abs(z.y - e.y) < 30) z.hp -= 60; } }
    if (e.type === "strikehorn" && e.t > 1) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.x - e.x) < 55 && Math.abs(z.y - e.y) < 30) z.hp -= 120; } }
    if (e.type === "strikehorn" && e.hp <= 0 && e.clones < 3) { const ox = (Math.random() * 120 - 60), oy = (Math.random() * 80 - 40); spawn("strikehorn", e.x + ox, e.y + oy); e.clones++; e.dead = true; }
    if (e.type === "scratchbuster" && e.t > 3) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.x - e.x) < 60 && Math.abs(z.y - e.y) < 30) { z.fling = true; z.vx = 200; } } }
    if (e.type === "quillerqueen" && e.t > 5) { e.t = 0; for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) { if (Math.abs(z.y - e.y) < 30) { z.mirrored = true; } } }

    // mines
    if (e.type === "mine" || e.type === "yukon") {
      for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) {
        if (Math.abs(z.x - e.x) < 35 && Math.abs(z.y - e.y) < 25) { spawn("boom", e.x, e.y); z.hp -= 999; e.dead = true; }
      }
      if (e.type === "yukon" && e.t > 15) { e.t = 0; spawn("sun", e.x, e.y - 40); }
    }
    if (e.type === "bombtater") {
      for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) {
        if (Math.abs(z.x - e.x) < 40 && Math.abs(z.y - e.y) < 30) { spawn("boom", e.x, e.y); z.hp -= 500; e.uses--; if (e.uses <= 0) e.dead = true; }
      }
    }
  }

  // explosions
  for (const boom of entities.filter(e => e.type === "boom")) {
    for (const z of entities.filter(z => ["zombie", "cone", "bucket", "imp"].includes(z.type))) {
      if (!z.dead && Math.hypot(z.x - boom.x, z.y - boom.y) < 80) { z.hp -= 999; }
    }
    boom.t += dt; if (boom.t > 0.5) boom.dead = true;
  }

  entities = entities.filter(e => !e.dead);
}

// ---------- draw ----------
function draw() {
  ctx.drawImage(imgs[currentBg], 0, 0, 2048, 1024, 0, 0, canvas.width, canvas.height);
  for (const e of entities) {
    const img = getStyledImage(e);
    if (img && img.complete && img.naturalWidth) {
      if (e.type === "zombie") { ctx.drawImage(img, e.x - 32, e.y - 48, 64, 96); }
      else if (e.type === "imp") { ctx.drawImage(img, e.x - 20, e.y - 20, 40, 40); }
      else if (e.type === "pea") { ctx.drawImage(img, e.x - 12, e.y - 12, 24, 24); }
      else if (e.type === "lobProj") { ctx.drawImage(img, e.x - 16, e.y - 16, 32, 32); }
      else if (e.type === "sun") { ctx.drawImage(img, e.x - 20, e.y - 20, 40, 40); }
      else if (e.type === "boom") {
  const boomImg = imgs.boom;
  if (boomImg && boomImg.complete && boomImg.naturalWidth) {
    ctx.drawImage(boomImg, e.x - 48, e.y - 48, 96, 96); // adjust size as needed
  }
}

      else { ctx.drawImage(img, e.x - 32, e.y - 32, 64, 64); }

      if (e.mirrored) { ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = "purple"; ctx.fillRect(e.x - 32, e.y - 48, 64, 96); ctx.restore(); }
    } else {
      ctx.fillStyle = "red"; ctx.fillRect(e.x - 10, e.y - 10, 20, 20);
    }
  }
}

// ---------- loop ----------
let last = 0;
function loop(ts) {
  const dt = (ts - last) / 1000; last = ts;
  update(dt); draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
