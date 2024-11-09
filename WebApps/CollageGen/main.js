const collageImages = []

function toggleLoading(show) {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (show) {
        loadingIndicator.classList.remove("hidden");
    } else {
        loadingIndicator.classList.add("hidden");
    }
}

async function generateCollage() {
    toggleLoading(true)
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('collage-container');
    const gridSize = 2;
    const imageheight = 150;
    const imagewidth = 225;
    
    if (!fileInput.files.length) {
        alert('Please select some images!');
        return;
    }

    // Convert file inputs to images
    const images = await Promise.all([...fileInput.files].map(file => loadImage(file)));
    const numGrids = Math.ceil(images.length / (gridSize * gridSize));

    outputDiv.innerHTML = '';  // Clear previous grids

    for (let gridIndex = 0; gridIndex < numGrids; gridIndex++) {
        const canvas = document.createElement('canvas');
        canvas.width = imagewidth * gridSize;
        canvas.height = imageheight * gridSize;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < gridSize * gridSize; i++) {
            const imgIndex = gridIndex * gridSize * gridSize + i;
            if (imgIndex >= images.length) break;

            const img = images[imgIndex];
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);
            ctx.drawImage(img, col * imagewidth, row * imageheight, imagewidth, imageheight);
        }
        collageImages.push(canvas)
        outputDiv.appendChild(canvas);
        // const downloadLink = document.createElement('a');
        // downloadLink.textContent = 'Download Grid ' + (gridIndex + 1);
        // downloadLink.href = canvas.toDataURL('image/jpeg');
        // downloadLink.download = `grid_${gridIndex + 1}.jpg`;
        // outputDiv.appendChild(downloadLink);
        outputDiv.appendChild(document.createElement('br'));
    }
    toggleLoading(false)
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

    // Assume `collageImages` is an array of image elements or URLs of generated collages
    collageImages.forEach((img, index) => {
        // Convert canvas image to data URL (if using canvas) or use URL directly
        const dataUrl = img.toDataURL("image/png");
        
        // Convert data URL to binary and add to zip
        folder.file(`collage-${index + 1}.png`, dataUrl.split(',')[1], { base64: true });
    });

    // Generate zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "collages.zip");
    });
}

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker registered successfully.');
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
