import React, { lazy, useEffect, useState, Suspense } from 'react';
const ReactMarkdown = lazy(() => import('react-markdown'));

function Fallback() {
  return (
    <div>
      Carregando edital...
    </div>
  )
}

function App() {
  const EDITAIS_BASE_URL = '/editais';
  const [listOfEditais, setListOfEditais] = useState([]);

  const fetchListOfEditais = async () => await ((await fetch(EDITAIS_BASE_URL)).json());

  const fetchEdital = async editais => {
    const requestPromises =
      await Promise
        .allSettled(
          editais.map(link => fetch(`${EDITAIS_BASE_URL}/${link}`))
        )
        .then(rawPromises => rawPromises.map(({value}) => value.text()));

      return Promise
        .allSettled(requestPromises)
        .then(quotePromises => quotePromises.map(({value}) => value));
  };

  useEffect(() => {
    (async () => {
      const listOfLinks = await fetchListOfEditais();

      setListOfEditais(
        await fetchEdital(listOfLinks),
      );
    })();
  }, []);

  return (
    <>
      {
        listOfEditais.map((edital, i) => (
          <Suspense fallback={<Fallback />}>
            <ReactMarkdown source={edital} />
          </Suspense>
        ))
      }
    </>
  );
}

export default App;
