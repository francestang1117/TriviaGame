import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Paper, Select, MenuItem, InputLabel, FormControl, makeStyles } from '@material-ui/core';

import API from '../config/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    textField: {
        minWidth: 650,
    },
    button: {
        width: '200px',
    },
    formControl: {
        minWidth: 650,
    },
}));

const CreateGame = () => {
    const classes = useStyles();

    const [gameName, setGameName] = useState('');
    const [gameDescription, setGameDescription] = useState('');
    const [gameCategory, setGameCategory] = useState('');
    const [gameTimeFrame, setGameTimeFrame] = useState('');
    const [gameDifficulty, setGameDifficulty] = useState('');
    const [questionIds, setQuestionIds] = useState('');

    const validations = () => {
        if (gameName === '' || gameDescription === '' || gameCategory === '' || gameTimeFrame === '' || gameDifficulty === '' || questionIds === '') {
            alert('All fields are required!');
            return false;
        }

        // Add more validation logic here if needed
        return true;
    }

    const handleCreateGame = () => {
        if (!validations()) return;

        // Split questionIds by comma to create an array
        const questions = questionIds.split(',').map(id => id.trim());

        axios.post(`${API}/game/add`, {
            gameName,
            gameDescription,
            gameCategory,
            gameTimeFrame,
            gameDifficulty,
            questions
        })
            .then(response => {
                console.log('Game saved successfully');
                window.alert("Game saved successfully");
            })
            .catch(error => {
                window.alert("Error occurred while saving game");
                console.error('Error:', error);
            });
    };

    return (
        <div className={classes.root}>
            <TextField
                className={classes.textField}
                id="gameName"
                label="Game Name"
                variant="outlined"
                onChange={e => setGameName(e.target.value)}
            />
            <TextField
                className={classes.textField}
                id="gameDescription"
                label="Game Description"
                variant="outlined"
                onChange={e => setGameDescription(e.target.value)}
            />
            <TextField
                className={classes.textField}
                id="gameCategory"
                label="Game Category"
                variant="outlined"
                onChange={e => setGameCategory(e.target.value)}
            />
            <TextField
                className={classes.textField}
                id="gameTimeFrame"
                label="Game Time Frame"
                variant="outlined"
                onChange={e => setGameTimeFrame(e.target.value)}
            />
            <FormControl className={classes.formControl} variant="outlined">
                <InputLabel id="gameDifficulty-label">Game Difficulty</InputLabel>
                <Select
                    labelId="gameDifficulty-label"
                    id="gameDifficulty"
                    value={gameDifficulty}
                    onChange={e => setGameDifficulty(e.target.value)}
                    label="Game Difficulty"
                >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                </Select>
            </FormControl>
            <TextField
                className={classes.textField}
                id="questionIds"
                label="Question IDs (separated by commas)"
                variant="outlined"
                onChange={e => setQuestionIds(e.target.value)}
            />
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handleCreateGame}
            >
                Create Game
            </Button>
        </div>
    );
};

export default CreateGame;
