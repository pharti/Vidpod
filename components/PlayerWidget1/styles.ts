import {StyleSheet,Platform} from 'react-native';
import Colors from '../../constants/Colors'


const imageBox = 75
const styles = StyleSheet.create({
    container:{
        width:'100%',
        position:'absolute',
        bottom:Platform.OS == "android"?45:45,
        paddingTop: 10,
        paddingBottom: 10,
        alignContent:'center',
        justifyContent:'center',
        backgroundColor:'#1C1E22',
        borderBottomWidth:2,
        borderColor:'black',
    },
    innerContainer:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    rightContainer:{
        flexDirection:'row',
        alignItems: 'center'
    },
    title:{
        color:'white',
        fontSize:17,
        fontWeight:'bold',
    },
    titleContainer:{
        flexShrink: 1
    },
    artist:{
        color:'lightgray',
        fontSize:20,
        marginRight:10,
    },
    
    row:{
        flexDirection:'row',
        paddingLeft: 10
    },
    image:{
        width:imageBox,
        height:imageBox,
        marginRight:10,
    },
    iconsContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        paddingRight: 10,
    },
    playArrows:{
        width:48,
        height:48,
        borderWidth:1,
        borderColor:'white',
        borderRadius:50,
        alignItems:'center', 
        justifyContent:'center',
    },
    playRadius:{
        height:50,
        width:50,
        alignItems:'center',
        justifyContent:'center',
    },

})
export default styles