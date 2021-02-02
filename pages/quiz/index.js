import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';
import database from '../../db.json';

export default function QuizDaGaleraPage() {
  return (
    <ThemeProvider theme={database.theme}>
      <QuizScreen db={database} />
    </ThemeProvider>
  );
}
