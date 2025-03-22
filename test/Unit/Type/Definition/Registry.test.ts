import { expect } from 'chai';

import { Registry } from '../../../../src/Type/Definition';

describe('Registry tests', () => {
  it('should return null on missing entry', () => {
    const registry = new Registry<string>();
    expect(registry.getEntry('iDoNotExist')).to.be.null;
  });
  it('should return the same element as set earlier', () => {
    const registry = new Registry<string>();
    registry.setEntry('key', 'someString');
    expect(registry.getEntry('key')).to.be.equal('someString');
  });
  it('should overwrite elements which were set earlier', () => {
    const registry = new Registry<string>();
    registry.setEntry('key', 'oldString');
    registry.setEntry('key', 'newString');
    expect(registry.getEntry('key')).to.be.equal('newString');
  });
  it('should return null for some set key after clear was run', () => {
    const registry = new Registry<string>();
    registry.setEntry('key', 'someString');
    registry.clearEntries();
    expect(registry.getEntry('iDoNotExist')).to.be.null;
  });
});
