import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { db } from './firebase';
// import { ref, onValue, runTransaction, serverTimestamp } from "firebase/database";
import TeamLeaderboard from "./TeamLeaderboard";
import { useParams } from "react-router-dom";
import { doc, collection, addDoc, runTransaction, onSnapshot, serverTimestamp } from "firebase/firestore";
// import { database } from "../firebase"
import PlayerBoard from "./PlayerBoard";
import { useNavigate } from "react-router-dom";


const TriviaGame = () => {
    const [category, setCategory] = useState('Science');
    const [difficulty, setDifficulty] = useState('Easy');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [remainingHintChances, setRemainingHintChances] = useState(2);
    const [showAnswer, setShowAnswer] = useState(false);
    const [submittedAnswer, setSubmittedAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [explanation, setExplanation] = useState('');
    const [realTimeScore, setRealTimeScore] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(false);
    const [timeIsUp, setTimeIsUp] = useState(false);
    const [teamScore, setTeamScore] = useState(null);
    const [message, setMessage] = useState(null);
    const [showTeamDashboard, setShowTeamDashboard] = useState(false);
    const [showPlayerDashboard, setShowPlayerDashboard] = useState(false);
    const [gameId, setGameId] = useState('');
    const { user, teamName } = useParams();
    const navigate = useNavigate()


    const timer = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log('start to get game id ....');
            try {

                const response = await axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/game',

                    {
                        category: category
                    });

                const parsedBody = JSON.parse(response.data.body);
                const gameId = parsedBody.data[0].id;
                console.log(gameId);

                setGameId(gameId);
            } catch (error) {
                console.error(`Error fetching game data: ${error}`);
            }
        }

        fetchData();
    }, [category]);


    const handlefetchQuestions = async () => {
        setTimeIsUp(false);
        // setQuestions([]);
        setTimeElapsed(false);
        try {
            // fetch questions
            // const response = await axios.post ('https://getquestions-5pg2kz6h4q-uc.a.run.app/getQuestions',
            const response = await axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/question',
                {
                    category: category,
                    difficulty: difficulty
                });

            if (response.statusCode == 404) {
                setMessage("questions not found");
            } else {
                // console.log(response);
                const newResponse = JSON.parse(response.data.body);
                const questions = newResponse?.data || [];
                // console.log(questions);
                // const questionsRef = ref(db, 'triviaQuestions');
                console.log(timeElapsed);
                setQuestions(questions);

                if (questions.length > 0) {
                    startTimer(questions[0].timeframe);
                }

            }

        } catch (error) {
            console.error('Error fetching questions: ', error);
        }

    };

    useEffect(() => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            startTimer(questions[currentQuestionIndex].timeframe);
        }
    }, [questions, currentQuestionIndex]);

    const startTimer = (timeframe) => {
        if (timer.current) {
            clearInterval(timer.current);
        }

        setTimeLeft(timeframe);
        timer.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timer.current);
                    setTimeElapsed(true);
                    return 0;
                }
            });
        }, 1000);
    };

    useEffect(() => { 
        if (timeLeft == 0) {
            setTimeElapsed(true);
        }
    }, [timeLeft]);

    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
    };

    const handleChangeDifficulty = (e) => {
        setDifficulty(e.target.value);
    };

    const handleOptionSelect = (e) => {
        setSelectedOption(Number(e.target.value));
    };

    const toggleDashboard = (type) => {
        if (type === 'team') {
            setShowTeamDashboard(!showTeamDashboard);
            setShowPlayerDashboard(false); // Optionally hide the player dashboard when showing the team dashboard
        } else if (type === 'player') {
            setShowPlayerDashboard(!showPlayerDashboard);
            setShowTeamDashboard(false); // Optionally hide the team dashboard when showing the player dashboard
        }
    };

    const handleAnswerSubmit = async () => {

        // stop the timer
        if (timer.current) {
            clearInterval(timer.current);
        }

        if (submittedAnswer || timeElapsed) {
            console.log('Time is up!');
            return; // Do not process the answer submission if the time has already elapsed
        }


        // Process user's answer
        const selectedQuestion = questions[currentQuestionIndex];
        const correctAnswerIndex = Number(selectedQuestion.answer);

        if (selectedOption === correctAnswerIndex) {
            // Handle correct answer
            console.log('Correct!');

            if (user) {

                try {
                    const scoreRef = doc(db, 'users', user);

                    await runTransaction(db, async (transaction) => {
                        const userDoc = await transaction.get(scoreRef);

                        if (!userDoc.exists()) {
                            // If the document does not exist, create it.
                            transaction.set(scoreRef, {
                                score: 1,
                                categoryScores: {
                                    [category]: 1
                                },
                                timestamp: serverTimestamp()
                            });
                        } else {
                            // Otherwise, increment the score and categoryScores[category] by 1.
                            let currentData = userDoc.data();
                            let newScore = (currentData.score || 0) + 1;
                            let categoryScores = currentData.categoryScores || {};
                            categoryScores[category] = (categoryScores[category] || 0) + 1;

                            transaction.update(scoreRef, {
                                score: newScore,
                                categoryScores: categoryScores,
                                timestamp: serverTimestamp()
                            });
                        }

                    });

                } catch (e) {
                    console.error('Transaction failed: ', e);
                }
            }

            // update team score
            if (teamName) {
                try {
                    const teamScoreRef = doc(db, `teams/${teamName}`);

                    await runTransaction(db, async (transaction) => {
                        const teamDoc = await transaction.get(teamScoreRef);

                        if (!teamDoc.exists()) {
                            // If the document does not exist, create it.
                            transaction.set(teamScoreRef, {
                                score: 1,
                                categoryScores: {
                                    [category]: 1
                                },
                                timestamp: serverTimestamp()
                            });
                        } else {
                            // Otherwise, increment the score and categoryScores[category] by 1.
                            let currentData = teamDoc.data();
                            let newScore = (currentData.score || 0) + 1;
                            let categoryScores = currentData.categoryScores || {};
                            categoryScores[category] = (categoryScores[category] || 0) + 1;

                            transaction.update(teamScoreRef, {
                                score: newScore,
                                categoryScores: categoryScores,
                                timestamp: serverTimestamp()
                            });
                        }
                    });
                } catch (e) {
                    console.error('Transaction failed: ', e);
                }
            }


            //  store the score in dynamoDB
            const response = await axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/game/score',
                {
                    teamName: teamName,
                    game_id: getCurrentQuestion().gameId,
                    user_id: user
                });

        } else {
            // Handle incorrect answer
            console.log('Incorrect!');
        }

        setSubmittedAnswer(true);
        setShowAnswer(true);
        setCorrectAnswer(correctAnswerIndex);
        setExplanation(selectedQuestion.explanation);

    };

    useEffect(() => {
        const currentQuestion = getCurrentQuestion();
        if (currentQuestion && currentQuestion.gameId) {
            addData(realTimeScore.score);
        }
    }, [realTimeScore]);

    const handleNextQuestion = () => {
        if (timer.current) {
            clearInterval(timer.current);
        }
        setShowAnswer(false);
        setCorrectAnswer(null);
        setShowHints(false);
        setExplanation('');
        setSelectedOption(null);
        setTimeElapsed(false);
        setSubmittedAnswer(false);
        // setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

        setCurrentQuestionIndex(currentQuestionIndex + 1);

        const timeframeOfNextQuestion = questions[currentQuestionIndex].timeframe;
        // Reset the timer for the new question
        setTimeLeft(timeframeOfNextQuestion);
        timer.current = setInterval(() => {
            setTimeLeft(timeLeft => {
                if (timeLeft > 1) {
                    return timeLeft - 1;
                } else {
                    setTimeElapsed(true);
                    clearInterval(timer.current);
                    return 0;
                }
            });
        }, 1000);
    };

    const handleTimeUp = () => {
        if (timeLeft === 0 && !submittedAnswer) {
            setTimeIsUp(true);
        }
        clearInterval(timer.current)
        setSubmittedAnswer(false);
    };


    useEffect(() => {
        if (timeLeft === 0 && currentQuestionIndex < questions.length && !submittedAnswer) {
            handleTimeUp();

        }
    }, [timeLeft, currentQuestionIndex, questions, submittedAnswer]);

    const handleShowHints = () => {
        if (remainingHintChances > 0) {
            // Decrease the chances to see hints
            setShowHints(true);
            setRemainingHintChances((prevChances) => prevChances - 1);
        }

    };

    const getCurrentQuestion = () => {
        return questions[currentQuestionIndex];
    };

    async function addData(score) {
        console.log(getCurrentQuestion().gameId);
        try {
            const docRef = await addDoc(collection(db, "score"), {
                game_id: getCurrentQuestion().gameId,
                points: score,
                team_id: teamName,
                user_id: user
            });
            console.log("Score document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding score document: ", e);
        }
    }

    useEffect(() => {
        if (user) {
            // show the score in Firestore
            const scoreRef = doc(db, `users/${user}`);
            const unsubscribeUser = onSnapshot(scoreRef, (docSnapshot) => {
                const data = docSnapshot.data();
                setRealTimeScore(data || { score: 0 });
            }, (error) => {
                console.error('Error reading data: ', error);
            });

            // Fetch the team's score from the database
            if (teamName) {
                const teamScoreRef = doc(db, `teams/${teamName}`);
                const unsubscribeTeam = onSnapshot(teamScoreRef, (docSnapshot) => {
                    const data = docSnapshot.data();
                    setTeamScore(data || { score: 0 });
                }, (error) => {
                    console.error('Error reading data: ', error);
                });

                // Clean up listener 
                return () => {
                    unsubscribeTeam();
                }
            }

            // Clean up listener 
            return () => {
                unsubscribeUser();
            }
        }
    }, [user, teamName]);

    const handleDashboard = () => {

        navigate(`/dashboard/${gameId}`);
    }

    // const handleLeaderboards = () => {
    //     navigate(`/leaderboard`);
    // }


    return (
        <div className="trivia-game-container">
            <form>
                <label>
                    Category:
                    <select value={category} onChange={handleChangeCategory}>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Literature">Literature</option>
                        <option value="Math">Math</option>
                    </select>
                </label>
                <label>
                    Difficulty:
                    <select value={difficulty} onChange={handleChangeDifficulty}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </label>
                {/* <label>
                    Team Name:
                    <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                    <button onClick={handleJoinTeam}>Join Team</button>
                </label> */}
                <button type="button" onClick={handlefetchQuestions} className="fetch-button">Fetch Questions</button>

                <div className="dashboard-controls">
                    <button type="button" onClick={() => toggleDashboard('team')} className="team-dashboard-button">Show Team Dashboard</button>
                    <button type="button" onClick={() => toggleDashboard('player')} className="player-dashboard-button">Show Player Dashboard</button>
                </div>

                {showTeamDashboard && <TeamLeaderboard />} {/* Show the team dashboard if the button is clicked */}
                {showPlayerDashboard && <PlayerBoard />} {/* Show the player dashboard if the button is clicked */}

            </form>
            {questions.length === 0 ? (
                <p>Loading questions...</p>
            ) : (
                <div className="trivia-game-content">
                    
                    {teamName && teamScore && (
                        <div>
                            <h3>Team: {teamName}</h3>
                            <p>Team Score: {teamScore.score}</p>
                        </div>
                    )}


                    {/* Display the remaining time */}
                    <div className="time-left">Time Left: {timeLeft} seconds</div>
                    {/* {timeElapsed ? (
                        <div className="time-up">Time's up!</div>
                    ) : (
                        <div className="time-left">Time Left: {timeLeft} seconds</div>
                    )} */}

                    {/* Display the current question */}
                    {currentQuestionIndex < questions.length ? (
                        
                        <div>
                            {/* Display the real-time score */}
                            {user && realTimeScore && (
                                <div>
                                 <h3>User: {user}</h3>
                                    <p className="score">Score: {realTimeScore.score}</p>
                                </div>
                            )}
                            <h2>Question {currentQuestionIndex + 1}</h2>
                            <p>{getCurrentQuestion().question} ({getCurrentQuestion().QUESTION_TAG})</p>
                            <p> </p>

                            {/* Display options */}
                            <ul>
                                {getCurrentQuestion().options.map((option, optionIndex) => (
                                    <li
                                        key={optionIndex}
                                        className={optionIndex === selectedOption ? "selected" : ""}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="answer"
                                                value={optionIndex}
                                                checked={selectedOption === optionIndex}
                                                onChange={handleOptionSelect}
                                            />
                                            {option.content}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            {/* Display "Submit" button */}
                            <button onClick={handleAnswerSubmit} disabled={submittedAnswer}>
                                Submit
                            </button>


                            {remainingHintChances > 0 && (
                                <div>
                                    <button onClick={handleShowHints} disabled={showAnswer || showHints}>
                                        Show Hints
                                    </button>
                                    {showHints && (
                                        <div>
                                            <p>Hints:</p>
                                            {questions[currentQuestionIndex]?.hints?.map((hint, hintIndex) => (
                                                <p key={hintIndex}>{hint.content}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                {/* Code for displaying the question and answers */}

                                {submittedAnswer && (
                                    <div>
                                        {selectedOption === correctAnswer ? "Correct!" : "Wrong!"}
                                        <p>Correct Answer: {questions[currentQuestionIndex]?.options[questions[currentQuestionIndex]?.answer]?.content}</p>
                                    </div>
                                )}
                                {submittedAnswer && !timeIsUp && questions[currentQuestionIndex]?.explanation && (
                                    <div>
                                        <h3>Explanation:</h3>
                                        <p>{questions[currentQuestionIndex]?.explanation}</p>
                                    </div>
                                )}
                                {timeElapsed && (
                                    <div>
                                        <p>Time's up! The correct answer was: {questions[currentQuestionIndex]?.options[questions[currentQuestionIndex]?.answer]?.content}</p>
                                        {questions[currentQuestionIndex]?.explanation && (
                                            <div>
                                                <h3>Explanation:</h3>
                                                <p>{questions[currentQuestionIndex]?.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Display the "Next" button */}
                                <button onClick={handleNextQuestion}>Next</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>Game Over</h2>
                            <p>Congratulations! You have completed the trivia game.</p>
                            <p>Your final score is {realTimeScore && realTimeScore.score}</p>
                            <p>Your can check the data graph</p>
                            <button onClick={handleDashboard}>Show Leaderboard</button>
                            {/* <button onClick={handleLeaderboards}>Show Team and User Score Details</button> */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export default TriviaGame;