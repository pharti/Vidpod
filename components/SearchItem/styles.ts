import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        padding: 10,
        borderBottomColor:'grey',
        borderBottomWidth: .2,
    },
    infoContainer:{
        marginLeft: 10,
        justifyContent:'center',
    },
    title:{
        color: 'white',
        fontSize: 15,
        overflow: 'hidden',
        flexWrap: 'nowrap',
        paddingRight: 50,
        
    },
    author: {
        color: 'white',
        fontSize: 10,
        opacity: .7

    }
});
export default styles