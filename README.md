# linkli

Find and open links to the docs for popular tech products all from the comfort of your terminal.

## Installation

> Linkli requires [Node.js](https://nodejs.org) version 18 or above.

To install the latest version of linkli, run the following command

```bash
npm i -g linkli
```

Linkli is meant to be installed globally which enables you to quickly open links whether your in a valid project directory or not.

## Setup

For the best experience, it is highly recommended to have [Amazon Q](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line.html) (formerly known as fig) installed and up to date.

The autocompletion provided allows linkli to prioritize and suggest products found within a project when running the `linkli open` command.

## Usage

Once installed globally, you can use the `linkli` command or `lkl` alias.

```bash
linkli [command]
```

#### Opening a link

```bash
linkli open drizzle
```

#### Search available products

```bash
linkli search
```

#### Find products in your project

In the root dir of a project that has both a `package.json` and `git` repository, run the following command

```bash
linkli init
```

Doing so will add linkli to your `.gitignore` and then linkli will look for product footprints in your project to generate a project-specific collection of links. The output will be written to `.linkli/collection.json`.

To generate a fresh collection, say if your project's tech stack has changed, run the following command

```bash
linkli generate
```
