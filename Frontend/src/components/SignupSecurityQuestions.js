import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import dynamodb from '../config/aws-config';
import axios from "axios";

const SecurityQuestionsPage = () => {
    const navigate = useNavigate();
    const uid = useLocation().state.uid;
    const [securityQuestions, setSecurityQuestions] = useState([
        {id: 1, question: 'What was the name of your first pet?'},
        {id: 2, question: 'What is your favorite book?'},
        {id: 3, question: 'In which city were you born?'},
    ]);

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
                ]
            }
            console.log(data);
            await axios.post('http://localhost:3000/user/signup/security-questions', {
                data
            }).then((result) => {
                if (result.status === 200) {
                    window.alert("Successful");
                    /**
                     * TODO: Navigate to the home page
                     * */
                } else {
                    window.alert("Something went wrong");
                }
            }).catch((error) => {
                window.alert("Something went wrong");
                console.error(error);
            })
        } catch (error) {
            console.log(error);
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

export default SecurityQuestionsPage;
