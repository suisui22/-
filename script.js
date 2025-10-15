document.addEventListener("DOMContentLoaded", () => {
  const missions = document.querySelectorAll(".mission");
  const storyText = document.getElementById("story-text");
  const videoContainer = document.getElementById("video-container");
  const missionVideo = document.getElementById("mission-video");

  const stories = [
    "闇を払う光の名を思い出した…封印がわずかに揺らぐ。",
    "炎が灯る。心の中に情熱が再び燃え上がった。",
    "風が吹き、過去の声が囁く。「次は命の源を思い出せ…」",
    "水の力が解放された。全ての元素が共鳴を始める──",
  ];

  missions.forEach((mission, index) => {
    const button = mission.querySelector(".check");
    const input = mission.querySelector(".answer");
    const result = mission.querySelector(".result");

    button.addEventListener("click", () => {
      const answer = input.value.trim();
      const correct = mission.dataset.answer;

      if (answer === correct) {
        result.textContent = "✅ 正解！";
        result.style.color = "#0f0";
        storyText.textContent = stories[index] || "封印が少しずつ解けていく…";

        // 4番目のミッションで動画再生
        if (index === 3) {
          videoContainer.classList.remove("hidden");
          missionVideo.play();
        }
      } else {
        result.textContent = "❌ 不正解";
        result.style.color = "#f00";
      }
    });
  });
});