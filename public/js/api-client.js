// DriveBase Central API Client with JWT Persistence & Route Protection
class DriveBaseAPI {
  static baseUrl = '/api/v1';

  static getAccessToken() {
    return localStorage.getItem('drivebase_access_token');
  }

  static getRefreshToken() {
    return localStorage.getItem('drivebase_refresh_token');
  }

  static getUserProfile() {
    const raw = localStorage.getItem('drivebase_user_profile');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  static getActiveProjectId() {
    return localStorage.getItem('drivebase_active_project_id') || 'proj_alpha_1';
  }

  static setActiveProjectId(id) {
    localStorage.setItem('drivebase_active_project_id', id);
  }

  static setSession(accessToken, refreshToken, userProfile) {
    if (accessToken) localStorage.setItem('drivebase_access_token', accessToken);
    if (refreshToken) localStorage.setItem('drivebase_refresh_token', refreshToken);
    if (userProfile) localStorage.setItem('drivebase_user_profile', JSON.stringify(userProfile));
  }

  static clearSession() {
    localStorage.removeItem('drivebase_access_token');
    localStorage.removeItem('drivebase_refresh_token');
    localStorage.removeItem('drivebase_user_profile');
  }

  static requireAuth() {
    const token = this.getAccessToken();
    if (!token) {
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith('auth.html')) {
        window.location.href = 'auth.html';
      }
      return false;
    }
    return true;
  }

  static getGoogleAuthUrl() {
    const token = this.getAccessToken();
    return `${this.baseUrl}/auth/google${token ? '?token=' + encodeURIComponent(token) : ''}`;
  }

  static async request(endpoint, options = {}) {
    const token = this.getAccessToken();
    const activeProject = this.getActiveProjectId();
    
    // Automatically attach Bearer Authorization token to all requests
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
      
      // If 401 Unauthorized occurs on protected routes, clear session & redirect to login
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        console.warn(`[DriveBase API] 401 Unauthorized on ${endpoint}. Session expired.`);
        this.clearSession();
        if (!window.location.pathname.endsWith('auth.html')) {
          window.location.href = 'auth.html';
        }
        throw new Error('Session expired. Please log in again.');
      }

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
      this.setSession(res.data.accessToken, res.data.refreshToken, res.data.user);
    }
    return res;
  }

  static async register(email, password, fullName, role = 'OWNER') {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });
    if (res.data?.accessToken) {
      this.setSession(res.data.accessToken, res.data.refreshToken, res.data.user);
    }
    return res;
  }

  static async getProfile() {
    const res = await this.request('/auth/me', { method: 'GET' });
    if (res.data) {
      localStorage.setItem('drivebase_user_profile', JSON.stringify(res.data));
    }
    return res;
  }

  static async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearSession();
      window.location.href = 'auth.html';
    }
  }

  // Google OAuth & Connection Methods
  static async getGoogleStatus() {
    return this.request('/auth/google/status', { method: 'GET' });
  }

  static async disconnectGoogle() {
    return this.request('/auth/google/disconnect', { method: 'POST' });
  }

  // StorageProvider Methods
  static async getStorageStatus() {
    return this.request('/storage/status', { method: 'GET' });
  }

  static async getStorageQuota() {
    return this.request('/storage/quota', { method: 'GET' });
  }

  static async uploadFile(fileName, mimeType, arrayBuffer) {
    const token = this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/storage/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': mimeType || 'application/octet-stream',
        'X-File-Name': encodeURIComponent(fileName),
        'X-File-Type': mimeType || 'application/octet-stream',
      },
      body: arrayBuffer,
    });
    return res.json();
  }

  static async renameFile(id, newName) {
    return this.request(`/storage/files/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ newName }),
    });
  }

  static async deleteFile(id) {
    return this.request(`/storage/files/${id}`, { method: 'DELETE' });
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
