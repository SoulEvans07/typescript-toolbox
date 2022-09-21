import { naturalCompare } from './helpers';

if (!Array.prototype.naturalSort) {
  Array.prototype.naturalSort = function (options?: CompareOptions) {
    return [...this].sort((a, b) => naturalCompare(a, b, options));
  };
}

if (!Array.prototype.limit) {
  Array.prototype.limit = function (length: number) {
    return this.slice(0, length);
  };
}

if (!Array.prototype.isEmpty) {
  Array.prototype.isEmpty = function () {
    return this.length === 0;
  };
}

if (!Array.prototype.first) {
  Array.prototype.first = function () {
    return this[0];
  };
}

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}
