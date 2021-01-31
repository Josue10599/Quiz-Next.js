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
import QuestionState from '../src/Model/QuestionState';
import AlternativesForm from '../src/components/AlternativeForm';

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

function FinishedWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        <h1>Parabéns você terminou!</h1>
      </Widget.Header>
      <Widget.Content>
        <h3>
          {`Você acertou ${results.filter((i) => i).length}!`}
        </h3>
        <ul>
          {results.map((result, index) => (
            <li>{`#${index + 1} Resultado: ${result === true ? 'Acertou' : 'Errou'}`}</li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

FinishedWidget.propTypes = {
  results: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

function QuestionWidget({
  question,
  index,
  size,
  addResult,
  onSubmit,
}) {
  const questionId = `question_${index}`;
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [questionState, setQuestionState] = React.useState(QuestionState.DEFAULT);

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
        <AlternativesForm
          onSubmit={(e) => {
            e.preventDefault();
            const result = selectedAlternative === question.answer;
            setQuestionState(result ? QuestionState.CORRECT : QuestionState.ERROR);
            setTimeout(() => {
              addResult(result);
              onSubmit();
              setQuestionState(QuestionState.DEFAULT);
              setSelectedAlternative(undefined);
            }, 1 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={selectedAlternative === alternativeIndex}
                data-status={questionState}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={selectedAlternative === undefined}>
            Confirmar
          </Button>
        </AlternativesForm>
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
  addResult: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function Quiz() {
  const [screenState, setScreenState] = React.useState(ScreenStates.LOADING);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [results, setResults] = React.useState([]);
  const size = db.questions.length;
  const question = db.questions[currentQuestion];

  function addResult(result) {
    setResults([...results, result]);
  }

  React.useEffect(() => setTimeout(() => setScreenState(ScreenStates.SUCCESS), 1 * 1000), []);
  function handleSubmit() {
    const nextQuestion = currentQuestion + 1;
    if (size === nextQuestion) setScreenState(ScreenStates.FINISH);
    else setCurrentQuestion(nextQuestion);
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === ScreenStates.LOADING && <LoadingWidget />}
        {screenState === ScreenStates.FINISH && <FinishedWidget results={results} />}
        {screenState === ScreenStates.SUCCESS && (
        <QuestionWidget
          question={question}
          index={currentQuestion}
          onSubmit={handleSubmit}
          addResult={addResult}
          size={size}
        />
        )}
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/Josue10599/Quiz-Next.js" />
    </QuizBackground>
  );
}
