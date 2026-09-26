const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'ADMIN') window.location.href = '../auth/login.html';

async function loadFarmers() {
    const list = document.getElementById('farmersList');
    const countEl = document.getElementById('farmerCount');

    try {
        const farms = await ApiService.getAllFarms();

        const farmersMap = new Map();
        farms.forEach(f => {
            if (f.user) {
                if (!farmersMap.has(f.user.id)) {
                    farmersMap.set(f.user.id, {
                        id: f.user.id,
                        name: f.user.name,
                        mobile: f.user.mobileNumber,
                        farmCount: 0
                    });
                }
                farmersMap.get(f.user.id).farmCount++;
            }
        });

        const farmers = Array.from(farmersMap.values());
        list.innerHTML = '';
        countEl.textContent = farmers.length + ' Farmers';

        if (farmers.length === 0) {
            list.innerHTML = '<tr><td colspan="5" class="text-center p-4">No registered farmers found.</td></tr>';
            return;
        }

        farmers.forEach(farmer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="font-family: monospace; font-weight: 600;">#U-${farmer.id}</span></td>
                <td><span style="font-weight: 600;">${farmer.name}</span></td>
                <td><i data-lucide="phone" style="width: 12px; vertical-align: middle; margin-right: 4px;"></i>${farmer.mobile}</td>
                <td><span class="badge" style="background: var(--accent-soft); color: var(--primary);">${farmer.farmCount} Fields</span></td>
                <td><span class="badge badge-success">Authorized</span></td>
             `;
            list.appendChild(row);
        });

        if (window.lucide) lucide.createIcons();

    } catch (e) {
        list.innerHTML = '<tr><td colspan="5" class="text-center p-4" style="color: var(--error);">Failed to synchronize farmer registry.</td></tr>';
    }
}

loadFarmers();
