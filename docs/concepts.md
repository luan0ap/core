# most.js Concepts

## Streams

A stream is a sequence of events that occur at specific times.  Streams are asynchronous and may be infinite.

In some ways, streams are like Arrays or lists, except that each event in a stream has a specific *time* at which it arrives.  Streams provide many operations that are similar to those of Arrays, such as [`map`](api.md#map), and [`filter`](api.md#filter).  They also provide other operations that don't make sense for Arrays--operations related to *time*.  For example, [`takeUntil`](api.md#takeuntil), and [`skipUntil`](api.md#skipuntil) allow you to slice a stream based on time rather than on indices.

Streams provide a powerful abstraction and API to create and compose asynchronous operations.

## Higher order streams

A Higher-order stream is a "stream of streams": a stream whose event values are themselves streams.

Conceptually, a higher-order stream is like an Array of Arrays: `[[1,2,3], [4,5,6], [4,5,6]]`.  For example, to create a higher-order stream similar to that:

```js
most.from([most.from([1,2,3]), most.from([4,5,6]), most.from([7,8,9])]);
```

That's not a terribly interesting higher-order stream since it can be easily done with Arrays.  Here's another, more useful example:

```js
var firstClick = most.fromEvent('click', document).take(1);
var mousemovesAfterFirstClick = firstClick.map(function() {
	return most.fromEvent('mousemove', document);
});
```

In that case `mousemovesAfterFirstClick` is a higher order stream containing one event, whose value is a *stream* of `mousemove` events.

Events from the "inner" streams can be surfaced using the [higher-order stream combinators](#combining-higher-order-streams).  For example, the following will log all `mousemove` events after the first click:

```js
mousemovesAfterFirstClick.join()
	.observe(console.log.bind(console));
```

## Time windows

**EXPERIMENTAL**

A time window is a time period, anchored at a particular start time.  For example: "from 1pm to 2pm on Tuesday", or "the time between the first mouse click and the first keypress that follows."

A time window can be represented as a higher-order stream.  The first event of the outer stream defines the start time, and the first event of the inner stream defines the end of the time period.

```js
// After the first click, log mouse move events for 1 second.
// Note that DOM event handlers will automatically be unregistered.
var start = most.fromEvent('click', document);
var end = most.of().delay(1000);

// Map the first click to a stream containing a 1 second delay
// The click represents the window start time, after which
// the window will be open for 1 second.
var timeWindow = start.constant(end);

most.fromEvent('mousemove', document)
	.within(timeWindow)
	.observe(console.log.bind(console));
```