import client from 'prom-client';

// Collect default process metrics
client.collectDefaultMetrics({ prefix: 'drivebase_' });

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'drivebase_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
});

export const activeConnectionsCounter = new client.Gauge({
  name: 'drivebase_active_connections',
  help: 'Number of active connections',
});

export const totalAuthRequests = new client.Counter({
  name: 'drivebase_auth_requests_total',
  help: 'Total authentication requests',
  labelNames: ['status'],
});

export async function getPrometheusMetrics(): Promise<string> {
  return client.register.metrics();
}
