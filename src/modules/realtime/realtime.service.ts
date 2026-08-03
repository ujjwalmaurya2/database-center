export class RealtimeService {
  private static channels = [
    { id: 'ch_presence_global', name: 'global:presence', connectedClients: 14, peakClients: 28, mode: 'PRESENCE' },
    { id: 'ch_storage_sync', name: 'storage:sync-events', connectedClients: 9, peakClients: 15, mode: 'BROADCAST' },
    { id: 'ch_db_changes', name: 'db:table-mutations', connectedClients: 5, peakClients: 12, mode: 'POSTGRES_CDC' },
  ];

  public static async listChannels() {
    return this.channels;
  }

  public static async broadcastMessage(channelName: string, event: string, payload: any) {
    let target = this.channels.find((c) => c.name === channelName);
    if (!target) {
      target = {
        id: `ch_${Date.now()}`,
        name: channelName,
        connectedClients: 1,
        peakClients: 1,
        mode: 'BROADCAST',
      };
      this.channels.push(target);
    }

    return {
      channel: channelName,
      event,
      payload,
      recipients: target.connectedClients,
      timestamp: new Date(),
    };
  }
}
