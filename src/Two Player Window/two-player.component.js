import React, {
    Component
} from 'react';
import './two-player.scss';
import avatarImg1 from './../avatar01.png';
import avatarImg2 from './../avatar02.png';
import runImage from './../run.png';
import winnerImage from './../winner.png';
import {
    ModalComponent
} from './../Modal Component/modalComponent';

export default class TwoPlayerWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfGameModalOpen: false,
            whoStartModalOpen: false,
            playerModalOpen: false,
            sectionList: [{
                    id: 'section_1',
                    playerImage: avatarImg1,
                    label: 'Player 01',
                    value: 'David',
                    handleOnClick: () => this.handleAction('player_01'),
                    requiredWrapperClass: 'section-1',
                    requiredspanClass: 'section-1-span'
                },
                {
                    id: 'section_2',
                    playerImage: avatarImg2,
                    label: 'Player 02',
                    value: 'Maria',
                    handleOnClick: () => this.handleAction('player_02'),
                    requiredWrapperClass: 'section-2',
                    requiredspanClass: 'section-2-span'
                },
                {
                    id: 'section_3',
                    playerImage: winnerImage,
                    label: 'Number of Games',
                    value: '2 Games',
                    handleOnClick: () => this.handleAction('number_of_game'),
                    requiredWrapperClass: 'section-3',
                    requiredspanClass: 'section-3-span'
                },
                {
                    id: 'section_4',
                    playerImage: runImage,
                    label: 'Who Starts',
                    value: 'Always player 01',
                    handleOnClick: () => this.handleAction('Who_starts'),
                    requiredWrapperClass: 'section-4',
                    requiredspanClass: 'section-4-span'
                }
            ],
            gameCountList: [{
                    id: 2,
                    isSelected: true,
                    text: '2 Games',
                    handleOnClick: () => this.handleSelection('gameCount', 2)
                },
                {
                    id: 3,
                    isSelected: false,
                    text: '3 Games',
                    handleOnClick: () => this.handleSelection('gameCount', 3)
                },
                {
                    id: 5,
                    isSelected: false,
                    text: '5 Games',
                    handleOnClick: () => this.handleSelection('gameCount', 5)
                },
                {
                    id: 10,
                    isSelected: false,
                    text: '10 Games',
                    handleOnClick: () => this.handleSelection('gameCount', 10)
                }
            ],
            whoStartList: [{
                    id: 'alternate',
                    isSelected: false,
                    text: 'Alterative turn',
                    handleOnClick: () => this.handleSelection('whoStart', 'alternate')
                },
                {
                    id: 'loser',
                    isSelected: false,
                    text: 'Loser first',
                    handleOnClick: () => this.handleSelection('whoStart', 'loser')
                },
                {
                    id: 'winner',
                    isSelected: false,
                    text: 'Winner first',
                    handleOnClick: () => this.handleSelection('whoStart', 'winner')
                },
                {
                    id: 'player_01',
                    isSelected: true,
                    text: 'Always player 01',
                    handleOnClick: () => this.handleSelection('whoStart', 'player_01')
                },
                {
                    id: 'player_02',
                    isSelected: false,
                    text: 'Always player 02',
                    handleOnClick: () => this.handleSelection('whoStart', 'player_02')
                }
            ],
            selectedGameCount: 2,
            actionType: '',
            selectedName: '',
            prevValue: {}
        }
    }

    handleAction = (action) => {
        switch (action) {
            case 'player_01':
                this.openModal(action, 'playerModalOpen', true);
                break;
            case 'player_02':
                this.openModal(action, 'playerModalOpen', true);
                break;
            case 'number_of_game':
                this.openModal(action, 'numberOfGameModalOpen', true);
                break;
            case 'Who_starts':
                this.openModal(action, 'whoStartModalOpen', true);
                break;
        }
    }

    handleArrow = () => {
        this.props.history.push('/home');
    }

    openModal = (action, name, value) => {
        this.setState({
            [name]: value,
            actionType: action
        });
    }

    closeModal = (name, value, sectionId, isFromModal) => {
        if (isFromModal) {
            const {
                gameCountList,
                whoStartList,
                prevValue
            } = this.state;
            let originalList = [],
                tagName = '';
            switch (sectionId) {
                case 'gameCount':
                    originalList = gameCountList;
                    tagName = 'gameCountList';
                    break;
                case 'whoStart':
                    originalList = whoStartList;
                    tagName = 'whoStartList';
                    break;
                default:
                    break;
            }
            const updatedList = originalList.map(item => {
                if (item.id === prevValue.id) {
                    return prevValue
                } else {
                    return {
                        ...item,
                        isSelected: false
                    }
                }
            });
            this.setState({
                [tagName]: updatedList,
                [name]: value
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleSelection = (tag, selection) => {
        const {
            gameCountList,
            whoStartList
        } = this.state;
        let originalList = [],
            name = '';
        switch (tag) {
            case 'gameCount':
                originalList = gameCountList;
                name = 'gameCountList';
                break;
            case 'whoStart':
                originalList = whoStartList;
                name = 'whoStartList';
                break;
            default:
                break;
        }
        this.setState({
            prevValue: originalList.find(item => item.isSelected)
        }, () => {
            const updatedList = originalList.map(item => {
                if (item.id === selection) {
                    return {
                        ...item,
                        isSelected: true
                    }
                } else {
                    return {
                        ...item,
                        isSelected: false
                    }
                }
            });
            this.setState({
                [name]: updatedList
            });
        });
    }

    handleConfirmation = (sectionId) => {
        const {
            gameCountList,
            sectionList,
            whoStartList,
            selectedName
        } = this.state;
        let updatedValue = '';
        switch (sectionId) {
            case 'section_1':
                updatedValue = selectedName;
                this.closeModal('playerModalOpen', false);
                break;
            case 'section_2':
                updatedValue = selectedName;
                this.closeModal('playerModalOpen', false);
                break;
            case 'section_3':
                const selectedGameCountObj = gameCountList.find(item => item.isSelected)
                updatedValue = selectedGameCountObj ? selectedGameCountObj.text : '2 Games';
                this.closeModal('numberOfGameModalOpen', false);
                break;
            case 'section_4':
                const selectedWhoStartObj = whoStartList.find(item => item.isSelected)
                updatedValue = selectedWhoStartObj ? selectedWhoStartObj.text : 'Always Player 01';
                this.closeModal('whoStartModalOpen', false);
                break;
            default:
                break;
        }
        const updatedSectionList = sectionList.map(item => {
            if (item.id === sectionId) {
                return {
                    ...item,
                    value: updatedValue
                }
            }
            return item;
        });
        this.setState({
            sectionList: updatedSectionList
        });
    }

    handleInputChange = (eve) => {
        const { value } = eve.target;
        this.setState({
            selectedName: value
        });
    }

    handleStartGame = () => {
        const { sectionList } = this.state;
        this.props.history.push({
            pathname: '/game_board',
            settings: {
                player1: sectionList[0].value,
                player2: sectionList[1].value,
                gameCount: parseInt(sectionList[2].value.split('G')[0]),
                whoStart: sectionList[3].value
            }
        });
    }

    render() {
        const {
            numberOfGameModalOpen,
            whoStartModalOpen,
            playerModalOpen,
            sectionList,
            gameCountList,
            whoStartList,
            actionType
        } = this.state;

        return (
            <div className='two-player-container'>
                <div className='header'>
                    <span  className='header-arrow' onClick={this.handleArrow}>
                        <i className='fas fa-arrow-left'></i>
                    </span>
                    <span className='header-text'>Two Player Game</span>
                </div>
                <div className='container'>
                    {
                        sectionList.map(({
                            id,
                            playerImage,
                            label,
                            value,
                            handleOnClick,
                            requiredWrapperClass,
                            requiredspanClass
                        }) => {
                            return (
                                <div 
                                    key={id} 
                                    className={`section ${requiredWrapperClass}`}
                                    onClick={handleOnClick}
                                >
                                    <span className={`section-span ${requiredspanClass}`}>
                                        <img
                                            className='section-img'
                                            src={playerImage}
                                            alt={`${label}-img`}
                                        />
                                    </span>
                                    <div className='section-div'>
                                        <span className='section-label'>{label}</span>
                                        <span className='section-value'>{value}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <span className='seperator'></span>
                    <span className='start-game-button' onClick={this.handleStartGame}>
                        <span className='button-text'>Start Game</span>
                    </span>
                </div>
                {
                    playerModalOpen && (
                        ModalComponent(
                            `Enter Player ${actionType === 'player_01' ? 1 : 2} Name`,
                            [],
                            () => this.closeModal('playerModalOpen', false, actionType === 'player_01' ? 'section_1' : 'section_2', false),
                            () => this.handleConfirmation(actionType === 'player_01' ? 'section_1' : 'section_2'),
                            this.handleInputChange
                        )
                    )
                }
                {
                    numberOfGameModalOpen && (
                        ModalComponent(
                            `Number Of Games`,
                            gameCountList,
                            () => this.closeModal('numberOfGameModalOpen', false, 'gameCount', true),
                            () => this.handleConfirmation('section_3')
                        )
                    )
                }
                {
                    whoStartModalOpen && (
                        ModalComponent(
                            `Who Starts`,
                            whoStartList,
                            () => this.closeModal('whoStartModalOpen', false, 'whoStart', true),
                            () => this.handleConfirmation('section_4')
                        )
                    )
                }
            </div>
        )
    }
}