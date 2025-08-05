# linkli

> NO LONGER AVAILABLE. This was a quick hobby project that quickly lost its value with the rapid development of AI-enabled terminals and IDEs.

Find and open links to the docs for popular tech products all from the comfort of your terminal.

## Usage

Once installed globally, you can use the `linkli` command.

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

#### Acknowledgements

In order to quickly get a prototype working, I used the following CLIs: [expo](https://github.com/expo/expo/tree/main/packages/%40expo/cli), [vercel](https://github.com/vercel/vercel/tree/main/packages/cli) and [netlify](https://github.com/netlify/cli) as a reference and in some cases re-used code (mainly in the form of util functions) so I thank all contributors of the aforementioned projects.
