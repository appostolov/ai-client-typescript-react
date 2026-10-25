var express = require('express');
var router = express.Router();
var middleware = require( "../middleware/message" );

router.post(
    '/send',
    middleware.send
);

router.post(
    '/select',
    middleware.select
);

module.exports = router;