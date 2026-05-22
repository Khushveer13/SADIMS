const urlParams = new URLSearchParams(window.location.search);
let farmId = urlParams.get('farmId');

if (farmId) {
    localStorage.setItem('lastFarmId', farmId);
} else {
    farmId = localStorage.getItem('lastFarmId');
}

if (!farmId) {
    alert(t ? t('noFarmSelected') : 'No farm selected! Please select a field from the dashboard first.');
    window.location.href = 'dashboard.html';
}

document.getElementById('farmIdDisplay').textContent = '#' + farmId;

// Helper function to parse JSON safely
function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return [];
    }
}

// Display Organic Solutions
function displayOrganicSolutions(solutionsData) {
    const container = document.getElementById('organicSolution');
    const solutions = typeof solutionsData === 'string' ? parseJSON(solutionsData) : solutionsData;

    if (!solutions || solutions.length === 0) {
        const msg = (typeof t !== 'undefined') ? t('noOrganicSolutions') : 'No organic solutions available.';
        container.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">${msg}</p>`;
        return;
    }

    let html = '<ul style="margin: 0; padding-left: 1.5rem; list-style: none;">';
    solutions.forEach((sol, index) => {
        const dosageLabel = (typeof t !== 'undefined') ? t('dosageLabel') : 'Dosage:';
        const frequencyLabel = (typeof t !== 'undefined') ? t('frequencyLabel') : 'Frequency:';
        html += `
            <li style="margin-bottom: 1rem; padding-bottom: 1rem; ${index < solutions.length - 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}">
                <strong style="color: #10b981; font-size: 0.95rem;">${sol.name}</strong><br>
                <span style="font-size: 0.85rem; color: var(--text-muted);">
                    📊 <strong>${dosageLabel}</strong> ${sol.dosage}<br>
                    ⏱️ <strong>${frequencyLabel}</strong> ${sol.frequency}<br>
                    💡 <em>${sol.note}</em>
                </span>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Display Chemical Solutions
function displayChemicalSolutions(solutionsData) {
    const container = document.getElementById('inorganicSolution');
    const solutions = typeof solutionsData === 'string' ? parseJSON(solutionsData) : solutionsData;

    if (!solutions || solutions.length === 0) {
        const msg = (typeof t !== 'undefined') ? t('noChemicalSolutions') : 'No chemical solutions available.';
        container.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">${msg}</p>`;
        return;
    }

    let html = '<ul style="margin: 0; padding-left: 1.5rem; list-style: none;">';
    solutions.forEach((sol, index) => {
        const dosageLabel = (typeof t !== 'undefined') ? t('dosageLabel') : 'Dosage:';
        const frequencyLabel = (typeof t !== 'undefined') ? t('frequencyLabel') : 'Frequency:';
        html += `
            <li style="margin-bottom: 1rem; padding-bottom: 1rem; ${index < solutions.length - 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}">
                <strong style="color: #3b82f6; font-size: 0.95rem;">${sol.name}</strong><br>
                <span style="font-size: 0.85rem; color: var(--text-muted);">
                    📊 <strong>${dosageLabel}</strong> ${sol.dosage}<br>
                    ⏱️ <strong>${frequencyLabel}</strong> ${sol.frequency}<br>
                    ⚠️ <em>${sol.note}</em>
                </span>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Display Prevention Tips
function displayPreventionTips(tipsData) {
    const container = document.getElementById('prevention');
    const tips = typeof tipsData === 'string' ? parseJSON(tipsData) : tipsData;

    if (!tips || tips.length === 0) {
        const msg = (typeof t !== 'undefined') ? t('noPreventionTips') : 'No prevention tips available.';
        container.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">${msg}</p>`;
        return;
    }

    let html = '<ul style="margin: 0; padding-left: 1.5rem;">';
    tips.forEach(tip => {
        html += `<li style="margin-bottom: 0.5rem; font-size: 0.9rem; line-height: 1.5;">${tip}</li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
}

async function checkDisease() {
    const imgPath = document.getElementById('imagePath').value;
    const btn = document.getElementById('analyzeBtn');
    const dropZone = document.getElementById('dropZone');
    const resultSection = document.getElementById('resultSection');

    if (!imgPath.trim()) {
        alert("Please upload a leaf image or provide a file path.");
        return;
    }

    // Interactive Loading State
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Analyzing Samples...';
    btn.disabled = true;
    dropZone.classList.add('pulse');
    lucide.createIcons();

    try {
        // Backend API Call
        const result = await ApiService.uploadDiseaseImage(farmId, imgPath);

        // Update UI Results
        document.getElementById('diseaseName').textContent = result.predictedDisease;
        document.getElementById('confidence').textContent = result.confidenceScore.toFixed(1) + '%';
        document.getElementById('cause').textContent = result.cause || 'No specific cause identified.';
        document.getElementById('recommendation').textContent = result.recommendation;

        // Parse and display structured solutions
        displayOrganicSolutions(result.organicSolutions);
        displayChemicalSolutions(result.chemicalSolutions);
        displayPreventionTips(result.preventionTips);

        document.getElementById('confidenceBar').style.width = result.confidenceScore + '%';

        // Update Status Badge
        const badge = document.getElementById('statusBadge');
        if (result.predictedDisease.toLowerCase() === 'healthy') {
            badge.textContent = 'Status: Optimal Health';
            badge.className = 'badge badge-success';
        } else {
            badge.textContent = 'Status: Disease Detected';
            badge.className = 'badge badge-danger';
        }

        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });

        // Refresh History
        loadHistory();
    } catch (e) {
        console.error(e);
        alert('AI Service Unreachable: Please ensure ML component is running.');
    } finally {
        // Reset Button
        btn.innerHTML = originalContent;
        btn.disabled = false;
        dropZone.classList.remove('pulse');
        lucide.createIcons();
    }
}

function toggleHistory() {
    const list = document.getElementById('historyList');
    const header = document.getElementById('historyHeader');
    const isHidden = list.classList.contains('hidden');

    list.classList.toggle('hidden');
    header.classList.toggle('hidden');

    if (isHidden) {
        list.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewRecord(record) {
    document.getElementById('diseaseName').textContent = record.predictedDisease;
    document.getElementById('cause').textContent = record.cause || 'No specific cause identified.';
    document.getElementById('recommendation').textContent = record.recommendation;

    // Use the same display functions for historical records
    displayOrganicSolutions(record.organicSolutions);
    displayChemicalSolutions(record.chemicalSolutions);
    displayPreventionTips(record.preventionTips);

    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

async function clearHistory() {
    if (!confirm('Are you sure you want to delete all previous scan records? This action cannot be undone.')) return;

    try {
        await ApiService.clearDiseaseHistory(farmId);
        loadHistory();
        alert('History cleared successfully.');
    } catch (e) {
        console.error(e);
        alert('Failed to clear records.');
    }
}

async function loadHistory() {
    const list = document.getElementById('historyList');
    const countEl = document.getElementById('historyCount');

    try {
        const history = await ApiService.getPredictionHistory(farmId);
        list.innerHTML = '';
        countEl.textContent = history.length + ' Records';

        if (history.length === 0) {
            list.innerHTML = `
                <div class="sd-card text-center p-4" style="grid-column: 1/-1; border: 1px dashed var(--border-color); background: transparent;">
                    <p style="color: var(--text-muted);">No analysis history for this field yet.</p>
                </div>
            `;
            return;
        }

        history.reverse().forEach(record => {
            const isHealthy = record.predictedDisease.toLowerCase() === 'healthy';
            const badgeClass = isHealthy ? 'badge-success' : 'badge-danger';
            const dateStr = new Date(record.predictionDate).toLocaleDateString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const card = document.createElement('div');
            card.className = 'sd-card stat-card';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'flex-start';
            card.style.gap = '0.5rem';
            card.style.cursor = 'pointer';
            card.onclick = () => viewRecord(record);

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${dateStr}</span>
                </div>
                <h4 class="heading-font" style="color: var(--primary); font-size: 1.1rem;">${record.predictedDisease}</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Click to view analysis details</p>
            `;
            list.appendChild(card);
        });

    } catch (e) {
        list.innerHTML = '<div class="sd-card text-center p-4" style="grid-column: 1/-1;"><p style="color: var(--error);">Error loading history logs.</p></div>';
    }
}

// Initial Load
loadHistory();
