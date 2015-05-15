// sublime: tab_size 2; translate_tabs_to_spaces true

var _config = require("./config.json");

var config = {
  "host": _config.host,
  "port": _config.port || 80,
  "xmlrpc_path": _config.xmlrpc_path || "/index.php/api/xmlrpc/",
  "login": _config.login,
  "pass": _config.pass
} 

var magento = require('../lib/magento.js')(config);

// console.log(magento);

// magento.xmlrpc.manual.init(function(err) {
//   console.log(err);
//   console.log(magento);
// });

// magento.xmlrpc.auto.catalog.product.info("021-198-009/B", "shop_de", function (error, result) {
//   console.log(result);
// });

var filter = magento.xmlrpc.auto.set_filter.sku("021-198-009/B");

console.log(filter);
magento.xmlrpc.auto.catalog.product.list(filter, "shop_de", function (error, result) {
  console.log(error);
  console.log(result);
});