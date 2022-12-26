<p align="center">
    <img alt="elementid-logo" src="https://user-images.githubusercontent.com/64678612/209457262-c83c8970-6641-40c1-9579-fc6ab4736397.png"/>
    <b align="center">Smart way to manage IDs for frontend Javascript and Typescript projects.</b>
    <p align="center" style="align: center;">
        <a href="https://github.com/appzic/elementid/blob/main/.github/workflows/main.yml">
            <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/appzic/elementid/main.yml">
        </a>
        <a href="https://www.npmjs.com/package/elementid">
            <img alt="npm" src="https://img.shields.io/npm/v/elementid">
        </a>
        <a href="https://www.npmjs.com/package/elementid">
            <img alt="npm" src="https://img.shields.io/npm/dw/elementid">
        </a>
        <a href="https://github.com/appzic/elementid/blob/main/LICENSE">
            <img alt="GitHub" src="https://img.shields.io/github/license/appzic/elementid">
        </a>
    </p>
</p>

## :book: Table of Contents

- [:book: Table of Contents](#book-table-of-contents)
- [:sunny: Introduction](#sunny-introduction)
- [:fire: Features](#fire-features)
- [:rocket: Getting Started](#rocket-getting-started)
  - [Installation](#installation)
  - [Create TOML file](#create-toml-file)
  - [Generate IDs](#generate-ids)
  - [Implement IDs](#implement-ids)
- [:computer: Command-line](#computer-command-line)
- [:rainbow: Use Cases](#rainbow-use-cases)
  - [Astro](#astro)
- [🙏 Contributing](#-contributing)
- [❤️ Contributors](#️-contributors)
- [:shield: License](#shield-license)

## :sunny: Introduction

ElementID is an ID management tool for your frontend Nodejs (Javascript or Typescript) projects. You can share ID values between different modules using ElementID without any conflict. ElementID is a dev dependency. It provides unique or custom values to your production build according to the input IDs. ElementID has a caching system that helps to make ID values static.

## :fire: Features

- :crossed_swords: No ID conflicts
- :tada: Zero dependencies in production
- :chart_with_upwards_trend: Increase your productivity
- :muscle: Generate unique IDs with the powerful [nanoid](https://github.com/ai/nanoid) generator
- :eyes: Auto generate with watch mode
- :minidisc: Cache static unique values
- :computer: Powerful CLI tool
- :scroll: Simple input configuration with .toml

## :rocket: Getting Started

### Installation

We recommend installing ElementID as a dev dependency

```bash
npm i -D elementid
```

### Create TOML file

Declare your project IDs in `.toml` format. We recommend the [Even Better TOML extension](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) for VS Code users to create the .toml file.

The **ElementID** can generate two types of ID values.

- **Unique values** - To generate a unique value for your declared ID, set the value in your toml file to an empty string ("").

```toml
yellowBtnId = ""
redBtnId = ""
```

- **Custom values** - Provide any custom ID values as usual.

```toml
greenBtnId = "my_custom_value_1"
blueBtnId = "my_custom_value_2"
```

### Generate IDs

The ElementID has a powerful CLI tool for generating IDs according to your input. If your input file path is `./my_ids.toml`, you can use the following command to generate IDs.

```
elementid ./my_ids.toml
```

Please read the [command line section](#command-line) for more CLI options.

### Implement IDs

The ElementID generates Javascript(.js) and type declaration(.d.ts) files in the `node_modeules/elementid/dist/` directory.

Usage example:

```Typescript
// ES6 syntax
import { yellowBtnId, redBtnId, greenBtnId } from "elementid";

const yellowBtn = document.getElementById(yellowBtnId);
const redBtn = document.querySelector(`#${greenBtnId}`);
```

```Javascript
// CommonJS syntax
const ids = require("elementid");

const yellowBtn = document.getElementById(ids.blueBtnId);
const redBtn = document.querySelector(`#${ids.redBtnId}`);
```

## :computer: Command-line

```
Usage: elementid <input file> [options]

Options:
  -w, --watch       Watch changes of input file                            [boolean]
  -f, --force       Generate unique IDs without caching                   [boolean]
  -l, --length      Specify length of generated unique IDs
                    (default = 8, options = 5, 6, 7, 8, 9, 10)              [number]
  --version         Show version number                                    [boolean]
  -h, --help        Show help                                              [boolean]

Examples:
  elementid ids.js                      Default usage without additional options
  elementid ids.js --length=7           Sets the length of generated IDs to 7
  elementid src/my_ids.js --watch       Uses the watch option
```

## :rainbow: Use Cases

### Astro

[Astro](https://astro.build/) is a static site generator. Astro has its own component to build a static site. There are four sections to generate HTML, CSS, and Javascript. [Read more about Astro components](https://docs.astro.build/en/core-concepts/astro-components/).

- HTML content helper
- HTML content
- Scripts
- Styles

Making a dynamic web page with Astro requires access to the DOM elements. The function [getElementById()](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) is a popular method to get access to the DOM elements from Javascript. However, Astro does not allow the same ID to be used in both the HTML content and Script sections.

While hardcoding ID values is an option, this strategy presents an increased opportunity for developer error and conflicts.

ElementID helps you to solve this problem. You can access the same ID values with ElementID in the HTML content helper section and Script sections. Check out the following example for how to use ElementID in [Astro](https://astro.build/).

```astro
---
import { myBtnId } from "elementid";
---

<div>
    <button id={myBtnId}>Click ME!</button>
</div>

<script>
    import { myBtnId } from "elementid";

    myBtn = document.getElementById(myBtnId);
    myBtn.addeventlistener("click",()=>{
        console.log("click my button");
    });
</script>
```

## 🙏 Contributing

If you want to open an issue, create a Pull Request, or simply want to know how you can run it on your local machine, please read the [Contributing Guide](https://github.com/appzic/elementid/blob/main/CONTRIBUTING.md).

## ❤️ Contributors

<a href="https://github.com/appzic/elementid/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=appzic/elementid" />
</a>

## :shield: License

ElementID is [MIT](https://github.com/appzic/elementid/blob/main/LICENSE) licensed.
