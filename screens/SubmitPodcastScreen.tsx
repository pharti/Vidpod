import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

import useSWRNative from '@nandorojo/swr-react-native';
import { Picker } from '@react-native-picker/picker';
import ModalSelector from 'react-native-modal-selector';

const fetcher = url => fetch(url).then(res => res.json());

export const SubmitPodcastScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState();
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const pickerRef = useRef();
  function close() {
    pickerRef.current.blur();
  }
  const { data, error } = useSWRNative(
    'https://yidpod.com/wp-json/wp/v2/categories?exclude=81,97,1&orderby=count&per_page=50',
    fetcher,
  );
  let index = 1;
  const d = data
    ? data.map(c => {
        return { key: index++, label: c.name, id: c.id };
      })
    : [];
  // const data = [
  //   { key: index++, section: 'section', label: 'Red Apples' },

  //   { key: index++, label: 'Red Apples' },
  //   { key: index++, label: 'Cherries' },
  //   { key: index++, label: 'Cranberries' },
  //   { key: index++, label: 'Pink Grapefruit' },
  //   { key: index++, label: 'Raspberries' },
  //   { key: index++, label: 'Beets' },
  //   { key: index++, label: 'Red Peppers' },
  //   { key: index++, label: 'Radishes' },
  //   { key: index++, label: 'Radicchio' },
  //   { key: index++, label: 'Red Onions' },
  //   { key: index++, label: 'Red Potatoes' },
  //   { key: index++, label: 'Rhubarb' },
  //   { key: index++, label: 'Tomatoes' },
  //   { key: index++, label: 'Radishes' },
  //   { key: index++, label: 'Radicchio' },
  //   { key: index++, label: 'Red Onions' },
  //   { key: index++, label: 'Red Potatoes' },
  //   { key: index++, label: 'Rhubarb' },
  //   { key: index++, label: 'Tomatoes' },
  //   { key: index++, label: 'Radishes' },
  //   { key: index++, label: 'Radicchio' },
  //   { key: index++, label: 'Red Onions' },
  //   { key: index++, label: 'Red Potatoes' },
  //   { key: index++, label: 'Rhubarb' },
  //   { key: index++, label: 'Tomatoes' },
  //   { key: index++, label: 'Radishes' },
  //   { key: index++, label: 'Radicchio' },
  //   { key: index++, label: 'Red Onions' },
  //   { key: index++, label: 'Red Potatoes' },
  //   { key: index++, label: 'Rhubarb' },
  //   { key: index++, label: 'Tomatoes' },
  //   { key: index++, label: 'Radishes' },
  //   { key: index++, label: 'Radicchio' },
  //   { key: index++, label: 'Red Onions' },
  //   { key: index++, label: 'Red Potatoes' },
  //   { key: index++, label: 'Rhubarb' },
  //   { key: index++, label: 'Tomatoes' },
  //   { key: index++, label: 'Radishes' },
  //   { key: index++, label: 'Radicchio' },
  //   { key: index++, label: 'Red Onions' },
  //   { key: index++, label: 'Red Potatoes' },
  //   { key: index++, label: 'Rhubarb' },
  //   { key: index++, label: 'Tomatoes' },
  // ];
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Submit a Podcast</Text>

      <TextInput
        style={styles.textBox}
        placeholder="Name"
        placeholderTextColor="grey"
        autoCapitalize="words"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.textBox}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.textBox}
        placeholder="Link"
        placeholderTextColor="grey"
        value={link}
        onChangeText={text => setLink(text)}
      />
      <ModalSelector
        data={[
          { key: 0, section: 'section', label: 'Choose a category' },
          ...d,
        ]}
        initValue="Choose a category"
        supportedOrientations={['landscape', 'portrait']}
        accessible={true}
        // optionTextStyle={styles.option}
        overlayStyle={styles.overlay}
        // childrenContainerStyle={styles.option}
        // sectionStyle={styles.option}
        // contentContainerStyle={styles.option}
        // cancelStyle={styles.option}
        // optionStyle={styles.options}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={option => {
          setCategory(option.key);
        }}>
        <TextInput
          style={styles.textBox}
          editable={false}
          placeholder="Choose a category"
          value={category ? d[category].label : 'Choose a category'}
        />
      </ModalSelector>
      {/* <Picker
        ref={pickerRef}
        selectedValue={category}
        style={styles.picker}
        mode={'dialog'}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
        <Picker.Item label={'Choose a category'} value={'0'} />
        {data &&
          data.map(item => {
            return (
              <Picker.Item
                label={item.name}
                value={item.id}
                key={'i' + item.id}
              />
            );
          })}
      </Picker> */}
      <TouchableOpacity
        onPress={() => {
          let t = '';
          if (!name) {
            t += 'Please enter a name\n';
          }
          if (!email) {
            t += 'Please enter an email\n';
          }
          if (!link) {
            t += 'Please enter an rss feed link\n';
          }
          if (!category || category == '0') {
            t += 'Please choose a category\n';
          }
          if (t) {
            setText(t);
            return;
          }
          const data = {
            category: d[category].id,
            feedlink: link,
            email: email,
            name: name,
          };

          setSending(true);
          setText('');
          fetch('https://yidpod.com/wp-json/yidpod/v2/podcast/request', {
            method: 'POST',
            body: JSON.stringify({
              category: category,
              feedlink: link,
              email: email,
              name: name,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (response.status == 200) {
                setLink('');
                setName('');
                setEmail('');
                setCategory('0');
                setSending(false);
                setText('The podcast has been submitted for review.');
              }

              return response.text();
            })
            .catch(error => console.log(error));
        }}
        disabled={sending}>
        <Text style={styles.button}>
          {sending ? (
            <ActivityIndicator size={'small'} color="white" />
          ) : (
            'Submit Podcast'
          )}
        </Text>
      </TouchableOpacity>
      <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>
        {text}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topText: {
    color: 'white',
    fontSize: 20,
    marginTop: 25,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: 'white',
    width: 200,
    height: 200,
  },
  textBox: {
    textAlignVertical: 'top',
    height: 40,
    width: 300,
    padding: 10,
    marginTop: 10,
    color: 'black',
    backgroundColor: 'lightgray',
  },
  option: {
    backgroundColor: 'white',
    color: 'black',
  },
  options: {
    backgroundColor: 'white',
    color: 'black',
  },
  overlay: {
    marginTop: 10,
  },
  button: {
    fontSize: 14,
    backgroundColor: '#1DB954',
    color: 'lightgrey',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
});
