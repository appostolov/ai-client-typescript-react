var express = require('express');
var router = express.Router();
var middleware = require( "../middleware/message" );

router.post(
    '/send',
    middleware.send
);

module.exports = router;