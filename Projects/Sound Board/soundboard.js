document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector('.add');
    const removeButton = document.querySelector('.remove');
    const soundsContainer = document.querySelector('.soundsContainer');

    let soundCounter = document.querySelectorAll('.sound').length + 1;

    // Add Sound
    addButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const title = prompt("Enter a title for this sound:", `Sound ${soundCounter}`);
                if (title !== null && title.trim() !== "") {
                    addSoundBlock(file, title.trim());
                }
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });

    // Remove last sound (still here if you want to keep it)
    removeButton.addEventListener('click', () => {
        const sounds = soundsContainer.querySelectorAll('.sound');
        if (sounds.length > 0) {
            const lastSound = sounds[sounds.length - 1];
            soundsContainer.removeChild(lastSound);
            soundCounter--;
        } else {
            alert("No sounds to remove.");
        }
    });

    // Add a sound block with title and file
    function addSoundBlock(file, titleText) {
        const objectUrl = URL.createObjectURL(file);

        const soundDiv = document.createElement('div');
        soundDiv.classList.add('sound');

        const title = document.createElement('p');
        title.classList.add('soundTitle');
        title.textContent = titleText;

        const audio = document.createElement('audio');
        audio.classList.add('audio');
        audio.src = objectUrl;

        const playButton = document.createElement('button');
        playButton.classList.add('play');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => {
            audio.play();
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-single');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            soundsContainer.removeChild(soundDiv);
            soundCounter--;
        });

        soundDiv.appendChild(title);
        soundDiv.appendChild(audio);
        soundDiv.appendChild(playButton);
        soundDiv.appendChild(removeButton);

        soundsContainer.appendChild(soundDiv);
        soundCounter++;
    }

    // Optional: drag-and-drop support
    window.addEventListener('dragover', (e) => e.preventDefault());

    window.addEventListener('drop', (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('audio/')) {
                const title = prompt("Enter a title for this sound:", `Sound ${soundCounter}`);
                if (title !== null && title.trim() !== "") {
                    addSoundBlock(file, title.trim());
                }
            } else {
                alert("Only audio files are allowed.");
            }
        }
    });
});
