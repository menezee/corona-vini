import React, { useEffect, useState} from 'react'
import {Accordion, Icon} from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown';

export default function () {
  const EDITAIS_BASE_URL = 'https://api.github.com/repos/Suprimentos-Covid-19-BR/SiteAgregador/contents';
  const [editalLinks, setEditalLinks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [editalMap, setEditalMap] = useState(new Map());

  const fetchListOfEditais = async () => (await ((await fetch(EDITAIS_BASE_URL)).json())).map(({ download_url }) => download_url);

  useEffect(() => {
    (async () => {
      setEditalLinks(
        await fetchListOfEditais(),
      );
    })();
  }, []);

  const handleClick = async (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    const markdown = editalMap.get(index) ?? await ((await fetch(editalLinks[index])).text());

    setEditalMap(m => (
      new Map([...m.entries(), [index, markdown]])
    ));

    setActiveIndex(newIndex);
  };

  return (
    <Accordion fluid styled>
      {
        editalLinks.map((link, i) => (
          <>
            <Accordion.Title
              active={activeIndex === i}
              index={i}
              onClick={handleClick}
            >
              <Icon name='dropdown'/>
              {link}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === i}>
              <ReactMarkdown source={editalMap.get(i)} />
            </Accordion.Content>
          </>
        ))
      }
    </Accordion>
  )
}
