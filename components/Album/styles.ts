import {StyleSheet,Dimensions} from 'react-native';

const squareSize = 150
const { width, height } = Dimensions.get('window');
const fourthWidth = (width-80)/2;
const styles = StyleSheet.create({
    container:{
        width: fourthWidth > squareSize?squareSize: fourthWidth,
        margin:10,
        
    },
    image:{
        // maxWidth: squareSize,
        width:fourthWidth > squareSize?squareSize: fourthWidth,
        height:fourthWidth > squareSize?squareSize: fourthWidth,
        borderRadius: 10,
    },
    noimage:{
        width:fourthWidth > squareSize?squareSize: fourthWidth,
        height:fourthWidth > squareSize?squareSize: fourthWidth,
        borderRadius: 10,
        backgroundColor:'grey',
        justifyContent:'center',
        alignItems:'center'
    },
    noimagetext:{
        color:'white',
        fontSize: 14,
    },
    text:{
        color:'white',
        marginTop:5,
        fontSize: 14,
        fontWeight:'bold',
        textAlign:'center',
       
    },
    author:{
        color:'white',
        opacity: .7,
        display:'none',
        textAlign:'center',
        fontSize: 12,
        textTransform:'capitalize'
    },
    published: { paddingLeft: 5, fontSize: 10, color: 'white' },
    publishedContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:3
      }

})

export default styles;