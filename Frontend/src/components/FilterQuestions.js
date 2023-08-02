import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import API from '../config/constants';
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const FilterQuestions = () => {
    const classes = useStyles();

    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [questions, setQuestions] = useState([]);

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };

    const handleFilter = () => {
        axios.post(`${API}/question`, {

                category: category,
                difficulty: difficulty,
                timeframe: timeframe,
            
        })
            .then(response => {
                setQuestions(JSON.parse(response.data.body).data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <TextField id="category" label="Category" variant="outlined" onChange={handleCategoryChange} />
            <TextField id="difficulty" label="Difficulty" variant="outlined" onChange={handleDifficultyChange} />
            <TextField id="timeframe" label="Timeframe" variant="outlined" onChange={handleTimeframeChange} />
            <Button variant="contained" color="primary" onClick={handleFilter}>
                Filter
            </Button>
            {questions ? (
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Question</TableCell>
                                <TableCell align="right">Category</TableCell>
                                <TableCell align="right">Difficulty</TableCell>
                                <TableCell align="right">Timeframe</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {question.question}
                                    </TableCell>
                                    <TableCell align="right">{question.category}</TableCell>
                                    <TableCell align="right">{question.difficulty}</TableCell>
                                    <TableCell align="right">{question.timeframe}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default FilterQuestions;
