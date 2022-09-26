if (!Number.prototype.pad) {
  Number.prototype.pad = function (length: number, char: string = '0') {
    return String(this).padStart(length, char);
  };
}

