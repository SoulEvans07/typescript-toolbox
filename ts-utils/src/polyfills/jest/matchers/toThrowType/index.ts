// made based on https://github.dev/jest-community/jest-extended/blob/main/src/matchers/toThrowWithMessage.js

import { MatcherContext, MatcherUtils } from '../../types';
import { failObj, passObj } from '../../utils';

export function toThrowType(this: MatcherContext, callbackOrPromiseReturn: VoidFunction, _class: Constructor<Error>) {
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

  const pass = error.name === new _class().name;
  if (pass) return passObj(passMessage(utils, error, new _class()));
  else return failObj(failMessage(utils, error, new _class()));
}

const positiveHint = (utils: MatcherUtils) => utils.matcherHint('.toThrowType', 'function', 'type');

const negativeHint = (utils: MatcherUtils) => utils.matcherHint('.not.toThrowType', 'function', 'type');

const passMessage = (utils: MatcherUtils, received: unknown, expected: unknown) => () =>
  negativeHint(utils) +
  `\n\nExpected not to throw:\n  ${utils.printExpected(expected)}\n` +
  `Thrown:\n  ${utils.printReceived(received)}\n`;

const failMessage = (utils: MatcherUtils, received: unknown, expected: unknown) => () =>
  positiveHint(utils) +
  `\n\nExpected to throw:\n  ${utils.printExpected(expected)}\n` +
  `Thrown:\n  ${utils.printReceived(received)}\n`;
