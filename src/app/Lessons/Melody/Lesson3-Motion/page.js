import Quizviewer from "../../../component/QuizView"

export default function Motion(){

     const quizzes=[
        {
            id: 14,
            title: "Introduction + Parallel Motion",
            question: "How many types of contrapuntal motion are there?",
            answer: "Four types."
          },
          {
            id: 15,
            title: "Introduction + Parallel Motion",
            question: "What defines parallel motion in music theory?",
            answer: "Both voices move in the same direction by the same generic interval."
          },
          {
            id: 16,
            title: "Introduction + Parallel Motion",
            question: "Why do both dyads in parallel motion form the same generic interval?",
            answer: "Because the voices move by identical intervals in the same direction, preserving the interval type between them."
          },
          {
            id: 17,
            title: "Similar (Direct) Motion and Contrary Motion",
            question: "What is another name for similar motion?",
            answer: "Direct motion."
          },
          {
            id: 18,
            title: "Similar (Direct) Motion and Contrary Motion",
            question: "How does similar motion differ from parallel motion?",
            answer: "In similar motion, both voices move in the same direction but by different intervals."
          },
          {
            id: 19,
            title: "Similar (Direct) Motion and Contrary Motion",
            question: "What does the change in interval type between dyads indicate in similar motion?",
            answer: "That the voices are not maintaining the same intervallic relationship and are moving by unequal distances."
          },
          {
            id: 20,
            title: "Contrary Motion and Oblique Motion",
            question: "What is contrary motion?",
            answer: "When two voices move in opposite directions—one up, one down."
          },
          {
            id: 21,
            title: "Contrary Motion and Oblique Motion",
            question: "How is oblique motion different from contrary motion?",
            answer: "In oblique motion, one voice stays the same while the other moves; in contrary motion, both voices move but in opposite directions."
          },
          {
            id: 22,
            title: "Contrary Motion and Oblique Motion",
            question: "Why might a composer use oblique motion in voice-leading?",
            answer: "To maintain stability or emphasis in one voice while allowing movement or melodic development in the other."
          }
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
                
                <h2>Types of contrapuntal motion</h2>

                <p>There are four types of contrapuntal motion between two musical lines. Differentiating these four types of motion is essential to generating good voice-leading, both strict and free.</p>

                <p>In <em>parallel motion</em>, two voices move in the same direction by the same generic interval. For example, the following two voices both move up by a step. Note also that both dyads form the same generic interval (sixth). This will always be true when two voices move in parallel motion.</p>

                <a href="/LessonImages/parallel.png"><img src={'/LessonImages/parallel.png'} alt='Example of parallel motion: C–A to D–B.' style={{ }}/></a>

                <p>In <em>similar motion</em>, also called <em>direct motion</em>, two voices move in the same direction, but by different intervals. For example, the following two voices both move down, but the upper voice moves by step while the lower voice moves by leap. Note also that the two dyads are different generic intervals. This will always be the case with similar or direct motion.</p>

                <a href="/LessonImages/similar.png"><img src={'/LessonImages/similar.png'} alt='Example of similar motion: C–G to A–F.' style={{ }}/></a>

                <p>In <em>contrary motion</em>, two voices move in opposite directions—one up, the other down.</p>

                <a href="/LessonImages/contrary.png"><img src={'/LessonImages/contrary.png'} alt='Example of contrary motion: C–E to A–F.' style={{ }}/></a>

                <p>In <em>oblique motion</em>, one voice is stationary, while the other voice moves (in either direction). The stationary tone may or may not be rearticulated.</p>

                <a href="/LessonImages/oblique1.png"><img src={'/LessonImages/oblique1.png'} alt='Example of oblique motion: C–G to B–G.' style={{ }}/></a>  
                <p>or  </p>
                <a href="/LessonImages/oblique2.png"><img src={'/LessonImages/oblique2.png'} alt='Example of oblique motion: C–G to B–G.' style={{ }}/></a>

                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}