const fs = require('fs');
const path = require('path');

const stylesheetPath = path.join(
  __dirname,
  '../node_modules/mdb-react-ui-kit/dist/css/mdb.min.css'
);
const css = fs.readFileSync(stylesheetPath, 'utf8');
const updatedCss = css.replace(/color-adjust:exact/g, 'print-color-adjust:exact');

if (updatedCss !== css) {
  fs.writeFileSync(stylesheetPath, updatedCss);
}