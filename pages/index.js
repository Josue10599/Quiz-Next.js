import React from 'react';
import { useRouter } from 'next/router';

import db from '../db.json';
import Link from '../src/components/Link';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <form onSubmit={function submitName(e) {
              e.preventDefault();
              router.push(`/quiz?name=${name}`);
            }}
            >
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="Qual é o seu nome?"
                name="nomeDoUsuario"
                value={name}
              />
              <Button type="submit" disabled={name.length === 0}>
                {`Vamos Jogar ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>Quiz da Galera</h1>
            <ul>
              {db.external.map((url) => {
                const [projectName, githubUser] = url.replace(/(h)\w+\W+/, '').replace(/(.v)\w+(.)+\w\//, '').split('.');
                return (
                  <li key={url}>
                    <Widget.Topic
                      as={Link}
                      href={`/quiz/${projectName}___${githubUser}?name=${name}`}
                      disabled={name.length === 0}
                    >
                      {`${githubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                );
              })}
            </ul>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/Josue10599/Quiz-Next.js" />
    </QuizBackground>
  );
}
