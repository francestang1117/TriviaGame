import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import API from "../config/constants";

const SigninSecurityQuestionsPage = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const uid = useLocation().state.uid;
    const email = useLocation().state.email;

    // Define the static security questions
    const securityQuestions = [
        {id: 1, question: 'What was the name of your first pet?'},
        {id: 2, question: 'What is your favorite book?'},
        {id: 3, question: 'In which city were you born?'},
    ];

    const [answers, setAnswers] = useState(['', '', '']);
    const [error, setError] = useState('');

    const handleAnswerChange = (event, questionIndex) => {
        const answer = event.target.value;
        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex] = answer;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate that all questions have been answered
        if (answers.some((answer) => answer.trim() === '')) {
            setError('Please answer all the security questions');
            return;
        }

        // Validate that no two answers match
        if (new Set(answers).size !== answers.length) {
            setError('Answers cannot match. Please provide unique answers for each question');
            return;
        }

        // Validate that each answer has a length of more than 5 characters
        if (answers.some((answer) => answer.trim().length <= 5)) {
            setError('Answers must be at least 6 characters long');
            return;
        }

        try {
            const data = {
                userId: uid,
                questions: [
                    {
                        question: securityQuestions[0].question,
                        answer: answers[0]
                    },
                    {
                        question: securityQuestions[1].question,
                        answer: answers[1]
                    },
                    {
                        question: securityQuestions[2].question,
                        answer: answers[2]
                    }
                ],
            };

            console.log(data);
            axios.post(`${API}/user/login/security-questions`, {
                data
            }).then((response) => {
                console.log(response);
                window.alert('Security questions validated');
                /**
                 * TODO: Navigate to homepage
                 * */

                navigate('/profile', {state: {uid: uid, email: email}});
            }).catch((error) => {
                window.alert("Validation failed");
                console.error(error);
            });
        } catch (error) {
            setError('An error occurred while saving the security questions. Please try again.');
        }
    };

    return (
        <div>
            <h2>Security Questions</h2>
            <form onSubmit={handleSubmit}>
                <p>Please answer all the security questions:</p>
                {securityQuestions.map((question, index) => (
                    <div key={question.id}>
                        <label>
                            {question.question}
                            <input
                                type="text"
                                value={answers[index]}
                                onChange={(event) => handleAnswerChange(event, index)}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default SigninSecurityQuestionsPage;
