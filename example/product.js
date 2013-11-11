// sublime: tab_size 2; translate_tabs_to_spaces true

var config = require(__dirname+"/../config.json");

var magento = require('../lib/magento.js')(config.magento);

// magento.xmlrpc.auto.catalog.product.info("021-198-009/B", config.mageplus.store_view[0].code, function (error, result) {
//   console.log(result);
// });
var filter = magento.xmlrpc.auto.set_filter.sku("021-198-009/B");
console.log(filter);
magento.xmlrpc.auto.catalog.product.list({ sku: { like: '%' } }, "shop_de", function (error, result) {
  console.log(error);
  console.log(result);
});