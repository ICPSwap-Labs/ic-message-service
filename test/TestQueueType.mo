import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Queue "../service/utils/Queue";


actor TestQueue {
    private stable var _queue: Queue.Type<Text> = Queue.empty<Text>();

    public shared func add(text: Text) {
        Queue.add<Text>(_queue, text);
    };
    public shared func size(): async Nat {
        return Queue.size<Text>(_queue);
    };
    public shared func get(): async ?Text {
        return Queue.peek<Text>(_queue);
    };
    public shared func take(): async ?Text {
        var val = Queue.peek<Text>(_queue);
        return Queue.take<Text>(_queue);
    };
    public shared func remove() {
        Queue.remove<Text>(_queue);
    };
    public shared func toArray(): async [Text] {
        return Queue.toArray(_queue);
    };
    public shared func addN(n: Nat) {
        for (i in Iter.range(0, n)) {
            Queue.add<Text>(_queue, Nat.toText(i));
        };
    };
    
}