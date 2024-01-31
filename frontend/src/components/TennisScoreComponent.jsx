import { useState, useEffect } from 'react';
import AxiosInstance from './Axios';

const TennisScoreComponent = ({ matchId, userId ,flag }) => {
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player1Games, setPlayer1Games] = useState(0);
    const [player2Games, setPlayer2Games] = useState(0);
    const [player1Sets, setPlayer1Sets] = useState(0);
    const [player2Sets, setPlayer2Sets] = useState(0);
    const [isTieBreaker, setIsTieBreaker] = useState(false);
    const [format, setFormat] = useState('normal'); // 'normal' or 'utr'
    const [tieBreakType, setTieBreakType] = useState('normal'); // 'normal' or 'super'
    const [history, setHistory] = useState([]);

    const incrementScore = (playerScoreSetter, opponentScoreSetter, playerScore, opponentScore) => {
        let newPlayerScore = playerScore;
        let newOpponentScore = opponentScore;
        let newIsTieBreaker = isTieBreaker;
    
        if (isTieBreaker) {
            newPlayerScore = playerScore + 1;
            playerScoreSetter(newPlayerScore);
            if (playerScore >= 6 && playerScore - opponentScore >= 1) {
                incrementGames(playerScoreSetter);
                newIsTieBreaker = false;
                setIsTieBreaker(newIsTieBreaker);
            }
        } else {
            const currentIndex = scoreOptions.indexOf(playerScore);
            const nextScore = scoreOptions[currentIndex + 1] || 'Game';
    
            if (nextScore === 'Game') {
                if (opponentScore !== 'AD') {
                    newPlayerScore = 0;
                    newOpponentScore = 0;
                    playerScoreSetter(newPlayerScore);
                    opponentScoreSetter(newOpponentScore);
                    incrementGames(playerScoreSetter);
                } else {
                    newPlayerScore = 40;
                    newOpponentScore = 40;
                    playerScoreSetter(newPlayerScore);
                    opponentScoreSetter(newOpponentScore);
                }
            } else if (nextScore === 'AD' && opponentScore === 'AD') {
                newPlayerScore = 40;
                newOpponentScore = 40;
                playerScoreSetter(newPlayerScore);
                opponentScoreSetter(newOpponentScore);
            } else {
                newPlayerScore = nextScore;
                playerScoreSetter(newPlayerScore);
            }
        }
    
        setHistory(prevHistory => [...prevHistory, {
            player1Score: newPlayerScore,
            player2Score: newOpponentScore,
            player1Games,
            player2Games,
            player1Sets,
            player2Sets,
            isTieBreaker: newIsTieBreaker
        }]);
        AxiosInstance.post(`matchhistory/`, {
            match : matchId,
            player1_score: player1Score,
            player2_score: player2Score,
            player1_games: player1Games,
            player2_games: player2Games,
            player1_sets: player1Sets,
            player2_sets: player2Sets,
            is_tiebreaker: isTieBreaker,
        });
    };

    const decrementScore = () => {
        if (history.length > 0) {
            // Remove the last entry from the history
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
    
            // Define the last entry
            const lastEntry = history[history.length - 1];
    
            // Delete the last entry on the server
            AxiosInstance.delete(`matchhistory/${lastEntry.id}/`);
    
            // If there are still entries in the history, restore the state to the previous entry
            if (newHistory.length > 0) {
                const previousEntry = newHistory[newHistory.length - 1];
                setPlayer1Score(previousEntry.player1Score);
                setPlayer2Score(previousEntry.player2Score);
                setPlayer1Games(previousEntry.player1Games);
                setPlayer2Games(previousEntry.player2Games);
                setPlayer1Sets(previousEntry.player1Sets);
                setPlayer2Sets(previousEntry.player2Sets);
                setIsTieBreaker(previousEntry.isTieBreaker);
            }
        }
    };
    
    const scoreOptions = [0, 15, 30, 40, 'AD'];

    useEffect(() => {
        const gamesToWin = format === 'utr' ? 4 : 6;
        const superTieBreakPoints = tieBreakType === 'super' ? 10 : 7;

        if (player1Games > gamesToWin ||(player1Games==gamesToWin && player1Games - player2Games >= 2) ) {
            setPlayer1Sets(player1Sets + 1);
            setPlayer1Games(0);
            setPlayer2Games(0);
        } else if (player2Games > gamesToWin ||(player2Games==gamesToWin && player2Games - player1Games >= 2)) {
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


    useEffect(() => {
        if (flag) {
            endMatch();
        }
    }, [flag]);

    const endMatch = () => {
        AxiosInstance.put(`matches`, {
                    sets_won: player1Sets,
                    games_won: player1Games,
                    points_won: player1Score,
                    user_id: userId,
                    match_id: matchId,
                });
                AxiosInstance.post(`matchhistory/`, {
                    match : matchId,
                    player1_score: player1Score,
                    player2_score: player2Score,
                    player1_games: player1Games,
                    player2_games: player2Games,
                    player1_sets: player1Sets,
                    player2_sets: player2Sets,
                    is_tiebreaker: isTieBreaker,
                });
            // Reset the match
            setPlayer1Score(0);
            setPlayer2Score(0);
            setPlayer1Games(0);
            setPlayer2Games(0);
            setPlayer1Sets(0);
            setPlayer2Sets(0);
            setIsTieBreaker(false);
            setHistory([]);
    };

    const incrementGames = (playerGamesSetter) => {
        playerGamesSetter(prevGames => prevGames + 1);
    };

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

            <div>
            <h2>Score</h2>
            <p>Player 1: {player1Sets} sets, {player1Games} games, {player1Score} points</p>
            <p>Player 2: {player2Sets} sets, {player2Games} games, {player2Score} points</p>
            </div>
        </div>
    );
};

export default TennisScoreComponent;