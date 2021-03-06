import React, { Component } from 'react';
import { Text,Alert,Easing, Animated, Dimensions, View, StyleSheet, Share, AsyncStorage } from 'react-native';
import { Constants } from 'expo';

const {width} = Dimensions.get('window');
import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import Colors from '../../Colors';
import Characters from '../../Characters';

import Footer from './Footer';
import Banner from './Banner'

//TODO: Make this dynamic
const banner = [
  {
    color: '#f6c62b',
    title: 'Get Notifications, Subscribe Now',
    button: {
      onPress: (_=> {
        Alert.alert(
     'Subscribe to our mailing list',
     'Join our mailing list and discover the latest news from Some Company and This Game.\n\n Read about fair use on http://fairuse.stanford.edu/overview/academic-and-educational-permissions/non-coursepack/#rules_for_reproducing_music',
     [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
       {text: 'OK', onPress: () => console.log('OK Pressed!')},
     ],
     {
       cancelable: false
     }
   )
      }),
      source: Images.button.mail,
      style: {aspectRatio: 1.85, height: 40}
    }
  },
  {
    color: '#f8602c',
    title: 'Free Gift in 2h 51m',
  },
  {
    color: '#d73a32',
    title: '44 * To Go',
  }
]

const AnimatedBanner = Animated.createAnimatedComponent(Banner);
class GameOver extends Component {
  state = {
    currentIndex: 0,
    characters: Object.keys(Characters).map(val => Characters[val]),
    animations: banner.map(val => new Animated.Value(0) )
  }
  dismiss = () => {
    this.props.navigation.goBack();
  }

  pickRandom = () => {
    const {characters, currentIndex} = this.state;

    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    const randomCharacter = characters[randomIndex];
    this.props.setCharacter(randomCharacter);
    this.dismiss();

  }

  componentDidMount() {

    setTimeout(_=> {
      this._animateBanners()
    }, 300);

  }

  _animateBanners = () => {
    const {timing} = Animated;
    const animations = this.state.animations.map(animation => timing(animation, {toValue: 1, duration: 1000, easing: Easing.elastic() }));
    Animated.stagger(300, animations).start();
  }

  _showResult = result => {
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     this.setState({result: 'shared with an activityType: ' + result.activityType});
    //   } else {
    //     this.setState({result: 'shared'});
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   this.setState({result: 'dismissed'});
    // }
  }


  select = () => {
    const {characters, currentIndex} = this.state;

    this.props.setCharacter(characters[currentIndex]);
    this.dismiss();
  }


  render() {
    const imageStyle={width: 60, height: 48};
    const {animations} = this.state;


    return (
      <View style={[styles.container, this.props.style]}>

          <View key='content' style={{flex: 1, justifyContent: 'center'}}>

            {
              banner.map((val, index) => (
                <AnimatedBanner
                  animatedValue={animations[index].interpolate({
                    inputRange:[0.2, 1],
                    outputRange: [-width, 0],
                    extrapolate: 'clamp'
                  })}
                  key={index}
                  style={{
                    backgroundColor: val.color,
                    transform: [
                      {
                        scaleY: animations[index].interpolate({
                          inputRange:[0, 0.2],
                          outputRange: [0, 1],
                          extrapolate: 'clamp'
                        })
                      }
                    ]
                  }}
                  title={val.title}
                  button={val.button}
                />
            ))
            }
          </View>

          <Footer setGameState={this.props.setGameState} navigation={this.props.navigation}/>
      </View>
    );
  }
}

import {connect} from 'react-redux';
import {setGameState} from '../../actions/game';
export default connect(state => ({}), {setGameState})(GameOver)

GameOver.defaultProps = {
  coins: 0
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 8,
    backgroundColor: 'rgba(105, 201, 230, 0.0)',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
