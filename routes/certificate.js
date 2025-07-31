const express = require('express');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const router = express.Router();

router.get('/:name/:item', (req, res) => {
  const { name, item } = req.params;
  const templatePath = path.join(__dirname, '../templates/certificate.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // ✅ Build absolute file path with file:// prefix
  const logoAbsolutePath = `file://${path.join(__dirname, '../public/logo.png')}`;

  html = html
    .replace('{{name}}', name)
    .replace('{{item}}', item)
    .replace('{{logoPath}}', logoAbsolutePath);

  const options = { format: 'A4', orientation: 'landscape', border: '10mm' };

  pdf.create(html, options).toStream((err, stream) => {
    if (err) return res.status(500).send('Error generating PDF');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
    stream.pipe(res);
  });
});

module.exports = router;
