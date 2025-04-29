import Quizviewer from "../../../component/QuizView"


export default function Pitches(){
    const quizzes = [
        {
            id: 1,
            title: "The Keyboard and Enharmonic Equivalence",
            question: "What do the letter names written on a keyboard represent in music theory?",
            answer: "They represent pitch classes."
          },
          {
            id: 2,
            title: "The Keyboard and Enharmonic Equivalence",
            question: "What is enharmonic equivalence?",
            answer: "It's when two pitch classes share a key on the keyboard, like C-sharp and D-flat."
          },
          {
            id: 3,
            title: "The Keyboard and Enharmonic Equivalence",
            question: "Why might a single key have more than one pitch name, and why isn’t it necessary to know all possible names?",
            answer: "Because of enharmonic equivalence, a key can represent different pitch spellings; most contexts only require knowing one or two common names."
          },
          {
            id: 4,
            title: "Octave Designation and ISO System",
            question: "What is the ISO designation for middle C?",
            answer: "C4."
          },
          {
            id: 5,
            title: "Octave Designation and ISO System",
            question: "What does a pitch-class plus a register represent?",
            answer: "A specific pitch."
          },
          {
            id: 6,
            title: "Octave Designation and ISO System",
            question: "Explain why the octave begins on C and ends on B, and how this affects pitch naming in scales.",
            answer: "The ISO system counts from C to B, so a scale ascending from C4 goes through C4, D4, ..., B4, then C5. This affects pitch naming because B4 is still in the C4 octave."
          },
          {
            id: 7,
            title: "Staff Pitches and Accidentals",
            question: "What pitches are found on the alto staff between F3 and G4?",
            answer: "F3, G3, A3, B3, C4, D4, E4, F4, G4."
          },
          {
            id: 8,
            title: "Staff Pitches and Accidentals",
            question: "How are accidentals written in full pitch designation?",
            answer: "The accidental comes before the octave number (e.g., C-sharp4)."
          },
          {
            id: 9,
            title: "Staff Pitches and Accidentals",
            question: "Why is B3 not considered the same pitch as C-flat4, even though they sound the same?",
            answer: "They are enharmonic equivalents; their notation differs due to context even though their sound is identical."
          }
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div " >
                <h2>Pitches and Octave Designations</h2>

                <h3>The Keyboard </h3>
                
                <p>The keyboard is great for helping you develop a visual, aural, and tactile understanding of music theory. On the illustration below, the <em>pitch-class</em> letter names are written on the keyboard. </p>

                <a href="/LessonImages/keyboardlayout-small.png"><img src={'/LessonImages/keyboardlayout-small.png'} style={{ width: '50%', height: '50%' }} alt="The picture shows musical note relationships: C# is OF D, D# is OF B, E is F, G, A, F# is OF G, G# is OF A, A# is OF B, C is OF B#"/></a>

                <h3>Enharmonic equivalence </h3>

                <p>Notice that some of the keys have two names. When two pitch classes share a key on the keyboard, they are said to have <em>enharmonic equivalence</em>. Theoretically, each key could have several names (the note C could also be considered D&#9837;&#9837;, for instance), but it's usually not necessary to know more than two enharmonic spellings. </p>

                <h3>Octave Designation </h3>

                <p>When specifying a particular pitch precisely, we also need to know the <em>register</em>. In fact, if all you have is C-sharp or B-flat, you do not have a <em>pitch</em>, you have a <em>pitch-class</em>. A pitch-class plus a register together designate a specific pitch. </p>

                <p>We will follow the International Standards Organization (ISO) system for register designations. In that system, middle C (the first ledger line above the bass staff or the first ledger line below the treble staff) is C4. An octave higher than middle C is C5, and an octave lower than middle C is C3. </p>

                <p>The tricky bit about this system is that the octave starts on C and ends on B. So an ascending scale from middle C contains the following pitch designations: </p>

                <a href="/LessonImages/C4toC5.png"><img src={'/LessonImages/C4toC5.png'} style={{ width: '80%' }} alt="The picture shows the ascending scale from middle C that left to right are C4, D4, E4, F4, G4, A4, B4, and C5"/></a>

                <p>And a descending scale from middle C contains the following pitch designations: </p>

                <a href="/LessonImages/C4toC3.png"><img src={'/LessonImages/C4toC3.png'} style={{ width: '80%' }} alt="The picture shows the descending scale from middle C that left to right are C4, B3, A3, G3, F3, E3, D3, and C3" /></a>

                <p>Pitches on the alto staff are as follows: </p>

                <a href="/LessonImages/F3toG4-alto.png"><img src={'/LessonImages/F3toG4-alto.png'} style={{ width: '80%' }} alt="The picture shows the ascending pitches on alto staff that are F3, G3, A3, B3, C4, D4, E4, F4, and G4"/></a>

                <p>Pitches on the tenor staff are as follows:</p>

                <a href="/LessonImages/pitchesTenor.png"><img src={'/LessonImages/pitchesTenor.png'} style={{ width: '80%' }} alt="The picture shows the ascending pitches on the tenor staff that are D3, E3, F3, G3, A3, B3, C4, and D4"/></a>

                <p>Any accidentals follow the octave designation of the natural pitch with the same generic name. Thus a half step below C4 is C-flat4 (even though it sounds the same as B3), and a half step above C4 is C-sharp4. </p>

                <p>Note that a complete designation contains both the pitch-class name (a letter name plus an optional sharp or flat) and the register (the ISO number indicating the octave in which the pitch is found). Unless both are present, you do not have the full designation of a specific pitch.</p>
                <Quizviewer quizzes={quizzes}/>            
            </div>
        </main>

    );
}