import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import List "mo:base/List";
import API "../api";

module Publisher {

    type Message = API.Message;
    type MessageService = API.MessageService;

    public class Publisher(_mq_server_cid: Text, _messages: [Message], _max_retry_times: Nat, _max_sync_num: Nat) {

        private func init_message() : () {
            for (message in _messages.vals()) {
                publish(message);
            };
        };
        
        let mq_server: MessageService = actor(_mq_server_cid): MessageService;
        var messages: Buffer.Buffer<Message> = Buffer.Buffer<Message>(1);
        
        public func publish(message: Message) : () {
            var new_messages: Buffer.Buffer<Message> = Buffer.Buffer<Message>(messages.size() + 1);
            new_messages.add(message);
            new_messages.append(messages);
            messages := new_messages;
        };

        init_message();

        public func states() : [Message] {
            List.toArray<Message>(List.reverse<Message>(List.fromArray<Message>(messages.toArray())));
        };

        public func sync() : async () {
            if (messages.size() == 0) {
                return;
            };
            var sync_index: Nat = messages.size() - 1;
            var succeed_count: Nat = 0;
            var failed_count: Nat = 0;
            while (messages.size() > 0 and failed_count < _max_retry_times and succeed_count < _max_sync_num) {
                try {
                    let message: Message = messages.get(sync_index);
                    await mq_server.publish(message);
                    ignore messages.removeLast();
                    if (sync_index > 0) {
                        sync_index -= 1;
                    };
                    succeed_count += 1;
                } catch (e) {
                    failed_count += 1;
                };
            };
        };
    }

}