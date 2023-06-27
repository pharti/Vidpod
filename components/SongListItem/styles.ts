import {StyleSheet} from 'react-native';
const imageBox = 75
const styles = StyleSheet.create({
    flexContainer:{
        flex:1,
        margin:5,
        paddingTop:5,
        paddingRight: 5,
        paddingLeft:5,
        borderRadius:10,
        backgroundColor:'#282828',
        paddingBottom: 10
    },
    container:{
        flexDirection:'row',
        position:'relative',
        
    },
    progressBar:{
        backgroundColor:'green',
        height:2,
        zIndex: 100,
        // borderRadius: 50,
        // alignSelf:'flex-start',
        // bottom: -9,
    },
    rightContainer:{
        marginLeft:10,
        marginTop: 5, 
        flexDirection:'column',
        flex:1,
        // flexWrap:'wrap',
        height:'100%',
        // justifyContent:'flex-start',
        position:'relative'

    },
    title:{
        color:'white',
        fontSize:14,
        flex: 1,
        fontWeight:'bold',
        marginRight: 5,
        // paddingBottom:30
    },
    artist:{
        color:'lightgray',
        fontSize:20
    },
    image:{
        width:imageBox,
        height:imageBox,
        paddingRight:5,
        borderRadius:5,
        marginLeft:5,
        marginTop:5,
        
    },
    noimage:{
        width:imageBox,
        height:imageBox,
        paddingRight:5,
        borderRadius:5,
        marginLeft:5,
        marginTop:5,
        backgroundColor:'grey'
    },
    icon:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        marginTop:10
       
    },
    info:{
        // position:'absolute',
        // bottom: 10,
        // alignSelf: 'flex-end',
        paddingBottom:5,
        flexDirection:'row',

    },
    episodeLength:{
        color:'white',
        fontSize: 12,
        marginLeft: 5
    },
    playArrows:{
        backgroundColor:'white',
        marginRight:5,
        marginTop:20,
        paddingBottom:10,
        width:50,
        height:50,
        borderWidth:1,
        borderColor:'white',
        borderRadius:50,
        alignItems:'center', 
        justifyContent:'center',
    },
    

})
export default styles