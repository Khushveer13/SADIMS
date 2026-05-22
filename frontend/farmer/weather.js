const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'FARMER') {
    window.location.href = '../auth/login.html';
}

// Dynamic user name in header
if (user && user.name) {
    const headerUserNameEl = document.getElementById('headerUserName');
    if (headerUserNameEl) {
        headerUserNameEl.textContent = user.name;
    }
}

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
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check-circle" style="width: 16px;"></i> Saved Successfully!';
        btn.style.background = 'var(--neon-green)';
        btn.style.borderColor = 'var(--neon-green)';
        btn.style.color = 'var(--bg-main)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            if (window.lucide) lucide.createIcons();
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
            // Default mock fallback values when empty
            document.getElementById('liveTempDisplay').textContent = '28.4°C';
            document.getElementById('liveHumidDisplay').textContent = '62.5%';
            document.getElementById('liveRainDisplay').textContent = '8.2 mm';
            document.getElementById('liveSoilMoistureVal').textContent = '68%';
            
            const badge = document.getElementById('hydrationStatusBadge');
            badge.textContent = 'OPTIMAL';
            badge.className = 'badge';
            badge.style.background = 'rgba(16, 185, 129, 0.08)';
            badge.style.color = 'var(--neon-green)';
            badge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            
            // Set input date to today by default
            document.getElementById('date').value = new Date().toISOString().substring(0, 10);
            return;
        }

        // The records array is usually returned chronologically by backend (e.g. oldest first).
        // Let's copy it and reverse it to get latest first.
        const sortedRecords = [...records].reverse();
        
        // Update live widgets with the latest record
        const latest = sortedRecords[0];
        document.getElementById('liveTempDisplay').textContent = `${latest.temperature.toFixed(1)}°C`;
        document.getElementById('liveHumidDisplay').textContent = `${latest.humidity.toFixed(1)}%`;
        document.getElementById('liveRainDisplay').textContent = `${latest.rainfall.toFixed(1)} mm`;
        document.getElementById('liveSoilMoistureVal').textContent = `${latest.humidity.toFixed(0)}%`;

        // Update wave height dynamically
        const waveSvg = document.querySelector('.wave-svg');
        if (waveSvg) {
            // map humidity (0-100) to svg bottom position or wave-svg height
            const height = 40 + (latest.humidity * 0.4); // ranges from 40px to 80px
            waveSvg.style.height = `${height}px`;
        }

        // Dynamic hydration status
        const badge = document.getElementById('hydrationStatusBadge');
        if (latest.humidity >= 60) {
            badge.innerHTML = '<i data-lucide="droplet" style="width: 12px; margin-right: 4px; vertical-align: middle;"></i> OPTIMAL';
            badge.className = 'badge';
            badge.style.background = 'rgba(16, 185, 129, 0.08)';
            badge.style.color = 'var(--neon-green)';
            badge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        } else if (latest.humidity >= 40) {
            badge.innerHTML = '<i data-lucide="alert-circle" style="width: 12px; margin-right: 4px; vertical-align: middle;"></i> CAUTION';
            badge.className = 'badge';
            badge.style.background = 'rgba(245, 158, 11, 0.08)';
            badge.style.color = 'var(--neon-amber)';
            badge.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        } else {
            badge.innerHTML = '<i data-lucide="droplet-off" style="width: 12px; margin-right: 4px; vertical-align: middle;"></i> CRITICAL';
            badge.className = 'badge';
            badge.style.background = 'rgba(239, 68, 68, 0.08)';
            badge.style.color = 'var(--neon-red)';
            badge.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        }

        sortedRecords.forEach(r => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="font-weight: 600;">${new Date(r.recordDate).toLocaleDateString()}</span></td>
                <td><i data-lucide="thermometer" style="width: 12px; vertical-align: middle; margin-right: 4px; color: var(--neon-teal);"></i>${r.temperature}°C</td>
                <td><i data-lucide="droplets" style="width: 12px; vertical-align: middle; margin-right: 4px; color: var(--neon-blue);"></i>${r.humidity}%</td>
                <td><i data-lucide="cloud-rain" style="width: 12px; vertical-align: middle; margin-right: 4px; color: var(--neon-blue);"></i>${r.rainfall}mm</td>
            `;
            tbody.appendChild(row);
        });

        // Set input date to today by default
        document.getElementById('date').value = new Date().toISOString().substring(0, 10);

        if (window.lucide) lucide.createIcons();

    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4" style="color: var(--error);">Failed to sync field climate history.</td></tr>';
    }
}

loadWeather();
