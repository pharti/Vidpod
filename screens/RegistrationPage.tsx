import * as React from 'react';
import { StyleSheet, TextInput,Button } from 'react-native';
import { Text, View} from '../components/Themed';


export default function RegistrationScreen() {
    const login = 1
  const [email,setEmail] = React.useState<string>('') 
  const [password,setPassword] = React.useState<string>('') 
  const [confirm, setConfirm]  = React.useState<string>('')
  // const [login, setLogin] = React.useState<boolean>(false)


  React.useEffect(()=>{
  },[login])
  return (
    <View style={styles.container}>
        <TextInput  
            style = {{
              marginTop:20,
              height:50,
              width:'100%',
              color:"black",
              backgroundColor:'lightgray',

            }}
            placeholder="Email"
            onChangeText={text=>setEmail(text)}/>
        <TextInput  
            style = {{
              marginTop:20,
              height:50,
              width:'100%',
              color:"black",
              backgroundColor:'lightgray',
              
            }}
            placeholder="First Name"
            onChangeText={text=>setEmail(text)}/>
        <TextInput  
            style = {{
              marginTop:20,
              height:50,
              width:'100%',
              color:"black",
              backgroundColor:'lightgray',
              
            }}
            placeholder="Last Name"
            onChangeText={text=>setEmail(text)}/>
        <TextInput  
            style = {{
                marginTop:20,
                height:50,
                width:'100%',
                color:"black",
                backgroundColor:'lightgray'
            }}
            placeholder="Enter Password"
            onChangeText={text=>setPassword(text)}
            secureTextEntry/>
      <TextInput  
            style = {{
                marginTop:20,
                height:50,
                width:'100%',
                color:"black",
                backgroundColor:'lightgray'
            }}
            placeholder="Confirm Password"
            onChangeText={text=>setConfirm(text)}
            secureTextEntry/>
        <Text>
        hello
        </Text>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    height:'100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  loginButton:{
    paddingTop:30,
    width:'100%',
  },
}
)