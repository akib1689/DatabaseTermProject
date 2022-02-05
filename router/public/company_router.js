// libraries
const express = require('express');

const router = express.Router({mergeParams : true});
const db_company_api = require('../../service/db_company_api')

router.get('/',async (req, res) => {

    const query_result = await db_company_api.getAllCompany();

    const result = {
        data : query_result
    }

    res.send(result)
})
module.exports = router;