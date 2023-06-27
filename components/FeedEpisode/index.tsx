import React from 'react';
import { View,Text } from "react-native"
import { Episode } from '../../features/episodesSlice';

const FeedEpisode =(props:Episode)=>{
    return <View>
        <Text>{props.title}</Text>
    </View>
}
export default FeedEpisode;