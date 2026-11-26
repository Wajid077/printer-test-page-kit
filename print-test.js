/* Printer Test Page Kit - builds each test sheet as inline SVG.
   MIT License. SVG fills print even when "Background graphics" is off. */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var page = document.getElementById('page');
  var paperSel = document.getElementById('paper');
  var sheetSel = document.getElementById('sheet');
  var styleTag = document.createElement('style');
  document.head.appendChild(styleTag);

  // Usable width in mm after 10 mm margins on each side
  var PAPER = {
    a4:     { size: 'A4',     w: 190 },
    letter: { size: 'letter', w: 195.9 }
  };

  function svg(wMm, hMm) {
    var el = document.createElementNS(NS, 'svg');
    el.setAttribute('viewBox', '0 0 ' + wMm + ' ' + hMm);
    el.setAttribute('width', wMm + 'mm');
    el.setAttribute('height', hMm + 'mm');
    return el;
  }

  function rect(parent, x, y, w, h, fill, stroke) {
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('fill', fill || 'none');
    if (stroke) { r.setAttribute('stroke', stroke); r.setAttribute('stroke-width', 0.25); }
    parent.appendChild(r);
    return r;
  }

  function line(parent, x1, y1, x2, y2, color, width) {
    var l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1);
    l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('stroke', color);
    l.setAttribute('stroke-width', width);
    parent.appendChild(l);
  }

  function text(parent, x, y, str, size) {
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('font-size', size || 3);
    t.setAttribute('font-family', 'sans-serif');
    t.textContent = str;
    parent.appendChild(t);
  }

  function heading(title, sub) {
    var h = document.createElement('h2'); h.textContent = title;
    var p = document.createElement('p'); p.className = 'sub'; p.textContent = sub;
    page.appendChild(h); page.appendChild(p);
  }

  function section(title) {
    var h = document.createElement('h3'); h.textContent = title;
    page.appendChild(h);
  }

  // Process colours: one bar per cartridge, as close as the driver allows
  var CMYK = [['Cyan', '#00FFFF'], ['Magenta', '#FF00FF'], ['Yellow', '#FFFF00'], ['Black', '#000000']];
  var RGB  = [['Red', '#FF0000'], ['Green', '#00FF00'], ['Blue', '#0000FF']];

  function swatchRow(list, W) {
    var s = svg(W, 24), w = W / list.length;
    list.forEach(function (c, i) {
      rect(s, i * w, 0, w, 18, c[1]);
      text(s, i * w + 1, 22.5, c[0], 3);
    });
    page.appendChild(s);
  }

  function ramp(W, from, to, steps) {
    var s = svg(W, 12), w = W / steps;
    for (var i = 0; i < steps; i++) {
      var t = i / (steps - 1);
      var v = Math.round(from + (to - from) * t);
      rect(s, i * w, 0, w + 0.05, 12, 'rgb(' + v + ',' + v + ',' + v + ')');
    }
    page.appendChild(s);
  }

  function hueGrid(W) {
    var cols = 12, rows = 4, cw = W / cols, ch = 8, s = svg(W, rows * ch);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var light = [35, 50, 65, 80][r];
        rect(s, c * cw, r * ch, cw, ch, 'hsl(' + (c * 30) + ',90%,' + light + '%)');
      }
    }
    page.appendChild(s);
  }

  function scaleBox() {
    section('Scale check');
    var s = svg(110, 60);
    rect(s, 0, 0, 100, 50, 'none', '#000');
    text(s, 2, 56, 'This box should measure exactly 100 mm × 50 mm. If not, printing is scaled.', 3);
    page.appendChild(s);
  }

  var SHEETS = {
    color: function (W) {
      heading('Color Printer Test Page', 'Check each cartridge: faded, streaky or missing colours show up straight away.');
      section('CMYK process colours'); swatchRow(CMYK, W);
      section('RGB primaries'); swatchRow(RGB, W);
      section('Hue grid'); hueGrid(W);
      section('Gray ramp (0–100%)'); ramp(W, 0, 255, 21);
      scaleBox();
    },
    bw: function (W) {
      heading('Black & White Printer Test Page', 'For mono lasers and the black cartridge on inkjets.');
      section('Solid black'); var s = svg(W, 30); rect(s, 0, 0, W, 30, '#000'); page.appendChild(s);
      section('Gray ramp (0–100%)'); ramp(W, 0, 255, 21);
      section('Fine lines (0.1 / 0.2 / 0.3 / 0.5 mm)');
      var l = svg(W, 30);
      [0.1, 0.2, 0.3, 0.5].forEach(function (w, i) { line(l, 0, 4 + i * 7, W, 4 + i * 7, '#000', w); });
      page.appendChild(l);
      section('Text sizes');
      var t = svg(W, 30);
      [2, 2.5, 3, 4, 5].forEach(function (sz, i) {
        text(t, 0, 4 + i * 6, Math.round(sz * 2.835) + 'pt  The quick brown fox jumps over the lazy dog 0123456789', sz);
      });
      page.appendChild(t);
      scaleBox();
    },
    nozzle: function (W) {
      heading('Nozzle Check Pattern', 'Every line should be unbroken. Gaps or missing steps point to a clogged nozzle in that colour.');
      CMYK.forEach(function (c) {
        section(c[0]);
        // Staircase of short steps: one broken step = one blocked nozzle row
        var s = svg(W, 16);
        for (var x = 0, i = 0; x < W - 4; x += 4, i++) {
          var y = 1 + (i % 8) * 1.6;
          line(s, x, y, x + 3, y, c[1], 0.35);
          line(s, x + 3, y, x + 3, 15, c[1], 0.25);
        }
        page.appendChild(s);
      });
      scaleBox();
    },
    align: function (W) {
      heading('Printer Alignment Grid', '5 mm grid with 10 mm major lines. Lines should be straight, evenly spaced and meet cleanly.');
      var H = 200, s = svg(W, H);
      for (var x = 0; x <= W; x += 5) line(s, x, 0, x, H, x % 10 === 0 ? '#000' : '#888', x % 10 === 0 ? 0.3 : 0.15);
      for (var y = 0; y <= H; y += 5) line(s, 0, y, W, y, y % 10 === 0 ? '#000' : '#888', y % 10 === 0 ? 0.3 : 0.15);
      line(s, 0, 0, W, H, '#00AEEF', 0.3);
      line(s, W, 0, 0, H, '#EC008C', 0.3);
      page.appendChild(s);
      scaleBox();
    }
  };

  function render() {
    var p = PAPER[paperSel.value];
    page.dataset.paper = paperSel.value;
    styleTag.textContent = '@page { size: ' + p.size + '; margin: 10mm; }';
    page.innerHTML = '';
    SHEETS[sheetSel.value](p.w);
    var foot = document.createElement('p');
    foot.className = 'scale-note';
    foot.textContent = 'Printer Test Page Kit (MIT). Ready-made PDFs: printerprinttest.com';
    page.appendChild(foot);
  }

  paperSel.addEventListener('change', render);
  sheetSel.addEventListener('change', render);
  document.getElementById('print').addEventListener('click', function () { window.print(); });
  render();
}());
