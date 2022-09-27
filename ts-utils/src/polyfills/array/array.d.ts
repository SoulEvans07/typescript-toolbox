declare interface Array<T> {
  naturalSort(options?: CompareOptions): Array<T>;
  limit(length: number): Array<T>;
  isEmpty(): boolean;
  first(): T;
  last(): T;
}

// https://www.techonthenet.com/js/string_localecompare.php
declare interface CompareOptions extends Intl.CollatorOptions {
  caseFirst?: 'lower' | 'upper';
  localeMatcher?: 'best fit' | 'lookup';
  sensitivity?: 'variant' | 'case' | 'base' | 'accent';
  usage?: 'sort' | 'search';
}
