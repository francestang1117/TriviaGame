const { sendPasswordResetEmail } = require("firebase/auth");
const { auth } = require('./Firebase');

exports.passwordHandler = async (event, context) => {
    try {
        const { email } = event;
        await sendPasswordResetEmail(auth, email);

        console.log("Password reset email sent!");
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, message: "Password reset email sent!" })
        };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);

        return {
            statusCode: 400,
            body: JSON.stringify({ status: 400, errorCode: errorCode, errorMessage: errorMessage })
        };
    }
};
