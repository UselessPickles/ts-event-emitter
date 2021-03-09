// tslint:disable:no-unused-expression
// NOTE: import from root/index to test against publicly exported types
import { EventEmitter, SubscriptionCanceller, EventSource } from ".";
import { expectType, expectError } from "tsd";
import { once } from "./once";

const baz = Symbol("baz");
const bad = Symbol("bad");

// Sample Events interface for testing
interface Events {
    foo(a: number, b: boolean): void;
    bar(a: string): void;
    [baz](a: boolean): void;
}

// shared instance for tests
const eventEmitter = new EventEmitter<Events>();

// properties
{
    // `emit` is the same as the `Events` type, except readonly
    expectType<{
        readonly foo: (a: number, b: boolean) => void;
        readonly bar: (a: string) => void;
        readonly [baz]: (a: boolean) => void;
    }>(eventEmitter.emit);
}

// asEventSource()
{
    expectType<EventSource<Events>>(eventEmitter.asEventSource());
}

// subscribe()
{
    // subscribe with invalid event name
    expectError(
        eventEmitter.subscribe({
            bad: () => {
                // empty
            },
        })
    );

    // subscribe with a valid event name
    eventEmitter.subscribe({
        foo: (a, b) => {
            expectType<number>(a);
            expectType<boolean>(b);
        },
    });

    // subscribe with multiple event names
    eventEmitter.subscribe({
        foo: (a, b) => {
            expectType<number>(a);
            expectType<boolean>(b);
        },
        bar: (a) => {
            expectType<string>(a);
        },
    });

    // subscribe using `once()`
    eventEmitter.subscribe({
        foo: once((a, b) => {
            expectType<number>(a);
            expectType<boolean>(b);
        }),
    });

    // handler returns a Promise.
    eventEmitter.subscribe({
        foo: (a, b) => {
            expectType<number>(a);
            expectType<boolean>(b);
            return Promise.resolve();
        },
    });

    // handler returns an invalid type.
    expectError(
        eventEmitter.subscribe({
            foo: (a, b) => {
                expectType<number>(a);
                expectType<boolean>(b);
                return 42;
            },
        })
    );

    // returns a SubscriptionCanceller
    expectType<SubscriptionCanceller>(eventEmitter.subscribe({}));
}

// on()
{
    // subscribe with invalid event name
    expectError(
        eventEmitter.on("broken", () => {
            // empty
        })
    );

    // subscribe with valid event name
    eventEmitter.on("foo", (a, b) => {
        expectType<number>(a);
        expectType<boolean>(b);
    });

    // handler returns a Promise
    eventEmitter.on("foo", (a, b) => {
        expectType<number>(a);
        expectType<boolean>(b);
        return Promise.resolve();
    });

    // handler returns an invalid type
    expectError(
        eventEmitter.on("foo", (a, b) => {
            expectType<number>(a);
            expectType<boolean>(b);
            return 42;
        })
    );

    // subscribe to a valid unique eymbol event name
    eventEmitter.on(baz, (a) => {
        expectType<boolean>(a);
    });

    // subscribe to an invalid unique eymbol event name
    expectError(eventEmitter.on(bad, () => undefined));

    // returns a SubscriptionCanceller
    expectType<SubscriptionCanceller>(eventEmitter.on("bar", () => undefined));
}

// once()
{
    // subscribe with invalid event name
    expectError(
        eventEmitter.once("broken", () => {
            // empty
        })
    );

    // subscribe with valid event name
    eventEmitter.once("foo", (a, b) => {
        expectType<number>(a);
        expectType<boolean>(b);
    });

    // handler returns a Promise
    eventEmitter.once("foo", (a, b) => {
        expectType<number>(a);
        expectType<boolean>(b);
        return Promise.resolve();
    });

    // handler returns an invalid type
    expectError(
        eventEmitter.once("foo", (a, b) => {
            expectType<number>(a);
            expectType<boolean>(b);
            return 42;
        })
    );

    // subscribe to a valid unique eymbol event name
    eventEmitter.once(baz, (a) => {
        expectType<boolean>(a);
    });

    // subscribe to an invalid unique eymbol event name
    expectError(eventEmitter.once(bad, () => undefined));

    // returns a SubscriptionCanceller
    expectType<SubscriptionCanceller>(
        eventEmitter.once("bar", () => undefined)
    );
}
