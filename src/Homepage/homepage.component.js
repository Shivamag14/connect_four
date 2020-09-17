import React, {
    Component
} from 'react';
import './homepage.scss';
import boardImage from './../4inarow.png';
import onePlayer from './../one.png';
import twoPlayer from './../two.png';
import onlineGame from './../online.png';
import tariningImg from './../training.png';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    handleAction = (action) => {
        switch (action) {
            case 'onePlayer':
                alert('coming soon');
                break;
            case 'twoPlayer':
                this.props.history.push('/two_player_window');
                break;
            case 'onlineGame':
                alert('coming soon');
                break;
            case 'trainingGame':
                alert('coming soon');
                break;
            default:
                this.props.history.push('/home');
                break;
        }
    }

    render() {
        const buttonList = [
            {
                image: onePlayer,
                text: 'Custom Game',
                requiredWrapperClass: 'action-button-1',
                requiredImgClass: 'button-img-1',
                requiredTextClass: 'button-text-1',
                handleOnClick: () => this.handleAction('onePlayer')
            },
            {
                image: twoPlayer,
                text: 'Two Player',
                requiredWrapperClass: 'action-button-2',
                requiredImgClass: 'button-img-2',
                requiredTextClass: 'button-text-2',
                handleOnClick: () => this.handleAction('twoPlayer')
            },
            {
                image: onlineGame,
                text: 'Game Online',
                requiredWrapperClass: 'action-button-3',
                requiredImgClass: 'button-img-3',
                requiredTextClass: 'button-text-3',
                handleOnClick: () => this.handleAction('onlineGame')
            },
            {
                image: tariningImg,
                text: 'Training Game',
                requiredWrapperClass: 'action-button-4',
                requiredImgClass: 'button-img-4',
                requiredTextClass: 'button-text-4',
                handleOnClick: () => this.handleAction('onePlayer')
            }
        ]

        return (
            <div className='home-container'>
                <div className='text-wrapper'>
                    <div className='heading'>
                        Connect Four!
                    </div>
                    <div className='sub-text'>
                        Play with other players around the world.
                    </div>
                </div>
                <div className='section_1'>
                    <div className='play-button-background'>
                        <div className='play-button'>
                            <i className='fa fa-play-circle'/>
                        </div>
                        <div className='play-button-text'>Play</div>
                    </div>
                    <div>
                        <div className='circle-1'>
                            <img className='board-img' src={boardImage} alt='board-img' />
                         </div>
                        <div className='circle-2'></div>
                    </div>
                    <div>
                        {
                            buttonList.map(({
                                image,
                                text,
                                requiredWrapperClass,
                                requiredImgClass,
                                requiredTextClass,
                                handleOnClick
                            }) => {
                                return (
                                    <div key={text} className={requiredWrapperClass} onClick={handleOnClick}>
                                        <img className={requiredImgClass} src={image} alt={`${text}-img`} />
                                        <span className={requiredTextClass}>{text}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='section_2'>
                    <div className='copyright-text'>
                        © 2020
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;