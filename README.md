<div align="center">
  
# pdfFrom

Vercel function which generates PDFs from Webpages.

</div>

## 👋 Introduction

This repo contains the code for a simple [Vercel](https://vercel.com) function which generates a PDF file from any webpage using a [headless Chrome instance](https://github.com/puppeteer/puppeteer).

## 🚀 Get started

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%elmsln%2FpdfFrom)

### Or setup manually:

Clone this repository:

```sh
git clone https://github.com/elmsln/pdfFrom
```

Install all dependencies:

```sh
yarn install
```

Login to your Vercel account and setup a project:

```sh
vercel
```

Run the function locally:

```sh
yarn run develop
```

Deploy to Vercel in production:

```sh
yarn run deploy 
```

## 📚 Usage

After you've deployed the function, you can use it by placing your function's domain infront of any URL:

```
to-pdf.vercel.app/https://github.com/elmsln/pdfFrom
```

The function will then generate a PDF of that URL and return it as a downloadable file.

Here is how this GitHub Page looks as a PDF:

![example](https://cdn.mxis.ch/assets/vercel-pdf-converter/preview.png)

## 💻 Development

Issues and PRs are very welcome!

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). To see differences with previous versions refer to the [CHANGELOG](CHANGELOG.md).

## License

Copyright 2022 ELMS: Learning Network

Project based off of work from: https://github.com/BetaHuhn/vercel-pdf-converter
Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
