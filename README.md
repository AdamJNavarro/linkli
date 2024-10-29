# linkli

```bash
npm i -g linkli
```

### Open Some Documentation

```bash
linkli open bun
```

### Generate a per-project collection

In the root directory of a project containing a `package.json`, run:

```bash
linkli generate
```

Linkli will look at your project's `package.json` and the contents of the root dir in an attempt to find any footprints of popular products. The results will be written to the `.linkli` folder in your projects root dir.

### Auto-complete Suggestions

When running `linkli open` while in a project that has a valid Linkli collection, your terminal suggestions (by way of Amazon Q a.k.a Fig) will prioritize the products that are found in the local collection.
