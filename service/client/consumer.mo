import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import List "mo:base/List";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import API "../api";

module Publisher {

    type Topic = API.Topic;
    type Message = API.Message;

    public class Consumer(_last_messages: [(Topic, Time.Time)]) {
        
        var last_messages: HashMap.HashMap<Topic, Time.Time> = HashMap.fromIter<Topic, Time.Time>(_last_messages.vals(), 0, Text.equal, Text.hash);

        public func lastMessages() : [(Topic, Time.Time)] {
            Iter.toArray(last_messages.entries());
        };

        public func consume(message: Message) : Bool {
            switch (last_messages.get(message.topic)) {
                case (?last_message_time) {
                    if (last_message_time > message.createdAt) {
                        return false;
                    } else {
                        last_messages.put(message.topic, message.createdAt);
                        return true;
                    }
                };
                case null {
                    last_messages.put(message.topic, message.createdAt);
                        return true;
                };
            }
        };

    }

}