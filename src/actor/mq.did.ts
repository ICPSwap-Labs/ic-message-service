export const idlFactory = ({ IDL }: any) => {
  const Value = IDL.Rec();
  const Time = IDL.Int;
  const Queue = IDL.Record({
    topic: IDL.Text,
    messages: IDL.Nat,
    name: IDL.Text,
    subscriber: IDL.Principal,
    lastConsumeAt: Time,
  });
  const Topic__1 = IDL.Text;
  const Topic = IDL.Record({ code: Topic__1, name: IDL.Text });
  Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      Nat: IDL.Nat,
      List: IDL.Vec(Value),
      Text: IDL.Text,
    })
  );
  const Message = IDL.Record({
    topic: IDL.Text,
    data: Value,
    createdAt: Time,
    productor: IDL.Principal,
  });
  const ErrorLog = IDL.Record({
    time: Time,
    error: IDL.Text,
    message: Message,
    subscriber: IDL.Principal,
  });
  const LogLevel = IDL.Nat8;
  const Log = IDL.Record({
    tag: IDL.Text,
    time: Time,
    level: LogLevel,
    message: IDL.Text,
  });
  const Role = IDL.Variant({
    RoleOwner: IDL.Null,
    RoleAnyone: IDL.Null,
    RoleClient: IDL.Null,
    RoleAdmin: IDL.Null,
  });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Principal], [], []),
    addClient: IDL.Func([IDL.Principal], [], []),
    addQueue: IDL.Func([Queue], [IDL.Bool], []),
    addTopic: IDL.Func([Topic], [IDL.Bool], []),
    admins: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    clients: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    delQueue: IDL.Func([IDL.Text, IDL.Principal], [IDL.Bool], []),
    delTopic: IDL.Func([IDL.Text], [IDL.Bool], []),
    deleteAdmin: IDL.Func([IDL.Principal], [], []),
    deleteClient: IDL.Func([IDL.Principal], [], []),
    errors: IDL.Func([], [IDL.Vec(ErrorLog)], ["query"]),
    getAccessControlState: IDL.Func(
      [],
      [
        IDL.Record({
          owners: IDL.Vec(IDL.Principal),
          admins: IDL.Vec(IDL.Principal),
          clients: IDL.Vec(IDL.Principal),
        }),
      ],
      []
    ),
    getQueues: IDL.Func([IDL.Text], [IDL.Vec(Queue)], []),
    logs: IDL.Func([], [IDL.Vec(Log)], ["query"]),
    owners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    publish: IDL.Func([Message], [], []),
    queues: IDL.Func([], [IDL.Vec(Queue)], []),
    roles: IDL.Func([], [IDL.Vec(Role)], []),
    setClient: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setOwner: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    topics: IDL.Func([], [IDL.Vec(Topic)], []),
  });
};
