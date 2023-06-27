import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        padding:20,
        

    },
    image:{
        width:175,
        height:175,
        margin:15,
        borderRadius: 10


    },
    name:{
        color:'white',
        fontSize:22,
        fontWeight:'bold',
        textAlign:'center'
    },
    podcast_title:{
        color:'white',
        fontSize:16,
        opacity: .7,
        textDecorationLine:'underline',
        textAlign:'center'
    },
    creatorContainer:{
        flexDirection:'row',
        margin:10
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
        marginTop: 20,

    },
    buttonText:{
        color:'lightgray',
        fontSize:20,
    },
})
export default styles