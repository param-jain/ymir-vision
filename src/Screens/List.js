import React from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Card } from 'react-native-elements';

class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            status: ''
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({status: 'Fetching Data from Hasura DB ...', loading: true});
        const query = `
            query MyQuery {
                images {
                id
                description
                before_url
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
              this.setState({data: res.data.images, loading: false});
            })
          .catch((err) => {
              this.setState({loading: false, status: 'Transaction Failed!'});
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="blue" size="large" animating={this.state.loading} />
                </View>
            )
        } else {
            return(
                <ScrollView style={{flex: 1}}>
                    {
                        this.state.data.map((image, i) => {
                            return(
                                <Card
                                    key={i}
                                    containerStyle={{margin: 10, paddingBottom: -30}}
                                    image={{ uri: image.before_url}}>
                                    <View style={{flexDirection: 'row', justifyContent:'center'}}>
                                        <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20}}>Description: </Text>
                                        <Text style={{fontWeight: '400', fontSize: 20}}>{image.description.substring(0, 1).toUpperCase()}{image.description.substring(1, image.description.length).toLowerCase()}</Text>
                                    </View>
                                </Card>
                            )
                        })
                    }
                    <View style={{marginTop: 50}} />
                </ScrollView>
            )
        }
    }
}

export default List;