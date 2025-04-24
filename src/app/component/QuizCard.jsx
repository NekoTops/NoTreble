"use client"
import "../cs/Quiz.css"
import {useState} from "react"

function QuizCard({quiz}) {
    const [showAns, setShowAns] = useState(false);
    function onCardClick(e) {
        e.preventDefault()
        if (!showAns) setShowAns(true);
        else setShowAns(false);
    }

    return <div className="quiz-card">
        <div className="quiz-poster">
            <div className="quiz-info">
                <h3 className={showAns ? "hideme" : "showme"}>{quiz.title}</h3>
                <p className={showAns ? "hideme" : "showme"}>{quiz.question}</p>
                <p className={showAns ? "showme" : "hideme"}>{quiz.answer}</p>
            </div>
            <button className="quiz-btn btn-primary " onClick={onCardClick}>
                    Show Answer
            </button>
        </div>
    </div>
}

export default QuizCard