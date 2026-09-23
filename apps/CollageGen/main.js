const collageImages = [];

function toggleLoading(show) {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (show) {
        loadingIndicator.classList.remove("hidden");
    } else {
        loadingIndicator.classList.add("hidden");
    }
}

async function generateCollage() {
    toggleLoading(true);
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('collage-container');
    const gridSize = 2; // 2x2 grid
    const canvasWidth = 1200; // 4 inches at 300 DPI
    const canvasHeight = 1800; // 6 inches at 300 DPI
    const imageWidth = canvasWidth / gridSize;
    const imageHeight = canvasHeight / gridSize;
    const maxWidth = 600;
    const maxHeight = 900;

    if (!fileInput.files.length) {
        alert('Please select some images!');
        toggleLoading(false);
        return;
    }

    const images = await Promise.all([...fileInput.files].map(file => loadImage(file)));
    const numGrids = Math.ceil(images.length / (gridSize * gridSize));

    outputDiv.innerHTML = '';

    for (let gridIndex = 0; gridIndex < numGrids; gridIndex++) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < gridSize * gridSize; i++) {
            const imgIndex = gridIndex * gridSize * gridSize + i;
            if (imgIndex >= images.length) break;

            const img = images[imgIndex];
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);

            const aspectRatio = img.width / img.height;
            // Landscape photos are rotated 90 degrees so they fill this
            // grid's portrait-shaped cells better, so the box they need
            // to fit into has width/height swapped relative to a
            // portrait photo's box.
            const isLandscape = aspectRatio > 1;
            const boxWidth = isLandscape ? maxHeight : maxWidth;
            const boxHeight = isLandscape ? maxWidth : maxHeight;

            // Scale down to fit inside the box while keeping the photo's
            // true aspect ratio. (The old code clamped width and height
            // independently, which could stretch/squish the image.)
            const scale = Math.min(boxWidth / img.width, boxHeight / img.height);
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;

            if (isLandscape) {
                ctx.save();
                ctx.translate((col + 0.5) * imageWidth, (row + 0.5) * imageHeight);
                ctx.rotate(-Math.PI / 2);
                ctx.drawImage(img, -drawHeight / 2, -drawWidth / 2, drawHeight, drawWidth);
                ctx.restore();
            } else {
                const xOffset = col * imageWidth + (imageWidth - drawWidth) / 2;
                const yOffset = row * imageHeight + (imageHeight - drawHeight) / 2;
                ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
            }
        }

        collageImages.push(canvas);
        outputDiv.appendChild(canvas);
    }

    toggleLoading(false);
}

function loadImage(file) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}

async function downloadAllImages() {
    const zip = new JSZip();
    const folder = zip.folder("collages");

    collageImages.forEach((img, index) => {
        const dataUrl = img.toDataURL("image/png");
        folder.file(`collage-${index + 1}.png`, dataUrl.split(',')[1], { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "collages.zip");
    });
}
