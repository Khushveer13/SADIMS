const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'ADMIN') window.location.href = '../auth/login.html';

async function loadFarms() {
    const list = document.getElementById('farmsList');
    const countEl = document.getElementById('farmCount');
    try {
        const farms = await ApiService.getAllFarms();
        list.innerHTML = '';
        countEl.textContent = farms.length + ' Fields';

        if (farms.length === 0) {
            list.innerHTML = '<tr><td colspan="5" class="text-center p-4">No farm records found in registry.</td></tr>';
            return;
        }

        farms.forEach(farm => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="font-family: monospace; font-weight: 600;">#F-${farm.id}</span></td>
                <td><span style="font-weight: 600;">Farmer ID: ${farm.farmerId}</span></td>
                <td><i data-lucide="map-pin" style="width: 12px; vertical-align: middle; margin-right: 4px;"></i>${farm.location}</td>
                <td><span class="badge" style="background: var(--accent-soft); color: var(--primary);">${farm.cropType}</span></td>
                <td><span class="badge" style="background: rgba(221, 161, 94, 0.15); color: #DDA15E;">${farm.soilType}</span></td>
            `;
            list.appendChild(row);
        });

        if (window.lucide) lucide.createIcons();
    } catch (e) {
        list.innerHTML = '<tr><td colspan="5" class="text-center p-4" style="color: var(--error);">Failed to load registry records.</td></tr>';
    }
}
loadFarms();
