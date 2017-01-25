import { Stream } from '../types';

export function awaitPromises<A>(stream: Stream<Promise<A>>): Stream<A>;

export function fromPromise<A>(promise: Promise<A>): Stream<A>;
