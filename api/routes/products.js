var express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products');
const multer = require('multer'); // multer is an alternative of the body parser , it parses things which can't be parsed by the body-parser.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null ,'./uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' ||
     file.mimetype === 'image/png' ||
     file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false)
    }
};

const upload = multer({storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}); // this is done so that multer will save all the incoming files in the uploads folder

router.get('/', productController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), 
                 productController.products_post_product);
// check-auth is after upload.single because we have to parse thre form data whaich will nbe possible when multer is available it parses the form data to avoid this we grab the rtoken from the request headers

router.get('/:productId', productController.products_get_product);

router.patch('/:productId', checkAuth, 
                productController.products_update_product);

router.delete('/:productId', checkAuth, 
                productController.products_delete_product);


module.exports = router;