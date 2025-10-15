// script.js
// 全ロジック：メインミッション5段階 + 通常12問一覧 + story typewriter + video control
// 直接編集しやすいように、テキストは下の変数をいじってください。

/* ---------------------------
   データ（ここを直接編集してください）
   --------------------------- */
const NORMAL_MISSIONS = [
  { id:0, text:"光の魔法を唱えよ", answer:"ルミナス", point:10 },
  { id:1, text:"風を操る言葉を思い出せ", answer:"ゼフィール", point:8 },
  { id:2, text:"水の精霊に呼びかけよ", answer:"アクアリス", point:7 },
  { id:3, text:"炎を灯す呪文を言え", answer:"イグナイト", point:9 },
  { id:4, text:"時間を止める言葉", answer:"クロノス", point:12 },
  { id:5, text:"運命の輪を回せ", answer:"フォーチュナ", point:11 },
  { id:6, text:"闇を払う祈りを唱えよ", answer:"ノクス", point:10 },
  { id:7, text:"真実の扉を開ける鍵", answer:"ヴェリタス", point:13 },
  { id:8, text:"夢の守護者の名を答えよ", answer:"ソムニア", point:8 },
  { id:9, text:"星々の歌を知る者", answer:"ステラ", point:9 },
  { id:10, text:"心の声を形にせよ", answer:"アニマ", point:10 },
  { id:11, text:"最後の試練を越えよ", answer:"アルカナ", point:15 }
];

// Main mission stage1 five minis (edit answers here)
const MAIN_STAGE1 = [
  { id:"m1_0", text:"第1問：古の記号A", answer:"アルファ", point:5 },
  { id:"m1_1", text:"第2問：古の記号B", answer:"ベータ", point:5 },
  { id:"m1_2", text:"第3問：古の記号C", answer:"ガンマ", point:5 },
  { id:"m1_3", text:"第4問：古の記号D", answer:"デルタ", point:5 },
  { id:"m1_4", text:"第5問：古の記号E", answer:"イプシロン", point:5 }
];

// Story blocks (editable)
const STORY_INTRO = `こんにちは諸君、こちらは魔道研究会。
私たちの研究会では異世界の生き物について色々語る至って普通の研究会だった。……この間までは。
実は先日、熱意のあるものが異世界の生き物を呼び出してしまい、本当に大阪芸大に異世界の生き物が召喚されてしまったのだ。
そんな時にちょうど学園祭が行われることになったので大阪芸大周遊謎と銘打って、頭の良い君たちに助けを求めたのだ。
`;

const AFTER_STAGE1 = `異界の気配が濃くなった。次の手がかりは古い書物にあるという。キーワードを見つけよ。`;
const AFTER_STAGE2 = `書物の文字が光る。扉が少しだけ開いた。さらに進め。`;
const AFTER_STAGE3 = `深淵の囁きが響く。核心が近い。最後の鍵をつかめ。`;
const AFTER_STAGE4 = `映像の中に、最後の手がかりが隠されていた。最終段階へ進め。`;
const AFTER_STAGE5 = `君たちの活躍により、世界は安定した。ミッションコンプリート！`;

/* -------------- localStorage keys -------------- */
const TOTAL_KEY = "total_score";
const NORMAL_SOLVED_PREFIX = "norm_";
const MAIN_STAGE_KEY = "main_stage"; // 1..5
const MAIN_STAGE1_FLAGS = "main_stage1_flags";
const MAIN_STAGE_SOLVED_PREFIX = "main_stage_solved_"; // e.g. main_stage_solved_2 true

/* -------------- helper functions -------------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function getTotal(){ const v = parseInt(localStorage.getItem(TOTAL_KEY)); return Number.isNaN(v)?0:v }
function setTotal(v){ localStorage.setItem(TOTAL_KEY, String(v)); renderTotal() }
function addTotal(delta){ setTotal(getTotal() + Number(delta)) }
function isNormSolved(id){ return localStorage.getItem(NORMAL_SOLVED_PREFIX + id) === "true" }
function markNormSolved(id){ localStorage.setItem(NORMAL_SOLVED_PREFIX + id, "true") }

function getMainStage(){ const s = parseInt(localStorage.getItem(MAIN_STAGE_KEY)); return Number.isNaN(s)?1:s }
function setMainStage(n){ localStorage.setItem(MAIN_STAGE_KEY, String(n)); renderStage() }

function getStage1Flags(){ try{ return JSON.parse(localStorage.getItem(MAIN_STAGE1_FLAGS)) || {} }catch(e){ return {} } }
function setStage1Flag(key, val){ const flags = getStage1Flags(); flags[key] = val; localStorage.setItem(MAIN_STAGE1_FLAGS, JSON.stringify(flags)); }

// check if all stage1 flags true
function isStage1AllSolved(){ const flags = getStage1Flags(); return MAIN_STAGE1.every(m => flags[m.id] === true) }

/* -------------- render functions -------------- */
function renderTotal(){
  const el = $("#totalScore");
  el.textContent = `合計得点：${getTotal()}点`;
}
function renderNormalMissions(){
  const grid = $("#missionGrid");
  grid.innerHTML = "";
  NORMAL_MISSIONS.forEach(m=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>ミッション ${m.id + 1}</h3>
        <p>${m.text}</p>
      </div>
      <div class="meta">
        <div class="point">${m.point} 点</div>
        <div style="display:flex; gap:8px; align-items:center">
          <div id="norm_done_${m.id}">${ isNormSolved(m.id) ? "✅ 正解済" : "" }</div>
          <button class="btn challenge-btn" data-id="${m.id}" style="padding:8px 10px; min-height:40px">挑戦</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  // attach
  $$(".challenge-btn").forEach(b=>{
    b.addEventListener("click", ()=> {
      const id = b.getAttribute("data-id");
      location.href = `mission.html?id=${encodeURIComponent(id)}`;
    });
  });
}

/* -------------- Main stage render -------------- */
function renderStage(){
  const area = document.getElementById("stageArea");
  const badge = document.getElementById("stageBadge");
  const s = getMainStage();
  badge.textContent = `Stage ${s}`;
  area.innerHTML = ""; // clear
  if(s === 1) renderStage1();
  else if(s === 2) renderStage2();
  else if(s === 3) renderStage3();
  else if(s === 4) renderStage4();
  else if(s === 5) renderStage5();
}

/* Stage1: 5 mini problems */
function renderStage1(){
  const container = document.createElement("div");
  container.className = "stage";
  container.innerHTML = `<h3>メインミッション 第1段階 — 封印を解け</h3><div class="desc">以下の5つの言葉を正しく入力してください。全て正解で次の段階へ進みます。</div>`;
  const miniGrid = document.createElement("div"); miniGrid.className = "mini-grid";
  const flags = getStage1Flags();
  MAIN_STAGE1.forEach(m=>{
    const box = document.createElement("div");
    box.className = "mini";
    box.innerHTML = `
      <div style="font-weight:700">${m.text}</div>
      <div>得点: ${m.point} 点</div>
      <input id="in_${m.id}" placeholder="合言葉を入力" style="margin-top:8px;padding:8px;border-radius:8px;border:none;background:rgba(255,255,255,0.04);color:#fff">
      <div style="display:flex; gap:8px; margin-top:8px; align-items:center">
        <button data-id="${m.id}" class="mini-check" style="padding:8px 10px; min-height:40px">判定</button>
        <div id="mini_res_${m.id}">${ flags[m.id] ? "✅ 正解済" : "" }</div>
      </div>
    `;
    miniGrid.appendChild(box);
  });
  container.appendChild(miniGrid);
  area.appendChild(container);

  // attach handlers
  $$(".mini-check").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-id");
      const m = MAIN_STAGE1.find(x=>x.id === id);
      const val = document.getElementById("in_"+id).value.trim();
      const resEl = document.getElementById("mini_res_"+id);
      if(val === m.answer){
        // award once
        const flags = getStage1Flags();
        if(!flags[id]){
          addTotal(m.point);
        }
        setStage1Flag(id, true);
        resEl.textContent = "✅ 正解済";
        // if all solved -> play story and advance
        if(isStage1AllSolved()){
          playStorySequence([AFTER_STAGE1], ()=> setMainStage(2));
        }
      } else {
        resEl.textContent = "何かが違うようです。";
        setTimeout(()=>{ const flags2 = getStage1Flags(); if(!flags2[id]) resEl.textContent = "" }, 1500);
      }
    });
  });
}

/* Stage2: keyword input */
function renderStage2(){
  const cont = document.createElement("div"); cont.className = "stage";
  cont.innerHTML = `
    <h3>メインミッション 第2段階 — 古書の謎</h3>
    <div class="desc">古書に書かれたキーワードを入力してください。</div>
    <div style="margin-top:10px">
      <div class="kinput"><input id="kw2" placeholder="キーワードを入力"><button id="kw2Btn">判定</button></div>
      <div id="kw2Res" style="margin-top:8px;color:#ffd6d6"></div>
    </div>
  `;
  document.getElementById("stageArea").appendChild(cont);
  // handler
  $("#kw2Btn").addEventListener("click", ()=>{
    const val = $("#kw2").value.trim();
    const CORRECT = "オルバス"; // 編集可
    if(val === CORRECT){
      if(!localStorage.getItem(MAIN_STAGE_SOLVED_PREFIX + "2")){
        addTotal(25);
        localStorage.setItem(MAIN_STAGE_SOLVED_PREFIX + "2","true");
      }
      playStorySequence([AFTER_STAGE2], ()=> setMainStage(3));
    } else {
      $("#kw2Res").textContent = "何かが違うようです。";
      setTimeout(()=> $("#kw2Res").textContent = "", 1500);
    }
  });
}

/* Stage3 */
function renderStage3(){
  const cont = document.createElement("div"); cont.className = "stage";
  cont.innerHTML = `
    <h3>メインミッション 第3段階 — 深淵の囁き</h3>
    <div class="desc">短いキーワードを入力してください。</div>
    <div style="margin-top:10px">
      <div class="kinput"><input id="kw3" placeholder="キーワードを入力"><button id="kw3Btn">判定</button></div>
      <div id="kw3Res" style="margin-top:8px;color:#ffd6d6"></div>
    </div>
  `;
  document.getElementById("stageArea").appendChild(cont);
  $("#kw3Btn").addEventListener("click", ()=>{
    const val = $("#kw3").value.trim();
    const CORRECT = "ルミア"; // 編集可
    if(val === CORRECT){
      if(!localStorage.getItem(MAIN_STAGE_SOLVED_PREFIX + "3")){
        addTotal(30);
        localStorage.setItem(MAIN_STAGE_SOLVED_PREFIX + "3","true");
      }
      playStorySequence([AFTER_STAGE3], ()=> setMainStage(4));
    } else {
      $("#kw3Res").textContent = "何かが違うようです。";
      setTimeout(()=> $("#kw3Res").textContent = "", 1500);
    }
  });
}

/* Stage4: keyword -> play local video -> then advance */
function renderStage4(){
  const cont = document.createElement("div"); cont.className = "stage";
  cont.innerHTML = `
    <h3>メインミッション 第4段階 — 映像の解読</h3>
    <div class="desc">キーワードを入力すると特別な映像が再生されます。</div>
    <div style="margin-top:10px">
      <div class="kinput"><input id="kw4" placeholder="キーワードを入力"><button id="kw4Btn">判定</button></div>
      <div id="kw4Res" style="margin-top:8px;color:#ffd6d6"></div>
      <div id="videoWrap" style="margin-top:12px; display:none">
        <video id="mainVideo" controls playsinline style="width:100%; border-radius:8px; background:#000">
          <source src="video/final_scene.mp4" type="video/mp4">
          動画を再生できません。
        </video>
      </div>
    </div>
  `;
  document.getElementById("stageArea").appendChild(cont);
  $("#kw4Btn").addEventListener("click", async ()=>{
    const val = $("#kw4").value.trim();
    const CORRECT = "シグマ"; // 編集可
    if(val === CORRECT){
      if(!localStorage.getItem(MAIN_STAGE_SOLVED_PREFIX + "4")){
        addTotal(40);
        localStorage.setItem(MAIN_STAGE_SOLVED_PREFIX + "4","true");
      }
      // show video and attempt autoplay (user interaction allowed)
      const wrap = $("#videoWrap"); wrap.style.display = "block";
      const vid = $("#mainVideo");
      try{
        await vid.play();
      }catch(e){
        // autoplay blocked -> mute and try
        vid.muted = true;
        await vid.play().catch(()=>{ /* fallback */ });
      }
      // on ended -> play story then advance to stage5
      vid.onended = ()=> {
        playStorySequence([AFTER_STAGE4], ()=> setMainStage(5));
      };
      // if video can't play, fallback to story
      setTimeout(()=> {
        if(vid.readyState === 0){
          // no video available -> fallback
          playStorySequence([AFTER_STAGE4], ()=> setMainStage(5));
        }
      }, 1200);
    } else {
      $("#kw4Res").textContent = "何かが違うようです。";
      setTimeout(()=> $("#kw4Res").textContent = "", 1500);
    }
  });
}

/* Stage5: replay video + final keyword -> final story -> complete */
function renderStage5(){
  const cont = document.createElement("div"); cont.className = "stage";
  cont.innerHTML = `
    <h3>メインミッション 第5段階 — 真実の顕現</h3>
    <div class="desc">映像を確認し、最終キーワードを入力してください。</div>
    <div style="margin-top:10px">
      <div style="margin-bottom:8px"><video id="replayVideo" controls playsinline style="width:100%; border-radius:8px"><source src="video/final_scene.mp4" type="video/mp4">動画がありません</video></div>
      <div class="kinput"><input id="kw5" placeholder="最終キーワードを入力"><button id="kw5Btn">判定</button></div>
      <div id="kw5Res" style="margin-top:8px;color:#ffd6d6"></div>
    </div>
  `;
  document.getElementById("stageArea").appendChild(cont);
  $("#kw5Btn").addEventListener("click", ()=>{
    const val = $("#kw5").value.trim();
    const CORRECT = "オメガ"; // 編集可
    if(val === CORRECT){
      if(!localStorage.getItem(MAIN_STAGE_SOLVED_PREFIX + "5")){
        addTotal(50);
        localStorage.setItem(MAIN_STAGE_SOLVED_PREFIX + "5","true");
      }
      // final story then go to complete
      playStorySequence([AFTER_STAGE5], ()=> { location.href = "complete.html"; });
    } else {
      $("#kw5Res").textContent = "何かが違うようです。";
      setTimeout(()=> $("#kw5Res").textContent = "", 1500);
    }
  });
}

/* -------------- Typewriter story logic -------------- */
const storyEl = $("#storyText");
const storyImg = $("#storyImage");
let typing = false;

// typewriter: one block text
function typeWriter(text, speed=18, cb){
  typing = true;
  storyEl.textContent = "";
  storyImg.style.display = "none";
  let i = 0;
  function step(){
    if(i < text.length){
      storyEl.textContent += text.charAt(i);
      i++;
      setTimeout(step, speed);
    } else {
      typing = false;
      if(cb) cb();
    }
  }
  step();
}

// play sequence of blocks
function playStorySequence(blocks, finalCb){
  if(!blocks || blocks.length === 0){ if(finalCb) finalCb(); return; }
  let idx = 0;
  function next(){
    if(idx >= blocks.length){ if(finalCb) finalCb(); return; }
    typeWriter(blocks[idx], 18, ()=> { idx++; setTimeout(next, 500); });
  }
  next();
}

/* -------------- Init on load -------------- */
window.addEventListener("load", ()=>{
  renderTotal();
  renderNormalMissions();
  renderStage();
  // intro play once per user (toggle via localStorage)
  if(!localStorage.getItem("intro_shown_v2")){
    playStorySequence([STORY_INTRO], ()=> { localStorage.setItem("intro_shown_v2", "true"); });
  } else {
    // show empty or short message
    storyEl.textContent = "";
  }
});

/* update when visibility returns (to refresh scores etc) */
document.addEventListener("visibilitychange", ()=>{
  if(!document.hidden){
    renderTotal();
    renderNormalMissions();
    renderStage();
  }
});