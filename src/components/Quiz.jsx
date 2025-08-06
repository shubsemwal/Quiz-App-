import React, { useEffect, useRef, useState } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);
  const option_array = [option1, option2, option3, option4];

  // Fetch quiz questions on mount
  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then((res) => res.json())
      .then((data) => {
        const formattedQuestions = data.results.map((q) => {
          const allOptions = [...q.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * 4);
          allOptions.splice(randomIndex, 0, q.correct_answer);
          return {
            question: decodeURIComponent(q.question),
            options: allOptions.map((opt) => decodeURIComponent(opt)),
            correct: randomIndex + 1,
          };
        });

        setQuestions(formattedQuestions);
        setQuestion(formattedQuestions[0]);
      })
      .catch((err) => console.error('Failed to load questions', err));
  }, []);

  const checkans = (e, ans) => {
    if (!lock) {
      if (question.correct === ans) {
        e.target.classList.add('correct');
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add('wrong');
        option_array[question.correct - 1].current.classList.add('correct');
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock) {
      if (index === questions.length - 1) {
        setResult(true);
        return;
      }

      const newIndex = index + 1;
      setIndex(newIndex);
      setQuestion(questions[newIndex]);
      setLock(false);
      option_array.forEach((option) => {
        option.current.classList.remove('wrong', 'correct');
      });
    }
  };

  const reset = () => {
    setQuestions([]);
    setIndex(0);
    setQuestion(null);
    setResult(false);
    setScore(0);
    setLock(false);
    // Refetch questions
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then((res) => res.json())
      .then((data) => {
        const formattedQuestions = data.results.map((q) => {
          const allOptions = [...q.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * 4);
          allOptions.splice(randomIndex, 0, q.correct_answer);
          return {
            question: decodeURIComponent(q.question),
            options: allOptions.map((opt) => decodeURIComponent(opt)),
            correct: randomIndex + 1,
          };
        });

        setQuestions(formattedQuestions);
        setQuestion(formattedQuestions[0]);
      });
  };

  return (
    <div className="container">
      <h1>Quiz-App</h1>
      <hr />

      {!question ? (
        <p>Loading questions...</p>
      ) : result ? (
        <>
          <h2>You scored {score} out of {questions.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {question.question}</h2>
          <ul>
            <li ref={option1} onClick={(e) => checkans(e, 1)}>{question.options[0]}</li>
            <li ref={option2} onClick={(e) => checkans(e, 2)}>{question.options[1]}</li>
            <li ref={option3} onClick={(e) => checkans(e, 3)}>{question.options[2]}</li>
            <li ref={option4} onClick={(e) => checkans(e, 4)}>{question.options[3]}</li>
          </ul>
          <button onClick={next}>Submit</button>
          <div className="index">{index + 1} of {questions.length}</div>
        </>
      )}
    </div>
  );
};

export default Quiz;
