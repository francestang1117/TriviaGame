const express = require('express');
const router = express.Router();
const {collection, setDoc, doc} = require('firebase/firestore');
const {auth, db} = require ('./Firebase');
const dynamodb = require('./aws-config');
const {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} = require( 'firebase/auth');
const cors = require('cors');
const axios = require('axios');

router.use(express.json());
router.use(cors());

// Sign up
router.post("/user/signup", (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const uid = userCredentials.user.uid;
                const data = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                }

               setDoc(doc(db, 'users', uid),{
                   ...data
               }).then((result) => {
                   console.log(result);
                   res.status(200).json({userId: userCredentials.user.uid});
               }).catch((error) => {
                    console.error(error);
               })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(400).json({errorCode, errorMessage});
        });


});

// Sign in
router.post("/user/signin", (req, res) => {
    const {email, password} = req.body;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const uid = userCredentials.user.uid;
            res.status(200).json({userId: uid});
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(400).json({errorCode, errorMessage});
        });
});

// Reset password
router.post("/user/resetpassword",async (req, res) => {
    console.log(req.body);
    const {email} = req.body;
    await sendPasswordResetEmail(auth, email)
        .then(() => {
            res.status(200).json({message: "Password reset email sent!"});
            console.log("Password reset email sent!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            res.status(400).json({errorCode, errorMessage});
        });
});

// MFA
router.post("/user/signup/security-questions", async (req, res) => {
    const {data} = req.body;
    const params = {
        TableName: 'SecurityQuestions',
        Item: {
            ...data
        },
    };
    console.log(params);
    dynamodb.put(params).promise().then((result) => {
        console.log(result);
        res.status(200).json({message: "Security question saved!"});
    }).catch((error) => {
        console.error(error);
        res.status(400).json({message: "Error saving security question!"});
    });
});

router.post("/user/signin/security-questions", async (req, res) => {
    const {data} = req.body;
    console.log(data);
    await axios.post('https://nbt4242u6g.execute-api.us-east-1.amazonaws.com/dev/validate-security-questions', 
        data
    )
    .then((response) => {
        if(response.data.status === 200) {
            console.log(response.data);
        res.status(200).json({message: "Security question validated!"});
        } else if(response.data.status === 400){
            console.log(response.data);
            res.status(400).json({message: "Unsuccessful validation!"});
        }
    }).catch((error) => {
        console.error(error);
        res.status(400).json({message: "Unsuccessful validation!"});
    });
});

module.exports = router;
