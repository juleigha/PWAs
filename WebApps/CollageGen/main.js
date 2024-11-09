async function generateGrids() {
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');
    const gridSize = 2;
    const imageSize = 200;
    
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
        canvas.width = imageSize * gridSize;
        canvas.height = imageSize * gridSize;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < gridSize * gridSize; i++) {
            const imgIndex = gridIndex * gridSize * gridSize + i;
            if (imgIndex >= images.length) break;

            const img = images[imgIndex];
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);
            ctx.drawImage(img, col * imageSize, row * imageSize, imageSize, imageSize);
        }

        outputDiv.appendChild(canvas);
        const downloadLink = document.createElement('a');
        downloadLink.textContent = 'Download Grid ' + (gridIndex + 1);
        downloadLink.href = canvas.toDataURL('image/jpeg');
        downloadLink.download = `grid_${gridIndex + 1}.jpg`;
        outputDiv.appendChild(downloadLink);
        outputDiv.appendChild(document.createElement('br'));
    }
}

function loadImage(file) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker registered successfully.');
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
