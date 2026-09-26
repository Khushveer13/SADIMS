const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'ADMIN') window.location.href = '../auth/login.html';

function showSection(id) {
    document.getElementById('diseaseSection').classList.toggle('hidden', id !== 'disease');
    document.getElementById('weatherSection').classList.toggle('hidden', id !== 'weather');
    
    const btnDisease = document.getElementById('btnDisease');
    const btnWeather = document.getElementById('btnWeather');
    
    if (id === 'disease') {
        btnDisease.className = 'sd-btn sd-btn-primary';
        btnDisease.style.background = '';
        btnWeather.className = 'sd-btn';
        btnWeather.style.background = 'rgba(255, 255, 255, 0.03)';
    } else {
        btnDisease.className = 'sd-btn';
        btnDisease.style.background = 'rgba(255, 255, 255, 0.03)';
        btnWeather.className = 'sd-btn sd-btn-primary';
        btnWeather.style.background = '';
    }
}

async function loadData() {
    const diseaseTbody = document.getElementById('diseaseTable');
    const weatherTbody = document.getElementById('weatherTable');

    try {
        const stats = await ApiService.getGlobalReports();

        // Render Disease Table
        diseaseTbody.innerHTML = '';
        if (stats.diseaseHistory.length === 0) {
            diseaseTbody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No AI scan data available.</td></tr>';
        } else {
            stats.diseaseHistory.reverse().forEach(record => {
                const isHealthy = record.predictedDisease.toLowerCase() === 'healthy';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(record.predictionDate).toLocaleDateString()}</td>
                    <td><span style="font-family: monospace; font-weight: 600;">#F-${record.farmId}</span></td>
                    <td><span style="font-weight: 600;">${record.predictedDisease}</span></td>
                    <td><span style="font-weight: 700; color: var(--neon-green);">${record.confidenceScore.toFixed(1)}%</span></td>
                    <td><span class="badge ${isHealthy ? 'badge-success' : 'badge-danger'}">${isHealthy ? 'Healthy' : 'Diseased'}</span></td>
                `;
                diseaseTbody.appendChild(row);
            });
        }

        // Render Weather Table
        weatherTbody.innerHTML = '';
        if (stats.weatherHistory.length === 0) {
            weatherTbody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No climate records found.</td></tr>';
        } else {
            stats.weatherHistory.reverse().forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(record.logDate).toLocaleDateString()}</td>
                    <td><span style="font-family: monospace; font-weight: 600;">#F-${record.farmId}</span></td>
                    <td><i data-lucide="thermometer" style="width: 12px; vertical-align: middle; color: var(--neon-teal);"></i> ${record.temperature}°C</td>
                    <td><i data-lucide="droplets" style="width: 12px; vertical-align: middle; color: var(--neon-blue);"></i> ${record.humidity}%</td>
                    <td><i data-lucide="cloud-rain" style="width: 12px; vertical-align: middle; color: var(--neon-blue);"></i> ${record.rainfall}mm</td>
                `;
                weatherTbody.appendChild(row);
            });
        }

        if (window.lucide) lucide.createIcons();

    } catch (e) {
        diseaseTbody.innerHTML = '<tr><td colspan="5" class="text-center p-4" style="color: var(--error);">Error syncing disease intelligence.</td></tr>';
        weatherTbody.innerHTML = '<tr><td colspan="5" class="text-center p-4" style="color: var(--error);">Error syncing climate intelligence.</td></tr>';
    }
}

loadData();
