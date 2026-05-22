const API_BASE_URL = "http://localhost:8080/api";

class ApiService {
    // --- Auth ---
    static async login(mobileNumber, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber, password })
        });
        return this.handleResponse(response);
    }

    static async changePassword(userId, oldPassword, newPassword) {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, oldPassword, newPassword })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to update password');
        }
        return true;
    }

    static async register(name, mobileNumber, password) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, mobileNumber, password })
        });
        return this.handleResponse(response);
    }

    // --- Farms ---
    static async getFarms(userId) {
        const response = await fetch(`${API_BASE_URL}/farms/user/${userId}`);
        return this.handleResponse(response);
    }

    static async addFarm(location, soilType, cropType, userId) {
        const response = await fetch(`${API_BASE_URL}/farms?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, soilType, cropType })
        });
        return this.handleResponse(response);
    }

    // --- Disease ---
    static async uploadDiseaseImage(farmId, imagePath) {
        const response = await fetch(`${API_BASE_URL}/disease/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ farmId, imagePath })
        });
        return this.handleResponse(response);
    }

    static async getPredictionHistory(farmId) {
        const response = await fetch(`${API_BASE_URL}/disease/history/${farmId}`);
        return this.handleResponse(response);
    }

    static async clearDiseaseHistory(farmId) {
        const response = await fetch(`${API_BASE_URL}/disease/history/${farmId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to clear history');
        return true;
    }

    // --- Weather ---
    static async addWeather(farmId, data) {
        const response = await fetch(`${API_BASE_URL}/weather?farmId=${farmId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    static async getWeatherHistory(farmId) {
        const response = await fetch(`${API_BASE_URL}/weather/${farmId}`);
        return this.handleResponse(response);
    }

    static async clearWeatherHistory(farmId) {
        const response = await fetch(`${API_BASE_URL}/weather/${farmId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to clear weather history');
        return true;
    }

    // --- Admin ---
    static async getAdminStats() {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
        return this.handleResponse(response);
    }

    static async getAllFarms() {
        const response = await fetch(`${API_BASE_URL}/admin/farms`);
        return this.handleResponse(response);
    }

    static async getGlobalDiseases() {
        const response = await fetch(`${API_BASE_URL}/admin/diseases`);
        return this.handleResponse(response);
    }

    static async getGlobalWeather() {
        const response = await fetch(`${API_BASE_URL}/admin/weather`);
        return this.handleResponse(response);
    }

    static async getGlobalReports() {
        const [diseases, weather] = await Promise.all([
            this.getGlobalDiseases(),
            this.getGlobalWeather()
        ]);

        return {
            diseaseHistory: diseases,
            weatherHistory: weather
        };
    }

    // --- Helper ---
    static async handleResponse(response) {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }
}
