import { RegistryInterface } from './Registry.js';

interface PriorityRegistryInterface<T = unknown> extends RegistryInterface<T> {
  setEntry(key: string, entry: T, priority?: number): this;
  getAllEntriesForKey(key: string): T[] | null;
}

type PriorityRegistryEntry<T = unknown> = {
  priority: number;
  entry: T;
};

class PriorityRegistry<T = unknown> implements PriorityRegistryInterface {
  private readonly entries: Map<string, PriorityRegistryEntry<T>[]> = new Map();

  clearEntries(): this {
    this.entries.clear();
    return this;
  }

  deleteEntry(key: string): this {
    this.entries.delete(key);
    return this;
  }

  /**
   * Returns the entry with the highest priority.
   * If multiple entries have the same priority, the one which was added first gets returned.
   */
  getEntry(key: string): T | null {
    if (!this.hasEntry(key)) {
      return null;
    }
    const priorityRegistryEntries = this.entries.get(key)!;
    return priorityRegistryEntries[priorityRegistryEntries.length - 1].entry;
  }

  hasEntry(key: string): boolean {
    return this.entries.has(key);
  }

  setEntry(key: string, entry: T, priority?: number): this {
    if (priority === undefined) {
      priority = 0;
    }

    let entryList: PriorityRegistryEntry<T>[];
    if (!this.entries.has(key)) {
      entryList = [];
      this.entries.set(key, entryList);
    } else {
      entryList = this.entries.get(key)!;
    }

    // find correct index in list to add entry to
    let left = 0;
    let right = entryList.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (entryList[mid].priority >= priority) {
        result = mid; // Found a candidate, but keep searching in the left half
        right = mid - 1;
      } else {
        left = mid + 1; // Search in the right half
      }
    }

    const insertAt = result === -1 ? left : result;

    entryList.splice(insertAt, 0, { priority: priority, entry: entry });
    return this;
  }

  getAllEntriesForKey(key: string): T[] | null {
    if (!this.entries.has(key)) {
      return null;
    }
    return this.entries.get(key)!.map((priorityRegistryEntry) => priorityRegistryEntry.entry);
  }
}

export { PriorityRegistryInterface, PriorityRegistry };
