import { useState, useEffect , useRef} from 'react';
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
    const [setCount, setSetCount] = useState(0);

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

    const scorePoint = (player) => {
        if (isTieBreaker) {
            if (player === 1) {
                if (player1Score < 6) {
                    setPlayer1Score(player1Score + 1);
                } else if (player1Score === 6) {
                    if (player1Score -player2Score >= 2 && player1Score >= 7) {
                        // Player 1 wins the tiebreaker
                        setPlayer1Sets(player1Sets + 1);
                        setPlayer1Score(0);
                        setPlayer2Score(0);
                        setIsTieBreaker(false);
                    } else if (player2Score >= 6) {
                        setPlayer1Score+1;
                    }
                } else if (player1Score === 7) {
                    // Player 1 wins the tiebreaker
                    setPlayer1Games(player1Games + 1);
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setIsTieBreaker(false);
                } else if (player1Score === 8) {
                    // Player 1 wins the tiebreaker
                    setPlayer1Games(player1Games + 1);
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setIsTieBreaker(false);
                }
            }
            else if (player === 2) {
                if (player2Score < 6) {
                    setPlayer2Score(player2Score + 1);
                } else if (player2Score === 6) {
                    if (player2Score - player1Score >= 2 && player2Score >= 7) {
                        // Player 2 wins the tiebreaker
                        setPlayer2Games(player2Games + 1);
                        setPlayer1Score(0);
                        setPlayer2Score(0);
                        setIsTieBreaker(false);
                    } else if (player1Score >= 6) {
                        setPlayer2Score+1;
                    }
                } else if (player2Score === 7) {
                    // Player 2 wins the tiebreaker
                    setPlayer2Games(player2Games + 1);
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setIsTieBreaker(false);
                } else if (player2Score === 8) {
                    // Player 2 wins the tiebreaker
                    setPlayer2Games(player2Games + 1);
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setIsTieBreaker(false);
                }
            }    

        }
        else 
        {
        if (player === 1) {
            if (player1Score < 30) {
                setPlayer1Score(player1Score + 15);
            } else if (player1Score === 30) {
                setPlayer1Score(40);
            } else if (player1Score === 40) {
                if (player2Score < 40) {
                    // Player 1 wins the game
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setPlayer1Games(player1Games + 1);
                } else if (player2Score === 40) {
                    setPlayer1Score('AD');
                } else if (player2Score === 'AD') {
                    setPlayer2Score(40);
                }
            } else if (player1Score === 'AD') {
                // Player 1 wins the game
                setPlayer1Score(0);
                setPlayer2Score(0);
                setPlayer1Games(player1Games + 1);
            }
        } else if (player === 2) {
            if (player2Score < 30) {
                setPlayer2Score(player2Score + 15);
            }
            else if (player2Score === 30) {
                setPlayer2Score(40);
            }
            else if (player2Score === 40) {
                if (player1Score < 40) {
                    // Player 2 wins the game
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setPlayer2Games(player2Games + 1);
                } else if (player1Score === 40) {
                    setPlayer2Score('AD');
                } else if (player1Score === 'AD') {
                    setPlayer1Score(40);
                }
            } else if (player2Score === 'AD') {
                // Player 2 wins the game
                setPlayer1Score(0);
                setPlayer2Score(0);
                setPlayer2Games(player2Games + 1);
            }
        }
        
        if (format === 'normal') {
            // Normal scoring logic...
            if (player1Games === 6 && player2Games === 6) {
                setIsTieBreaker(true);
            }
            // Check if a player has won the set
            if (player1Games >=6 && player1Games - player2Games >= 2) {
                setPlayer1Sets(player1Sets + 1);
                setPlayer1Games(0);
                setPlayer2Games(0);
                setSetCount(setCount + 1);
            } else if (player2Games >= 6 && player2Games - player1Games >= 2) {
                setPlayer2Sets(player2Sets + 1);
                setPlayer1Games(0);
                setPlayer2Games(0);
                setSetCount(setCount + 1);
            }
        } else if (format === 'UTR') {
            // UTR scoring logic...
            if (player1Games === 4 && player2Games === 4) {
                setIsTieBreaker(true);
            }
            // Check if a player has won the set
            if (player1Games >=4 && player1Games - player2Games >= 2) {
                setPlayer1Sets(player1Sets + 1);
                setPlayer1Games(0);
                setPlayer2Games(0);
                setSetCount(setCount + 1);
            } else if (player2Games >= 4 && player2Games - player1Games >= 2) {
                setPlayer2Sets(player2Sets + 1);
                setPlayer1Games(0);
                setPlayer2Games(0);
                setSetCount(setCount + 1);
            }
        }
        
        if (format === 'superTiebreak') {
            // Super tiebreak scoring logic...
            if (setCount === 2) {
                if (player1Score >= 10 && player1Score - player2Score >= 2) {
                    // Player 1 wins the super tiebreak
                    setPlayer1Sets(player1Sets + 1);
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setIsTieBreaker(false);
                } else if (player2Score >= 10 && player2Score - player1Score >= 2) {
                    // Player 2 wins the super tiebreak
                    setPlayer2Sets(player2Sets + 1);
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    setIsTieBreaker(false);
                }
            }
        }

        // Check if a player has won the match
        if (player1Sets === 2) {
            console.log('Player 1 wins the match');
        } else if (player2Sets === 2) {
            console.log('Player 2 wins the match');
        }

        const newHistoryEntry = {
            player1Score: player1Score,
            player2Score: player2Score,
            player1Games: player1Games,
            player2Games: player2Games,
            player1Sets: player1Sets,
            player2Sets: player2Sets,
            isTieBreaker: isTieBreaker,
        };
        setHistory([...history, newHistoryEntry]);


    }
    }
    const [shouldDecrement, setShouldDecrement] = useState(false);

    const decrementingScore = useRef(false);

    useEffect(() => {
        if (shouldDecrement && !decrementingScore.current) {
            decrementingScore.current = true;
            decrementScore();
            setShouldDecrement(false); // Reset the flag
            decrementingScore.current = false;
        }
    }, [shouldDecrement]);

    const decrementScore = () => {
        console.log('boton llamado');
        setHistory(prevHistory => {
            if (prevHistory.length > 1) {
                const newHistory = prevHistory.slice(0, -1);
                const lastEntry = newHistory[newHistory.length - 1];
    
                setPlayer1Score(lastEntry.player1Score);
                setPlayer2Score(lastEntry.player2Score);
                setPlayer1Games(lastEntry.player1Games);
                setPlayer2Games(lastEntry.player2Games);
                setPlayer1Sets(lastEntry.player1Sets);
                setPlayer2Sets(lastEntry.player2Sets);
    
                return newHistory;
            } else {
                // Reset scores if there's no history
                setPlayer1Score(0);
                setPlayer2Score(0);
                setPlayer1Games(0);
                setPlayer2Games(0);
                setPlayer1Sets(0);
                setPlayer2Sets(0);
    
                return [];
            }
        });
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
            <div>Player 1:</div>
            <button onClick={() => scorePoint(1)}>Increment Player 1</button>


            <div>Player 2</div>
            <button onClick={() => scorePoint(2)}>Increment Player 2</button>
            <div>
            <button onClick={() => setShouldDecrement(true)}>Undo</button>
            <h2>Score</h2>
            <p>Player 1: {player1Sets} sets, {player1Games} games, {player1Score} points</p>
            <p>Player 2: {player2Sets} sets, {player2Games} games, {player2Score} points</p>
            </div>
        </div>
    );
};

export default TennisScoreComponent;