import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Error "mo:base/Error";
import EvictingQueue "./utils/EvictingQueue";
import Timer "mo:base/Timer";
import Nat8 "mo:base/Nat8";
import API "./api";
import Debug "mo:base/Debug";
import Queue "./utils/Queue";

shared(msg) actor class Broker() = this {
    public type Role = {
        #RoleOwner;
        #RoleAdmin;
        #RoleClient;
        #RoleAnyone;
    };
    private type Subscriber = {
        principal: Principal;
        offset: Nat;
        onMessage: API.OnMessage;
        topic: API.Topic;
    };
    private type Topic = {
        code: API.Topic;
        name: Text;
    };
    private type Queue = API.Queue;
    private type LogLevel = Nat8; 
    private type MessageQueue = {
        name: Text;
        topic: Text;
        var messages: Queue.Type<API.Message>;
        subscriber: Principal;
        lastConsumeAt: Time.Time;
    };
    private type ErrorLog = {
        time: Time.Time;
        subscriber: Principal;
        message: API.Message;
        error: Text;
    };
    private type Log = {
        time: Time.Time;
        level: LogLevel;
        tag: Text;
        message: Text;
    };
    private stable let LOG_LEVEL = {
        DEBUG: LogLevel = 0;
        INFO: LogLevel = 1;
        WARN: LogLevel = 2;
        ERROR: LogLevel = 3;
    };
    private type Consumer = actor {
        onMessage: shared (message: API.Message) -> async ();
    }; 
    private stable var _consumeLimit: Nat = 5;   // Maximum messages consumed per job
    private stable var _errorQueueSize: Nat = 100;
    private stable var _logQueueSize: Nat = 1000;
    private stable var _topics: [Topic] = [];
    private stable var _messageQueues: [MessageQueue] = [];

    private stable var _owners: [Principal] = [msg.caller];
    private stable var _admins: [Principal] = [];
    private stable var _clients: [Principal] = [];
    private stable var _subscriber: [Subscriber] = [];
    private stable var _errorArr: [ErrorLog] = [];
    private stable var _logLevel: LogLevel = LOG_LEVEL.INFO;

    private var _errors: EvictingQueue.EvictingQueue<ErrorLog> = EvictingQueue.fromArray<ErrorLog>(_errorQueueSize, _errorArr);
    private var _logs: EvictingQueue.EvictingQueue<Log> = EvictingQueue.fromArray<Log>(_logQueueSize, []);
    

    private var busy: Bool = false;
    private func _add(arr: [Principal], item: Principal) : [Principal] {
        var buffer: Buffer.Buffer<Principal> = Buffer.Buffer<Principal>(arr.size() + 1);
        var exists: Bool = false;
        for (c in arr.vals()) {
            if (Principal.equal(c, item)) {
                exists := true;
            };
            buffer.add(c);
        };
        if (not exists) {
            buffer.add(item);
        };
        return Buffer.toArray<Principal>(buffer);
    };
    private func _remove(arr: [Principal], item: Principal) : [Principal] {
        var buffer: Buffer.Buffer<Principal> = Buffer.Buffer<Principal>(arr.size() + 1);
        var exists: Bool = false;
        for (c in arr.vals()) {
            if (not Principal.equal(c, item)) {
                buffer.add(c);
            };
        };
        return Buffer.toArray<Principal>(buffer);
    };
    private func _topic_equal(t1 : Topic, t2 : Topic) : Bool {
        return Text.equal(t1.code, t2.code);
    };
    
    private func _topicExists(message: API.Message): Bool {
        for (it in _topics.vals()) {
            if (Text.equal(it.code, message.topic)) {
                return true;
            };
        };
        return false;
    };
    private func _addLog(level: LogLevel, tag: Text, message: Text) {
        if (_logLevel >= level) {
            ignore _logs.add({
                time = Time.now();
                level = level;
                tag = tag;
                message = message;
            });
        };
    };
    private func _messageQueueToQueue(it: MessageQueue): Queue {
        return {
            name = it.name;
            topic = it.topic;
            subscriber = it.subscriber;
            messages = Queue.size(it.messages);
            lastConsumeAt = it.lastConsumeAt;
        };
    };
    private func _queueToMessageQueue(it: Queue): MessageQueue {
        return {
            name = it.name;
            topic = it.topic;
            subscriber = it.subscriber;
            var messages = Queue.empty<API.Message>();
            lastConsumeAt = Time.now();
        };
    };
    
    
    private func consume() : async () {
        Debug.print("==>consume");
        if (not Bool.equal(busy, true)) {
            busy := true;
            var count: Nat = 0; 
            label lb loop {
                var h: Nat = 0;
                for (queue in _messageQueues.vals()) {
                    if (count >= _consumeLimit) {
                        break lb;
                    };
                    if (Queue.size(queue.messages) > 0) {
                        var act: Consumer = actor(Principal.toText(queue.subscriber));
                        switch (Queue.peek(queue.messages)) {
                            case (?message) {
                                try {
                                    await act.onMessage(message);
                                    Queue.remove(queue.messages);
                                } catch (e) {
                                    ignore _errors.add({
                                        time = Time.now();
                                        subscriber = queue.subscriber;
                                        message = message;
                                        error = Error.message(e);
                                    });
                                };
                            };
                            case (_) {};
                        };
                        h := h + 1;
                        count := count + 1;
                    };
                };
                if (Nat.equal(h, 0)) {
                    break lb;
                }
            };
            busy := false;
        };
    };
    private func _isOwner(principal: Principal): Bool {
        for (it in _owners.vals()) {
            if (Principal.equal(principal, it)) {
                return true;
            };
        };
        return false;
    };
    private func _isAdmin(principal: Principal): Bool {
        for (it in _admins.vals()) {
            if (Principal.equal(principal, it)) {
                return true;
            };
        };
        return false;
    };
    private func _isClient(principal: Principal): Bool {
        for (it in _clients.vals()) {
            if (Principal.equal(principal, it)) {
                return true;
            };
        };
        return false;
    };
    
    public shared({caller}) func publish(message: API.Message) : async () {
        _addLog(LOG_LEVEL.INFO, "Broker", "publish message: " # debug_show(message));
        if (_topicExists(message)) {
            for (it in _messageQueues.vals()) {
                if (Text.equal(it.topic, message.topic)) {
                    _addLog(LOG_LEVEL.INFO, "QUEUE", "public message to queue: " # it.topic # " - " # Principal.toText(it.subscriber));
                    Queue.add<API.Message>(it.messages, message);
                }
            }
        };
    };
    /// topic management.
    public shared func topics(): async [Topic] {
        return _topics;
    };
    public shared func addTopic(topic: Topic): async Bool {
        var buffer: Buffer.Buffer<Topic> = Buffer.Buffer<Topic>(_topics.size() + 1);
        var exists: Bool = false;
        for (it in _topics.vals()) {
            if (_topic_equal(it, topic)) {
                exists := true;
            };
            buffer.add(it);
        };
        if (not exists) {
            buffer.add(topic);
        };
        _topics := Buffer.toArray<Topic>(buffer);
        return not exists;
    };
    public shared func delTopic(code: Text): async Bool {
        var buffer: Buffer.Buffer<Topic> = Buffer.Buffer<Topic>(_topics.size());
        var exists: Bool = false;
        for (it in _topics.vals()) {
            if (Text.equal(code, it.code)) {
                exists := true;
            } else {
                buffer.add(it);
            };
        };
        _topics := Buffer.toArray<Topic>(buffer);
        return exists;
    };
    /// queue management.
    public shared func queues(): async [Queue] {
        return Array.map<MessageQueue, Queue>(_messageQueues, _messageQueueToQueue);
    };
    public shared func getQueues(topic: Text): async [Queue] {
        var buffer: Buffer.Buffer<Queue> = Buffer.Buffer<Queue>(_topics.size());
        for (it in _messageQueues.vals()) {
            if (Text.equal(it.topic, topic)) {
                buffer.add(_messageQueueToQueue(it));
            };
        };
        return Buffer.toArray<Queue>(buffer);
    };

    public shared func addQueue(queue: Queue): async Bool {
        var buffer: Buffer.Buffer<MessageQueue> = Buffer.Buffer<MessageQueue>(_topics.size());
        var exists: Bool = false;
        for (it in _messageQueues.vals()) {
            if (Text.equal(it.topic, queue.topic) and Principal.equal(it.subscriber, queue.subscriber)) {
                exists := true;
            };
            buffer.add(it);
        };
        if (not exists) {
            buffer.add(_queueToMessageQueue(queue));
        };
        _messageQueues := Buffer.toArray<MessageQueue>(buffer);
        return not exists;
    };
    public shared func delQueue(topic: Text, subscriber: Principal): async Bool {
        var buffer: Buffer.Buffer<MessageQueue> = Buffer.Buffer<MessageQueue>(_topics.size());
        var exists: Bool = false;
        for (it in _messageQueues.vals()) {
            if (Text.equal(it.topic, topic) and Principal.equal(it.subscriber, subscriber)) {
                exists := true;
            } else {
                buffer.add(it);
            };
        };
        _messageQueues := Buffer.toArray<MessageQueue>(buffer);
        return exists;
    };
    public query func errors(): async [ErrorLog] {
        _errors.toArray()
    };
    public query func logs(): async [Log] {
        _logs.toArray()
    };
    /// Access Control.
    public shared func owners(): async [Principal] {
        _owners
    };
    public shared func admins(): async [Principal] {
        _admins
    };
    public shared func clients(): async [Principal] {
        _clients
    };
    public shared func setOwner(owners: [Principal]) : async () {
        _owners := owners;
    };
    public shared func addAdmin(admin: Principal) : async () {
        _admins := _add(_admins, admin);
    };
    public shared func deleteAdmin(admin: Principal) : async () {
        _admins := _remove(_admins, admin);
    };
    public shared func setClient(clients: [Principal]) : async () {
        _clients := clients;
    };
    public shared func deleteClient(client: Principal) : async () {
        _clients := _remove(_clients, client);
    };
    public shared func addClient(client: Principal) : async () {
        _clients := _add(_clients, client);
    };
    public shared({caller}) func roles(): async [Role] {
        var buffer: Buffer.Buffer<Role> = Buffer.Buffer<Role>(3);
        if (_isOwner(caller)) {
            buffer.add(#RoleOwner);
        };
        if (_isAdmin(caller)) {
            buffer.add(#RoleAdmin);
        };
        return Buffer.toArray<Role>(buffer);
    };
    public shared func getAccessControlState() : async {owners: [Principal]; admins: [Principal]; clients: [Principal]} {
        return {
            owners = _owners;
            admins = _admins;
            clients = _clients;
        };
    };
    system func preupgrade() {
        _errorArr := _errors.toArray();
    };

    system func postupgrade() {
        _errorArr := [];
    };

    system func inspect({
        arg : Blob;
        caller : Principal;
        msg : {
            #addAdmin : () -> Principal;
            #addClient : () -> Principal;
            #addQueue : () -> Queue;
            #addTopic : () -> Topic;
            #admins : () -> ();
            #clients : () -> ();
            #delQueue : () -> (Text, Principal);
            #delTopic : () -> Text;
            #deleteAdmin : () -> Principal;
            #deleteClient : () -> Principal;
            #errors : () -> ();
            #getAccessControlState : () -> ();
            #getQueues : () -> Text;
            #logs : () -> ();
            #owners : () -> ();
            #publish : () -> API.Message;
            #queues : () -> ();
            #roles : () -> ();
            #setClient : () -> [Principal];
            #setOwner : () -> [Principal];
            #topics : () -> ()
        }
    }) : Bool {
        let requireRole = switch(msg) {
            case (#setOwner args) { return _isOwner(caller); };
            case (#addAdmin args) { return _isOwner(caller); };
            case (#deleteAdmin args) { return _isOwner(caller); };
            case (#publish args) { return _isClient(caller); };
            case (_) {
                return (_isOwner(caller) or _isAdmin(caller));
            };
        };
    };

    ignore Timer.recurringTimer(#seconds(10), consume);
}