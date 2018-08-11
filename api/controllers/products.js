const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

exports.products_post_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message : 'Created Product',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    }
    );
  
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From Database", doc);
        if(doc) {

            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get All Products',
                    url: 'http://localhost:3000/products/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for the provided entry'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    // if we send a respond here then we cant be sure that whether 
    // a result is found or whether the error has occured 
    // as this code snippet will not wait for the above 
    // lines to be completed cuz promises run asynch. . So we send seperate
    // responses in the then and catch block
} 

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id}, {$set: updateOps }).exec()
    .then(result => {
        res.status(200).json({
            message: 'Prosuct Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type: 'POST',
                description: 'Want to create new product? Click the link below',
                url: 'http://localhost:3000/products/',
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
})
}