import { expect } from 'chai';

import { PriorityRegistry } from '../../../../src/Type/Definition';

describe('PriorityRegistry tests', () => {
  it('should return null on missing entry', () => {
    const registry = new PriorityRegistry<string>();
    expect(registry.getEntry('iDoNotExist')).to.be.null;
  });
  it('should return the same element as set earlier', () => {
    const registry = new PriorityRegistry<string>();
    registry.setEntry('key', 'someString');
    expect(registry.getEntry('key')).to.be.equal('someString');
  });
  it('should not overwrite elements which were set earlier', () => {
    const registry = new PriorityRegistry<string>();
    registry.setEntry('key', 'oldString');
    registry.setEntry('key', 'newString');
    expect(registry.getEntry('key')).to.be.equal('oldString');
  });
  it('should return element with higher priority', () => {
    const registry = new PriorityRegistry<string>();
    registry.setEntry('key', 'lowPriority', 1);
    registry.setEntry('key', 'highPriority', 10);
    expect(registry.getEntry('key')).to.be.equal('highPriority');
    registry.clearEntries();
    registry.setEntry('key', 'highPriority', 10);
    registry.setEntry('key', 'lowPriority', 1);
    expect(registry.getEntry('key')).to.be.equal('highPriority');
  });
  it('should return null for some set key after clear was run', () => {
    const registry = new PriorityRegistry<string>();
    registry.setEntry('key', 'someString');
    registry.clearEntries();
    expect(registry.getEntry('iDoNotExist')).to.be.null;
  });
});
