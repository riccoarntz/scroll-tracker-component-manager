## Description
The ScrollTrackerComponentManager is a `Class` that tracks whether a component is within your viewport based on your scroll position. It will/can handle the following for you:

* Trigger methods such as `enterView` or `leaveView`, once you component enters/leaves your viewport.
* Update your component with a progress value between `0` and `1`. This is the progress of you components visibility.
* Enable smooth-scroll if needed

## Table of contents

1. [Installation](#installation)
2. [Demo](#demo)
3. [Documentation](#documentation)
4. [Building](#building)
5. [Authors](#authors)
6. [Contribute](#contribute)
7. [License](#license)

## Installation
### yarn / npm

```sh
yarn add scroll-tracker-component-manager
```

```sh
npm i -S scroll-tracker-component-manager
```

## Online Demo
Checkout the online [demo](https://riccoarntz.github.io/scroll-tracker-component-manager/example/).


## Demo
Demo can be found in /example.
Install dev dependencies:
```sh
  yarn
```
Run the example:
```sh
  yarn dev
```

## Documentation
Detailed documentation and examples are located in the wiki!

### [Check the wiki!](https://github.com/riccoarntz/scroll-tracker-component-manager/wiki)


## Building

In order to build scroll-tracker-component-manager, ensure that you have [Git](http://git-scm.com/downloads) and [Node.js]
(http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/riccoarntz/scroll-tracker-component-manager.git
```

Change to the vue-transition directory:
```sh
cd scroll-tracker-component-manager
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build           # build this project
yarn dev             # run dev-watch mode, serving example/index.html in the browser
yarn generate        # generate all artifacts (compiles ts, webpack, docs and coverage)
yarn test:unit       # run the unit tests
yarn validate        # runs validation scripts, including test, lint and coverage check
yarn lint            # run tslint on this project
yarn doc             # generate typedoc documentation
```

When installing this module, it adds a pre-push hook, that runs the `validate`
script before committing, so you can be sure that everything checks out.


## Authors
View [AUTHORS.md](./AUTHORS.md)

## Contribute
View [CONTRIBUTING.md](./CONTRIBUTING.md)

## License
[MIT](./LICENSE) © Ricco Arntz
