import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
   
    button:{
        backgroundColor:'#1DB954',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 30,
        paddingLeft: 30,
        borderRadius:Platform.OS == "android" ? 50 : 25,
        margin: 10,
        overflow: 'hidden',
        color: 'white',
        fontSize: 18,
        letterSpacing: 1.5,
        fontWeight: 'bold',
    
    },
    
})
export default styles