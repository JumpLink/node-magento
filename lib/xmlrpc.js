module.exports = function(config) {
  var xmlrpc_config = {
    host: config.host,
    port: config.port,
    path: config.xmlrpc_path,
    login: config.login,
    pass:  config.pass
  };
  //var isSecure = config.isSecure;
  var isSecure = true;
  var magento = {
    manual: require('./xmlrpc_core.js')(xmlrpc_config, isSecure),
    auto: {
      catalog: {
        category: {
          level: function(website, storeView ,parentCategory, cb) {
            if (magento.manual.catalog_category)
              magento.manual.catalog_category.level(website, storeView ,parentCategory, cb);
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_category.level(website, storeView ,parentCategory, cb);
              });
          },
          /* http://www.magento.manualcommerce.com/wiki/doc/webservices-api/catalog_category#catalog_category.tree */
          tree: function(parentId, storeView, cb) {
            if (magento.manual.catalog_category)
              magento.manual.catalog_category.tree(parentId, storeView, cb);
            else {
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_category.tree(parentId, storeView, cb);
              });
            }
          },
          /* http://www.magento.manualcommerce.com/wiki/doc/webservices-api/catalog_category#catalog_category.assignedproducts */
          assignedProducts: function(categoryId, store, cb) {
            if (magento.manual.catalog_category)
              magento.manual.catalog_category.assignedProducts(categoryId, store, cb);
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_category.assignedProducts(categoryId, store, cb);
              });
          },
          create: function(parent_id, categoryData, storeView, cb) {
            if(categoryData.default_sort_by === null) {
              categoryData.available_sort_by = ['name'];
              categoryData.default_sort_by = 'name';
            }
            if (magento.manual.catalog_category)
              magento.manual.catalog_category.create(parent_id, categoryData, storeView, cb);
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_category.create(parent_id, categoryData, storeView, cb);
              });
          },
          delete: function (id, cb) {
            if (magento.manual.catalog_category)
              magento.manual.catalog_category.delete(id, cb);
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_category.delete(id, cb);
              });
          }
        },
        product: {
          list: function(filters, storeView, cb) {
            if (magento.manual.catalog_product)
              magento.manual.catalog_product.list(filters, storeView, cb);
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.list(filters, storeView, cb);
              });
          },
          /* http://www.magento.manualcommerce.com/wiki/doc/webservices-api/api/catalog_product#catalog_product.info */
          info: function(product_id_or_sku, storeView, cb) {
            if (magento.manual.catalog_product) {
              magento.manual.catalog_product.info(product_id_or_sku, storeView, cb);
            } else {
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.info(product_id_or_sku, storeView, cb);
              });
            }
          },
          delete: function(id, cb) {
            if (magento.manual.catalog_category)
              magento.manual.catalog_product.delete(id, cb);
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.delete(id, cb);
              });
          },
          available: function(product_id_or_sku, storeView, cb) {
            if (magento.manual.catalog_product)
              magento.manual.catalog_product.info(product_id_or_sku, storeView, function (error, result){
                if(error) {
                  cb(false, product_id_or_sku);
                }
                else {
                  cb(true, product_id_or_sku);
                }
              });
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.info(product_id_or_sku, storeView, function (error, result){
                  if(error) {
                    cb(false, product_id_or_sku);
                  }
                  else {
                    cb(true, product_id_or_sku);
                  }
                });
              });
          },
          info_and_image: function(product_id_or_sku, storeView, cb_render) {
            if (magento.manual.catalog_product)
              magento.manual.catalog_product.info(product_id_or_sku, storeView, function(error, result_attributes) {
                if (error) { throw error; }
                magento.manual.catalog_product_attribute_media.list(product_id_or_sku, storeView, function(error, result_image) {
                  if (error) { throw error; }
                  cb_render(result_attributes, result_image);
                });
              });
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.info(product_id_or_sku, storeView, function(error, result_attributes) {
                  if (error) { throw error; }
                  magento.manual.catalog_product_attribute_media.list(product_id_or_sku, storeView, function(error, result_image) {
                    if (error) { throw error; }
                    cb_render(result_attributes, result_image);
                  });
                });
              });
          },
          update: function product_update (product_id_or_sku, productData, storeView, cb_render) {
            var product_id_or_sku = product_id_or_sku;
            if (magento.manual.catalog_product)
              magento.manual.catalog_product.update(product_id_or_sku, productData, storeView, function(error, result) {
                if(error && error.faultString == "SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock; try restarting transaction") {
                  console.log(error.faultString);
                  console.log("restart update now!");
                  setTimeout(function() {
                    product_update(product_id_or_sku, productData, storeView, cb_render);
                  }, 500);
                } else {
                  cb_render(error, result, product_id_or_sku);
                }
              });
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.update(product_id_or_sku, productData, storeView, function(error, result) {
                  if(error && error.faultString == "SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock; try restarting transaction") {
                    console.log(error.faultString);
                    console.log("restart update now!");
                    setTimeout(function() {
                      product_update(product_id_or_sku, productData, storeView, cb_render);
                    }, 500);
                  } else {
                    cb_render(error, result, product_id_or_sku);
                  }
                });
              });
          },
          /* http://www.magentocommerce.com/api/soap/catalog/catalogProduct/catalog_product.create.html */
          create: function product_create (type, set, sku, productData, storeView, cb) {
            if (magento.manual.catalog_product)
              magento.manual.catalog_product.create(type, set, sku, productData, storeView, function (error, result){
                if(error && error.faultString == "SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock; try restarting transaction") {
                  console.log(error.faultString);
                  console.log("restart create now!");
                  setTimeout(function() {
                    product_create(type, set, sku, productData, storeView, cb);
                  }, 500);
                } else {
                  cb(error, result, sku);
                }
              });
            else
              magento.manual.init(function(err) {
                if (err) { throw err; }
                magento.manual.catalog_product.create(type, set, sku, productData, storeView, function (error, result){
                  if(error && error.faultString == "SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock; try restarting transaction") {
                    console.log(error.faultString);
                    console.log("restart create now!");
                    setTimeout(function() {
                      product_create(type, set, sku, productData, storeView, cb);
                    }, 500);
                  } else {
                    cb(error, result, sku);
                  }
                });
              });
          },
          stock: {
            list: function(product_id_or_sku, cb) {
              if (magento.manual.cataloginventory_stock_item) {
                magento.manual.cataloginventory_stock_item.list(product_id_or_sku, function (err, res) {
                  if(err) cb(err, res);
                  else {
                    if(typeof res.is_in_stock !== 'undefined') res.is_in_stock = res.is_in_stock != '0';
                    if(typeof res.qty !== 'undefined') res.qty = Number(res.qty);
                    cb(err, res);
                  }
                });
              } else {
                magento.manual.init(function(err) {
                  if (err) { cb(err); /*throw err;*/ }
                  magento.manual.cataloginventory_stock_item.list(product_id_or_sku, function (err, res) {
                    if(err) cb(err, res);
                    else {
                      if(typeof res.is_in_stock !== 'undefined') res.is_in_stock = res.is_in_stock != '0';
                      if(typeof res.qty !== 'undefined') res.qty = Number(res.qty);
                      cb(err, res);
                    }
                  });
                });
              }
            },
            update: function(product_id_or_sku, data, cb) {
              console.log("data", data);
              var transformed = {};
              if(typeof data.qty !== 'undefined') transformed.qty = data.qty.toString();
              if(typeof data.is_in_stock !== 'undefined') transformed.is_in_stock = data.is_in_stock == true || data.is_in_stock == 1 ? '1' : '0';
              if(typeof data.manage_stock !== 'undefined') transformed.manage_stock = data.manage_stock == true || data.manage_stock == 1 ? '1' : '0';
              if(typeof data.use_config_manage_stock !== 'undefined') transformed.use_config_manage_stock = data.use_config_manage_stock == true || data.use_config_manage_stock == 1 ? '1' : '0';
              if(typeof data.min_qty !== 'undefined') transformed.min_qty = data.min_qty.toString();
              if(typeof data.use_config_min_qty !== 'undefined') transformed.use_config_min_qty = data.use_config_min_qty == true || data.use_config_min_qty == 1 ? '1' : '0';
              if(typeof data.min_sale_qty !== 'undefined') transformed.min_sale_qty = data.min_sale_qty.toString();
              if(typeof data.use_config_min_sale_qty !== 'undefined') transformed.use_config_min_sale_qty = data.use_config_min_sale_qty == true || data.use_config_min_sale_qty == 1 ? '1' : '0';
              if(typeof data.max_sale_qty !== 'undefined') transformed.max_sale_qty = data.max_sale_qty.toString();
              if(typeof data.use_config_max_sale_qty !== 'undefined') transformed.use_config_max_sale_qty = data.use_config_max_sale_qty == true || data.use_config_max_sale_qty == 1 ? '1' : '0';
              if(typeof data.is_qty_decimal !== 'undefined') transformed.is_qty_decimal = data.is_qty_decimal == true || data.is_qty_decimal == 1 ? '1' : '0';
              if(typeof data.backorders !== 'undefined') transformed.backorders = data.backorders == true || data.backorders == 1 ? '1' : '0';
              if(typeof data.use_config_backorders !== 'undefined') transformed.use_config_backorders = data.use_config_backorders == true || data.use_config_backorders == 1 ? '1' : '0';
              if(typeof data.notify_stock_qty !== 'undefined') transformed.notify_stock_qty = data.notify_stock_qty.toString();
              if(typeof data.use_config_notify_stock_qty !== 'undefined') transformed.use_config_notify_stock_qty = data.use_config_notify_stock_qty == true || data.use_config_notify_stock_qty == 1 ? '1' : '0';
              console.log("transformed", transformed);

              if (magento.manual.cataloginventory_stock_item) {
                magento.manual.cataloginventory_stock_item.update(product_id_or_sku, transformed, cb);
              } else {
                magento.manual.init(function(err) {
                  if (err) { cb(err); /*throw err;*/ }
                  magento.manual.cataloginventory_stock_item.update(product_id_or_sku, transformed, cb);
                });
              }
            }
          },
          attribute: {
            media: {
              /* http://www.magento.manualcommerce.com/wiki/doc/webservices-api/api/catalog_product_attribute_media#catalog_product_attribute_media.list */
              list: function(product_id_or_sku, storeView, cb) {
                if (magento.manual.catalog_product_attribute_media)
                  magento.manual.catalog_product_attribute_media.list(product_id_or_sku, storeView, cb);
                else
                  magento.manual.init(function(err) {
                    if (err) { throw err; }
                    magento.manual.catalog_product_attribute_media.list(product_id_or_sku, storeView, cb);
                  });

              },
              /* http://www.magento.manualcommerce.com/wiki/doc/webservices-api/api/catalog_product_attribute_media#catalog_product_attribute_media.info */
              info: function(product_id_or_sku, storeView, cb) {
                if (magento.manual.catalog_product_attribute_media)
                  magento.manual.catalog_product_attribute_media.info(product_id_or_sku, storeView,  cb);
                else
                  magento.manual.init(function(err) {
                    if (err) { throw err; }
                    magento.manual.catalog_product_attribute_media.info(product_id_or_sku, storeView,  cb);
                  });
              }
            },
            /* http://www.magentocommerce.com/wiki/doc/webservices-api/api/catalog_product_attribute_tier_price */
            tier_price: {
              info: function (product_id_or_sku, cb) {
                if (magento.manual.catalog_product_attribute_tier_price) {
                  magento.manual.catalog_product_attribute_tier_price.info(product_id_or_sku, cb);
                } else {
                  magento.manual.init(function(err) {
                    if (err) { throw err; }
                    magento.manual.catalog_product_attribute_tier_price.update(product_id_or_sku, cb);
                  });
                }
              },
              update: function (product_id_or_sku, tierPrices, cb) {
                if (magento.manual.catalog_product_attribute_tier_price) {
                  magento.manual.catalog_product_attribute_tier_price.update(product_id_or_sku, tierPrices, cb);
                } else {
                  magento.manual.init(function(err) {
                    if (err) { throw err; }
                    magento.manual.catalog_product_attribute_tier_price.update(product_id_or_sku, tierPrices, cb);
                  });
                }
              }
            }
          }
        }
      },

      store: {
        list: function(cb) {
          if (magento.manual.core_magento)
            magento.manual.core_magento.info(cb);
          else
            magento.manual.init(function(err) {
              if (err) { throw err; }
              magento.manual.core_magento.info(cb);
            });
        }
      },
      /*
       * http://www.magentocommerce.com/wiki/1_-_installation_and_configuration/using_collections_in_magento
       * Definiert einen Filter
       */
      set_filter: {
        sku: function(sku) {
          var filters = {
              sku: {
                eq: sku
              }
            };
          return filters;
        },
        like_sku: function(sku) {
          var filters = {
              sku: {
                like: sku+"%"
              }
            };
          return filters;
        },
        product_id: function(product_id) {
          var filters = {
              product_id: {
                eq: product_id
              }
            };
          return filters;
        },
        name: function(name) {
          var filters = {
              name: {
                eq: name
              }
            };
          return filters;
        },
        set: function(set) {
          var filters = {
              set: {
                eq: set
              }
            };
          return filters;
        },
        type: function(type) {
          var filters = {
              type: {
                eq: type
              }
            };
          return filters;
        }
      }
    }
  };
  return magento;
};
