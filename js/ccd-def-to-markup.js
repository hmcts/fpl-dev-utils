var fs = require('fs');
const path = require('path');

function walk(dir) {
    let files = fs.readdirSync(dir);
    files = files.map(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    });

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

const defRoot = '../../fpl-ccd-configuration/ccd-definition';

const types = walk(defRoot + '/ComplexTypes/');
const isComplex = (type) => {
    return !(type === 'Text' || type === 'TextArea' || type === 'Date'
        || type === 'Label' || type === 'YesOrNo' || type === 'Document' || type === 'AddressUK'
        || type === 'Collection' || type === 'DateTime');
};

types.forEach(type => {
    var complexType = JSON.parse(fs.readFileSync(type).toString());

    console.log(`h2. ${complexType[0].ID}`);
    console.log('');
    console.log('||Attribute name||Definition||Description||Reform model name||Status');

    complexType.forEach(elem => {
        if (elem.FieldType === 'MultiSelectList' || elem.FieldType === 'FixedRadioList' || elem.FieldType === 'FixedList') {
            console.log(`|${elem.ListElementCode}|${elem.FieldType}&#91;[${elem.FieldTypeParameter}|#${elem.FieldTypeParameter}]&#93;| | | |`);
        } else if (isComplex(elem.FieldType)) {
            console.log(`|${elem.ListElementCode}|[${elem.FieldType}|#${elem.FieldType}]| | | |`);
        } else if (elem.FieldType !== 'Label') {
            console.log(`|${elem.ListElementCode}|${elem.FieldType}| | | |`);
        }
    });

});

const fixedLists = walk(defRoot + '/FixedLists/');

fixedLists.forEach(type => {
  var complexType = JSON.parse(fs.readFileSync(type).toString());

  console.log(`h2. ${complexType[0].ID}`);
  console.log('');
  console.log('||Element code||Element label||Description||Reform model name||Status');

  complexType.forEach(elem => {
    console.log(`|${elem.ListElementCode}|${elem.ListElement}| | | |`);
  });

});
