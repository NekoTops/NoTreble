import QuizCard from "../component/QuizCard"
import "../cs/Quiz.css"

function Quizviewer({quizzes}){

    return(
        <div className="quiz-viewer">
            <div className="quiz-container">
            <h3>Quiz</h3>
                {quizzes.map(quiz =>(
                <QuizCard quiz={quiz} key={quiz.id}/>
            ))}
            </div>
        </div>
    )
}
export default Quizviewer