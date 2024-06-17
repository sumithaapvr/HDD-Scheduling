// Global variables
let algorithm, qSize, queueElements, initHead;
let outputDiv = document.getElementById('output');

// Constants for C-SCAN
const HIGH = 199;
const LOW = 0;

// Function to run selected algorithm
function runAlgorithm() {
    // Fetch inputs
    algorithm = document.getElementById('algorithm').value;
    qSize = parseInt(document.getElementById('qSize').value);
    queueElements = document.getElementById('queueElements').value.split(',').map(x => parseInt(x.trim()));
    initHead = parseInt(document.getElementById('initHead').value);

    // Validate inputs
    if (isNaN(qSize) || qSize <= 0 || !Array.isArray(queueElements) || queueElements.length !== qSize || isNaN(initHead)) {
        outputDiv.innerHTML = '<p style="color: red;">Invalid inputs! Please check your input values.</p>';
        return;
    }

    // Select algorithm
    switch (algorithm) {
        case 'fcfs':
            runFCFS();
            break;
        case 'sstf':
            runSSTF();
            break;
        case 'scan':
            runSCAN();
            break;
        case 'cscan':
            runCSCAN();
            break;
        case 'look':
            runLOOK();
            break;
        case 'clook':
            runCLOOK();
            break;
        default:
            outputDiv.innerHTML = '<p style="color: red;">Invalid algorithm selected!</p>';
    }
}

// FCFS Algorithm
function runFCFS() {
    let seek = 0;
    let avg = 0;

    let queue = [initHead, ...queueElements];

    for (let i = 0; i < qSize; i++) {
        let diff = Math.abs(queue[i] - queue[i + 1]);
        seek += diff;
        outputDiv.innerHTML += `Disk head moves from ${queue[i]} to ${queue[i + 1]} with seek ${diff}<br>`;
    }

    avg = seek / qSize;
    outputDiv.innerHTML += `<br>Total seek time is ${seek}<br>`;
    outputDiv.innerHTML += `Average seek time is ${avg.toFixed(2)}<br><br>`;
}
//SSTF Algorithm
function runSSTF() {
    let seek = 0;
    let avg = 0;

    let tempQueue = [...queueElements];
    let queue = [initHead];

    while (tempQueue.length > 0) {
        let minDiff = Infinity;
        let index = -1;

        for (let i = 0; i < tempQueue.length; i++) {
            let diff = Math.abs(queue[queue.length - 1] - tempQueue[i]);
            if (diff < minDiff || (diff === minDiff && tempQueue[i] > queue[queue.length - 1])) {
                minDiff = diff;
                index = i;
            }
        }

        seek += minDiff;
        queue.push(tempQueue.splice(index, 1)[0]);
    }

    for (let i = 0; i < queue.length - 1; i++) {
        outputDiv.innerHTML += `Disk head moves from ${queue[i]} to ${queue[i + 1]} with seek ${Math.abs(queue[i] - queue[i + 1])}<br>`;
    }

    avg = seek / (queue.length - 1);
    outputDiv.innerHTML += `<br>Total seek time is ${seek}<br>`;
    outputDiv.innerHTML += `Average seek time is ${avg.toFixed(2)}<br><br>`;
}

//SCAN Algorithm
function runSCAN() {
    let seek = 0;
    let avg = 0;
    let diskSize = 199; // assuming the disk size is 200 (0 to 199)

    let sortedQueue = [initHead, ...queueElements].sort((a, b) => a - b);
    let headIndex = sortedQueue.indexOf(initHead);

    // Left to right (initial head to the highest element)
    for (let i = headIndex; i < sortedQueue.length - 1; i++) {
        seek += Math.abs(sortedQueue[i + 1] - sortedQueue[i]);
        outputDiv.innerHTML += `Disk head moves from ${sortedQueue[i]} to ${sortedQueue[i + 1]} with seek ${Math.abs(sortedQueue[i] - sortedQueue[i + 1])}<br>`;
    }

    // Move to 199 (end of the disk)
    seek += Math.abs(diskSize - sortedQueue[sortedQueue.length - 1]);
    outputDiv.innerHTML += `Disk head moves from ${sortedQueue[sortedQueue.length - 1]} to ${diskSize} with seek ${Math.abs(diskSize - sortedQueue[sortedQueue.length - 1])}<br>`;

    // Right to left (199 to the lowest element not covered)
    let remainingQueue = sortedQueue.slice(0, headIndex).reverse();
    remainingQueue.unshift(diskSize); // Start from 199

    for (let i = 0; i < remainingQueue.length - 1; i++) {
        seek += Math.abs(remainingQueue[i] - remainingQueue[i + 1]);
        outputDiv.innerHTML += `Disk head moves from ${remainingQueue[i]} to ${remainingQueue[i + 1]} with seek ${Math.abs(remainingQueue[i] - remainingQueue[i + 1])}<br>`;
    }

    avg = seek / (sortedQueue.length - 1);
    outputDiv.innerHTML += `<br>Total seek time is ${seek}<br>`;
    outputDiv.innerHTML += `Average seek time is ${avg.toFixed(2)}<br><br>`;
}


// C-SCAN Algorithm
function runCSCAN() {
    let seek = 0;
    let avg = 0;
    let diskSize = 199; // assuming the disk size is 200 (0 to 199)
    let lowestValue = 0;

    let sortedQueue = [initHead, ...queueElements].sort((a, b) => a - b);
    let headIndex = sortedQueue.indexOf(initHead);

    // Left to right (initial head to the highest element)
    for (let i = headIndex; i < sortedQueue.length - 1; i++) {
        seek += Math.abs(sortedQueue[i + 1] - sortedQueue[i]);
        outputDiv.innerHTML += `Disk head moves from ${sortedQueue[i]} to ${sortedQueue[i + 1]} with seek ${Math.abs(sortedQueue[i] - sortedQueue[i + 1])}<br>`;
    }

    // Move to 199 (end of the disk)
    seek += Math.abs(diskSize - sortedQueue[sortedQueue.length - 1]);
    outputDiv.innerHTML += `Disk head moves from ${sortedQueue[sortedQueue.length - 1]} to ${diskSize} with seek ${Math.abs(diskSize - sortedQueue[sortedQueue.length - 1])}<br>`;

    // Move to 0 (start of the disk)
    seek += Math.abs(diskSize - lowestValue);
    outputDiv.innerHTML += `Disk head moves from ${diskSize} to ${lowestValue} with seek ${Math.abs(diskSize - lowestValue)}<br>`;

    // Left to right (0 to the lowest elements)
    for (let i = 0; i < headIndex; i++) {
        if (i === 0) {
            seek += Math.abs(sortedQueue[i] - lowestValue);
            outputDiv.innerHTML += `Disk head moves from ${lowestValue} to ${sortedQueue[i]} with seek ${Math.abs(lowestValue - sortedQueue[i])}<br>`;
        } else {
            seek += Math.abs(sortedQueue[i] - sortedQueue[i - 1]);
            outputDiv.innerHTML += `Disk head moves from ${sortedQueue[i - 1]} to ${sortedQueue[i]} with seek ${Math.abs(sortedQueue[i] - sortedQueue[i - 1])}<br>`;
        }
    }

    avg = seek / queueElements.length;
    outputDiv.innerHTML += `<br>Total seek time is ${seek}<br>`;
    outputDiv.innerHTML += `Average seek time is ${avg.toFixed(2)}<br><br>`;
}


// LOOK Algorithm
function runLOOK() {
    let seek = 0;
    let avg = 0;

    let sortedQueue = [initHead, ...queueElements].sort((a, b) => a - b);
    let headIndex = sortedQueue.indexOf(initHead);

    // Move right from initial head to the highest element
    for (let i = headIndex; i < sortedQueue.length - 1; i++) {
        seek += Math.abs(sortedQueue[i + 1] - sortedQueue[i]);
        outputDiv.innerHTML += `Disk head moves from ${sortedQueue[i]} to ${sortedQueue[i + 1]} with seek ${Math.abs(sortedQueue[i] - sortedQueue[i + 1])}<br>`;
    }

    // Track the last position before switching direction
    let lastPosition = sortedQueue[sortedQueue.length - 1];

    // Move left from the highest element to the lowest element (only uncovered elements)
    for (let i = headIndex - 1; i >= 0; i--) {
        seek += Math.abs(lastPosition - sortedQueue[i]);
        outputDiv.innerHTML += `Disk head moves from ${lastPosition} to ${sortedQueue[i]} with seek ${Math.abs(lastPosition - sortedQueue[i])}<br>`;
        lastPosition = sortedQueue[i];
    }

    avg = seek / (queueElements.length + 1);
    outputDiv.innerHTML += `<br>Total seek time is ${seek}<br>`;
    outputDiv.innerHTML += `Average seek time is ${avg.toFixed(2)}<br><br>`;
}

// C-LOOK Algorithm
function runCLOOK() {
    let seek = 0;
    let avg = 0;

    let tempQueue = [...queueElements];
    tempQueue.push(initHead);
    tempQueue.sort((a, b) => a - b);

    let headIndex = tempQueue.indexOf(initHead);
    let queue = [];

    if (headIndex === 0) {
        queue = [initHead, ...tempQueue.slice(1)];
    } else {
        queue = [...tempQueue.slice(headIndex), ...tempQueue.slice(0, headIndex)];
    }

    for (let i = 0; i < qSize; i++) {
        seek += Math.abs(queue[i] - queue[i + 1]);
        outputDiv.innerHTML += `Disk head moves from ${queue[i]} to ${queue[i + 1]} with seek ${Math.abs(queue[i] - queue[i + 1])}<br>`;
    }

    avg = seek / qSize;
    outputDiv.innerHTML += `<br>Total seek time is ${seek}<br>`;
    outputDiv.innerHTML += `Average seek time is ${avg.toFixed(2)}<br><br>`;
}

