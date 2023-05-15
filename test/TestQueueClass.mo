import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Queue "../service/utils/Queue";


actor TestQueue {
    private var _queue: Queue.Class<Text> = Queue.Class<Text>();

    public shared func add(text: Text) {
        _queue.add(text);
    };
    public shared func size(): async Nat {
        return _queue.size();
    };
    public shared func get(): async ?Text {
        return _queue.peek();
    };
    public shared func take(): async ?Text {
        return _queue.take();
    };
    public shared func remove() {
        _queue.remove();
    };
    public shared func toArray(): async [Text] {
        return _queue.toArray();
    };
    public shared func addN(n: Nat) {
        for (i in Iter.range(0, n)) {
            _queue.add(Nat.toText(i));
        };
    };
    
}