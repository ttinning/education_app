import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import WordService from "../../services/WordService"
import AccountService from '../../services/AccountsService'

const QuizPage = () => {

    const data = useLocation()
    const topic = data.state.topic
    const accounts = data.state.accounts

    const [questionNumber, setQuestionNumber] = useState(0);
    const [answer, setAnswer] = useState('');
    const [wordInfo, setWordInfo] = useState({});
    const [showHint, setShowHint]= useState(false);
    const [showAnswer, setShowAnswer]= useState(false);
    const [answerCorrect, setAnswerCorrect] = useState(false);
    const [randomWord, setRandomWord] = useState('')
    const [answerIncorrect, setAnswerIncorrect] = useState(false);

    useEffect(() => {
        WordService.getWordInfo(topic.word_list[questionNumber])
            .then(res => setWordInfo(res))
            // .then(letterRandomise(quizWord));
    }, [questionNumber]);

    useEffect(() => {
        if (answer === quizWord) {
            setAnswerCorrect(true)
            setAnswerIncorrect(false)
            setAnswer('')
            document.getElementById("answer-input").reset()
        } else if (answer.length === quizWord.length) {
            document.getElementById("answer-input").reset()
            setAnswerIncorrect(true)
            setAnswer('')
        }
    }, [answer])
    
    const handleNextClick = () => {
        document.getElementById("answer-input").reset()
        setQuestionNumber(questionNumber + 1)
        setShowHint(false)
        setShowAnswer(false);
        setAnswerCorrect(false);
        setAnswerIncorrect(false);
    }

    const quizWord = topic.word_list[questionNumber]

    const handleHintClick = () => {
        letterRandomise(quizWord)
        setShowHint(true);
    }

    const handleRevealClick = () => {
        setShowAnswer(true);
    }

    const letterRandomise = (quizWord) => {
        let word = quizWord;
        let shuffleWord = '';
        quizWord = quizWord.split('');
        while (quizWord.length > 0) {
            shuffleWord += quizWord.splice(quizWord.length * Math.random() << 0,1);
        }
        if (word === shuffleWord) {
            letterRandomise(quizWord)
        }
        setRandomWord(shuffleWord);
    }

    const checkAnswer = (event) => {
        setAnswer(answer.concat(event.target.value.toLowerCase()))
        // setAnswer(event.target.value.toLowerCase())
    }


    const updateAccount = () => {
        const temp = {...accounts[0]}
        temp.student.completed_topics.push(topic.title)
        delete temp._id
        AccountService.updateAccounts(accounts[0]._id, temp)
    }

    return(
        <section id="quiz-body">
            <h2>{topic.title} quiz</h2>
            
            {Object.keys(wordInfo).length > 0 ? <img src={wordInfo.definitions[0].image_url } alt={wordInfo.word}></img> : null}
            
            <button onClick={handleHintClick}>Show Hint</button>
            {showHint ? <p>{randomWord}</p> : null}

            <button onClick={handleRevealClick}>Reveal answer</button>
            {showAnswer ? <p>The answer is {wordInfo.word}</p> : null}

            

            <form id="answer-input">
                <label htmlFor="answer-box">Enter your answer here:</label>
                {quizWord.split('').map((letter) => {
                    return <input maxLength='1' id="answer-box" type="text" onChange={checkAnswer}></input>
                })}
                {/* <input id="answer-box" type="text" onChange={checkAnswer}></input> */}
            </form>

            {answerCorrect ? 
                <div>
                    <h2>CORRECT!</h2>
                    <p>{wordInfo.definitions[0].definition}</p>
                </div> : null}

            {answerIncorrect ?
                <div>
                    <h2>TRY AGAIN!</h2>
                </div> : null}

            {wordInfo.word !== topic.word_list[topic.word_list.length - 1] ? 
                <button onClick={handleNextClick}>Next</button> : 
                <Link to={`/student/${topic.title}/completed`}><button onClick={updateAccount}>Complete Topic!</button></Link>}

        </section>


    )
}

export default QuizPage