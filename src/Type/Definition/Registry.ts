interface RegistryInterface<T = unknown> {
  getEntry(key: string): T | null;
  hasEntry(key: string): boolean;
  setEntry(key: string, value: T): this;
  deleteEntry(key: string): this;
  clearEntries(): this;
}

interface PriorityRegistryInterface extends RegistryInterface {
  setEntry<T = unknown>(key: string, value: T, priority?: number): this;
  getAllEntriesForKey<T = unknown[]>(key: string): T | null;
}

class Registry<T = unknown> implements RegistryInterface {
  private readonly entries: Map<string, T> = new Map();

  clearEntries(): this {
    this.entries.clear();
    return this;
  }

  deleteEntry(key: string): this {
    this.entries.delete(key);
    return this;
  }

  getEntry<T = unknown>(key: string): T | null {
    if (!this.hasEntry(key)) {
      return null;
    }
    return this.entries.get(key) as T;
  }

  hasEntry(key: string): boolean {
    return this.entries.has(key);
  }

  setEntry(key: string, value: T): this {
    this.entries.set(key, value);
    return this;
  }
}

export { RegistryInterface, PriorityRegistryInterface, Registry };
