function parseInput(value) {
    const arr = value.split(',').map(v => v.trim());
    if (arr.some(v => v === "" || isNaN(v))) return null;
    const numbers = arr.map(Number);
    if (numbers.some(n => n < 0)) return null;
    return numbers;
}

function calculateWater(heights) {
    const n = heights.length;
    if (n === 0) return { total: 0, levels: [] };

    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);
    const levels = new Array(n).fill(0);

    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], heights[i]);

    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], heights[i]);

    let total = 0;
    for (let i = 0; i < n; i++) {
        levels[i] = Math.min(leftMax[i], rightMax[i]) - heights[i];
        total += levels[i];
    }

    return { total, levels };
}

function drawScene(heights, waterLevels) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const n = heights.length;

    const squareSize = 60;
    const gap = 12;
    const padding = 60; // Padding around the drawing

    // 1. Calculate Required Dimensions
    const maxTotalHeight = Math.max(...heights.map((h, i) => h + waterLevels[i]));
    
    const requiredWidth = n * squareSize + (n - 1) * gap + padding * 2;
    const requiredHeight = maxTotalHeight * (squareSize + gap) + padding * 2;

    // Set canvas dimensions (with a minimum size)
    canvas.width = Math.max(600, requiredWidth);
    canvas.height = Math.max(400, requiredHeight);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startX = (canvas.width - (n * squareSize + (n - 1) * gap)) / 2;
    const baseY = canvas.height - padding;

    // 1. Draw Water Blocks (Connected to water, separated from ground)
    heights.forEach((h, i) => {
        const x = startX + i * (squareSize + gap);
        const w = waterLevels[i];

        if (w > 0) {
            // A. Vertical solid water for this column
            const waterTop = baseY - (h + w) * (squareSize + gap) + gap;
            const waterBottom = baseY - h * (squareSize + gap);
            const waterHeight = waterBottom - waterTop;
            
            ctx.fillStyle = "#00adef";
            ctx.fillRect(x, waterTop, squareSize, waterHeight);

            // B. Horizontal connection to the next column
            // Only fill the gap if the next column also has water at some levels
            if (i < n - 1 && waterLevels[i+1] > 0) {
                const nextH = heights[i+1];
                const nextW = waterLevels[i+1];
                
                // Connection only happens where both columns have water
                // The shared water range starts at max(h, nextH) and goes up to the pool surface
                const sharedH = Math.max(h, nextH);
                const surfaceH = h + w; // Pool surface is consistent across the pool
                
                const gapBottom = baseY - sharedH * (squareSize + gap);
                const gapTop = baseY - surfaceH * (squareSize + gap) + gap;
                const gapHeight = gapBottom - gapTop;

                if (gapHeight > 0) {
                    ctx.fillRect(x + squareSize, gapTop, gap, gapHeight);
                }
            }
        }
    });

    // 2. Draw Ground Blocks (Outlined Squares)
    heights.forEach((h, i) => {
        const x = startX + i * (squareSize + gap);
        
        for (let j = 0; j < h; j++) {
            const y = baseY - (squareSize + gap) * j - squareSize;
            
            ctx.strokeStyle = "black";
            ctx.lineWidth = 6;
            ctx.strokeRect(x, y, squareSize, squareSize);
            
            ctx.fillStyle = "white";
            ctx.fillRect(x + 3, y + 3, squareSize - 6, squareSize - 6);
        }

        // 3. Draw Index Labels
        ctx.fillStyle = "#64748b";
        ctx.font = "600 16px Inter";
        ctx.textAlign = "center";
        ctx.fillText(i.toString(), x + squareSize / 2, baseY + 30);
    });
}

function handleDraw() {
    const input = document.getElementById("input").value;
    const errorEl = document.getElementById("error");
    const resultEl = document.getElementById("result");

    errorEl.textContent = "";

    const heights = parseInput(input);

    if (!heights) {
        errorEl.textContent = "Please enter a valid list of numbers (e.g. 3,0,2,0,4)";
        return;
    }

    const { total, levels } = calculateWater(heights);
    resultEl.textContent = total;

    drawScene(heights, levels);
}