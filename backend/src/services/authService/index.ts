import { DatabaseStorage } from "../../core/storage";
import { User, InsertUser } from "../../models";

export interface IAuthService {
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
}

export class AuthService implements IAuthService {
  private storage: DatabaseStorage;

  constructor(storage: DatabaseStorage) {
    this.storage = storage;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.storage.getUserByUsername(username);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.storage.getUserById(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.storage.createUser(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    return this.storage.validateUser(username, password);
  }
}

// Export singleton instance
export const authService = new AuthService(new DatabaseStorage());