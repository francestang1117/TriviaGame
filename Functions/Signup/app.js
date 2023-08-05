const { createUserWithEmailAndPassword } = require('firebase/auth');
const { auth, db } = require('./Firebase');
const { collection, setDoc, doc } = require('firebase/firestore');
const {SNS} = require('./aws-config');

exports.signupHandler = async (event, context) => {
    console.log(event);
    const { firstName, lastName, email, password } = event;
    const topicARN = 'arn:aws:sns:us-east-1:659069070023:TriviaNotification';
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredentials.user.uid;
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email
        };


        const subscribeParams = {
            Protocol: 'email',
            TopicArn: topicARN,
            Endpoint: email,
        };

        await SNS.subscribe(subscribeParams).promise();


        const result = await setDoc(doc(db, 'users', uid), { ...data });
        console.log(result);

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, userId: uid })
        };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body : JSON.stringify({ status: 500, errorCode: errorCode, errorMessage: errorMessage })
        };
    }
};
