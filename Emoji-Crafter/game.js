document.addEventListener('DOMContentLoaded', () => {
    let discoveredEmojis = new Set(JSON.parse(localStorage.getItem('discoveredEmojis')) || startingEmojis);
    const dropZone1 = document.getElementById('drop-zone-1');
    const dropZone2 = document.getElementById('drop-zone-2');
    const resultZone = document.getElementById('result');
    const craftBtn = document.getElementById('craft-btn');
    
    function saveProgress() {
        localStorage.setItem('discoveredEmojis', JSON.stringify([...discoveredEmojis]));
    }

    function updateDiscoveredList() {
        const list = document.getElementById('discovered-list');
        list.innerHTML = '';
        [...discoveredEmojis].sort().forEach(emoji => {
            const div = document.createElement('div');
            div.className = 'emoji-item';
            div.draggable = true;
            div.textContent = emoji;
            div.addEventListener('dragstart', handleDragStart);
            list.appendChild(div);
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (!e.target.classList.contains('drop-zone')) return;
        e.target.classList.add('dragover');
    }

    function handleDragLeave(e) {
        if (!e.target.classList.contains('drop-zone')) return;
        e.target.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone) return;
        
        dropZone.classList.remove('dragover');
        const emoji = e.dataTransfer.getData('text/plain');
        dropZone.textContent = emoji;
        
        checkCraftingPossible();
    }

    function checkCraftingPossible() {
        const emoji1 = dropZone1.textContent;
        const emoji2 = dropZone2.textContent;
        
        if (emoji1 && emoji2 && !emoji1.includes('Drag') && !emoji2.includes('Drag')) {
            craftBtn.disabled = false;
        } else {
            craftBtn.disabled = true;
        }
    }

    function craft() {
        const emoji1 = dropZone1.textContent;
        const emoji2 = dropZone2.textContent;
        const combination = `${emoji1}${emoji2}`;
        const reverseCombination = `${emoji2}${emoji1}`;
        
        const result = recipes[combination] || recipes[reverseCombination];
        
        if (result) {
            resultZone.textContent = result;
            resultZone.classList.add('pop');
            
            if (!discoveredEmojis.has(result)) {
                discoveredEmojis.add(result);
                saveProgress();
                updateDiscoveredList();
            }
        } else {
            resultZone.textContent = '❌';
            resultZone.classList.add('pop');
        }
        
        setTimeout(() => {
            resultZone.classList.remove('pop');
        }, 300);
    }

    // Event Listeners
    document.addEventListener('dragend', handleDragEnd);
    dropZone1.addEventListener('dragover', handleDragOver);
    dropZone2.addEventListener('dragover', handleDragOver);
    dropZone1.addEventListener('dragleave', handleDragLeave);
    dropZone2.addEventListener('dragleave', handleDragLeave);
    dropZone1.addEventListener('drop', handleDrop);
    dropZone2.addEventListener('drop', handleDrop);
    craftBtn.addEventListener('click', craft);

    // Initialize
    updateDiscoveredList();
});