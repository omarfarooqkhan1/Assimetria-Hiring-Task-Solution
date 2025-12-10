import { DatabaseStorage } from "../../core/storage";
import { HealthStatus } from "../../core/storage";

export interface IHealthService {
  getHealthStatus(): Promise<HealthStatus>;
}

export class HealthService implements IHealthService {
  private storage: DatabaseStorage;

  constructor(storage: DatabaseStorage) {
    this.storage = storage;
  }

  async getHealthStatus(): Promise<HealthStatus> {
    return this.storage.getHealthStatus();
  }
}

// Export singleton instance
export const healthService = new HealthService(new DatabaseStorage());