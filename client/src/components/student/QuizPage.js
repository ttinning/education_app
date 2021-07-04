import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import WordService from "../../services/WordService"

const QuizPage = () => {

    const data = useLocation()
    const topic = data.state.topic

    const [questionNumber, setQuestionNumber] = useState(0);
    const [answer, setAnswer] = useState("");
    const [wordInfo, setWordInfo] = useState({});
    const [showHint, setShowHint]= useState(false);

    useEffect(() => {
        WordService.getWordInfo(topic.word_list[questionNumber])
            .then(res => setWordInfo(res))
    }, [questionNumber]);
    
    const handleNextClick = () => {
        document.getElementById("answer-input").reset()
        setQuestionNumber(questionNumber + 1)
        setShowHint(false)
    }

    const handleHintClick = () => {
        setShowHint(true);
    }

    const quizWord = topic.word_list[questionNumber]

    const letterRandomise = (quizWord) => {
        let shuffleWord = '';
        quizWord = quizWord.split('');
        while (quizWord.length > 0) {
            shuffleWord += quizWord.splice(quizWord.length * Math.random() << 0,1);
        }
        return shuffleWord;
    }

    const randomWord = letterRandomise(quizWord)

    const handleSubmit = (quizWord) => {
        if (answer == quizWord) {
            console.log('correct')
        }
    }

    const checkAnswer = (event) => {
        setAnswer(event.target.value.toLowerCase())
    }

    return(
        <div>
            <h2>{topic.title} quiz</h2>
            <p>{topic.word_list[questionNumber]}</p>
            {Object.keys(wordInfo).length > 0 ? 
            <div>
                <img src={wordInfo.definitions[0].image_url } alt={wordInfo.word}></img> 
                <p>{wordInfo.definitions[0].definition}</p>
            </div>
            : null}
            <button onClick={handleHintClick}>Show Hint</button>
            {showHint ? <p>{letterRandomise(quizWord)}</p> : null}
            <form id="answer-input" onSubmit={handleSubmit(quizWord)}>
                <input type="text" onChange={checkAnswer}></input>
            </form>
            {wordInfo.word === topic.word_list[-1] ? <button>Complete Topic!</button> : <button onClick={handleNextClick}>Next</button> }
        </div>


    )
}

export default QuizPage