/**
 * SADIMS - Cybernetic HUD System Notification Service
 * Synchronizes alerts, unread states, and user actions persistently in real-time across pages.
 */

const defaultAlerts = [
    {
        id: "alert-1",
        type: "DANGER",
        title: "Wheat Block B-12 Rust Detected",
        details: "Severity estimated at 68% (Moderate risk)",
        time: "2 mins ago",
        read: false,
        icon: "shield-alert",
        color: "var(--neon-red)"
    },
    {
        id: "alert-2",
        type: "HEALTHY",
        title: "Maize Block A-04 Normal Status",
        details: "Diagnostic scan successfully registered.",
        time: "1 hr ago",
        read: false,
        icon: "check-circle",
        color: "var(--neon-green)"
    },
    {
        id: "alert-3",
        type: "SYSTEM",
        title: "CROPSCAN AI Online",
        details: "Offline Emulation Engine v4.2 connected.",
        time: "System Start",
        read: true,
        icon: "cpu",
        color: "var(--neon-teal)"
    }
];

// Initialize Alerts from LocalStorage
function getAlerts() {
    let alerts = localStorage.getItem('system_alerts');
    if (!alerts) {
        localStorage.setItem('system_alerts', JSON.stringify(defaultAlerts));
        return defaultAlerts;
    }
    return JSON.parse(alerts);
}

// Save Alerts to LocalStorage
function saveAlerts(alerts) {
    localStorage.setItem('system_alerts', JSON.stringify(alerts));
    // Trigger storage event manually for same-window updates
    window.dispatchEvent(new Event('storage'));
}

// Prepend a dynamic new notification to the feed
function addNotification(type, title, details) {
    const alerts = getAlerts();
    
    // Type definitions
    let icon = "info";
    let color = "var(--neon-teal)";
    if (type === "DANGER") {
        icon = "shield-alert";
        color = "var(--neon-red)";
    } else if (type === "HEALTHY") {
        icon = "check-circle";
        color = "var(--neon-green)";
    }

    const newAlert = {
        id: "alert-" + Date.now(),
        type: type,
        title: title,
        details: details,
        time: "Just now",
        read: false,
        icon: icon,
        color: color
    };

    alerts.unshift(newAlert);
    
    // Limit to 8 alerts to prevent UI lag
    if (alerts.length > 8) {
        alerts.pop();
    }
    
    saveAlerts(alerts);
    renderNotifications();
}

// Render notification dropdown list and badge state
function renderNotifications() {
    const alerts = getAlerts();
    const badge = document.getElementById('notificationBadge');
    const listContainer = document.getElementById('notificationList');
    
    if (!listContainer) return;

    // Check for unread notifications
    const hasUnread = alerts.some(alert => !alert.read);
    if (badge) {
        badge.style.display = hasUnread ? 'block' : 'none';
    }

    // Build the markup
    listContainer.innerHTML = '';
    
    if (alerts.length === 0) {
        listContainer.innerHTML = `
            <div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 1.5rem 0;">
                No system alerts registered.
            </div>
        `;
        return;
    }

    alerts.forEach(alert => {
        const item = document.createElement('div');
        item.style.background = alert.read ? 'rgba(255, 255, 255, 0.005)' : 'rgba(255, 255, 255, 0.02)';
        item.style.border = alert.read ? '1px solid rgba(255, 255, 255, 0.02)' : `1px solid rgba(255, 255, 255, 0.06)`;
        item.style.borderLeft = alert.read ? `3px solid rgba(255, 255, 255, 0.05)` : `3px solid ${alert.color}`;
        item.style.borderRadius = '6px';
        item.style.padding = '0.55rem';
        item.style.fontSize = '0.72rem';
        item.style.lineHeight = '1.4';
        item.style.textAlign = 'left';
        item.style.transition = 'all 0.3s ease';
        
        // Add subtle unread glow
        if (!alert.read) {
            item.style.boxShadow = `0 0 8px rgba(255, 255, 255, 0.02)`;
        }

        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <span style="color: ${alert.color}; font-weight: 700; display: flex; align-items: center; gap: 4px; font-size: 0.65rem; text-transform: uppercase;">
                    <i data-lucide="${alert.icon}" style="width: 12px; height: 12px;"></i> ${alert.type}
                </span>
                <span style="color: var(--text-muted); font-size: 0.6rem;">${alert.time}</span>
            </div>
            <div style="color: ${alert.read ? 'var(--text-muted)' : '#fff'}; font-weight: ${alert.read ? '500' : '700'}; transition: color 0.3s;">${alert.title}</div>
            <div style="color: var(--text-muted); font-size: 0.65rem; margin-top: 1px;">${alert.details}</div>
        `;
        listContainer.appendChild(item);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Bulletproof Computed-Style Toggle notifications
function toggleNotifications(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('notificationsDropdown');
    if (!dropdown) return;
    
    // Using robust getComputedStyle
    const displayStyle = window.getComputedStyle(dropdown).display;
    const isHidden = displayStyle === 'none';
    
    dropdown.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        dropdown.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Force reflow
        dropdown.offsetHeight;
        
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }
}

// Mark all system alerts as read
function clearNotifications(e) {
    if (e) e.stopPropagation();
    
    const alerts = getAlerts();
    alerts.forEach(alert => {
        alert.read = true;
    });
    
    saveAlerts(alerts);
    renderNotifications();

    // Visual feedback within dropdown
    const btn = document.querySelector('#notificationsDropdown h4');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" style="width: 14px; color: var(--neon-green);"></i> Sync OK`;
        setTimeout(() => {
            btn.innerHTML = originalText;
            if (window.lucide) lucide.createIcons();
        }, 1200);
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (e) {
    // 1. Notifications Dropdown
    const dropdown = document.getElementById('notificationsDropdown');
    const btn = document.getElementById('notificationBellBtn');
    
    if (dropdown && btn) {
        const isVisible = window.getComputedStyle(dropdown).display !== 'none';
        if (isVisible && !dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 250);
        }
    }

    // 2. Profile Dropdown
    const profDropdown = document.getElementById('profileDropdown');
    const profBtn = document.getElementById('profileWidgetBtn');
    
    if (profDropdown && profBtn) {
        const isVisible = window.getComputedStyle(profDropdown).display !== 'none';
        if (isVisible && !profDropdown.contains(e.target) && !profBtn.contains(e.target)) {
            profDropdown.style.opacity = '0';
            profDropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                profDropdown.style.display = 'none';
            }, 250);
        }
    }
});

// Toggle user profile dropdown
function toggleProfileDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;
    
    // Close notifications dropdown if open
    const notifDropdown = document.getElementById('notificationsDropdown');
    if (notifDropdown) notifDropdown.style.display = 'none';

    const displayStyle = window.getComputedStyle(dropdown).display;
    const isHidden = displayStyle === 'none';
    
    dropdown.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        dropdown.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        
        dropdown.offsetHeight; // reflow
        
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }
}

// Global logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
}

// Real-time synchronization across browser tabs and views
window.addEventListener('storage', function (e) {
    renderNotifications();
});

// Initialize on script load
document.addEventListener('DOMContentLoaded', () => {
    renderNotifications();
});
