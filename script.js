// -------------------------
// ヘルパー：文字アニメーション表示
// -------------------------
function typeText(element, text, speed = 50, callback) {
  element.innerHTML = '';
  let i = 0;
  let interval = setInterval(() => {
    element.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

// -------------------------
// 通常ミッション判定
// -------------------------
document.querySelectorAll('#mission-container .mission').forEach(mission => {
  const btn = mission.querySelector('.check');
  const input = mission.querySelector('.answer');
  const result = mission.querySelector('.result');

  btn.addEventListener('click', () => {
    if (input.value.trim() === mission.dataset.answer) {
      result.textContent = '○ 正解！';
      result.style.color = 'lightgreen';
    } else {
      result.textContent = '× 何かが違うようです。';
      result.style.color = 'red';
    }
  });
});

// -------------------------
// メインミッション判定
// -------------------------

// 1段階目（5問）
function checkMainStage1() {
  const missions = document.querySelectorAll('#main-mission-container > .mission');
  let allCorrect = true;
  missions.forEach(m => {
    const input = m.querySelector('.answer');
    const result = m.querySelector('.result');
    if (input.value.trim() === m.dataset.answer) {
      result.textContent = '○ 正解！';
      result.style.color = 'lightgreen';
    } else {
      result.textContent = '× 何かが違うようです。';
      result.style.color = 'red';
      allCorrect = false;
    }
  });
  if (allCorrect) {
    // 次段階表示
    document.getElementById('main-mission-2').classList.remove('hidden');
    // RPG文字アニメーション
    typeText(document.getElementById('story-text'), '1段階目クリア！次のキーワードに挑戦だ！');
  }
}

document.querySelectorAll('#main-mission-container > .mission .check').forEach(btn => {
  btn.addEventListener('click', checkMainStage1);
});

// 2段階目
document.getElementById('check2').addEventListener('click', () => {
  const input = document.getElementById('keyword2');
  const result = document.getElementById('result2');
  const correct = '魔道';
  if (input.value.trim() === correct) {
    result.textContent = '○ 正解！';
    result.style.color = 'lightgreen';
    document.getElementById('main-mission-3').classList.remove('hidden');
    typeText(document.getElementById('story2-text'), '2段階目クリア！次のキーワードに挑戦だ！');
  } else {
    result.textContent = '× 何かが違うようです。';
    result.style.color = 'red';
  }
});

// 3段階目
document.getElementById('check3').addEventListener('click', () => {
  const input = document.getElementById('keyword3');
  const result = document.getElementById('result3');
  const correct = '召喚';
  if (input.value.trim() === correct) {
    result.textContent = '○ 正解！';
    result.style.color = 'lightgreen';
    document.getElementById('main-mission-4').classList.remove('hidden');
    typeText(document.getElementById('story3-text'), '3段階目クリア！動画を確認しよう！');
  } else {
    result.textContent = '× 何かが違うようです。';
    result.style.color = 'red';
  }
});

// 4段階目（動画自動再生）
document.getElementById('check4').addEventListener('click', () => {
  const input = document.getElementById('keyword4');
  const result = document.getElementById('result4');
  const correct = '異世界';
  if (input.value.trim() === correct) {
    result.textContent = '○ 正解！';
    result.style.color = 'lightgreen';
    const videoDiv = document.getElementById('video-container');
    videoDiv.classList.remove('hidden');
    const video = document.getElementById('mission-video');
    video.play();
    // 次段階表示
    document.getElementById('main-mission-5').classList.remove('hidden');
    typeText(document.getElementById('story4-text'), '4段階目クリア！最後の挑戦だ！');
  } else {
    result.textContent = '× 何かが違うようです。';
    result.style.color = 'red';
  }
});

// 5段階目
document.getElementById('check5').addEventListener('click', () => {
  const input = document.getElementById('keyword5');
  const result = document.getElementById('result5');
  const correct = '冒険';
  if (input.value.trim() === correct) {
    result.textContent = '○ 正解！';
    result.style.color = 'lightgreen';
    typeText(document.getElementById('story5-text'), '全段階クリア！ミッションコンプリート！\nメインページに戻ってもう一度挑戦できます。');
  } else {
    result.textContent = '× 何かが違うようです。';
    result.style.color = 'red';
  }
});