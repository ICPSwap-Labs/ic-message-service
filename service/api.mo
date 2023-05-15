import Time "mo:base/Time";

module API {
    public type Topic = Text;
    public type Value = {
        #List: [Value];
        #Map: [(Text, Value)]; 
        #Text: Text;
        #Nat: Nat;
        #Int: Int;
    };
    public type Message = {
        topic: Text;
        productor: Principal;
        createdAt: Time.Time;
        data: Value;
    };
    public type Queue = {
        name: Text;
        topic: Text;
        subscriber: Principal;
        messages: Nat;
        lastConsumeAt: Time.Time;
    };
    public type Error = {
        occurAt: Int;
        message: Text;
    };

    public type ILocalMessageQueue = {
        push: (message: Message) -> ();
        sync: () -> ();
        states: () -> [Message];
    };


    public class LocalMessageQueue(messages: [Message], addr: Principal) {
        public func push(message: Message) {
        };
        public func sync() {
        };
        public func state(): [Message] { [] };
    };
    public type OnMessage = shared (Message) -> async ();

    public type MessageService = actor {
        publish: shared (message: Message) -> async ();
    };


}