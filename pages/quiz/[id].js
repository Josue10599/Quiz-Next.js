import React from 'react';
import PropTypes, { string } from 'prop-types';

import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

export default function QuizDaGaleraPage({ dbExterno }) {
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen db={dbExterno} />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');

  try {
    const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
      .then((respostaDoServer) => {
        if (respostaDoServer.ok) {
          return respostaDoServer.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto);
    return {
      props: {
        dbExterno,
      },
    };
  } catch (err) {
    throw new Error(err);
  }
}

QuizDaGaleraPage.propTypes = {
  dbExterno: PropTypes.shape({
    bg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      answer: PropTypes.number.isRequired,
      alternatives: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    external: PropTypes.arrayOf(string).isRequired,
    theme: PropTypes.shape({
      colors: PropTypes.shape({
        primary: PropTypes.string.isRequired,
        secondary: PropTypes.string.isRequired,
        mainBg: PropTypes.string.isRequired,
        contrastText: PropTypes.string.isRequired,
        wrong: PropTypes.string.isRequired,
        success: PropTypes.string.isRequired,
      }).isRequired,
      borderRadius: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
