const ctx = document.getElementById("game").getContext("2d");
const bgm = document.getElementById("bgm");
document.addEventListener("click", () => { bgm.muted=false; bgm.play(); }, { once:true });

function load(src){ const i=new Image(); i.src=src; return i; }

// ---------- images ----------
const imgs = {
  bg: load("./background.png"),
  bg2: load("./background2.png"),

  peaShooter: load("./pea.png"),
  solarpea: load("./solarpea.png"),
  beatchoy: load("./beatchoy.png"),
  bonkchoy: load("./bonkchoy.png"),
  cabbarage: load("./cabbarage.png"),
  bop: load("./bop.png"),
  mine: load("./mine.png"),
  bombtater: load("./bombtater.png"),
  lob: load("./lob.png"),
  yukon: load("./yukon.png"),
  wallnut: load("./wallnut.png"),
  hazelnut: load("./hazelnut.png"),
  sunflower: load("./sunflower.png"),
  strikehorn: load("./strikehorn.png"),
  scratchbuster: load("./scratchbuster.png"),
  quillerqueen: load("./quillerqueen.png"),
  mirror: load("./mirror.png"),

  zombie: load("./zombie.png"),
  cone: load("./cone.png"),
  bucket: load("./bucket.png"),
  imp: load("./imp.png"),

  pea: load("./pea_proj.png"),
  lobProj: load("./lob_proj.png"),
  sun: load("./sun.png"),
  boom: load("./boom.png"),

  peaShooter_packet: load("./peaShooter_packet.png"),
  solarpea_packet: load("./solarpea_packet.png"),
  beatchoy_packet: load("./beatchoy_packet.png"),
  bonkchoy_packet: load("./bonkchoy_packet.png"),
  cabbarage_packet: load("./cabbarage_packet.png"),
  bop_packet: load("./bop_packet.png"),
  mine_packet: load("./mine_packet.png"),
  bombtater_packet: load("./bombtater_packet.png"),
  lob_packet: load("./lob_packet.png"),
  yukon_packet: load("./yukon_packet.png"),
  wallnut_packet: load("./wallnut_packet.png"),
  hazelnut_packet: load("./hazelnut_packet.png"),
  sunflower_packet: load("./sunflower_packet.png"),
  strikehorn_packet: load("./strikehorn_packet.png"),
  scratchbuster_packet: load("./scratchbuster_packet.png"),
  quillerqueen_packet: load("./quillerqueen_packet.png"),
  zombie_packet: load("./zombie_packet.png"),
  cone_packet: load("./cone_packet.png"),
  bucket_packet: load("./bucket_packet.png"),
  imp_packet: load("./imp_packet.png"),
  delete_packet: load("./delete_packet.png")
};

// ---------- seed packets ----------
const seeds = [
  {type:"peaShooter", packet:"peaShooter_packet"},
  {type:"solarpea", packet:"solarpea_packet"},
  {type:"beatchoy", packet:"beatchoy_packet"},
  {type:"bonkchoy", packet:"bonkchoy_packet"},
  {type:"cabbarage", packet:"cabbarage_packet"},
  {type:"bop", packet:"bop_packet"},
  {type:"mine", packet:"mine_packet"},
  {type:"bombtater", packet:"bombtater_packet"},
  {type:"lob", packet:"lob_packet"},
  {type:"yukon", packet:"yukon_packet"},
  {type:"wallnut", packet:"wallnut_packet"},
  {type:"hazelnut", packet:"hazelnut_packet"},
  {type:"sunflower", packet:"sunflower_packet"},
  {type:"strikehorn", packet:"strikehorn_packet"},
  {type:"scratchbuster", packet:"scratchbuster_packet"},
  {type:"quillerqueen", packet:"quillerqueen_packet"},
  {type:"zombie", packet:"zombie_packet"},
  {type:"cone", packet:"cone_packet"},
  {type:"bucket", packet:"bucket_packet"},
  {type:"imp", packet:"imp_packet"},
  {type:"delete", packet:"delete_packet"}
];

let selected=null;
const ui=document.getElementById("seedbank");
seeds.forEach(seed=>{
  const img=document.createElement("img");
  img.src=imgs[seed.packet].src;
  img.onclick=()=>{
    [...ui.children].forEach(c=>c.classList.remove("selected"));
    img.classList.add("selected");
    selected=seed.type;
  };
  ui.appendChild(img);
});

let entities=[];
let currentBg="bg";
document.getElementById("changeScene").onclick=()=>{
  currentBg = currentBg==="bg" ? "bg2" : "bg";
};

// ---------- spawn ----------
function spawn(type,x,y){
  const e={type,x,y,hp:100,t:0,armed:false,vy:0};
  if(type==="cone") e.hp=250;
  if(type==="bucket") e.hp=600;
  if(type==="beatchoy") e.hp=400;
  if(type==="bonkchoy") e.hp=250;
  if(type==="cabbarage") e.hp=500;
  if(type==="bop") e.hp=150;
  if(type==="wallnut") e.hp=1200;
  if(type==="hazelnut") e.hp=600;
  if(type==="solarpea") e.hp=300;
  if(type==="sunflower") e.hp=300;
  if(type==="strikehorn") e.hp=350;
  if(type==="scratchbuster") e.hp=250;
  if(type==="quillerqueen") e.hp=300;
  if(type==="mirror"){ e.hp=100; e.isMirror=true; }
  if(type==="bombtater"){ e.hp=150; e.armed=true; e.uses=3; }
  if(type==="imp"){ e.hp=80; e.speed=60; }
  if(type==="lobProj"){ e.vy=-250; }
  entities.push(e);
}

// ---------- mouse placement ----------
document.getElementById("game").addEventListener("click", e=>{
  const rect=e.target.getBoundingClientRect();
  const x=e.clientX-rect.left, y=e.clientY-rect.top;
  if(!selected) return;
  if(selected==="delete"){
    entities=entities.filter(en=>Math.hypot(en.x-x,en.y-y)>40);
  } else {
    if(selected==="hazelnut" && currentBg!=="bg2") return;
    spawn(selected,x,y);
  }
});

// ---------- game loop ----------
function update(dt){
  for(const e of entities){
    e.t += dt;

    // pea projectile
    if(e.type==="pea"){
      e.x += 200*dt;
      for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
        if(!z.dead && Math.abs(z.y - e.y) < 30){
          z.hp -= 50; e.dead = true; break;
        }
      }
      if(e.x > 850) e.dead = true;
    }

    // lob projectile
    if(e.type==="lobProj"){
      e.x += 150*dt; e.y += e.vy*dt; e.vy += 400*dt;
      if(e.y > 550){ spawn("boom", e.x, 550); e.dead = true; }
      for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
        if(!z.dead && Math.abs(z.y - e.y) < 30){
          spawn("boom", e.x, e.y); z.hp -= 150; e.dead = true; break;
        }
      }
    }

    // zombies
    if(["zombie","cone","bucket","imp"].includes(e.type)){
      if(e.fling){
        e.x += e.vx*dt; e.vx *= 0.95;
        if(e.x > 900 || e.hp <= 0) e.dead = true;
        continue;
      }
      let collidingPlant = entities.find(p =>
        ["peaShooter","solarpea","beatchoy","bonkchoy","cabbarage","bop","mine",
         "bombtater","lob","yukon","wallnut","hazelnut","sunflower","strikehorn",
         "scratchbuster","quillerqueen"].includes(p.type) &&
        !p.dead && Math.abs(p.x - e.x) < 35 && Math.abs(p.y - e.y) < 40
      );
      if(collidingPlant){
        e.eating = true;
        collidingPlant.hp -= 20*dt;
        if(collidingPlant.hp <= 0) collidingPlant.dead = true;
      } else {
        e.eating = false;
        const speed = e.type==="imp"? e.speed : (e.type==="zombie"?30:(e.type==="cone"?28:25));
        e.x -= speed*dt;
      }
      if(e.hp <= 0) e.dead = true;
    }

    // sunflower
    if(e.type==="sunflower" && e.t >= 10){ e.t=0; spawn("sun", e.x, e.y-40); }

    // solarpea
    if(e.type==="solarpea"){
      const laneHasZ = entities.some(z=>["zombie","cone","bucket","imp"].includes(z.type) && !z.dead && Math.abs(z.y - e.y) < 30);
      if(laneHasZ && e.t >= 2){ e.t=0; spawn("pea", e.x+20, e.y); spawn("sun", e.x, e.y-40); }
    }

    // peashooter
    if(e.type==="peaShooter"){
      const laneHasZ = entities.some(z=>["zombie","cone","bucket","imp"].includes(z.type) && !z.dead && Math.abs(z.y - e.y) < 30);
      if(laneHasZ && e.t >= 2){ e.t=0; spawn("pea", e.x+20, e.y); }
    }

    // lob shooter
    if(e.type==="lob"){
      const laneHasZ = entities.some(z=>["zombie","cone","bucket","imp"].includes(z.type) && !z.dead && Math.abs(z.y - e.y) < 30);
      if(laneHasZ && e.t >= 3){ e.t=0; spawn("lobProj", e.x, e.y); }
    }

    // strikehorn
    if(e.type==="strikehorn" && e.t > 1){
      e.t=0;
      for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
        if(!z.dead && Math.abs(z.x - e.x) < 55 && Math.abs(z.y - e.y) < 30){ z.hp -= 120; }
      }
    }
    if(e.type==="strikehorn" && e.hp <= 0 && !e.cloned){
      spawn("strikehorn", e.x+40, e.y); e.cloned = true;
      entities.push({type:"flash",x:e.x,y:e.y,t:0});
      e.dead = true;
    }

    // scratchbuster
    if(e.type==="scratchbuster" && e.t > 3){
      e.t=0;
      for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
        if(!z.dead && Math.abs(z.x - e.x) < 60 && Math.abs(z.y - e.y) < 30){
          z.fling = true; z.vx = 200;
        }
      }
    }

    // quillerqueen
    if(e.type==="quillerqueen" && e.t > 5){
      e.t=0;
      for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
        if(!z.dead && Math.abs(z.y - e.y) < 30){ spawn("mirror", z.x-40, z.y); }
      }
    }

    // mirror
    if(e.type==="mirror"){
      e.x += 60*dt;
      for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
        if(!z.dead && Math.abs(z.x - e.x) < 25 && Math.abs(z.y - e.y) < 30){
          z.hp -= 100; e.dead = true; break;
        }
      }
    }

    // flash effect
    if(e.type==="flash"){
      e.t+=dt; if(e.t>0.5) e.dead=true;
    }
  }

  // explosions
  for(const boom of entities.filter(e=>e.type==="boom")){
    for(const z of entities.filter(z=>["zombie","cone","bucket","imp"].includes(z.type))){
      if(!z.dead && Math.hypot(z.x - boom.x, z.y - boom.y) < 80){ z.hp -= 999; }
    }
    boom.t += dt; if(boom.t > 0.5) boom.dead = true;
  }

  entities = entities.filter(e=>!e.dead);
}

// ---------- draw ----------
function draw(){
  ctx.drawImage(imgs[currentBg],0,0,2048,1024,0,0,850,600);
  for(const e of entities){
    const img = imgs[e.type];
    if(e.type==="flash"){ 
      ctx.fillStyle="rgba(255,255,0,"+(1-e.t*2)+")";
      ctx.beginPath(); ctx.arc(e.x,e.y,40,0,Math.PI*2); ctx.fill();
      continue;
    }
    if(img && img.complete && img.naturalWidth){
      if(["zombie","cone","bucket"].includes(e.type)){
        ctx.drawImage(img,e.x-32,e.y-48,64,96);
      } else if(e.type==="imp"){
        ctx.drawImage(img,e.x-20,e.y-20,40,40);
      } else if(e.type==="bop"){
        ctx.drawImage(img,e.x-24,e.y-24,48,48);
      } else if(e.type==="mirror"){
        ctx.save(); ctx.shadowColor="purple"; ctx.shadowBlur=15;
        ctx.drawImage(img,e.x-24,e.y-24,48,48);
        ctx.restore();
      } else {
        ctx.drawImage(img,e.x-32,e.y-32,64,64);
      }
    } else {
      ctx.fillStyle="red"; ctx.fillRect(e.x-10,e.y-10,20,20);
    }
  }
}

// ---------- loop ----------
let last=0;
function loop(ts){
  const dt=(ts-last)/1000; last=ts;
  update(dt); draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
