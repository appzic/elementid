# ElementId

A proper way to manage ids for javascript and typescript projects.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/appzic/elementid/main.yml?branch=main)
![npm](https://img.shields.io/npm/v/elementid)
![npm](https://img.shields.io/npm/dw/elementid)
![GitHub](https://img.shields.io/github/license/appzic/elementid)

## How to install

```bash
npm i -D elementid
```

## How to use
create `.toml` file for input ids. For example your can create `my_ids.toml` in root of the project directory
```toml
# unique ids
yellowBtnId = ""
redBtnId = ""

# custom id
greenBtnId = "mycustomid"
```
use following commond to generate ids
```
elementid ./my_ids.toml
```
now you can use ids in your javascript or typescript source files 
```typescript
// ES6 syntax
import {yellowBtnId, redBtnId, greenBtnId} from "elementid";

const yellowBtn = document.getElementById(yellowBtnId);
const redBtn = document.querySelector(`#${redBtnId}`);
```

```javascript
// CommonJS syntax
const ids = require("elementid");

const yellowBtn = document.getElementById(ids.yellowBtnId);
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
