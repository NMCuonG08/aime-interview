const dropZone = document.getElementById("drop-zone");
const errorEl = document.getElementById("error");
const uniqueEl = document.getElementById("unique");
const topEl = document.getElementById("top");

const worker = new Worker("worker.js");

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    errorEl.textContent = "";
    topEl.innerHTML = "";

    const file = e.dataTransfer.files[0];


    if (!file || !file.name.endsWith(".txt")) {
        errorEl.textContent = "Only .txt file allowed";
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        const content = event.target.result;


        const valid = /^[a-zA-Z.,\s]+$/.test(content);

        if (!valid) {
            errorEl.textContent = "Invalid characters in file";
            return;
        }

        worker.postMessage(content);
    };

    reader.readAsText(file);
});

worker.onmessage = (e) => {
    if (e.data.error) {
        errorEl.textContent = e.data.error;
        return;
    }

    uniqueEl.textContent = e.data.uniqueCount;

    e.data.top3.forEach(([word, count]) => {
        const li = document.createElement("li");
        li.textContent = `${word}: ${count}`;
        topEl.appendChild(li);
    });
};