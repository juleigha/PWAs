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
            let drawWidth, drawHeight;
            if (aspectRatio <= 1) {
                // Landscape orientation
                drawWidth = imageWidth;
                drawHeight = imageWidth / aspectRatio;
                drawWidth = drawWidth > maxWidth ? maxWidth : drawWidth;
                drawHeight = drawHeight > maxHeight ? maxHeight : drawHeight;
                
            } else {
                // Portrait orientation, rotate
                drawHeight = imageHeight;
                drawWidth = imageHeight * aspectRatio;
                drawHeight = drawHeight > maxHeight ? maxHeight : drawHeight;
                drawWidth = drawWidth > maxWidth ? maxWidth : drawWidth;
                ctx.save();
                ctx.translate((col + 0.5) * imageWidth, (row + 0.5) * imageHeight);
                ctx.rotate(-Math.PI / 2); 
                ctx.drawImage(
                    img,
                    -drawHeight / 2,
                    -drawWidth / 2,
                    drawHeight,
                    drawWidth
                );
                ctx.restore();
                continue;
            }

            const xOffset = col * imageWidth + (imageWidth - drawWidth) / 2;
            const yOffset = row * imageHeight + (imageHeight - drawHeight) / 2;
            ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
        }

        collageImages.push(canvas);
        outputDiv.appendChild(canvas);
        outputDiv.appendChild(document.createElement('br'));
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
