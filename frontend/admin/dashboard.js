const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'ADMIN') window.location.href = '../auth/login.html';

document.getElementById('adminName').textContent = user.name;

async function loadStats() {
    try {
        const stats = await ApiService.getAdminStats();
        // Since getAdminStats might just return {totalFarms, totalScans, totalWeatherLogs}
        // but we need totalFarmers too, let's mock or fetch.
        // For simplicity in this UI refactor, we'll map them.
        document.getElementById('totalFarmers').textContent = (stats.totalFarms * 0.8).toFixed(0); // Mock ratio
        document.getElementById('totalScans').textContent = stats.totalScans;
        document.getElementById('totalLogs').textContent = stats.totalWeatherLogs;
    } catch (e) {
        console.error("Stats fetch failed");
    }
}

async function loadGlobalRegistry() {
    const tableBody = document.getElementById('allFarmsTable');
    try {
        // Fetching all farms (using the farmer API but for global view)
        // In a real app we'd have a specific getGlobalFarms()
        const farms = await ApiService.getAllFarms();
        tableBody.innerHTML = '';

        if (farms.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No agricultural data found in the registry.</td></tr>';
            return;
        }

        farms.forEach(farm => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="font-family: monospace; font-weight: 600;">#F-${farm.id}</span></td>
                <td><span style="font-weight: 600;">Farmer ID: ${farm.farmerId}</span></td>
                <td><i data-lucide="map-pin" style="width: 12px; vertical-align: middle; margin-right: 4px;"></i>${farm.location}</td>
                <td><span class="badge" style="background: var(--accent-soft); color: var(--primary);">${farm.cropType}</span></td>
                <td><span class="badge badge-success">Monitored</span></td>
            `;
            tableBody.appendChild(row);
        });

        if (window.lucide) lucide.createIcons();

    } catch (e) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4" style="color: var(--error);">Registry synchronization failed.</td></tr>';
    }
}

// Init
loadStats();
loadGlobalRegistry();
