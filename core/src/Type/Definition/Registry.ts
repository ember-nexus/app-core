interface RegistryInterface<T = unknown> {
  getEntry(key: string): T | null;
  hasEntry(key: string): boolean;
  setEntry(key: string, entry: T): this;
  deleteEntry(key: string): this;
  clearEntries(): this;
}

class Registry<T = unknown> implements RegistryInterface<T> {
  private readonly entries: Map<string, T> = new Map();

  clearEntries(): this {
    this.entries.clear();
    return this;
  }

  deleteEntry(key: string): this {
    this.entries.delete(key);
    return this;
  }

  getEntry(key: string): T | null {
    if (!this.hasEntry(key)) {
      return null;
    }
    return this.entries.get(key) as T;
  }

  hasEntry(key: string): boolean {
    return this.entries.has(key);
  }

  setEntry(key: string, entry: T): this {
    this.entries.set(key, entry);
    return this;
  }
}

export { Registry, RegistryInterface };
