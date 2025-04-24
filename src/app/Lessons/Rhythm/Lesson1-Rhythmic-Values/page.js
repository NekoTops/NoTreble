import Quizviewer from "../../../component/QuizView"

export default function Rhythm(){
    const quizzes=[
        {
            id: 1,
            title: "Rhythmic Values",
            question: "What do rhythm and durations in music represent?",
            answer: "The combination of long and short durations in time."
          },
          {
            id: 2,
            title: "Rhythmic Values",
            question: "What visual characteristics differentiate unfilled and filled noteheads?",
            answer: "Unfilled noteheads can have or lack stems; filled noteheads always have stems."
          },
          {
            id: 3,
            title: "Rhythmic Values",
            question: "How does adding flags to a filled notehead affect its duration?",
            answer: "Each flag halves the duration of the note."
          },
          {
            id: 4,
            title: "Rests",
            question: "What do rests represent in music notation?",
            answer: "Silence."
          },
          {
            id: 5,
            title: "Rests",
            question: "How do rests relate to note durations?",
            answer: "Each note duration has a matching rest with the same time value."
          },
          {
            id: 6,
            title: "Rests",
            question: "Why is it important that each duration has a corresponding rest?",
            answer: "To accurately represent rhythmic timing, including periods of silence."
          },
          {
            id: 7,
            title: "Dots and Ties",
            question: "What does a dot do to a note or rest?",
            answer: "It increases the duration by half."
          },
          {
            id: 8,
            title: "Dots and Ties",
            question: "What is the difference in beat division between undotted and dotted notes?",
            answer: "Undotted notes divide into two; dotted notes divide into three."
          },
          {
            id: 9,
            title: "Dots and Ties",
            question: "How would you notate a note that lasts longer than one measure?",
            answer: "Use a tie to connect the note across measures."
          },
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
                
                <h2>Rhythmic values</h2>

                <p>Rhythm refers to the combination of long and short durations in time. Durations are notated with either unfilled or filled noteheads. Unfilled noteheads can appear with or without a stem; filled noteheads always appear with a stem. Flags can be added to the stems of filled noteheads; each flag shortens the duration by half. </p>

                <a href="/LessonImages/durations.png"><img src="/LessonImages/durations.png" alt='Image shows musica symbol notes arranged vertically with their names. From top to bottom is Whole, half, quarter, eighth, sixteenth, and thirty-second.' width="60%"/></a>
                <h3>Rests</h3>

                <p>Rests represent silence in musical notation. For each durational symbol there exists a corresponding rest. </p>

                <a href="/LessonImages/rests.png"><img src="/LessonImages/rests.png" alt='Image shows each corresponding rest next to its name. It is ordered vertically. From top to bottom is whole, half, quarter, eighth, sixteenth, and thirty second.' width="60%"/></a>
                <h3>Dots and ties</h3>

                <p>Dots and ties allow for basic durations to be lengthened. A dot occurs after a pitch or a rest, and it increases its duration by half. For example, if a quarter note is equivalent in duration to two eighth notes, a dotted quarter note would be equivalent to <em>three</em> eighth notes. Generally, undotted notes divide into two notes; dotted notes divide into three. Thus, undotted notes are typically used to represent the beat level in simple meter, while dotted notes are used to represent the beat in compound meter.</p>

                <p>Multiple dots can be added to a duration. Subsequent dots add half the duration of the previous dot. For example, a quarter note with two dots would be equivalent in duration to a quarter, eighth, and sixteenth note. </p>

                <a href="/LessonImages/dots.png"><img src="/LessonImages/dots.png" alt='Image shows the equivalence of notes using equations. A half note with a dot is equal to a half note and quarter note added. a quarter note with one dot is equal to a quarter note and an eighth note added. And a quarter note with two dots is equal to quarter note added with an eighth and sixteenth note.' width="50%"/></a>

                <p>A <em>tie</em> lengthens a duration by connecting two adjacent identical pitches. Ties are used to either sustain a pitch beyond the length of a single measure, or to make a particular rhythmic grouping in a measure more clear. </p>

                <p>In the example below, the duration of the first pitch is longer than a single measure, so it is represented by tying the dotted half note, which lasts the full measure, to the first beat of the subsequent measure. </p>

                <a href="/LessonImages/ties.png"><img src="/LessonImages/ties.png" alt='Image shows that the duration of the first pitch is longer than a single measure and thereofre is representeed by tying the dotted half note. ' width="50%"/></a>

                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}