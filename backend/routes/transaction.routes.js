const express = require('express');
const router = express.Router();
const Authmiddleware = require('../middleware/authMiddleware.js');
const Account = require("../models/account.model.js");
const Transaction = require("../models/transaction.model.js")

router.get('/' , Authmiddleware , async (req,res) => {
    try {
        const {start , end , page = 1 , pageSize = 20 , accountId , categoryId} = req.query;

        const filter = {userId : req.user.id};

        if(start && end){
            filter.date = { $gte : new Date(start) , $lte : new Date(end) };
        }

        if(accountId) filter.accountId = accountId;
        if(categoryId) filter.categoryId = categoryId;

        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);

        const {transactions , total} = await Promise.all([
            Transaction.find(filter)
            .populate('accountId' , 'name')
            .populate('categoryId' , 'name type')
            .sort({date : -1})
            .skip(skip)
            .limit(limit),
            Transaction.countDocuments(filter)
        ]);

        res.status(200).json({
            message: "Transaction Feteched Successfully",  
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(total / pageSize),
            },
        });


    } catch (error) {
         res.status(500).json({ message: `Server Error - ${error.message}` });
    }    
});


router.post('/', Authmiddleware, async (req, res) => {
  try {
    const { accountId, amountCents, type, categoryId, date, note } = req.body;

    if (!accountId || !amountCents || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      accountId,
      amountCents,
      type,
      categoryId,
      date,
      note,
    });

    const savedTransaction = await transaction.save();

    const account = await Account.findOne({ _id: accountId, userId: req.user.id });
    if (!account) {
      return res.status(404).json({ message: 'Account not found or unauthorized' });
    }

    if (type === 'income') {
      account.balanceCents += amountCents;
    } else if (type === 'expense') {
      account.balanceCents -= amountCents;
    }

    await account.save();

    res.status(201).json({message : "Transaction Added" , transaction: savedTransaction , updatedBalance: account.balanceCents, });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;