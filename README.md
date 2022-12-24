# ElementID

<p align="center">
    <p align="center">Smart way to manage ids for javascript and typescript projects.</p>
    <p align="center" style="align: center;">
        <a href="https://github.com/appzic/elementid/blob/main/LICENSE">
            <img alt="GitHub" src="https://img.shields.io/github/license/appzic/elementid">
        </a>
    </p>
</p>

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/appzic/elementid/main.yml?branch=main)
![npm](https://img.shields.io/npm/v/elementid)
![npm](https://img.shields.io/npm/dw/elementid)
![GitHub](https://img.shields.io/github/license/appzic/elementid)

## How to install

```bash
npm i -D elementid
```

## How to use

### Create Input File

First, you declare your project IDs in `.toml` format. The **ElementID** can generates two types of id values.

- **Unique values** - If you want a unique value for your declared id, you should assign an empty string("") for it.

```toml
yellowBtnId = ""
redBtnId = ""
```

- **Custom values** - If you want a custom value for your declared id, you should assign your custom value for it.

```toml
greenBtnId = "my_custom_value_1"
blueBtnId = "my_custom_value_2"
```

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

## Contributing

If you want to open a issue, create a Pull Request or simply want to know how you can run it on your local machine, please read the [Contributing guide](./CONTRIBUTING.md).

## License

MIT
