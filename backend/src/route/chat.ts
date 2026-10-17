var express = require('express');
var router = express.Router();
var middleware = require( "../middleware/chat" );

router.post(
    '/select',
    middleware.select
);

router.post(
    '/delete',
    middleware.delete
);

module.exports = router;