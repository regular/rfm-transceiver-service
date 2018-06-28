# rfm-transceiver-service

API, v1.0.0.

Send and receive datagrams via Hope RF's digital radio modules RFM12B and RFM69CW

## usage: async

Print usage

```bash
usage [command string]
```

```js
usage(command)
```

 - command: string, the name of a subcommand (optional)

## receive: source

Get a stream of datagrams

```bash
receive [--to, --from, --norepeat]
```

```js
receive({ to:, from:, norepeat: })
```

 - opts:
   - to: filter message by recipient
   - from: filter message by sender
   - norepeat: suppress immediate message duplicates

Returns a stream of objects with `meta` and `payload` propertues.

  - meta: 
      - to: node-id of recipient
      - ftom: node-id of sender
      - wantsACK: whether sender requested ACK
      - isACK: whether this message is an ACK
  - payload: hex-encoded message payload
