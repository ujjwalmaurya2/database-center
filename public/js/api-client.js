// DriveBase Central API Client
class DriveBaseAPI {
  static baseUrl = '/api/v1';

  static getAccessToken() {
    return localStorage.getItem('drivebase_access_token');
  }

  static getActiveProjectId() {
    return localStorage.getItem('drivebase_active_project_id') || 'proj_alpha_1';
  }

  static setActiveProjectId(id) {
    localStorage.setItem('drivebase_active_project_id', id);
  }

  static setTokens(accessToken, refreshToken) {
    localStorage.setItem('drivebase_access_token', accessToken);
    localStorage.setItem('drivebase_refresh_token', refreshToken);
  }

  static clearTokens() {
    localStorage.removeItem('drivebase_access_token');
    localStorage.removeItem('drivebase_refresh_token');
  }

  static async request(endpoint, options = {}) {
    const token = this.getAccessToken();
    const activeProject = this.getActiveProjectId();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(activeProject ? { 'x-project-id': activeProject } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
      return data;
    } catch (error) {
      console.error(`[DriveBase API Error] ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth Methods
  static async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.accessToken) {
      this.setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  }

  static async register(email, password, fullName, role = 'OWNER') {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });
    if (res.data?.accessToken) {
      this.setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  }

  static async getProfile() {
    return this.request('/auth/me', { method: 'GET' });
  }

  static async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  // Projects Methods
  static async getProjects() {
    return this.request('/projects', { method: 'GET' });
  }

  static async createProject(name, slug, description) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, slug, description }),
    });
  }

  static async getProjectDetails(id) {
    return this.request(`/projects/${id}`, { method: 'GET' });
  }

  static async updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async archiveProject(id) {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  static async restoreProject(id) {
    return this.request(`/projects/${id}/restore`, { method: 'POST' });
  }

  // Environment Variables & Secrets Methods
  static async getEnvVars(projectId) {
    return this.request(`/projects/${projectId}/env`, { method: 'GET' });
  }

  static async setEnvVar(projectId, key, value, isSecret = false) {
    return this.request(`/projects/${projectId}/env`, {
      method: 'POST',
      body: JSON.stringify({ key, value, isSecret }),
    });
  }

  static async deleteEnvVar(projectId, key) {
    return this.request(`/projects/${projectId}/env/${key}`, { method: 'DELETE' });
  }
}

window.DriveBaseAPI = DriveBaseAPI;
