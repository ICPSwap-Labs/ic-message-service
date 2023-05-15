import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Publisher "../service/client/publisher";
import API "../service/api";
import { recurringTimer } "mo:base/Timer";

actor class PublisherTest() = this {

    private stable var messages: [API.Message] = [];
    private let publisher: Publisher.Publisher = Publisher.Publisher("bwckc-3qaaa-aaaak-aepwq-cai", messages, 3, 5);
    private func sync(): async () {
        await publisher.sync();
    };
    public query func getMessages(): async [API.Message] {
        return publisher.states();
    };
    public func publish(): async () {
        await publisher.sync();
    };
    public shared({caller}) func transfer(account: Text, amount: Nat) : () {
        let message: API.Message = {
            topic = "Transfer";
            productor = Principal.fromActor(this);
            createdAt = Time.now();
            data = #Text(Principal.toText(caller) # " transfer " # Nat.toText(amount) # " to " # account);
        };
        publisher.publish(message);
    };
    public shared({caller}) func deposit(amount: Nat) : () {
        let message: API.Message = {
            topic = "Deposit";
            productor = Principal.fromActor(this);
            createdAt = Time.now();
            data = #Text(Principal.toText(caller) # " deposit " # Nat.toText(amount));
        };
        publisher.publish(message);
    };

    system func preupgrade() {
        messages := publisher.states();
    };

    system func postupgrade() {
    };
    ignore recurringTimer(#seconds(10), sync);
}