const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'FARMER') window.location.href = '../auth/login.html';

document.getElementById('userName').textContent = user.name;

async function loadFarms() {
    const list = document.getElementById('farmsList');
    list.innerHTML = '<div class="sd-card text-center p-4" style="grid-column: 1/-1;"><p>Refreshing data...</p></div>';

    try {
        const farms = await ApiService.getFarms(user.id);
        list.innerHTML = '';

        document.getElementById('totalFieldsCnt').textContent = farms.length;
        // Mocking total checks for now as it's not in the base farm object
        document.getElementById('totalChecksCnt').textContent = farms.length * 3;

        if (farms.length === 0) {
            list.innerHTML = `
                <div class="sd-card text-center p-4" style="grid-column: 1/-1; border: 2px dashed var(--border-color); background: transparent;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🚜</div>
                    <p style="color: var(--text-muted); font-weight: 500;">No farms registered yet.</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Use the form above to add your first field.</p>
                </div>
            `;
            return;
        }

        farms.forEach(farm => {
            const card = document.createElement('div');
            card.className = 'sd-card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <h4 class="heading-font" style="color: var(--primary);">${farm.location}</h4>
                    <span class="badge badge-success">Healthy</span>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                        <span style="color: var(--text-muted);">Crop Type</span>
                        <span style="font-weight: 600;">${farm.cropType}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Soil Condition</span>
                        <span style="font-weight: 600;">${farm.soilType}</span>
                    </div>
                </div>
                <hr style="border: none; border-top: 1px solid var(--border-color); margin: 1rem 0;">
                <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                    <button onclick="goToDisease(${farm.id})" class="sd-btn sd-btn-primary" style="font-size: 0.85rem; padding: 0.6rem;">
                        <i data-lucide="camera" style="width: 14px;"></i> Scan Disease
                    </button>
                    <button onclick="goToWeather(${farm.id})" class="sd-btn" style="font-size: 0.85rem; padding: 0.6rem; background: var(--bg-main); border: 1px solid var(--border-color);">
                        <i data-lucide="cloud-sun" style="width: 14px;"></i> Weather Log
                    </button>
                </div>
            `;
            list.appendChild(card);
        });

        // Refresh icons after dynamic insert
        if (window.lucide) lucide.createIcons();

    } catch (e) {
        list.innerHTML = '<div class="sd-card text-center p-4" style="grid-column: 1/-1;"><p style="color: var(--error);">Failed to load fields. Please check connection.</p></div>';
    }
}

document.getElementById('addFarmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loc = document.getElementById('location').value;
    const crop = document.getElementById('crop').value;
    const soil = document.getElementById('soil').value;

    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Registering...';
    btn.disabled = true;

    try {
        if (loc && crop && soil) {
            await ApiService.addFarm(loc, soil, crop, user.id);
            document.getElementById('location').value = '';
            document.getElementById('crop').value = '';
            document.getElementById('soil').value = '';
            await loadFarms();
        }
    } catch (error) {
        alert('Failed to register farm. Try again.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

function goToDisease(farmId) {
    window.location.href = `disease.html?farmId=${farmId}`;
}

function goToWeather(farmId) {
    window.location.href = `weather.html?farmId=${farmId}`;
}

function selectField(name, ph, moisture) {
    document.getElementById('tooltip-name').textContent = name;
    document.getElementById('tooltip-ph').textContent = ph;
    document.getElementById('selected-field-trend').textContent = name + ' Trend';
    
    // Highlight and animate moisture bars
    const barFills = document.querySelectorAll('.bar-fill');
    if (barFills.length >= 5) {
        barFills[0].style.height = `${moisture}%`;
        barFills[1].style.height = `${Math.max(10, moisture - 20)}%`;
        barFills[2].style.height = `${Math.min(100, moisture + 15)}%`;
        barFills[3].style.height = `${Math.max(10, moisture - 10)}%`;
        barFills[4].style.height = `${Math.min(100, moisture + 5)}%`;
    }
}

function animateCircularProgress() {
    const circle = document.querySelector('.progress-bar-svg');
    if (circle) {
        // Circumference is 440 in style.css stroke-dasharray
        // Animate from 440 to 440 - (440 * 0.92) = 35.2
        circle.style.strokeDashoffset = '440';
        setTimeout(() => {
            circle.style.strokeDashoffset = '35.2';
        }, 100);
    }
}

// Init
loadFarms();
animateCircularProgress();
