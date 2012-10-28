// sublime: tab_size 2; translate_tabs_to_spaces true

var config = require('json-fs').open(__dirname+"/config/general.json");

var magento = require('../lib/magento.js')(config);

magento.auto.catalog.product.info("021-198-009/B", config.store_view[0].code, function (error, result) {
  console.log(result);
});