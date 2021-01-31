import React from 'react';
import PropTypes from 'prop-types';

import db from '../db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Button from '../src/components/Button';
import ScreenStates from '../src/Model/ScreenStates';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question, index, size, onSubmit,
}) {
  const questionId = `question_${index}`;
  return (
    <Widget>
      <Widget.Header>
        <h3>{`Pergunta ${index + 1} de ${size}`}</h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;
            return (
              <Widget.Topic as="label" htmlFor={alternativeId}>
                <input
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}
          <Button type="submit">
            Confirmar
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

QuestionWidget.propTypes = {
  question: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    answer: PropTypes.number,
    alternatives: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function Quiz() {
  const [screenState, setScreenState] = React.useState(ScreenStates.LOADING);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const size = db.questions.length;
  const question = db.questions[currentQuestion];

  React.useEffect(() => setTimeout(() => setScreenState(ScreenStates.SUCCESS), 1 * 1000), []);
  function handleSubmit() {
    setCurrentQuestion(currentQuestion + 1);
    if (size === currentQuestion) setScreenState(ScreenStates.FINISH);
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === ScreenStates.LOADING && <LoadingWidget />}
        {screenState === ScreenStates.SUCCESS && (
        <QuestionWidget
          question={question}
          index={currentQuestion}
          onSubmit={handleSubmit}
          size={size}
        />
        )}
        {screenState === ScreenStates.FINISH && <h1>Terminou</h1>}
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/Josue10599/Quiz-Next.js" />
    </QuizBackground>
  );
}
