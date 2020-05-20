import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert, YellowBox, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { SliderBox } from "react-native-image-slider-box";
import { Camera } from 'expo-camera';
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../../config/firebase';
import Environment from '../../config/environment';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imageId: '',
            status: '',
            googleResponse: [],
            beforeImageURL: 'https://dummyimage.com/600x400/000000/ffffff&text=Before',
            afterImageURL: 'https://dummyimage.com/600x400/000000/ffffff&text=After',
            loading: false
        }
    }

    componentDidMount() {
        YellowBox.ignoreWarnings(['Setting a timer']);
    }

    takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3]
		});

		this.handleImagePicked(pickerResult);
	};

    openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
        });

        this.handleImagePicked(pickerResult);
    }

    handleImagePicked = async (pickerResult) => {
        if (!pickerResult.cancelled) {
            this.setState({ loading: true, status: 'Uploading Image to Firebase Storage ...'});
            var imageId = Math.floor(Math.random() * 1000000) + 1;
            this.setState({imageId});
            await this.uploadImage(pickerResult.uri, imageId)
                .then(() => {
                    var ref = firebase.storage().ref().child("images/" + imageId);
                    ref.getDownloadURL().then((url) => {
                        this.setState({beforeImageURL: url})
                        this.getVisionResult();
                    });
                })
                .catch((error) => {
                    Alert.alert(error.msg);
                    this.setState({loading: false, status: 'Transaction Failed!'});
                });
        }
    }

    uploadToHasura = () => {
        this.setState({status: 'Uploading Data to Hasura DB ...'});
        const query = `
            mutation MyMutation {
                insert_images(objects: {before_url: "${this.state.beforeImageURL}", description: "${this.state.googleResponse}"}) {
                affected_rows
                }
            }
        `
        const url = 'https://ymir-vision.herokuapp.com/v1/graphql';

        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
          };

        fetch(url, opts)
          .then(res => res.json())
          .then((res) => {
              this.setState({loading: false});
              this.setState({status: 'Transaction Successful!'})
            })
          .catch((err) => {
              this.setState({loading: false, status: 'Transaction Failed!'});
            });
    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
    
        var ref = firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob);
    }

    getVisionResult = async () => {
        this.setState({status: 'Fetching Results from Google Vision ...'});
        var url = "https://vision.googleapis.com/v1/images:annotate?key=" + Environment["GOOGLE_CLOUD_VISION_API_KEY"];
        var body = JSON.stringify({
            requests: [{
                "image": {
                    "source": {
                        "imageUri": this.state.beforeImageURL
                      }
                },
                "features": [
                  {
                    "type": "DOCUMENT_TEXT_DETECTION"
                  }
                ]
              }],
        })
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                const textLen = responseJson.responses[0].textAnnotations[0].description.length;
                this.setState({googleResponse: responseJson.responses[0].textAnnotations[0].description.substring(0, textLen - 1), afterImageURL: 'https://dummyimage.com/600x400/000000/ffffff&text=' + `${responseJson.responses[0].textAnnotations[0].description.substring(0, textLen - 1)}`});
                this.uploadToHasura();
            })
            .catch(err => {
                this.setState({loading: false, status: 'Transaction Failed!'});
            });
    }

    render() {
        let images = [
            this.state.beforeImageURL,
            this.state.afterImageURL
        ]
        var descriptionLength = this.state.googleResponse.length;
        return(
            <ScrollView style={{marginTop: 40}}>
                <View style={{flexDirection: 'row'}}>
                    <Button
                    title="Pick a Photo!"
                    type="solid"
                    containerStyle={{flex: 1, marginLeft: 10, marginRight: 5}}
                    onPress={() => this.openImagePickerAsync()}
                    />
                    <Button
                    title="Click One!"
                    type="solid"
                    containerStyle={{flex: 1, marginLeft: 5, marginRight: 10}}
                    onPress={() => this.takePhoto()}
                    />
                </View>
                <View style={{marginTop: 30}}>
                    <SliderBox sliderBoxHeight={200} images={images} />
                    <ActivityIndicator size="large" color='blue' style={{marginTop: 20}} animating={this.state.loading}/>
                    <Text style={{marginTop: 5, textAlign: 'center'}}>{this.state.status}</Text>
                    {this.state.imageId != '' ? <Text style={{marginTop: 5, textAlign: 'center', fontWeight: 'bold'}}>Image Id: {this.state.imageId}</Text> : null}
                </View>
                <View style={{margin: 10, marginTop: 20}}>
                    {this.state.googleResponse != '' ? <Text style={{fontSize: 24, fontWeight: '700'}}>Text Description: {this.state.googleResponse.substring(0, 1).toUpperCase()}{this.state.googleResponse.substring(1, descriptionLength).toLowerCase()}</Text> : null}
                </View>
                <View style={{margin: 10, marginTop: 20}}>
                    <Text style={{fontSize: 24, fontWeight: '800'}}>Before Image: </Text>
                    <TouchableHighlight onPress={() => Linking.openURL(this.state.beforeImageURL)}>
                        <Text style={{color: 'blue', fontWeight: '500'}}>{this.state.beforeImageURL}</Text>
                    </TouchableHighlight>
                </View>
                <Button
                    title="Display Previous Results"
                    type="solid"
                    containerStyle={{marginHorizontal: 10, marginTop: 30}}
                    onPress={() => this.props.navigation.navigate('List')}
                />
                <View style={{marginTop: 50}} />
            </ScrollView>
        )
    }
}

export default Home;