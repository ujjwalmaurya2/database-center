import { StorageProvider } from './storage-provider.interface';

export class StorageProviderRegistry {
  private static providers = new Map<string, StorageProvider>();
  private static defaultProviderName = 'google_drive';

  public static registerProvider(provider: StorageProvider): void {
    this.providers.set(provider.providerName.toLowerCase(), provider);
    console.log(`[StorageProviderRegistry] Registered provider plugin: ${provider.providerName}`);
  }

  public static getProvider(name?: string): StorageProvider {
    const targetName = (name || this.defaultProviderName).toLowerCase();
    const provider = this.providers.get(targetName);
    if (!provider) {
      throw new Error(`[StorageProviderRegistry] Storage provider '${targetName}' is not registered.`);
    }
    return provider;
  }

  public static setDefaultProvider(name: string): void {
    if (!this.providers.has(name.toLowerCase())) {
      throw new Error(`[StorageProviderRegistry] Cannot set default. Provider '${name}' not found.`);
    }
    this.defaultProviderName = name.toLowerCase();
  }

  public static listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
