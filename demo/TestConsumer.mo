import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Consumer "../service/client/consumer";
import API "../service/api";

actor class ConsumerTest() = this {

    private stable var last_messages: [(API.Topic, Time.Time)] = [];
    private var consumer: Consumer.Consumer = Consumer.Consumer(last_messages);
    private var messages: Buffer.Buffer<Text> = Buffer.Buffer<Text>(10);
    private stable var amount: Nat = 0;
    private stable var messageServiceAddress : Text = "bwckc-3qaaa-aaaak-aepwq-cai";
    
    public shared({caller}) func onMessage(message: API.Message) : async () {
        if (Text.equal(messageServiceAddress, Principal.toText(caller))) {
            if (consumer.consume(message)) {
                switch (message.data) {
                    case (#Text value) {
                        messages.add(message.topic # ": " # value);
                    };
                    case (_) {};
                };
            };
        };
    };
    public query func getMessages(): async [Text] {
        return Buffer.toArray(messages);
    };
    public func clearMessage(): async () {
        messages.clear();
    };
    system func preupgrade() {
        last_messages := consumer.lastMessages();
    };

    system func postupgrade() {
    };
}