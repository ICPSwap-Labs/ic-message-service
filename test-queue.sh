#!/bin/bash

set -e

dfx stop
rm -rf .dfx
dfx start --background
dfx canister create --all
dfx build

dfx canister install --all

echo test queue start...

# step 1
echo step 1
dfx canister call TestQueue add '("a")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"a\" })" ]] && [[ "$size" = "(1 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 2
echo step 2
dfx canister call TestQueue remove
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec {})" ]] && [[ "$size" = "(0 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 3
echo step 3
dfx canister call TestQueue remove
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec {})" ]] && [[ "$size" = "(0 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 4
echo step 4
dfx canister call TestQueue add '("b")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"b\" })" ]] && [[ "$size" = "(1 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 5
echo step 5
val=`dfx canister call TestQueue get`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"b\")" ]] && [[ "$arr" = "(vec { \"b\" })" ]] && [[ "$size" = "(1 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 6
echo step 6
val=`dfx canister call TestQueue take`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"b\")" ]] && [[ "$arr" = "(vec {})" ]] && [[ "$size" = "(0 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 7
echo step 7
val=`dfx canister call TestQueue take`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(null)" ]] && [[ "$arr" = "(vec {})" ]] && [[ "$size" = "(0 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 8
echo step 8
dfx canister call TestQueue add '("c")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"c\" })" ]] && [[ "$size" = "(1 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 9
echo step 9
dfx canister call TestQueue add '("d")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"c\"; \"d\" })" ]] && [[ "$size" = "(2 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi
# step 10
echo step 10
dfx canister call TestQueue add '("e")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"c\"; \"d\"; \"e\" })" ]] && [[ "$size" = "(3 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 11
echo step 11
dfx canister call TestQueue add '("f")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"c\"; \"d\"; \"e\"; \"f\" })" ]] && [[ "$size" = "(4 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 12
echo step 12
val=`dfx canister call TestQueue take`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"c\")" ]] && [[ "$arr" = "(vec { \"d\"; \"e\"; \"f\" })" ]] && [[ "$size" = "(3 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 13
echo step 13
val=`dfx canister call TestQueue take`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"d\")" ]] && [[ "$arr" = "(vec { \"e\"; \"f\" })" ]] && [[ "$size" = "(2 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 14
echo step 14
dfx canister call TestQueue add '("g")'
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"e\"; \"f\"; \"g\" })" ]] && [[ "$size" = "(3 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 15
echo step 15
val=`dfx canister call TestQueue take`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"e\")" ]] && [[ "$arr" = "(vec { \"f\"; \"g\" })" ]] && [[ "$size" = "(2 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 16
echo step 16
dfx canister call TestQueue remove
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$arr" = "(vec { \"g\" })" ]] && [[ "$size" = "(1 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $arr, $size \033[0m"
fi

# step 17
echo step 17
val=`dfx canister call TestQueue get`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"g\")" ]] && [[ "$arr" = "(vec { \"g\" })" ]] && [[ "$size" = "(1 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

# step 18
echo step 18
val=`dfx canister call TestQueue take`
arr=`dfx canister call TestQueue toArray`
size=`dfx canister call TestQueue size`
if [[ "$val" = "(opt \"g\")" ]] && [[ "$arr" = "(vec {})" ]] && [[ "$size" = "(0 : nat)" ]]; then
    echo "\033[32m success. \033[0m"
else
    echo "\033[31m fail. $val, $arr, $size \033[0m"
fi

echo test queue end...

dfx stop


# #actor TestQueue {
#     public shared func add(text: Text) {
#         _queue.add(text);
#     };
#     public shared func size(): async Nat {
#         return _queue.size();
#     };
#     public shared func get(): async ?Text {
#         return _queue.peek();
#     };
#     public shared func remove() {
#         _queue.remove();
#     };
#     public shared func toArray(): async [Text] {
#         return _queue.toArray();
#     };
# }