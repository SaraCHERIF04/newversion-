import { 
  initializeRemoteConfig, 
  getRemoteConfigString, 
  getRemoteConfigBoolean, 
  getRemoteConfigNumber, 
  getRemoteConfigJSON,
  isFeatureEnabled
} from './firebase';

class RemoteConfigService {
  /**
   * Initialize the Remote Config service
   * This should be called as early as possible in the app lifecycle
   */
  async initialize() {
    return await initializeRemoteConfig();
  }

  /**
   * Get a string config value
   * @param key The config key
   * @param defaultValue Optional default value if config isn't available
   */
  getString(key: string, defaultValue = ''): string {
    const value = getRemoteConfigString(key);
    return value || defaultValue;
  }

  /**
   * Get a boolean config value
   * @param key The config key
   * @param defaultValue Optional default value if config isn't available
   */
  getBoolean(key: string, defaultValue = false): boolean {
    const value = getRemoteConfigBoolean(key);
    return typeof value === 'boolean' ? value : defaultValue;
  }

  /**
   * Get a number config value
   * @param key The config key
   * @param defaultValue Optional default value if config isn't available
   */
  getNumber(key: string, defaultValue = 0): number {
    const value = getRemoteConfigNumber(key);
    return isNaN(value) ? defaultValue : value;
  }

  /**
   * Get a JSON config value
   * @param key The config key
   * @param defaultValue Optional default value if config isn't available
   */
  getJSON(key: string, defaultValue = {}): any {
    const value = getRemoteConfigJSON(key);
    return value || defaultValue;
  }

  /**
   * Check if a feature flag is enabled
   * @param featureName The name of the feature to check
   * @param defaultValue Optional default value if feature flag isn't available
   */
  isFeatureEnabled(featureName: string, defaultValue = false): boolean {
    return isFeatureEnabled(featureName) || defaultValue;
  }

  /**
   * Check if maintenance mode is enabled
   */
  isMaintenanceModeEnabled(): boolean {
    return this.getBoolean('maintenance_mode', false);
  }

  /**
   * Get the allowed document types
   */
  getAllowedDocumentTypes(): string[] {
    return this.getString('allowed_document_types', 'pdf,doc,docx').split(',');
  }

  /**
   * Get the maximum file size in MB
   */
  getMaxFileSizeMB(): number {
    return this.getNumber('max_file_size_mb', 10);
  }

  /**
   * Get the current app version from remote config
   */
  getAppVersion(): string {
    return this.getString('app_version', '1.0.0');
  }

  /**
   * Check if document sharing is enabled
   */
  isDocumentSharingEnabled(): boolean {
    return this.getBoolean('enable_document_sharing', false);
  }
}

export const remoteConfigService = new RemoteConfigService(); 