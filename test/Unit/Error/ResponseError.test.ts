import { expect, test } from 'vitest';

import { ResponseError } from '../../../src/Error';

test('ResponseError with only constructor being set', () => {
  const responseError = new ResponseError();
  expect(responseError.getType()).toBeNull();
  expect(responseError.getTitle()).toBeNull();
  expect(responseError.getDetail()).toBeNull();
  expect(responseError.getStatus()).toBeNull();
});

test('ResponseError values set by setters will be returned', () => {
  const responseError = new ResponseError();
  responseError.setType('type');
  responseError.setTitle('title');
  responseError.setDetail('detail');
  responseError.setStatus(123);
  expect(responseError.getType()).toEqual('type');
  expect(responseError.getTitle()).toEqual('title');
  expect(responseError.getDetail()).toEqual('detail');
  expect(responseError.getStatus()).toEqual(123);
});
