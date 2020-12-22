import React, {useEffect, useState} from 'react';
import deezer from '../api/deezer';

export default () => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const searchApi = async (searchTerm) => {
    console.log('hi there');
    try {
      const response = await deezer.get('/search', {
        params: {
          q: searchTerm,
          limit: 8,
        },
      });
      setResults(response.data.data);
      // console.log(results);
    } catch (err) {
      setErrorMessage('Something went haywire!');
    }
  };

  useEffect(() => {
    searchApi('');
  }, []);

  return [searchApi, results, errorMessage];
};
