import Option "mo:base/Option";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";


module {
    private type Node<T> = {
        value: T;
        var next: ?Node<T>;
    };
    public type Type<T> = {
        var head: ?Node<T>;
        var tail: ?Node<T>;
        var size: Nat;
    };
    public func empty<T>(): Type<T> {
        return {
            var head = null;
            var tail = null;
            var size = 0;
        };
    };
    public func size<T>(queue: Type<T>): Nat {
        return queue.size;
    };
    public func add<T>(queue: Type<T>, t: T) {
        let node: ?Node<T> = Option.make<Node<T>>({ 
            value = t; 
            var next = null; 
        });
        switch(queue.tail) {
            case (?tail) {
                tail.next := node;
                queue.tail := node;
            };
            case null {
                queue.head := node;
                queue.tail := queue.head;
            };
        };
        queue.size := queue.size + 1;
    };
    public func peek<T>(queue: Type<T>): ?T {
        switch(queue.head) {
            case (?head) {
                return Option.make<T>(head.value);
            };
            case null {
                return null;
            };
        };
    };
    public func take<T>(queue: Type<T>): ?T {
        switch(queue.head) {
            case (?head) {
                let value = Option.make<T>(head.value);
                queue.head := head.next;
                queue.size := queue.size - 1;
                if (queue.size == 0) {
                    queue.tail := null;
                };
                return value;
            };
            case null {
                return null;
            };
        };
    };
    public func remove<T>(queue: Type<T>) {
        ignore take<T>(queue);
    };
    public func toArray<T>(queue: Type<T>): [T] {
        var buffer: Buffer.Buffer<T> = Buffer.Buffer<T>(queue.size);
        var curr: ?Node<T> = queue.head;
        label l while(Option.isSome(curr)) {
            switch(curr) {
                case (?node) {
                    buffer.add(node.value);
                    curr := node.next;
                };
                case null {
                    break l;
                };
            };
        };
        return Buffer.toArray<T>(buffer);
    };
    public class Class<T>() = this {
        private var _head: ?Node<T> = null;
        private var _tail: ?Node<T> = null;
        private var _size = 0;
        private func _enqueue(value: T) {
            let node: ?Node<T> = Option.make<Node<T>>({ 
                value = value; 
                var next = null; 
            });
            switch(_tail) {
                case (?tail) {
                    tail.next := node;
                    _tail := node;
                };
                case null {
                    _tail := node;
                    _head := node;
                };
            };
            _size := _size + 1;
        };
        private func _dequeue(): ?T {
            switch(_head) {
                case (?head) {
                    var value: T = head.value;
                    _head := head.next;
                    _size := _size - 1;
                    if (Nat.equal(_size, 0)) {
                        _tail := null;
                    };
                    return Option.make<T>(value);
                };
                case null {
                    return null;
                };
            };
        };
        public func size(): Nat {
            return _size;
        };
        public func add(value: T) {
            _enqueue(value);
        };
        public func take(): ?T {
            return _dequeue();
        };
        public func remove() {
            ignore _dequeue();
        };
        public func peek(): ?T {
            switch(_head) {
                case (?head) {
                    return Option.make<T>(head.value);
                };
                case null {
                    return null;
                };
            };
        };
        public func toArray(): [T] {
            var buffer: Buffer.Buffer<T> = Buffer.Buffer<T>(_size);
            var curr: ?Node<T> = _head;
            label l while(Option.isSome(curr)) {
                switch(curr) {
                    case (?node) {
                        buffer.add(node.value);
                        curr := node.next;
                    };
                    case null {
                        break l;
                    };
                };
            };
            return Buffer.toArray<T>(buffer);
        };
        
    }
}