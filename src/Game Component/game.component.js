import React, {
    Component
} from 'react';
import './game.scss';
import player1Img from './../avatar01.png';
import player2Img from './../avatar02.png';
import isEmpty from 'lodash/isEmpty';
import {
    gameStateData
} from './../gameStateData';

export default class GameComponent extends Component {
    constructor(props) {
        super(props);
        const {
            history: {
                location: {
                    settings: {
                        player1: player1Name,
                        player2: player2Name
                    } = {}
                } = {
                    settings: {}
                }
            } = { }
        } = this.props;
        this.player1 = {
            img: player1Img,
            name: player1Name ? player1Name : 'David',
            value: 'X',
            index: 0
        }
        this.player2 = {
            img: player2Img,
            name: player2Name ? player2Name : 'Maria',
            value: 'O',
            index: 0
        }
        this.state = {
            gameState: gameStateData,
            gameActive: true,
            currentPlayer: '',
            firstPlayer: this.player1,
            winningMessage: '',
            drawMatchMessage: '',
            tournamentCounter: 1,
            scoreCard: {
                player1Score: 0,
                player2Score: 0
            },
            winningIndexes: [],
            winner: '',
            tournamentWinner: '',
            lastTurn: {}
        }
    }

    componentDidMount() {
        this.setState({
            currentPlayer: this.setDefaultCurrentPlayer()
        });
    }

    setDefaultCurrentPlayer = () => {
        const {
            history: {
                location: {
                    settings: {
                        whoStart: whoWillStart
                    } = {}
                } = {
                    settings: {}
                }
            } = {}
        } = this.props;
        const {
            scoreCard: {
                player1Score,
                player2Score
            },
            tournamentCounter
        } = this.state;
        const oddEvenNumber = (number) => {
            if (number % 2 === 0) {
                return 'even';
            } else {
                return 'odd'
            }
        }

        const firstPlayer = () => {
            let player = this.player1;
            switch (whoWillStart) {
                case 'Always player 01':
                    return player;
                case 'Always player 02':
                    player = this.player2;
                    return player;
                case 'Winner first':
                    if ((player1Score === player2Score && player1Score === 0) || (player1Score > player2Score)) {
                        player = this.player1;
                    } else if (player2Score > player1Score) {
                        player = this.player2;
                    }
                    return player;
                case 'Looser first':
                    if ((player1Score === player2Score && player1Score === 0) || (player1Score < player2Score)) {
                        player = this.player1;
                    } else if (player2Score < player1Score) {
                        player = this.player2;
                    }
                    return player;
                case 'Alternative turn':
                    player = oddEvenNumber(tournamentCounter) === 'odd' ? this.player1 : this.player2;
                    return player;
                default:
                    return this.player1;
            }
        }
        return firstPlayer();
    }

    resetBoard = () => {
        const {
            history: {
                location: {
                    settings: {
                        gameCount
                    } = {}
                } = {
                    settings: {}
                }
            } = {}
        } = this.props;
        this.setState({
            gameActive: true,
            gameState: gameStateData,
            tournamentCounter: this.state.tournamentCounter < gameCount ? ++this.state.tournamentCounter : gameCount,
            currentPlayer: this.setDefaultCurrentPlayer(),
            winningMessage: '',
            drawMatchMessage: '',
            winner: '',
            winningIndexes: [],
            lastTurn: {}
        });
    }

    winningMessage = (winnerData) => {
        this.setState({
            winningMessage: `Player ${winnerData.name} has won`
        });
    }

    drawMatchMessage = () => this.setState({
        drawMatchMessage: 'Game ended in a draw.'
    });

    handleBlockClick = (blockEvent) => {
        const {
            gameActive,
            gameState
        } = this.state;

        const targetCell = blockEvent.target;

        const cellIndex = targetCell.getAttribute('data-cell-index');

        const clickedIndexState = gameState.find(item => item.index === cellIndex);
        const isIndexAllreadyPlayed = clickedIndexState.name;
        if (!isEmpty(isIndexAllreadyPlayed) || !gameActive) {
            return;
        }

        this.handleCellPlayed(cellIndex);
    }

    handleCellPlayed = (clickedCellIndex) => {
        const {
            gameState,
            currentPlayer,
            scoreCard,
            scoreCard: {
                player1Score,
                player2Score
            }
        } = this.state;
        const {
            img: playerImg,
            name: playerName,
            value: playerSymbol
        } = currentPlayer;

        const updatedGameState = gameState.map(item => {
            if (item.index === clickedCellIndex) {
                this.setState({
                    lastTurn: item
                });
                return {
                    ...item,
                    img: playerImg,
                    value: playerSymbol,
                    name: playerName
                };
            }
            return item;
        });
        this.setState({
            gameState: updatedGameState
        }, () => {
            const rowIndex = parseInt(clickedCellIndex.charAt(0));
            const columnIndex = parseInt(clickedCellIndex.charAt(1));
            const roundWon = this.checkforVictory(rowIndex, columnIndex);
            if (roundWon) {
                this.winningMessage(currentPlayer);
                let updatedScoreCard = {
                    player1Score: currentPlayer.value === 'X' ? player1Score + 1 : player1Score,
                    player2Score: currentPlayer.value === 'O' ? player2Score + 1 : player2Score,
                }
                this.setState({
                    gameActive: false,
                    scoreCard: updatedScoreCard,
                    winner: currentPlayer.name
                }, () => {
                    const tournamentWinner = this.checkForTournamentWinner();
                    console.log(tournamentWinner);
                    this.setState({
                        tournamentWinner
                    });
                });
                return;
            }

            let roundDraw = isEmpty(gameState.find(item => item.name === ""));
            if (roundDraw) {
                this.drawMatchMessage();
                const updatedScoreCard = {
                    ...scoreCard,
                    player1Score: ++player1Score,
                    player2Score: ++player2Score
                }
                this.setState({
                    gameActive: false,
                    scoreCard: updatedScoreCard
                });
                return;
            }
            if (!roundWon) {
                this.handlePlayerChange();
            }
        });
    }

    handlePlayerChange = () => {
        const {
            currentPlayer
        } = this.state;
        const {
            value
        } = currentPlayer;
        let nextPlayer = (value === 'X') ? this.player2 : this.player1;
        this.setState({
            currentPlayer: nextPlayer
        });
    }

    checkforVictory = (row, col) => {
        if (this.getAdjecentCell(row, col, 0, 1) + this.getAdjecentCell(row, col, 0, -1) > 2) {
            /* for horizontal */
            return true;
        } else if (this.getAdjecentCell(row, col, 1, 0) + this.getAdjecentCell(row, col, -1, 0) > 2) {
            /* for vertical */
            return true;
        } else {
            if (this.getAdjecentCell(row, col, -1, 1) + this.getAdjecentCell(row, col, 1, -1) > 2) {
                /* for diagonal1\ */
                return true;
            } else {
                if (this.getAdjecentCell(row, col, 1, 1) + this.getAdjecentCell(row, col, -1, -1) > 2) {
                    /* for diagonal2/ */
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    getAdjecentCell = (row, col, row_inc, col_inc) => {
        if ((this.cellValue(row, col) === this.cellValue(row + row_inc, col + col_inc)) && this.cellValue(row, col) !== "") {
            return 1 + this.getAdjecentCell(row + row_inc, col + col_inc, row_inc, col_inc);
        } else {
            return 0;
        }
    }

    cellValue = (row, col) => {
        const { gameState } = this.state;
        const cellIndex = `${row}${col}`;
        const cellCurrentStateData = gameState.find(item => item.index === cellIndex);
        if (cellCurrentStateData) {
            return cellCurrentStateData.value;
        } else {
            return -1;
        }
    }

    handleArrow = () => {
        this.props.history.push('/home');
    }

    endTournament = () => {
        this.props.history.push('/home');
    }

    checkForTournamentWinner = () => {
        const { scoreCard: {
            player1Score,
            player2Score
        } } = this.state;
        const {
            history: {
                location: {
                    settings: {
                        gameCount
                    } = {}
                } = {
                    settings: {}
                }
            } = {}
        } = this.props;
        let winner = '';
        if (parseInt(gameCount / 2) < player1Score) {
            winner = this.player1.name;
        } else if (parseInt(gameCount / 2) < player2Score) {
            winner = this.player2.name;
        } else if ((player1Score + player2Score === gameCount) && (player1Score === player2Score)) {
            winner = 'draw';
        }
        return winner;
    }

    undoStep = () => {
        const { lastTurn, gameState } = this.state;
        const lastTurnIndex = lastTurn.index;
        const updatedGameState = gameState.map(item => {
            if (item.index === lastTurnIndex) {
                return lastTurn;
            }
            return item;
        });
        this.setState({
            gameState : updatedGameState
        }, () => {
            this.handlePlayerChange();
        });
    }

    render() {
        const {
            currentPlayer,
            gameState,
            winningMessage,
            drawMatchMessage,
            gameActive,
            tournamentCounter,
            scoreCard: {
                player1Score,
                player2Score
            },
            tournamentWinner,
            winningIndexes
        } = this.state
        const {
            history: {
                location: {
                    settings: {
                        player1,
                        player2,
                        gameCount
                } = {}
                } = { settings: {} }
            } = {}
        } = this.props;

        return (
            <div className='game-board-container'>
                <div className='header'>
                    <span  className='header-arrow' onClick={this.handleArrow}>
                        <i className='fas fa-arrow-left'></i>
                    </span>
                    <span className='header-text'>Two Player Game</span>
                </div>

                <div className='game-detail'>
                    <div className='detail-container'>
                        <div className='details-heading'>
                            {`${gameCount} Game Tournament`}
                        </div>
                        {
                            isEmpty(winningMessage) && isEmpty(tournamentWinner) && (
                                <div className='details-sub-heading'>
                                    {`Playing Game ${tournamentCounter}`}
                                </div>
                            )
                        }
                        {
                            !isEmpty(winningMessage) && isEmpty(tournamentWinner) && (
                                <div className='winning-message'>
                                    <div className='congratulation-text'>Congratulations!</div>
                                    <div className='player-text'>
                                        {`${currentPlayer.name}, you won game ${tournamentCounter}`}
                                    </div>
                                </div>
                            )
                        }
                        {
                            !isEmpty(drawMatchMessage) && (
                                <div className='winning-message'>
                                    <div className='player-text'>
                                        {`Game ${tournamentCounter} is a Draw.`}
                                    </div>
                                </div>
                            )
                        }
                        {
                            !isEmpty(tournamentWinner) && (tournamentWinner !== 'draw') && (
                                <div className='winning-message'>
                                    <div className='congratulation-text'>Congratulations!</div>
                                    <div className='player-text'>
                                        {`${tournamentWinner}, you won the tournament.`}
                                    </div>
                                </div>
                            )
                        }
                        <div className='scoreboard-container'>
                            <div className='player-scoreboard'>
                                <div className={`image-wrapper ${currentPlayer.value === 'X' ? 'add-border' : 'player1-wrapper'}`}>
                                    <img className='image' src={player1Img} alt={`${player1}-img`}></img>
                                </div>
                                <div className='detail'>
                                    <div className='label'>Player 01</div>
                                    <div className='sub-label'>{player1}</div>
                                </div>
                                <div className='score-detail'>
                                    <div className='label'>Score</div>
                                    <div className='sub-label'>{player1Score}</div>
                                </div>
                            </div>
                            <div className='player-scoreboard'>
                                <div className={`image-wrapper ${currentPlayer.value === 'O' ? 'add-border' : 'player2-wrapper'}`}>
                                    <img className='image' src={player2Img} alt={`${player2}-img`}></img>
                                </div>
                                <div className='detail'>
                                    <div className='label'>Player 02</div>
                                    <div className='sub-label'>{player2}</div>
                                </div>
                                <div className='score-detail'>
                                    <div className='label'>Score</div>
                                    <div className='sub-label'>{player2Score}</div>
                                </div>
                            </div>
                        </div>
                        <div className='seperator'></div>
                        <div className='button-container'>
                            {
                                gameActive && isEmpty(tournamentWinner) && (
                                    <div className='undo-button' onClick={this.undoStep}>
                                        Undo Step
                                    </div>
                                )
                            }
                            {
                                !gameActive && isEmpty(tournamentWinner) && !(tournamentCounter === gameCount) && (
                                    <div className='next-button' onClick={this.resetBoard}>
                                        Next Game
                                    </div>
                                )
                            }
                            <div className='end-button' onClick={this.endTournament}>End Tournament</div>
                        </div>
                    </div>
                </div>
                <div className='game-field'></div>
                <div className='game-field-background'></div>
                <div className='game--container'>
                    {
                        gameState.map(({ index, img }) => {
                            return (
                                <div 
                                key={index} 
                                className='cell'
                                data-cell-index={index}
                                onClick={(e) => this.handleBlockClick(e)}
                                >
                                    <img
                                        src={img}
                                        className='player-img'
                                        data-cell-index={index}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}