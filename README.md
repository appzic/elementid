<p align="center">
    <img alt="elementid-logo" src="https://user-images.githubusercontent.com/64678612/209457262-c83c8970-6641-40c1-9579-fc6ab4736397.png"/>
    <b align="center">Smart way to manage ids for forntend javascript and typescript projects.</b>
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
        <a href="https://github.com/appzic/elementid/LICENSE">
            <img alt="GitHub" src="https://img.shields.io/github/license/appzic/elementid">
        </a>
    </p>
</p>

## Table of contents

- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Features](#features)
- [Get Started](#get-started)
  - [How to install](#how-to-install)
  - [Create Input File](#create-input-file)
  - [Generate](#generate)
  - [Implementation](#implementation)
- [Command-line](#command-line)
- [Use Cases](#use-cases)
  - [With Astro component](#with-astro-component)
- [Contributing](#contributing)
- [License](#license)

## Introduction

ElementID is an ID management tool for your frontend Nodejs (javascript or typescript) projects. You can share id values between different modules using ElementID without any conflict. ElementID is a dev dependency. It provides unique or custom values to your production build according to the input IDs. ElementID has a caching system that helps to make id values static.

## Features

- :crossed_swords: No IDs conflict anymore
- :tada: Zero dependencies in production
- :chart_with_upwards_trend: Increase your productivity
- :muscle: Generate unique IDs with powerful the [nanoid](https://github.com/ai/nanoid) generator
- :eyes: Auto generate with watch mode
- :minidisc: Static unique values using caching
- :computer: Powerful CLI tool
- :scroll: Simple input configuration with .toml

## Get Started

### How to install

We recommend installing ElementID as a dev dependency

```bash
npm i -D elementid
```

### Create Input File

First, you declare your project IDs in `.toml` format. The **ElementID** can generates two types of id values.

- **Unique values** - If you want a unique value for your declared id, you should assign an empty string ("") for it.

```toml
yellowBtnId = ""
redBtnId = ""
```

- **Custom values** - If you want a custom value for your declared id, you should assign your custom value for it.

```toml
greenBtnId = "my_custom_value_1"
blueBtnId = "my_custom_value_2"
```

we recommend the [Even Better TOML extension](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) for VS Code users to create the .toml file

### Generate

The ElementID has a powerful CLI tool for generating IDs according to your input. If your input file path is `./my_ids.toml`, you can use the following command to generate IDs.

```
elementid ./my_ids.toml
```

Please read the [command line section](#command-line) for more CLI options.

### Implementation

The ElementID generates a javascript(.js) and a type declaration(.d.ts) files in `node_modeules/elementid/dist/` directory. you can use them as followings.

```typescript
// ES6 syntax
import { yellowBtnId, redBtnId, greenBtnId } from "elementid";

const yellowBtn = document.getElementById(yellowBtnId);
const redBtn = document.querySelector(`#${greenBtnId}`);
```

```javascript
// CommonJS syntax
const ids = require("elementid");

const yellowBtn = document.getElementById(ids.blueBtnId);
const redBtn = document.querySelector(`#${ids.redBtnId}`);
```

## Command-line

```
Usage: elementid <input file> [options]

Options:
  -w, --watch  Watch changes of input file
  -f, --force  Generate unique ids without cacheing
  --version    Show version number
  -h, --help   Show help

Examples:
  elementid ids.js                          with the input file
  elementid src/my_ids.js --watch           with the input file and a option
```

## Use Cases

### With Astro component

[Astro](https://astro.build/) is a static site generator. Astro has it has own component to build a static site. Astro component has four sections to generate HTML, CSS, and Javascript. [Read more about astro components](https://docs.astro.build/en/core-concepts/astro-components/).

- HTML content helper
- HTML content
- Scripts
- Styles

If you want to make a dynamic web page with Astro, you need to get access to the DOM elements. [getElementById()](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) is a popular method to get access to the DOM elements from javascript. But in Astro, you can not share the same id between HTML content and Script sections.

You can hardcode ID values in HTML content and Script sections. But it is not a good idea because these values can be spelling errors, and can conflict with each other.

The ElementID helps you to solve this problem. You can access the same id values with ElementID in the HTML content helper section and Script sections. Check out the following example for how to use ElementID in [Astro](https://astro.build/).

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

## Contributing

If you want to open a issue, create a Pull Request or simply want to know how you can run it on your local machine, please read the [Contributing guide](https://github.com/appzic/elementid/blob/main/CONTRIBUTING.md).

## License

ElementID is [MIT](https://github.com/appzic/elementid/blob/main/LICENSE) licensed.
