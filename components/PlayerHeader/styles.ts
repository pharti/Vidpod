import {Dimensions, StyleSheet} from 'react-native';
const { width, height } = Dimensions.get('window')
const maxWidth = 350;
const styles = StyleSheet.create({
    container:{
        // alignItems:'center',
        marginRight:20,
        marginLeft:20,
                // justifyContent:'center',
        // justifyContent:'flex-end',
        // justifyContent:'space-between',
        zIndex: 10,
        // flex:1,
        // backgroundColor:'red'
     
    },
    image:{
        width:'100%',
        // height:'80%',
        // marginRight:20,
        // marginLeft:20,
        height: 300,
        borderRadius:20,
        // flexShrink:1
        overflow:'hidden',
        marginBottom: 5,

    },
    info:{
        // width:width - 50,
        marginLeft:10,
        // alignSelf:'flex-start'
    },
    name:{
        color:'white',
        fontWeight:'bold',
        fontSize:23,
        textAlign:'left',
    },
    author:{
        color:'white',
        fontSize:16,
        // marginTop: 3,
        opacity: .7,
        textAlign:'left'
    },
    creatorContainer:{
        flexDirection:'row',
        margin:5
    },
    slider:{
        width: width-30,
        height: 10, 
        flexShrink:1,
        paddingTop: 20,
        zIndex: 10
    },
    text:{
        color:'white',
        opacity: .7
        
    },
    by:{
        margin:5,
        color:'lightgray',
        fontSize:20 
    },
    likes:{
        margin:5,
        color:'lightgray',
        fontSize:20
    },
    button:{
        backgroundColor:'#1DB954',
        height:50,
        width:150,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        // marginTop: 20,

    },
    buttonText:{
        color:'lightgray',
        fontSize:20,
    },
})
export default styles