import {StyleSheet,Platform,Dimensions} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors'
const isLandscape = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height;
};
function tabBarHeight() {
    const majorVersion = parseInt(Platform.Version, 10);
    const isIos = Platform.OS === 'ios';
    const isIOS11 = majorVersion >= 11 && isIos;
    if(Platform.isPad) return 49;
    if(isIOS11 && !isLandscape()) return 49;
    return 29;
}
const height = tabBarHeight();

const imageBox = 75
const styles = StyleSheet.create({
    container:{
        // flex:1,
        
        width:'100%',
        position:'relative',
        // bottom: Platform.OS == "android" ? 49: height,
        paddingTop: 0,
        // flex: 1,
        // paddingBottom: 10,
        // alignContent:'center',
        // justifyContent:'center',
        backgroundColor:'#1C1E22',
        borderBottomWidth:1,
        zIndex:50,
        borderColor:'black',
    },
    innerContainer:{
        flexDirection: 'row',
        alignItems:'center',
        // justifyContent:'space-between'
    },
    rightContainer:{
        flexDirection:'row',
        alignItems: 'center',
   
    },
    title:{
        color:'white',
        fontSize:15,
        fontWeight:'bold',
        opacity: .9,
        paddingRight: 10 
    },
    titleContainer:{
        // justifyContent:'flex-start',
        flexShrink:1,
        // flex:1,
        // paddingTop:20
        alignSelf:'stretch',
        width:'100%',
        justifyContent:'center',
        // backgroundColor:'red',
        paddingLeft: 5,
        // marginRight: 140,
        // width:  275,
    },
    artist:{
        color:'lightgray',
        fontSize:20,
        marginRight:10,
    },
    
    row:{
        flexDirection:'row',
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor:'red'
    },
    image:{
        width:imageBox,
        height:imageBox,
        marginTop:2,
        marginRight: 5,
        
        // marginBottom: -7
    },
    iconsContainer:{
        flexDirection:'row',
        alignItems:'center',
        // alignSelf:'flex-end',
        justifyContent:'flex-end',
        paddingRight: 10,
      
        // flexGrow: 2,
    },
    icon:{
        padding: 10,
        fontWeight: '100',
        textAlign:'right',
        backgroundColor:'red',

        
        // borderLeft

    },
    playArrows:{
        width:48,
        height:48,
        borderWidth:1,
        // marginTop: 10,
        // marginLeft: 5,
        borderColor:'white',
        borderRadius:50,
        position:'absolute',
        right: 5,
        top: 5,
        alignItems:'center', 
        // self :'flex-end'
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