const audioMap = {
    // 'emu.png': new Audio('./assets/audios/emu_voice.mp3'),
    'momoi.png': new Audio('./assets/audios/momoi_voice.mp3')
};

Object.values(audioMap).forEach(audio => {
    audio.preload = 'auto';
});

let currentAudio = null;
let audioFadeFrame = null;


function getCurrentAudio() {
    const characterImg = document.getElementById('character');
    if (!characterImg) return null;

    for (const [imgName, audio] of Object.entries(audioMap)) {
        if (characterImg.src.endsWith(imgName)) {
            return audio
        }
    }
    return null
}

function playVoice() {
    const audio = getCurrentAudio();
    if (!audio) return;

    if (currentAudio && currentAudio != audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = audio

    cancelAnimationFrame(audioFadeFrame);

    audio.loop = true;
    if (audio.paused) {
        audio.currentTime = 0;
        audio.volume = 0;
        audio.play().catch(err => console.warn('Audio playback is blocked:', err));
    }

    const fadeDuration = 500;
    const startVol = audio.volume;
    const startTime = performance.now();

    function fadeIn(time) {
        const elapsed = time - startTime;
        const progress = elapsed / fadeDuration;

        if (progress >= 1) {
            audio.volume = 1;
        } else {
            const nextVol = startVol + (1 - startVol) * progress;
            audio.volume = Math.max(0, Math.min(1, nextVol));
            audioFadeFrame = requestAnimationFrame(fadeIn);
        }
    }
    audioFadeFrame = requestAnimationFrame(fadeIn);
}

function stopVoice() {
    const audio = currentAudio || getCurrentAudio();
    if (!audio) return;

    cancelAnimationFrame(audioFadeFrame);
    audio.loop = false;

    let remainingTime = (audio.duration - audio.currentTime) * 1000;
    if (isNaN(remainingTime) || remainingTime < 100) {
        remainingTime = 500;
    }
    const startVol = audio.volume;
    const startTime = performance.now();
    function fadeOut(time) {
        const elapsed = time - startTime;
        const progress = elapsed / remainingTime;

        if (progress >= 1) {
            audio.volume = 0;
            audio.pause();
        } else {
            const nextVol = startVol * (1 - progress);
            audio.volume = Math.max(0, Math.min(1, nextVol));
            audioFadeFrame = requestAnimationFrame(fadeOut);
        }
    }
    audioFadeFrame = requestAnimationFrame(fadeOut);
}

window.playVoice = playVoice;
window.stopVoice = stopVoice;