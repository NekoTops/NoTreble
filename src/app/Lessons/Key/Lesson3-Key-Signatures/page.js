import Quizviewer from "../../../component/QuizView"


export default function Key(){

    const quizzes=[
        {
            id: 19,
            title: "Purpose of Key Signatures",
            question: "Why do composers use key signatures?",
            answer: "To avoid writing out accidentals repeatedly and to indicate which notes are consistently sharp or flat."
          },
          {
            id: 20,
            title: "Purpose of Key Signatures",
            question: "How does a key signature help a performer reading a melody?",
            answer: "It tells the performer which pitch classes are sharp or flat throughout the piece, reducing clutter in notation."
          },
          {
            id: 21,
            title: "Purpose of Key Signatures",
            question: "How would a melody in D major be affected if no key signature were used?",
            answer: "The notes F and C would need to be marked with accidentals every time, making the score harder to read and write."
          },
          {
            id: 22,
            title: "Circle of Fifths & Mnemonics",
            question: "What is the circle of fifths used for?",
            answer: "To identify the key signature of any major or minor key with up to seven sharps or flats."
          },
          {
            id: 23,
            title: "Circle of Fifths & Mnemonics",
            question: "What is the mnemonic device for the order of sharps and flats?",
            answer: "Father Charles Goes Down And Ends Battle."
          },
          {
            id: 24,
            title: "Circle of Fifths & Mnemonics",
            question: "How do you use the mnemonic to identify flats in A-flat major?",
            answer: "Read the mnemonic backwards to get: B, E, A, D — the four flats in A-flat major."
          },
          {
            id: 25,
            title: "Minor Keys & Clef Usage",
            question: "What is a relative key?",
            answer: "A major and minor key that share the same key signature."
          },
          {
            id: 26,
            title: "Minor Keys & Clef Usage",
            question: "What is the relative minor of C major, and how many accidentals do they have?",
            answer: "A minor is the relative minor of C major, and both have no sharps or flats."
          },
          {
            id: 27,
            title: "Minor Keys & Clef Usage",
            question: "How does knowing key signatures across clefs (e.g. treble, bass, alto, tenor) help musicians?",
            answer: "It allows performers and composers to correctly write and interpret music regardless of the clef, ensuring accurate pitch reading across different instruments and voices."
          }
    ];


    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >

            <h2>Key Signatures</h2>

            <p>When you're writing in a single key for an extended period of time, it gets tedious to write out the accidentals over and over again. </p>

            <p>Here is a simple melody in D major, without a key signature. </p>

            <a href="/LessonImages/melodyWithoutKS.png"><img src="/LessonImages/melodyWithoutKS.png"/></a>

            <p>To avoid this, composers used <em>key signatures</em> at the beginning of each staff to remind performers of which pitch classes should have flats or sharps. </p>

            <p>Here is the same melody, with the key signature at the beginning of the staff to remind the performer that F and C should be sharp. </p>

            <a href="/LessonImages/melodyWithKS.png"><img src="/LessonImages/melodyWithKS.png"/></a>

            <h3>The circle of fifths </h3>

            <p>The circle of fifths is an illustration that has been used in music theory pedagogy for hundreds of years. It conveniently summarizes the key signature needed for any key with up to seven flats or sharps. </p>

            <a href="/LessonImages/circleOfFifths.png"><img src="/LessonImages/circleOfFifths.png" width="65%"/></a>

            <p>But <em>which</em> notes are flat or sharp in a key? To properly use the circle of fifths to figure out a key signature, you'll need to also remember this mnemonic device, which tells you the order of flats and sharps:</p>

            <p><strong>F</strong>ather <strong>C</strong>harles <strong>G</strong>oes <strong>D</strong>own <strong>A</strong>nd <strong>E</strong>nds <strong>B</strong>attle. </p>

            <p>For sharp keys (clockwise on the circle of fifths), read the mnemonic device forward. For example, the circle of fifths tells us that there are 3 sharps in the key of A major. Which three notes are sharp? The first three notes in the mnemonic device: F(ather), C(harles), and G(oes). </p>

            <p>For flat keys (counter-clockwise on the circle of fifths), read the mnemonic device backwards. For example, the circle of fifths tells us that the key of A-flat major has four flats. Which flats? Reading backwards: B(attle), E(nds), A(nd), D(own). </p>

            <h3>Minor key signatures </h3>

            <p>Of course, minor keys can use key signatures, too. In fact, for each major key signature, there is a corresponding minor key that shares its signature. Major and minor keys that share the same key signature are called <em>relative</em> keys. For example, both C major and A minor have zero sharps or flats. A minor is considered the <em>relative minor</em> of C major; likewise, C major is considered the <em>relative major</em> of A minor. Compare the minor key circle of fifths below with the major key circle of fifths above, and you'll see the remaining relative key pairs. </p>

            <a href="/LessonImages/circleOfFifths-minor.png"><img src="/LessonImages/circleOfFifths-minor.png" width="65%"/></a>

            <h3>Writing key signatures </h3>

            <p>Below is a reference that shows how all of the key signatures should be written on treble, alto, tenor, and bass clefs. </p>

            <a href="/LessonImages/sharpsTreble.png"><img src="/LessonImages/sharpsTreble.png"/></a>
            <a href="/LessonImages/sharpsAlto.png"><img src="/LessonImages/sharpsAlto.png"/></a>
            <a href="/LessonImages/sharpsTenor.png"><img src="/LessonImages/sharpsTenor.png"/></a>
            <a href="/LessonImages/sharpsBass.png"><img src="/LessonImages/sharpsBass.png"/></a>
            <a href="/LessonImages/flatsTreble.png"><img src="/LessonImages/flatsTreble.png"/></a>
            <a href="/LessonImages/flatsAlto.png"><img src="/LessonImages/flatsAlto.png"/></a>
            <a href="/LessonImages/flatsTenor.png"><img src="/LessonImages/flatsTenor.png"/></a>
            <a href="/LessonImages/flatsBass.png"><img src="/LessonImages/flatsBass.png"/></a>

            <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}