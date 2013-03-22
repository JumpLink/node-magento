// sublime: tab_size 2; translate_tabs_to_spaces true

var config = require('json-fs').open(__dirname+"/../../../config/general.json");

var magento = require('../lib/magento.js')(config.mageplus);

// magento.auto.catalog.product.info("021-198-009/B", config.mageplus.store_view[0].code, function (error, result) {
//   console.log(result);
// });
var filter = magento.auto.set_filter.sku("021-198-009/B");
magento.auto.catalog.product.list(filter, config.mageplus.store_view[0].code, function (error, result) {
  console.log(result);
});