const urlParams = new URLSearchParams(window.location.search);
let farmId = urlParams.get('farmId');

if (farmId) {
    localStorage.setItem('lastFarmId', farmId);
} else {
    farmId = localStorage.getItem('lastFarmId');
}

if (!farmId) {
    alert('No farm selected! Please select a field from the dashboard first.');
    window.location.href = 'dashboard.html';
}

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        recordDate: document.getElementById('date').value,
        temperature: parseFloat(document.getElementById('temp').value),
        humidity: parseFloat(document.getElementById('humid').value),
        rainfall: parseFloat(document.getElementById('rain').value)
    };

    try {
        await ApiService.addWeather(farmId, data);
        loadWeather();
        e.target.reset();

        // Visual feedback
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Saved Successfully!';
        btn.classList.add('badge-success');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('badge-success');
        }, 2000);

    } catch (er) {
        alert('Failed to synchronize climate record.');
    }
});

async function clearWeatherHistory() {
    if (!confirm('Are you sure you want to delete all weather records? This action cannot be undone.')) return;

    try {
        await ApiService.clearWeatherHistory(farmId);
        loadWeather();
        alert('Records cleared successfully.');
    } catch (e) {
        console.error(e);
        alert('Failed to clear records.');
    }
}

async function loadWeather() {
    const tbody = document.getElementById('weatherTableBody');
    const countEl = document.getElementById('recordCount');

    try {
        const records = await ApiService.getWeatherHistory(farmId);
        tbody.innerHTML = '';
        countEl.textContent = records.length + ' Records';

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4">No historical climate records found for this field.</td></tr>';
            return;
        }

        records.reverse().forEach(r => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="font-weight: 600;">${new Date(r.recordDate).toLocaleDateString()}</span></td>
                <td><i data-lucide="thermometer" style="width: 12px; vertical-align: middle; margin-right: 4px;"></i>${r.temperature}°C</td>
                <td><i data-lucide="droplets" style="width: 12px; vertical-align: middle; margin-right: 4px;"></i>${r.humidity}%</td>
                <td><i data-lucide="cloud-rain" style="width: 12px; vertical-align: middle; margin-right: 4px;"></i>${r.rainfall}mm</td>
            `;
            tbody.appendChild(row);
        });

        if (window.lucide) lucide.createIcons();

    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4" style="color: var(--error);">Failed to sync field climate history.</td></tr>';
    }
}

loadWeather();
