import Quizviewer from "../../../component/QuizView"


export default function Scales(){
    const quizzes=[
        {
            id: 10,
            title: "Scales, Chromatic, and Major Scales",
            question: "What is a scale in music theory?",
            answer: "A succession of pitches ascending or descending in steps."
          },
          {
            id: 11,
            title: "Scales, Chromatic, and Major Scales",
            question: "What is the pattern of whole and half steps in a major scale?",
            answer: "W-W-H-W-W-W-H."
          },
          {
            id: 12,
            title: "Scales, Chromatic, and Major Scales",
            question: "How does the chromatic scale differ from a major scale in terms of pitch organization?",
            answer: "The chromatic scale consists entirely of half steps and includes every pitch in an octave, while a major scale follows a specific whole/half step pattern and uses only seven pitch classes."
          },
          {
            id: 13,
            title: "Scale Degrees and Solfège",
            question: "What is a scale degree?",
            answer: "A pitch's position within a specific scale."
          },
          {
            id: 14,
            title: "Scale Degrees and Solfège",
            question: "What solfège syllables are typically used to represent scale degrees in movable-do solfège?",
            answer: "Do, Re, Mi, Fa, Sol, La, Ti (and variations like Le, Te in minor)."
          },
          {
            id: 15,
            title: "Scale Degrees and Solfège",
            question: "Why is movable-do solfège useful for identifying scale degrees in different keys?",
            answer: "Because it assigns solfège syllables based on function within the scale rather than fixed pitch, helping with transposition and aural training."
          },
          {
            id: 16,
            title: "Minor Scales (Natural, Harmonic, Melodic)",
            question: "What is the pattern of whole and half steps in a natural minor scale?",
            answer: "W-H-W-W-H-W-W."
          },
          {
            id: 17,
            title: "Minor Scales (Natural, Harmonic, Melodic)",
            question: "How does a harmonic minor scale differ from the natural minor scale?",
            answer: "The seventh scale degree is raised by a semitone in the harmonic minor scale."
          },
          {
            id: 18,
            title: "Minor Scales (Natural, Harmonic, Melodic)",
            question: "Why do composers modify the minor scale when writing melodies or harmonies?",
            answer: "To create stronger melodic motion or harmonic resolution, such as avoiding the augmented second between le and ti or achieving closure between ti and do."
          }
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
                <h2>Scales and Scale Degrees</h2>

                <p>A scale is a succession of pitches ascending or descending in steps. There are two types of steps: <em>half steps</em> and <em>whole steps</em>. A half step (H) consists of two adjacent pitches on the keyboard. A whole step (W) consists of two half steps. Usually, the pitches in a scale are each notated with different letter names, though this isn't always possible or desirable. </p>

                <h3>The Chromatic Scale </h3>

                <p>The chromatic scale consists entirely of half steps, and uses every pitch on the keyboard within a single octave. Here is the chromatic scale that spans the pitches C4 through C5.</p>

                <a href="/LessonImages/chromaticscale.png"><img src={'/LessonImages/chromaticscale.png'} style={{ }} alt="Illustration shows the chromatic scale spanning through pitches C4 and C5"/></a>

                <h3>The major scale </h3>

                <p>A major scale, a sound with which you are undoubtedly familiar, consists of seven whole (W) and half (H) steps in the following succession: W-W-H-W-W-W-H. The first pitch of the scale, called the <em>tonic</em>, is the pitch upon which the rest of the scale is based. When the scale ascends, the tonic is repeated at the end an octave higher.</p>

                <p>Here is the D major scale. It is called the "D major scale" because the pitch D is the <em>tonic</em> and is heard at both ends of the scale. </p>

                <a href= "/LessonImages/majorscale.png"><img src={'/LessonImages/majorscale.png'}  style={{ }} alt="The D major scale"/></a>

                <h3>Scale degrees and solfège </h3>

                <p>While ISO notation allows us to label a pitch in its specific register, it is often useful to know where that pitch fits within a given scale. For example, the pitch class D is the first (and last) note of the D-major scale. The pitch class A is the fifth note of the D-major scale. When described in this way, we call the notes <em>scale degrees</em>, because they're placed in context of a specific scale. Solfège syllables, <a href="http://en.wikipedia.org/wiki/Solfège"><u>a centuries-old method of teaching pitch and sight singing</u></a>, can also be used to represent scale degrees (when used in this way, this system is specifically called movable-<em>do</em> solfège). </p>

                <p>Scale degrees are labeled with Arabic numerals and carets (^). The illustration below shows a D-major scale and corresponding ISO notation, scale degrees, and solfège syllables.</p>

                <a href= "/LessonImages/sdsf.png"><img src="/LessonImages/sdsf.png" /></a>

                <h3>The minor scale </h3>

                <p>Another scale with which you are likely very familiar is the minor scale. There are several scales that one might describe as <em>minor</em>, all of which have a characteristic third scale degree that is lower than the one found in the major scale. The minor scale most frequently used in tonal music from the Common Practice period is based on the <em>aeolian mode</em> (you'll read more about modes later), which is sometimes referred to as the <em>natural minor</em> scale. </p>

                <p>The natural minor scale consists of seven whole (W) and half (H) steps in the following succession: W-H-W-W-H-W-W. Note the changes in solfège syllables.</p>

                <a href= "/LessonImages/sdsf-naturalMinor.png"><img src="/LessonImages/sdsf-naturalMinor.png" alt="The natural minor scale"/></a>

                <p>If you sing through the above example, you'll notice that the ending lacks the same sense of closure you heard in the major scale. This closure is created in the major scale, in part, by the ascending semitone between <em>ti</em> and <em>do</em>. Composers often want to have this sense of closure when using the minor mode, too. They're able to achieve this by applying an accidental to the seventh scale degree, raising it by a semitone. If you do this within the context of the natural minor scale, you get something called the <em>harmonic minor</em> scale.</p>

                <a href="LessonImages/sdsf-harmonicMinor.png"><img src="/LessonImages/sdsf-harmonicMinor.png" alt="The harmonic minor scale" /></a>

                <p>Now the last two notes of the scale sound much more conclusive, but you might have found it difficult to sing <em>le</em> to <em>ti</em>. When writing melodies in a minor key, composers often "corrected" this by raising <em>le</em> by a semitone to become <em>la</em> when approaching the note <em>ti</em>. When the melody descended from <em>do</em>, the closure from <em>ti</em> to <em>do</em> isn't needed; likewise, it is no longer necessary to "correct" <em>le</em>, so the natural form of the minor scale is used again. Together, these different ascending and descending versions are called the <em>melodic minor</em> scale.</p>

                <p>When ascending, the <em>melodic minor</em> scale uses <em>la</em> and <em>ti</em>.</p>

                <a href="/LessonImages?sdsf-melodicMinorASC.png"><img src="/LessonImages/sdsf-melodicMinorAsc.png" alt="The melodic minor scale when ascending" /></a>

                <p>When descending, the <em>melodic minor</em> scale uses the "natural" <em>te</em> and <em>le</em>. </p>

                <a href="/LessonImages/sdsf-melodicMinorDesc.png"><img src="/LessonImages/sdsf-melodicMinorDesc.png" alt="The melodic minor scale when descending" /></a>

                <p>Truth be told, most composers don't really think about three different "forms" of the minor scale. The <em>harmonic minor</em> scale simply represents composers' tendency to use <em>ti</em> when building harmonies that include the seventh scale degree in the minor mode. Likewise, the <em>melodic minor</em> scale is derived from composers' desire to avoid the melodic augmented second interval (more on this in the <a href ="/Lessons/Melody/Lesson1-Intervals"><u>intervals</u></a> section) between <em>le</em> and <em>ti</em> (and some chose not to avoid this!). In reality, there is only one "version" of the minor scale. Context determines when a composer might use <em>la</em> and <em>ti</em> when writing music in a minor key. </p>
                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}