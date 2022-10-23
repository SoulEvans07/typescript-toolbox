import { Exception, NotExceptionError, UnknownError } from './index';

describe('Exceptions', () => {
  describe('from', () => {
    test('throw string', () => {
      const message = 'string error';
      const error = convertFrom(() => {
        throw message;
      });

      expect(() => {
        throw error;
      }).toThrowType(UnknownError);
      expect(error.name).toEqual(UnknownError.name);
      expect(error.message).toEqual(message);
    });

    test('throw Error', () => {
      const message = 'Error class error';
      const error = convertFrom(() => {
        throw new Error(message);
      });

      expect(() => {
        throw error;
      }).toThrowType(Error);
      expect(error.name).toEqual(Error.name);
      expect(error.message).toEqual(message);
    });

    test('throw Error - CustomError', () => {
      const message = 'CustomError class error';
      const error = convertFrom(() => {
        throw new CustomError(message);
      });

      expect(() => {
        throw error;
      }).toThrowType(CustomError);
      expect(error.name).toEqual(CustomError.name);
      expect(error.message).toEqual(message);
    });

    test('throw Exception - CustomException', () => {
      const message = 'CustomException - Exception class error';
      const error = convertFrom(() => {
        throw new CustomException(message);
      });

      expect(() => {
        throw error;
      }).toThrowType(CustomException);
      expect(error.name).toEqual(CustomException.name);
      expect(error.message).toEqual(message);
    });

    test('throw other', () => {
      const obj = { msg: 'simple object thrown' };
      expect(() =>
        convertFrom(() => {
          throw obj;
        })
      ).toThrowType(NotExceptionError);
    });

    function convertFrom(callback: () => never): Exception {
      try {
        callback();
      } catch (e) {
        const error = Exception.from(e);
        return error;
      }
    }
  });
});

class CustomError extends Error {
  name = CustomError.name;
}

class CustomException extends Exception {
  name = CustomException.name;
}
