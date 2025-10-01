document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector('.add');
    const soundsContainer = document.querySelector('.soundsContainer');
    let db;
    let soundCounter = 1;

    // Open IndexedDB
    const request = indexedDB.open("SoundBoardDB", 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("sounds")) {
            db.createObjectStore("sounds", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadSounds();
    };

    request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.errorCode);
    };

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
                    saveSound({ title: title.trim(), file: file });
                }
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });

    // Add a sound block
    function addSoundBlock(id, file, titleText) {
        const objectUrl = URL.createObjectURL(file);

        const soundDiv = document.createElement('div');
        soundDiv.classList.add('sound');

        const title = document.createElement('p');
        title.classList.add('soundTitle');
        title.textContent = titleText;

        const audio = document.createElement('audio');
        audio.classList.add('audio');
        audio.src = objectUrl;
        audio.style.display = "none"; // hide the default white controls

        const playButton = document.createElement('button');
        playButton.classList.add('play');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => {
            audio.currentTime = 0; // restart from beginning
            audio.play();
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-single');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            soundsContainer.removeChild(soundDiv);
            removeSound(id);
        });

        soundDiv.appendChild(title);
        soundDiv.appendChild(audio);
        soundDiv.appendChild(playButton);
        soundDiv.appendChild(removeButton);

        soundsContainer.appendChild(soundDiv);
        soundCounter++;
    }

    // Save sound to IndexedDB
    function saveSound(sound) {
        const transaction = db.transaction(["sounds"], "readwrite");
        const store = transaction.objectStore("sounds");
        store.add(sound);

        transaction.oncomplete = () => {
            loadSounds(); // refresh view
        };
    }

    // Remove sound from IndexedDB
    function removeSound(id) {
        const transaction = db.transaction(["sounds"], "readwrite");
        const store = transaction.objectStore("sounds");
        store.delete(id);
    }

    // Load sounds from IndexedDB
    function loadSounds() {
        soundsContainer.innerHTML = ""; // clear current
        const transaction = db.transaction(["sounds"], "readonly");
        const store = transaction.objectStore("sounds");

        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const { id, title, file } = cursor.value;
                addSoundBlock(id, file, title);
                cursor.continue();
            }
        };
    }
});

//testing push