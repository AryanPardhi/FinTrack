var express = require('express');
var router = express.Router();
const Authmiddleware = require('../middleware/authMiddleware.js');
const Account = require("../models/account.model.js");



router.get("/", Authmiddleware ,async(req ,res) => {
    try {
        const accounts = Account.find({ userId: req.user.id });
        if(!accounts){
            return res.status(200).json({message : "No Account Exists"});
        }

        return res.status(200).json({message : "Account fetched successfully" , accounts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id',Authmiddleware, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create" ,Authmiddleware, async (req,res) => {
    try {
        const {name,userId,type,accountNumber,balanceCents , currency} = req.body;
        if(!name || !userId || !type || !accountNumber){
            return res.status(400).json({message : "Required Fields are missing"});
        }
        
        const accPresent = await Account.findOne({accountNumber});

        if(accPresent){
            return res.status(400).json({ message: 'Account already exists' });
        }

        const newAccount = new Account({
            userId,
            name,
            type,
            accountNumber,
            balanceCents : balanceCents ? balanceCents : 0,
            currency : currency ? currency : 'INR'
        })

        await newAccount.save(); 

        res.status(201).json({message : "Account Created Successfully" , newAccount});

    } catch (error) {
         res.status(400).json({ message: error.message });
    }
});


router.put('/update/:id', Authmiddleware ,async (req, res) => {
  try {
    // If updating accountNumber, ensure uniqueness
    if (req.body.accountNumber) {
      return res.status(400).json({
        message: 'Account number cannot be updated once created'
      });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });

    res.status(200).json(updatedAccount);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id',Authmiddleware ,async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);

    if (!deletedAccount) return res.status(404).json({ message: 'Account not found' });

    res.status(200).json({ message: 'Account deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;