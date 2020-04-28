<div align="center">
<h1>Generate Tree</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/OnurErtugral/generate-tree/master/assets/generate-tree.png" />
</p>
</div>

## Installation

```
npm install generate-tree
```

or

```
yarn add generate-tree
```

## Usage

```
generate-tree --entryFile src/index.js
```

## What does this do?

`generate-tree` is a dependency tree visualization tool. You give it an entry file as an input, it reads `import` statments in the file, and traverse your project by using `DFS` alogrithm.

It produces an `HTML` file as an output, you can view and interact with it in your browser.

## Roadmap

- [ ] Make the space between nodes adjustable
- [ ] Support `require` imports
- [ ] Add diffrent themes
- [ ] Show current scale factor to user
