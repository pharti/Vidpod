import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        padding:10,
        
    },
    image:{
        width:150,
        height:150,
        borderRadius: 10,
    },
    noimage:{
        width:100,
        height:100,
        borderRadius: 10,
        backgroundColor: 'grey'
    },
    textinput:{
        height: 40,
        width: 200,
        color: 'black',
        // paddingLeft: 10,
        backgroundColor: 'white',
      },
      clicked:{
        padding: 5
      },

    name:{
        color:'white',
        // flex: 1,
        fontSize:18,
        fontWeight:'bold',
        // lineHeight: 1.1
        // letterSpacing: .5
    },
    author:{
        color:'white',
        // flex: 1,
        fontSize:12,
        marginTop: 0,
        
    
    },
    creatorContainer:{
        flexDirection:'row',
        margin:10
    },
    by:{
        margin:5,
        color:'white',
        fontSize:20 
    },
    likes:{
        margin:5,
        color:'white',
        fontSize:20
    },
    button:{
        backgroundColor:'#1DB954',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom:10,
        marginLeft: 10,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText:{
        
        color:'#F1F1F1',
        fontSize:15,
        // letterSpacing:1.2,
        // fontWeight:'bold',
        // te
        // textTransform:'uppercase'
    },
    shareButton:{
        marginLeft:0
    },
    buttonsContainer:{
        paddingRight: 10,
        paddingLeft: 10,
        flex:1,
        marginTop:10,
        
        
    },
    rightContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        flex: 1

    },
    bellButton:{
        marginLeft:15,

    }
})
export default styles