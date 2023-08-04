import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { db } from '../firebase';
import { ref, onValue, runTransaction, onChildAdded, off } from "firebase/database";
import Dashboard from "./TeamLeaderboard";
import { useParams } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; 
import { database } from "../firebase-scores";


const TriviaGame = () => {
    const [category, setCategory] = useState('Science');
    const [difficulty, setDifficulty] = useState('Easy');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    // const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [remainingHintChances, setRemainingHintChances] = useState(2);
    const [showAnswer, setShowAnswer] = useState(false);
    const [submittedAnswer, setSubmittedAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [realTimeScore, setRealTimeScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeIsUp, setTimeIsUp] = useState(false);
    const [teamScore, setTeamScore] = useState(0);
    const [showDashboard, setShowDashboard] = useState(false); 
    const { user, teamName } = useParams();

    const timer = useRef(null);



    // Function to toggle the dashboard visibility
    const toggleDashboard = () => {
        setShowDashboard(!showDashboard);
    };
    
    // Randomly fetch 20 questions based on category and difficulty
    const handlefetchQuestions = async () => {
        setTimeIsUp(false);
        try {
            // fetch questions
            // const response = await axios.post ('https://getquestions-5pg2kz6h4q-uc.a.run.app/getQuestions',
            const response = await axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/question', 
            { 
                category: category, 
                difficulty: difficulty 
            });
            // console.log(response);
            const newResponse = JSON.parse(response.data.body);
            const questions = newResponse.data;
            // console.log(questions);
            // const questionsRef = ref(db, 'triviaQuestions');
            setQuestions(questions);
            // onChildAdded(questionsRef, (snapshot) => {
            //     const questionsData = snapshot.val();
            //     if (questionsData) {
            //       setQuestions(Object.values(questionsData));
            setCurrentQuestionIndex(0);
            setRealTimeScore(0);
            //     }
            // });


            // const questionsData = JSON.parse(response) 
            // setQuestions(questionsData.data.questions);
            // setCurrentQuestionIndex(0);
            // setRealTimeScore(0);
        }catch (error) {
            console.error('Error fetching questions: ', error);
        }

    };

    // useEffect(() => {

    //     if (category && difficulty) {
    //         handlefetchQuestions();
    //     }
    // }, [category, difficulty]);

    const startTimer = (timeframe) => {
        clearInterval(timer.current); // Clear any existing timer
        // const timeFrame = questions[currentQuestionIndex].timeframe;
        setTimeLeft(Number(timeframe));
        // setTimer(setInterval(updateTimer, 1000));
        timer.current = setInterval(updateTimer, 1000);
        setTimerRunning(true); 
        setTimeIsUp(false);
    };

    // update the timer every second
    const updateTimer = () => {
        setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
                clearInterval(timer.current);
                setTimeElapsed(true);
                setTimeIsUp(true); 
                return 0;
            } else {
                return prevTime - 1;
            }
        });
    };

    useEffect(() => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            const timeframeOfNextQuestion = questions[currentQuestionIndex].timeframe;
            startTimer(timeframeOfNextQuestion);
        }
    }, [currentQuestionIndex, questions]);

   
    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
    };
    
    const handleChangeDifficulty = (e) => {
        setDifficulty(e.target.value);
    };

    const handleOptionSelect = (e) => {
        setSelectedOption(Number(e.target.value));
    };

    const handleAnswerSubmit = async () => {

        if (submittedAnswer || timeElapsed) {
            console.log('Time is up!');
            return; // Do not process the answer submission if the time has already elapsed
        }
        // Clear the timer
        clearInterval(timer.current);
    
        // Process user's answer
        const selectedQuestion = questions[currentQuestionIndex];
        const correctAnswerIndex = Number(selectedQuestion.answer);
    
        if (selectedOption === correctAnswerIndex) {
          // Handle correct answer
          console.log('Correct!');
          
            if (user) {
                // const useremail = "abc@123";
            
                // update the score in real-time database
                const scoreRef = ref(db, `users/${user}/score`);
            
                runTransaction(scoreRef, (currentScore) => {
                    // Increment the score by 1
                    return (currentScore || 0) + 1;
                }).catch((error) => {
                    console.error('Transcation failed: ', error);
                });

                // Update the team's score in real-time database
                const teamScoreRef = ref(db, `teams/${teamName}/score`);
                runTransaction(teamScoreRef, (currentScore) => {
                // Increment the team's score by 1
                return (currentScore || 0) + 1;
                }).catch((error) => {
                    console.error("Transaction failed: ", error);
                });
            } 
            
            // Increment the score locally in the state
            setRealTimeScore((prevScore) => prevScore + 1);


            //  store the score in dynamoDB
            const response = await axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/game/score', 
            { 
                teamName: teamName,
                game_id: getCurrentQuestion().gameId,
                user_id: user
            });

            
            addData();
            

        } else {
          // Handle incorrect answer
          console.log('Incorrect!');
        }

        // stop the timer
        clearInterval(timer.current);
        setTimerRunning(false);
        setSubmittedAnswer(true);
        setShowAnswer(true);
        setCorrectAnswer(correctAnswerIndex);
        setExplanation(selectedQuestion.explanation);

        // if (timeLeft > 0) {
        //     setShowExplanation(true);
        // }
    
        // Move to the next question
        // setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        // setSelectedOption(null);
    };

    const handleNextQuestion = () => {
        if (timerRunning) {
            clearInterval(timer); 
            setTimerRunning(false); 
        }
        
        setShowAnswer(false);
        setCorrectAnswer(null);
        setShowHints(false);
        setExplanation('');
        setShowExplanation(false)
        setSelectedOption(null);
        setTimeElapsed(false);
        setSubmittedAnswer(false);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        
        if (currentQuestionIndex + 1 < questions.length) {
            const timeframeOfNextQuestion = questions[currentQuestionIndex + 1].timeframe;
            startTimer(timeframeOfNextQuestion);
        }
    };

    const handleTimeUp = () => {
        if (timeLeft === 0 && !submittedAnswer) {
            setTimeIsUp(true);
        }
        clearInterval(timer.current)
        setSubmittedAnswer(false);
        setShowExplanation(true); 
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

    const handleShowExplanation = () => {
        setShowExplanation(true);
    };

    
    const getCurrentQuestion = () => {
        return questions[currentQuestionIndex];
    };

   const addData = async () => {
        try {
                const docRef = await addDoc(collection(database, "score"), {  
                    game_id: getCurrentQuestion().gameId,
                    points: realTimeScore,
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
            // const userId = user.uid;
            // const useremail = "abc@123"
            
            // update the score in real-time database
            const scoreRef = ref(db, `users/${user}/score`);
            onValue(scoreRef, (snapshot) => {
                const scoreFromDB = snapshot.val();
                // If the score is null, set it to 0
                setRealTimeScore(scoreFromDB || 0); 
            });

            // Fetch the team's score from the database
            if (teamName) {
                const teamScoreRef = ref(db, `teams/${teamName}/score`);
                onValue(teamScoreRef, (snapshot) => {
                    const teamScore = snapshot.val();
                    // If the score is null, set it to 0
                    setTeamScore(teamScore || 0);
                });
            }

        }
    }, [user, teamName]);

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
                <button type="button" onClick={handlefetchQuestions}>Fetch Questions</button>
                <button type="button" onClick={toggleDashboard}>
                    Show Team Dashboard
                </button>
                {showDashboard && <Dashboard />} {/* Show the dashboard if the button is clicked */}
                {/* <button type="button" onClick={toggleDashboard}>
                    Show Player Dashboard
                </button>
                {showDashboard && <PlayerLeaderboard />} */}
            </form>
            {questions.length === 0 ? (
                <p>Loading questions...</p>
                ) : (
                <div className="trivia-game-content">
                    {/* Display the real-time score */}
                    {user && (
                        <div>
                            <p className="score">Score: {realTimeScore}</p>
                            {teamName && <p>Team Score: {teamScore}</p>}
                        </div>
                    )}
                    

                    {/* Display the remaining time */}
     
                    {timeIsUp ? (
                        <div className="time-up">Time's up!</div>
                    ) : (
                        <div className="time-left">Time Left: {timeLeft} seconds</div>
                    )}

                    {/* Display the current question */}
                    {currentQuestionIndex < questions.length ? (
                        <div>
                            <h2>Question {currentQuestionIndex + 1}</h2>
                            <p>{getCurrentQuestion().question}</p>

                            {/* Display options */}
                            <ul>
                                {getCurrentQuestion().options.map((option, optionIndex) => (
                                    <li 
                                        key={optionIndex}
                                        className={optionIndex === selectedOption ? "selected": ""}>
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
                            {/* The explanation button */}
                            {/* {submittedAnswer && (
                                <div>
                                    <button onClick={handleShowExplanation}>Show Explanation</button>
                                </div>
                            )} */}
                            
                            {/* The explanation part
                            {showExplanation && (<p>Explanation: {explanation}</p>)} */}

                            {/* Display "Submit" button */}
                            <button onClick={handleAnswerSubmit} disabled = {submittedAnswer}>
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
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>Game Over</h2>
                            <p>Congratulations! You have completed the trivia game.</p>
                            <p>Your final score is {realTimeScore}.</p>
                        </div>
                    )}
                    {/* Display the correct answer */}
                    {/* Display the "Next" button */}
                    <button onClick={handleNextQuestion}>Next</button>
                </div>
            )}
        </div>
    );
};


export default TriviaGame;