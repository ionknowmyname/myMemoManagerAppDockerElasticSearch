// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../config/auth");


const Memo = require("../models/Memo");
const User = require("../models/User");
const { upload } = require("../uploadMulter");

const fs = require('fs');
const path = require('path');

/* const elastic = require("elasticsearch");
const elasticClient = elastic.Client({
    // host: "localhost:9200",
    node: "http://localhost:9200",
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true,
});
 */

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    //  node: 'https://elastic:elastic@localhost:9200'  // or this, according to documentation
    node: 'https://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'elastic'
    },
    tls: {
      ca: fs.readFileSync(path.join(__dirname, '../config/http_ca.crt')), 
      rejectUnauthorized: false
    },
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true 
})

/* const result = await client.search({
    index: 'title-index',
    query: {
      match: { title: 'testing' }
    }
  }) */


///////////////////// GET ALL MEMOS /////////////////////
router.get("/memo", async (req, res) => {
    // console.log(req);
    try {
        const memo = await Memo.find({ isResolved: false });
        if (!memo) throw Error("No items");

        res.status(200).json(memo);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});
/////////////////////////////////////////////////////////

// const uploads = upload.single("file");

//////////////////////// POST NEW MEMO ///////////////////////
router.post("/memo", upload.single("file"), async (req, res) => {
    console.log("req.body from memo.js: ", req.body);
    // console.log(req.files.file);
    console.log("req.file from memo.js: ", req.file);

    const {
        memoTo,
        memoFrom,
        memoTitle,
        memoRemark,
        date,
        loggedDate,
        select,
    } = req.body;

    const memo = new Memo({
        memoTo,
        memoFrom,
        memoTitle,
        memoRemark,
        loggedDate,
        // fileName: req.file.filename,
        path: req.file.path,
        date,
        select,
    });

    await client
        .index({
            index: "memo_title",
            body: { memo } 
        })
        .then((res) => {
            // memo
            // console.log("submitted memo: ", memo);
            console.log("Memo index successfully created");
           

            /* res.status(200).send({
                memo: memo, // res
                msg: "Memo index successfully created",
            }); */
        })
        .catch((err) => {
            console.log("Error: ", err);
        });


  // FROM FORMER client.index
  /*       type: "document",
        //id: _id,
        body: memo, */


    // await client.index({
    //     index: 'title-index',
    //     document: {
    //         character: 'Daenerys Targaryen',
    //         quote: 'I am the blood of the dragon.'
    //     }
    // })
        

    memo.save()
        .then((memo) => {
            console.log("submitted memo: ", memo);

            res.status(200).send({
                memo: memo,
                msg: "Memo successfully registered",
            });
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
});
////////////////////////////////////////////////////////////////////////

//////////////////////// GET MEMO BY ID & UPDATE ////////////////////////
router.post("/queryMemo", async (req, res) => {
    try {
        const { ID } = req.body;
        console.log("id: ", ID);
        // console.log("req: ", req);
        const memo = await Memo.findById({ _id: ID });
        console.log("selected memo to pass front: ", memo);
        res.status(200).json(memo);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.post("/memoUpdate", async (req, res) => {
    // can also use put method
    try {
        const { ID, memoRemark, select } = req.body; // memoTo, memoFrom, memoTitle,

        Memo.findOneAndUpdate(
            { _id: ID },
            { memoRemark, select }, // memoTo, memoFrom, memoTitle,
            // so that it doesnt update
            (err, memo) => {
                if (!memo) {
                    return res.status(400).json({
                        msg: "Memo does not exist",
                    });
                } else {
                    if (err) {
                        return res.status(401).json({
                            msg: err,
                        });
                    }

                    res.status(200).json({
                        msg: "Memo sucessfully updated",
                        updatedMemo: memo,
                    });
                }
            }
        );
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

////////////////////////////////////////////////////////////////////////

////////////////////////////// RESOLVE MEMO //////////////////////////////
router.put("/resolvedMemo", async (req, res) => {
    try {
        const { ID, isResolved } = req.body;

        Memo.findByIdAndUpdate({ _id: ID }, { isResolved }, (err, memo) => {
            if (!memo) {
                return res.status(400).json({
                    msg: "Memo does not exist",
                });
            } else {
                if (err) {
                    return res.status(401).json({
                        msg: err,
                    });
                }

                res.status(200).json({
                    msg: "Memo sucessfully updated",
                    resolvedMemo: memo,
                });
            }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});
////////////////////////////////////////////////////////////////////////

///////////////////// GET RESOLVED MEMOS /////////////////////
router.get("/resolvedMemo", async (req, res) => {
    // console.log(req);
    try {
        const memo = await Memo.find({ isResolved: true });
        if (!memo) throw Error("No items");

        res.status(200).json(memo);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});
/////////////////////////////////////////////////////////

module.exports = router;
