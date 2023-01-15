# Rakkas on Deno

There is some manual boilerplate here to work around some issues but it works!

## Getting started

Clone with:

```bash
deno run -A npm:degit rakkasjs/deno-template rakkas-deno
```

## Available tasks

| Tasks               | Description                       |
| ------------------- | --------------------------------- |
| `deno task dev`     | Start the development server      |
| `deno task build`   | Build the project for production  |
| `deno task serve`   | Serve the production build        |
| `deno task deploy`¹ | Deploy the project to Deno Deploy |

¹ Edit the `deno.json` file to change the project ID and add your deploy token (or use the `DENO_DEPLOY_TOKEN` environment variable).
