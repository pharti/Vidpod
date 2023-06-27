import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { offlineSelector, setTerms } from '../../features/offlineSlice';
import { SeeMore } from '../AlbumCategory/SeeMore';
import SpecialCategory from './SpecialCategory';

export const SpecialCategories = props => {
  const mounted = useRef(true);
  const dispatch = useDispatch();
  const offline = useSelector(offlineSelector);
  const terms = offline.terms;
  const getting = useRef(false);
  const isFocussed = useIsFocused();
  const getTerms = async () => {
    if (getting.current) {
      return;
    }
    getting.current = true;
    const url = 'https://yidpod.com/wp-json/yidpod/v1/getterms';
    fetch(url, {
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(t => t.json())
      .then(t => {
        if (t && mounted.current) {
          dispatch(setTerms(t));
        }
      })
      .catch(error => {});
  };
  useEffect(() => {
    mounted.current = true;
    if (isFocussed && !getting.current) {
      getTerms();
    }

    return () => {
      mounted.current = false;
    };
  }, [isFocussed]);
  useEffect(() => {
    if (props.refreshing && !getting.current) {
      getTerms();
    }
  }, [props.refreshing]);
  return (
    <View>
      {terms &&
        Object.keys(terms).map(term => {
          return (
            <SpecialCategory
              term={term}
              key={term}
              terms={terms[term].split(',')}
            />
          );
        })}
    </View>
  );
};
