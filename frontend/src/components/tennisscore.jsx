import { useState, useEffect } from 'react';
import axios from 'axios';

const TennisScoreComponent = () => {
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player1Games, setPlayer1Games] = useState(0);
    const [player2Games, setPlayer2Games] = useState(0);
    const [player1Sets, setPlayer1Sets] = useState(0);
    const [player2Sets, setPlayer2Sets] = useState(0);
    const [isTieBreaker, setIsTieBreaker] = useState(false);
    const [matchEnded, setMatchEnded] = useState(false);
    const [format, setFormat] = useState('normal'); // 'normal' or 'utr'
    const [tieBreakType, setTieBreakType] = useState('normal'); // 'normal' or 'super'
    
    const decrementScore = (playerScoreSetter, opponentScoreSetter, playerScore, opponentScore) => {
        if (isTieBreaker) {
            if (playerScore > 0) {
                playerScoreSetter(playerScore - 1);
            }
            return;
        }
    
        if (opponentScore === 'AD') {
            opponentScoreSetter(40);
        } else if (playerScore === 'AD') {
            playerScoreSetter(40);
        } else {
            const currentIndex = scoreOptions.indexOf(playerScore);
            const prevScore = scoreOptions[currentIndex - 1] || 0;
            playerScoreSetter(prevScore);
        }
    };
    
    const scoreOptions = [0, 15, 30, 40, 'AD'];

    const userToken = 'YOUR_USER_TOKEN'; // Replace 'YOUR_USER_TOKEN' with the actual user token

    useEffect(() => {
        if (player1Sets > player2Sets) {
            axios.post('/api/matches/', {
                sets_won: player1Sets,
                games_won: player1Games,
                points_won: player1Score,
            }, {
                headers: {
                    'Authorization': `Token ${userToken}`
                },
                timeout: 5000 // Time in milliseconds. Here, 5000ms is 5 seconds
            }).catch(error => {
                if (error.code === 'ECONNABORTED') {
                    console.error('Timeout error:', error.message);
                } else {
                    // Handle other errors
                }
            });
        }
    }, [player1Sets, player2Sets]);

    
    useEffect(() => {
        if (player1Sets >= 3 || player2Sets >= 3) {
            setMatchEnded(true);
        }
    }, [player1Sets, player2Sets]);

    useEffect(() => {
        const gamesToWin = format === 'utr' ? 4 : 6;
        const superTieBreakPoints = tieBreakType === 'super' ? 10 : 7;

        if (player1Games >= gamesToWin && player1Games - player2Games >= 2) {
            setPlayer1Sets(player1Sets + 1);
            setPlayer1Games(0);
            setPlayer2Games(0);
        } else if (player2Games >= gamesToWin && player2Games - player1Games >= 2) {
            setPlayer2Sets(player2Sets + 1);
            setPlayer1Games(0);
            setPlayer2Games(0);
        } else if (player1Games === gamesToWin && player2Games === gamesToWin) {
            setIsTieBreaker(true);
            setPlayer1Score(0);
            setPlayer2Score(0);
        }

        if (isTieBreaker) {
            if (player1Score >= superTieBreakPoints && player1Score - player2Score >= 2) {
                setPlayer1Sets(player1Sets + 1);
                setIsTieBreaker(false);
            } else if (player2Score >= superTieBreakPoints && player2Score - player1Score >= 2) {
                setPlayer2Sets(player2Sets + 1);
                setIsTieBreaker(false);
            }
        }
    }, [player1Games, player2Games, player1Score, player2Score]);


    const endMatch = () => {
        if (window.confirm('Are you sure you want to end the match?')) {
            if (player1Sets > player2Sets) {
                axios.post('/api/matches/', {
                    sets_won: player1Sets,
                    games_won: player1Games,
                    points_won: player1Score,
                }, {
                    headers: {
                        'Authorization': `Token ${userToken}`
                    }
                });
            }
            // Reset the match
            setPlayer1Score(0);
            setPlayer2Score(0);
            setPlayer1Games(0);
            setPlayer2Games(0);
            setPlayer1Sets(0);
            setPlayer2Sets(0);
            setIsTieBreaker(false);
            setMatchEnded(false);
        }
    };

    const incrementScore = (playerScoreSetter, opponentScoreSetter, playerScore, opponentScore) => {
        if (isTieBreaker) {
            playerScoreSetter(playerScore + 1);
            if (playerScore >= 6 && playerScore - opponentScore >= 1) {
                incrementGames(playerScoreSetter);
                setIsTieBreaker(false);
            }
            return;
        }

        const currentIndex = scoreOptions.indexOf(playerScore);
        const nextScore = scoreOptions[currentIndex + 1] || 'Game';

        if (nextScore === 'Game') {
            if (opponentScore !== 'AD') {
                playerScoreSetter(0);
                opponentScoreSetter(0);
                incrementGames(playerScoreSetter);
            } else {
                playerScoreSetter(40);
                opponentScoreSetter(40);
            }
        } else if (nextScore === 'AD' && opponentScore === 'AD') {
            playerScoreSetter(40);
            opponentScoreSetter(40);
        } else {
            playerScoreSetter(nextScore);
        }
    };

    const incrementGames = (playerGamesSetter) => {
        playerGamesSetter(prevGames => prevGames + 1);
    };

    useEffect(() => {
        if (player1Games >= 6 && player1Games - player2Games >= 2) {
            setPlayer1Sets(player1Sets + 1);
            setPlayer1Games(0);
            setPlayer2Games(0);
        } else if (player2Games >= 6 && player2Games - player1Games >= 2) {
            setPlayer2Sets(player2Sets + 1);
            setPlayer1Games(0);
            setPlayer2Games(0);
        } else if (player1Games === 6 && player2Games === 6) {
            setIsTieBreaker(true);
            setPlayer1Score(0);
            setPlayer2Score(0);
        }
    }, [player1Games, player2Games]);

    return (
        <div>
            <div>
                <label>Format: </label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="utr">UTR</option>
                </select>
            </div>

            <div>
                <label>Tie Break Type: </label>
                <select value={tieBreakType} onChange={(e) => setTieBreakType(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="super">Super</option>
                </select>
            </div>
            <div>Player 1: {player1Score} Games: {player1Games} Sets: {player1Sets}</div>
            <button onClick={() => incrementScore(setPlayer1Score, setPlayer2Score, player1Score, player2Score)}>Increment Player 1</button>
            <div>Player 1: {player1Score} Games: {player1Games} Sets: {player1Sets}</div>
            <button onClick={() => incrementScore(setPlayer1Score, setPlayer2Score, player1Score, player2Score)}>Increment Player 1</button>
            <button onClick={() => decrementScore(setPlayer1Score, player1Score)}>Decrement Player 1</button>


            <div>Player 2: {player2Score} Games: {player2Games} Sets: {player2Sets}</div>
            <button onClick={() => incrementScore(setPlayer2Score, setPlayer1Score, player2Score, player1Score)}>Increment Player 2</button>
            <div>Player 2: {player2Score} Games: {player2Games} Sets: {player2Sets}</div>
            <button onClick={() => incrementScore(setPlayer2Score, setPlayer1Score, player2Score, player1Score)}>Increment Player 2</button>
            <button onClick={() => decrementScore(setPlayer2Score, player2Score)}>Decrement Player 2</button>

            {matchEnded && (
                <button onClick={endMatch}>End Match</button>
            )}
        </div>
    );
};

export default TennisScoreComponent;