const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    message: "This isn't the endpoint you're looking for... (≖_≖ )",
  });
});

module.exports = router;
