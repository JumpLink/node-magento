module.exports = function(config) {
  var config = config;
  var magento = {
    rest: require('./rest.js')(config),
    auto: {
      /*
       * http://www.restcommerce.com/wiki/1_-_installation_and_configuration/using_collections_in_rest
       * Definiert einen Filter
       */
      set_filter: {
        sku: function(sku) {
          var filters = {
              sku: {
                qe: sku
              }
            }
          return filters
        },
        product_id: function(product_id) {
          var filters = {
              product_id: {
                qe: product_id
              }
            }
          return filters
        },
        name: function(name) {
          var filters = {
              name: {
                qe: name
              }
            }
          return filters
        },
        set: function(set) {
          var filters = {
              set: {
                qe: set
              }
            }
          return filters
        },
        type: function(type) {
          var filters = {
              type: {
                qe: type
              }
            }
          return filters
        }
      },

      catalog: {
        category: {
          level: function(website, storeView ,parentCategory, cb) {
            rest.init(function(err) {
              rest.catalog_category.level(website, storeView ,parentCategory, cb);
            });
          },
          /* http://www.restcommerce.com/wiki/doc/webservices-api/catalog_category#catalog_category.tree */
          tree: function(parentId, storeView, cb) {
            rest.init(function(err) {
              rest.catalog_category.tree(parentId, storeView, cb);
            });
          },
          /* http://www.restcommerce.com/wiki/doc/webservices-api/catalog_category#catalog_category.assignedproducts */
          assignedProducts: function(categoryId, store, cb) {
            rest.init(function(err) {
              rest.catalog_category.assignedProducts(categoryId, store, cb);
            });
          }
        },
        product: {
          list: function(filters, storeView, cb) {
            rest.init(function(err) {
              rest.catalog_product.list(filters, storeView, cb);
            });

          },
          /* http://www.restcommerce.com/wiki/doc/webservices-api/api/catalog_product#catalog_product.info */
          info: function(product_id_or_sku, storeView, cb) {
            magento.rest.init(function(err) {
              rest.catalog_product.info(product_id_or_sku, storeView, cb);
            });

          },
          info_and_image: function(product_id_or_sku, storeView, cb_render) {
            rest.init(function(err) {
              rest.catalog_product.info(product_id_or_sku, storeView, function(error, result_attributes) {
                if (error) { throw error; }
                rest.catalog_product_attribute_media.list(product_id_or_sku, storeView, function(error, result_image) {
                  if (error) { throw error; }
                  cb_render(result_attributes, result_image);
                });
              }); 
              
            });

          },
          update: function(product_id_or_sku, productData, storeView, cb_render) {
            var product_id_or_sku = product_id_or_sku;
            rest.init(function(err) {
              rest.catalog_product.update(product_id_or_sku, productData, storeView, function(error, result) {
                //if (error) { throw error; }
                //console.log("updated sku: "+product_id_or_sku);
                cb_render(error, product_id_or_sku, result);
              }); 
            });
          },
          attribute: {
            media: {
              /* http://www.restcommerce.com/wiki/doc/webservices-api/api/catalog_product_attribute_media#catalog_product_attribute_media.list */
              list: function(product_id, storeView, cb) {
                rest.init(function(err) {
                  rest.catalog_product_attribute_media.list(product_id, storeView, cb);
                });

              },
              /* http://www.restcommerce.com/wiki/doc/webservices-api/api/catalog_product_attribute_media#catalog_product_attribute_media.info */
              info: function(product_id, storeView, cb) {
                rest.init(function(err) {
                  rest.catalog_product_attribute_media.info(product_id, storeView,  cb);
                });
              }
            }
          }
        }
      },

      store: {
        list: function(cb) {
          rest.init(function(err) {
            rest.core_rest.info(cb);
          });
        }
      }
    }
  }
  return magento;
}