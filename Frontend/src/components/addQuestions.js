import React, { useState } from 'react';
import axios from 'axios';
import './addQuestions.css';

function AddQuestions() {
    const [questionData, setQuestionData] = useState({
        question: '',
        options: '',
        answer: '',
        explanation: '',
        timeframe: '',
        difficulty: '',
        category: '',
        hints: ''
    });

    const handleInputChange = (event) => {
        setQuestionData({
            ...questionData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Convert options and hints from comma-separated strings to arrays
        const dataToSend = {
            ...questionData,
            options: questionData.options.split(','),
            hints: questionData.hints.split(',')
        };

        try {
            const response = await axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/question/add', dataToSend);
            console.log(response.data);
            alert('Question added successfully!');
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="add-question-container">
            <h2>Add Question</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="question" placeholder="Question" onChange={handleInputChange} />
                <input type="text" name="options" placeholder="Options (comma separated)" onChange={handleInputChange} />
                <input type="text" name="answer" placeholder="Answer" onChange={handleInputChange} />
                <input type="text" name="explanation" placeholder="Explanation" onChange={handleInputChange} />
                <input type="text" name="timeframe" placeholder="Timeframe" onChange={handleInputChange} />
                <input type="text" name="difficulty" placeholder="Difficulty" onChange={handleInputChange} />
                <input type="text" name="category" placeholder="Category" onChange={handleInputChange} />
                <input type="text" name="hints" placeholder="Hints (comma separated)" onChange={handleInputChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddQuestions;
