// made based on https://github.dev/jest-community/jest-extended/blob/main/src/matchers/toThrowWithMessage.js

import { EXPECTED_COLOR } from 'jest-matcher-utils';
import { MatcherContext, MatcherUtils } from '../../types';
import { failObj, passObj } from '../../utils';

export function toThrowSubType(
  this: MatcherContext,
  callbackOrPromiseReturn: VoidFunction,
  _class: AnyConstructor<Error>
) {
  const utils = this.utils;
  const isFromReject = this && this.promise === 'rejects'; // See https://github.com/facebook/jest/pull/7621#issue-244312550

  if ((!callbackOrPromiseReturn || typeof callbackOrPromiseReturn !== 'function') && !isFromReject) {
    return failObj(
      () =>
        `${positiveHint(utils)}\n\nReceived value must be a function but instead "${callbackOrPromiseReturn}" was found`
    );
  }

  if (!_class || typeof _class !== 'function') {
    return failObj(() => `${positiveHint(utils)}\n\nExpected type to be a function but instead "${_class}" was found`);
  }

  let error: Error | undefined;
  if (isFromReject) {
    error = callbackOrPromiseReturn as unknown as Error;
  } else {
    try {
      callbackOrPromiseReturn();
    } catch (e) {
      error = e as Error;
    }
  }

  if (!error) {
    return failObj(() => `Expected the function to throw an error.\nBut it didn't throw anything.`);
  }

  const pass = isDescendantOf(error, _class);
  if (pass) return passObj(passMessage(utils, error, _class));
  else return failObj(failMessage(utils, error, _class));
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isDescendantOf<T extends Object, K extends Object>(obj: T, _class: AnyConstructor<K>): boolean {
  do {
    if (obj.constructor.name === _class.name) return true;

    obj = Object.getPrototypeOf(obj);
  } while (obj.constructor.name !== 'Object');

  return false;
}

const positiveHint = (utils: MatcherUtils) => utils.matcherHint('.toThrowSubType', 'function', 'type');

const negativeHint = (utils: MatcherUtils) => utils.matcherHint('.not.toThrowSubType', 'function', 'type');

const passMessage = (utils: MatcherUtils, received: unknown, expected: AnyConstructor<unknown>) => () =>
  negativeHint(utils) +
  `\n\nExpected not to throw:\n  ` +
  EXPECTED_COLOR(`[${expected.name}]`) +
  `\nThrown:\n  ${utils.printReceived(received)}\n`;

const failMessage = (utils: MatcherUtils, received: unknown, expected: AnyConstructor<unknown>) => () =>
  positiveHint(utils) +
  `\n\nExpected to throw:\n  ` +
  EXPECTED_COLOR(`[${expected.name}]`) +
  `\nThrown:\n  ${utils.printReceived(received)}\n`;
