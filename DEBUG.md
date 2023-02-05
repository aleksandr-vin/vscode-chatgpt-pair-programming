# Debugging the extension

## Install deps

```
yarn install
```

## Debug

Follow Get up and running straight away section of [vsc-extension-quickstart.md](vsc-extension-quickstart.md).

But if you see an error like:

> Activating extension 'chatgpt-pair-programming' failed: ENOENT: no such file or directory, open '.../dist/encoder.json'.

The run this command as a workaround:

```
cp node_modules/gpt-3-encoder/{encoder.json,vocab.bpe} dist/
```
