// DriveBase Central API Client with Dynamic Production BaseURL & Resilience
class DriveBaseAPI {
  static get baseUrl() {
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}/api/v1`;
    }
    return '/api/v1';
  }

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
    const path = (window.location.pathname || '').toLowerCase();
    const isAuthPage = path.endsWith('auth.html') || path.endsWith('/auth');
    
    if (!token && !isAuthPage) {
      console.warn('[DriveBase Auth] No access token found. Redirecting to auth page.');
      window.location.href = 'auth.html';
      return false;
    }
    return true;
  }

  static getGoogleAuthUrl() {
    const token = this.getAccessToken();
    const projectId = this.getActiveProjectId();
    let url = `${this.baseUrl}/auth/google`;
    const params = [];
    if (token) params.push(`token=${encodeURIComponent(token)}`);
    if (projectId) params.push(`projectId=${encodeURIComponent(projectId)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return url;
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

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { error: { message: 'Invalid server response' } };
      }

      // ONLY handle explicit 401 Unauthorized for true invalid/expired tokens (do NOT redirect on 500, 502, 503, 504, 404, or network glitches)
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        console.warn(`[DriveBase API] 401 Unauthorized on ${endpoint}. Session token expired.`);
        this.clearSession();
        const path = (window.location.pathname || '').toLowerCase();
        if (!path.endsWith('auth.html') && !path.endsWith('/auth')) {
          window.location.href = 'auth.html';
        }
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.error?.message || `API request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`[DriveBase API Network Note] ${endpoint}:`, error.message);
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

  // BYO Google Credentials Methods
  static async getGoogleCredentials(projectId) {
    return this.request(`/projects/${projectId}/google-credentials`, { method: 'GET' });
  }

  static async saveGoogleCredentials(projectId, clientId, clientSecret) {
    return this.request(`/projects/${projectId}/google-credentials`, {
      method: 'POST',
      body: JSON.stringify({ clientId, clientSecret }),
    });
  }

  static async deleteGoogleCredentials(projectId) {
    return this.request(`/projects/${projectId}/google-credentials`, { method: 'DELETE' });
  }

  // StorageProvider Methods
  static async getStorageStatus() {
    return this.request('/storage/status', { method: 'GET' });
  }

  static async getStorageQuota() {
    return this.request('/storage/quota', { method: 'GET' });
  }

  static async uploadFileFormData(file) {
    const token = this.getAccessToken();
    const activeProject = this.getActiveProjectId();
    const formData = new FormData();
    formData.append('file', file, file.name);

    const res = await fetch(`${this.baseUrl}/storage/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(activeProject ? { 'x-project-id': activeProject } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'File upload failed');
    }
    return data;
  }

  static async uploadFile(fileName, mimeType, arrayBuffer) {
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const file = new File([blob], fileName, { type: mimeType });
    return this.uploadFileFormData(file);
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

  // Sync Engine Methods
  static async getSyncStatus() {
    return this.request('/sync/status', { method: 'GET' });
  }

  static async triggerSync() {
    return this.request('/sync/trigger', { method: 'POST' });
  }

  static async pauseSync() {
    return this.request('/sync/pause', { method: 'POST' });
  }

  static async resumeSync() {
    return this.request('/sync/resume', { method: 'POST' });
  }

  static async retryFailedSync() {
    return this.request('/sync/retry-failed', { method: 'POST' });
  }

  // Conflict Engine Methods
  static async getConflicts() {
    return this.request('/conflicts', { method: 'GET' });
  }

  static async getConflictDiff(id) {
    return this.request(`/conflicts/${id}/diff`, { method: 'GET' });
  }

  static async resolveConflict(id, strategy) {
    return this.request(`/conflicts/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ strategy }),
    });
  }

  // Recovery & Snapshot Methods
  static async getSnapshots() {
    return this.request('/recovery/snapshots', { method: 'GET' });
  }

  static async createSnapshot(name) {
    return this.request('/recovery/snapshots', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  static async rollbackSnapshot(id) {
    return this.request(`/recovery/snapshots/${id}/rollback`, { method: 'POST' });
  }

  // Realtime Methods
  static async getRealtimeChannels() {
    return this.request('/realtime/channels', { method: 'GET' });
  }

  static async broadcastRealtime(channel, event, payload) {
    return this.request('/realtime/broadcast', {
      method: 'POST',
      body: JSON.stringify({ channel, event, payload }),
    });
  }

  // Edge Functions Methods
  static async getFunctions() {
    return this.request('/functions', { method: 'GET' });
  }

  static async createFunction(name, routePath, code) {
    return this.request('/functions', {
      method: 'POST',
      body: JSON.stringify({ name, routePath, code }),
    });
  }

  static async updateFunction(id, data) {
    return this.request(`/functions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteFunction(id) {
    return this.request(`/functions/${id}`, { method: 'DELETE' });
  }

  static async invokeFunction(id, payload = {}) {
    return this.request(`/functions/${id}/invoke`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // API Keys Methods
  static async getApiKeys() {
    return this.request('/api-keys', { method: 'GET' });
  }

  static async createApiKey(name, role = 'ADMIN') {
    return this.request('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, role }),
    });
  }

  static async deleteApiKey(id) {
    return this.request(`/api-keys/${id}`, { method: 'DELETE' });
  }

  // Database Introspection & SQL Methods
  static async getDbTables() {
    return this.request('/database/tables', { method: 'GET' });
  }

  static async getDbTableData(tableName) {
    return this.request(`/database/tables/${tableName}/data`, { method: 'GET' });
  }

  static async executeDbQuery(sql) {
    return this.request('/database/query', {
      method: 'POST',
      body: JSON.stringify({ sql }),
    });
  }

  // Logs & Analytics Methods
  static async getLogs(level, search) {
    let url = '/logs';
    const params = [];
    if (level) params.push(`level=${encodeURIComponent(level)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.request(url, { method: 'GET' });
  }

  static async getAnalyticsOverview() {
    return this.request('/analytics/overview', { method: 'GET' });
  }
}

window.DriveBaseAPI = DriveBaseAPI;
