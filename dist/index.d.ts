import { Options as Options$1 } from 'locate-path';
export { hasPath, hasPathSync } from 'has-path';

declare type MaybePromise<T> = T | Promise<T>;
declare type Path = string | undefined;
declare type NameTypes = string | string[] | ((directory: URL | Path) => MaybePromise<Path | Symbol>);
interface Options extends Options$1 {
    limit?: number;
    readonly stopAt?: string;
}
declare const findUpStop: Symbol;
declare const findUpMultiple: (name: NameTypes, options?: Options) => Promise<string[]>;
declare const findUpMultipleSync: (name: NameTypes, options?: Options) => string[];
declare const findUp: (name: NameTypes, options?: {}) => Promise<string>;
declare const findUpSync: (name: NameTypes, options?: {}) => string;

export { findUp, findUpMultiple, findUpMultipleSync, findUpStop, findUpSync };
