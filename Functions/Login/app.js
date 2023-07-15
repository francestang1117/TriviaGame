const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require('./Firebase');

exports.loginHandler = async (event, context) => {
    try {
        const { email, password } = event;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, userId: userCredentials.user.uid })
        };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 400,
            body : JSON.stringify({ status: 400, errorCode: errorCode, errorMessage: errorMessage })
        };
    }
};
