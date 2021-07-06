import { useDrag } from 'react-dnd';

export const WordDrag = function WordBox({ word, incrementScore, wordId }) {

    

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "Word",
        item: { word },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                // alert(`You dropped ${word} into ${dropResult.name}!`);
                isCorrect(word, dropResult);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));

    const isCorrect = (word, dropResult) => {
        if (word === dropResult.name) {
            // alert("Correct!")
            incrementScore()
            console.log(dropResult)
            document.querySelector(`#word${wordId}`).remove()
            document.querySelector(`#${word}`).style.backgroundColor = "green";
            document.querySelector(`#${word}`).style.color = "white";
            const correctAnswer = document.createElement('b')
            correctAnswer.textContent = ` Correct! This is a ${word}`
            document.querySelector(`#${word}`).appendChild(correctAnswer);
        } else {
            document.querySelector(`#${dropResult.name}`).style.animation = "shake 0.5s"
            setTimeout(() => {  document.querySelector(`#${dropResult.name}`).removeAttribute('style')}, 1000)
        }
        // word === dropResult.name ? alert("Correct!") : null;
    }
    

    const opacity = isDragging ? 0 : 1;
    return (<li className="dnd-word" id={`word${wordId}`} ref={drag} style={{opacity}} role='Word'>{word}</li>);

};