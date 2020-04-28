<div align="center">
<h1>Generate Tree</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/OnurErtugral/generate-tree/master/assets/generate-tree.png" />
</p>

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

##What does this do?

`generate-tree` is a dependency tree visualization tool. You give it an entry file as an input, it reads `import` statments in the file, and traverse your project by using `DFS` alogrithm. It produces an `HTML` file as an output, so you can view it in your browser.
