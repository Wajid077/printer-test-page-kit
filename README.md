# Printer Test Page Kit

A small, dependency-free set of printer test pages you can open in any browser and print. It has four sheets, each sized for A4 or US Letter:

- **Color test**: CMYK and RGB swatches, a 48-patch hue grid and a gray ramp, for spotting faded or missing colours
- **Black & white test**: solid black, a gray ramp, 0.1–0.5 mm hairlines and text from 6 to 14 pt
- **Nozzle check**: a staircase pattern in cyan, magenta, yellow and black, where a broken step points to a blocked nozzle
- **Alignment grid**: a 5 mm / 10 mm grid with diagonals for checking skew and print head alignment

Every sheet also has a 100 × 50 mm scale box, so you can confirm with a ruler that nothing was resized.

**Live demo:** https://wajid077.github.io/printer-test-page-kit/

![Color test sheet preview](docs/preview-color.jpg)

## Usage

Open `index.html`, pick the paper size and the sheet, then press **Print**. For accurate results:

1. Set the scale to 100% and turn off "Fit to page" or "Shrink to fit".
2. Use plain white paper at the printer's normal quality setting.

There's no need to turn on "Background graphics". All patches are drawn as inline SVG, and browsers print SVG fills as content.

## How it works

- `@page` sets the paper size and a 10 mm margin. The script swaps it when you change the paper.
- Everything that gets measured uses millimetres in SVG `viewBox` units, with the SVG `width` and `height` set in mm. CSS defines 1 in = 96 px, so at 100% scale the printed sizes are exact.
- The SVGs are never stretched with CSS (`width: 100%`), because that would make the scale box wrong.
- `print-color-adjust: exact` is set as a fallback for anything that isn't SVG.

## Ready-made PDFs

If you just want something to print, PDF versions of these sheets, plus more test pages and printer guides, are free at [PrinterPrintTest.com](https://printerprinttest.com/).

## License

MIT. See `LICENSE`.
