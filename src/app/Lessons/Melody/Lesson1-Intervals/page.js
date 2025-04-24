import Quizviewer from "../../../component/QuizView"

export default function Intervals(){

    const quizzes=[
        {
            id: 1,
            title: "Intervals and Dyads Introduction",
            question: "What is a dyad in music?",
            answer: "A dyad is a pair of pitches sounding together, essentially a two-note chord."
          },
          {
            id: 2,
            title: "Intervals and Dyads Introduction",
            question: "What is the difference between an interval and a dyad?",
            answer: "An interval refers to the distance between two pitches, while a dyad is a pair of pitches sounding together, often referred to by the interval between them."
          },
          {
            id: 3,
            title: "Intervals and Dyads Introduction",
            question: "How is the term \"interval\" used in both a theoretical and practical context in music?",
            answer: "The term \"interval\" refers both to the distance between two pitches on a scale and to a dyad whose pitches are separated by that distance. This allows for the term to describe both theoretical distance and practical musical chords."
          },
          {
            id: 4,
            title: "Chromatic and Diatonic Intervals",
            question: "How are chromatic intervals measured on the keyboard?",
            answer: "Chromatic intervals are measured by counting the number of half-steps (semitones) between two pitches."
          },
          {
            id: 5,
            title: "Chromatic and Diatonic Intervals",
            question: "How would you determine the diatonic interval from C4 to E4?",
            answer: "Count the number of different letter names (C, D, E), including both C and E, which gives you a diatonic interval of a third."
          },
          {
            id: 6,
            title: "Chromatic and Diatonic Intervals",
            question: "Why is it necessary to know both the generic and chromatic interval to find the specific interval between two pitches, such as C4–E4?",
            answer: "The generic interval identifies the broad category (e.g., third), but the chromatic interval gives the exact number of semitones, which allows you to determine the specific quality (e.g., major, minor) of the interval."
          },
          {
            id: 7,
            title: "Compound Intervals, Inversions, and Methods",
            question: "What is a compound interval?",
            answer: "A compound interval is any interval larger than an octave."
          },
          {
            id: 8,
            title: "Compound Intervals, Inversions, and Methods",
            question: "What is the relationship between C4-E4 and C4-E5, and how is it classified?",
            answer: "C4-E4 is a major third, and C4-E5 is a major tenth. The tenth is called a compound third because it functions the same as the major third but spans an octave."
          },
          {
            id: 9,
            title: "Compound Intervals, Inversions, and Methods",
            question: "How does interval inversion work, and what are the three key relationships between inversions, such as C4-E4 and E4-C5?",
            answer: "Interval inversion involves switching the order of the notes while maintaining the same pitch classes. The three key relationships are:\n\nThe chromatic intervals add up to 12.\n\nThe generic intervals add up to 9.\n\nMajor intervals invert to minor, augmented to diminished, and perfect remains perfect."
          }
    ];

    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
               
                <h2>Intervals and Dyads</h2>

                <p>An <em>interval</em> is the distance between two pitches, usually measured as a number of steps on a scale.</p>

                <p>A <em>dyad</em> is a pair of pitches sounding together (in other words, a two-note chord). Since a dyad is defined by the interval between the two pitches, dyads are often simply called intervals.</p>

                <p>Thus, the term <em>interval</em> regularly refers both to the distance between two pitches on a scale and to a dyad whose pitches are separated by that distance.</p>

                <h3>Chromatic intervals </h3>

                <p>The simplest way to measure intervals, particularly at the keyboard, is to count the number of half-steps, or <em>semitones</em>, between two pitches. To determine the chromatic interval between C4 and E4, for example, start at C4 and ascend the chromatic scale to E4, counting steps along the way: C#4, D4, D#4, E4. E4 is four semitones higher than C4. Chromatic intervals are notated with a lower-case  <em>i</em> followed by an Arabic numeral for the number of semitones. C4–E4 is four semitones, or  <em>i4</em>.</p>

                <a href="/LessonImages/c4e4.png"><img src={'/LessonImages/c4e4.png'} alt="Chromatic steps from C4 to E4." style={{ }}/></a>

                <h3>Diatonic intervals </h3>

                <p>More commonly for tonal music, we are interested in the number of steps on the diatonic (major or minor) scale. This is a bit tricky—not because it's difficult, but because it's counterintuitive. Unfortunately, the system is too old and well engrained to change it now! But once you get past the initial strangeness, diatonic intervals are manageable.</p>

                <p>When identifying a diatonic interval, begin with the <em>letter names only</em>. That is, treat C, C-sharp, and C-flat all as <em>C</em> for the time being. Next, count the number of steps (different letters) between the two pitches in question, <em>including both pitches in your count</em>. This gives you the <em>generic interval</em>.</p>

                <p>For example, from C4 to E4, counting both C and E, there are three diatonic steps (three letter names): C, D, E. Thus, the generic interval for C4–E4 is a <em>third</em>. The same is true for any C to any E: C#4 to E4, Cb4 to E#4, etc. They are all diatonic thirds.</p>

                <a href="/LessonImages/thirds.png"><img src={'/LessonImages/thirds.png'} alt='Three kinds of generic thirds.' style={{ }}/></a>

                <p>Often more specificity is needed than generic intervals can provide. That specificity comes in the form of an interval's <em>quality</em>. Combining <em>quality</em> with a generic interval name produces a <em>specific interval</em>.</p>

                <p>There are five possible interval qualities:</p>

                <p><li>augmented </li>(A)</p>
                <p><li>major </li>(M)</p>
                <p><li>perfect </li>(P)</p>
                <p><li>minor </li>(m)</p>
                <p><li>diminished </li>(d)</p>

                <p>To obtain an interval's quality, find both the generic interval and the chromatic interval. Then consult the following table to find the specific interval. </p>
                <table>

                <caption></caption>
                <tr>
                    <th>  </th><th> unis. </th><th> 2nd </th><th> 3rd </th><th> 4th </th><th> 5th </th><th> 6th </th><th> 7th </th><th> oct. </th>  
                </tr>
                <tr><td style={{ textAlign: 'right' }}> i0 </td><td> P1 </td><td> d2 </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i1 </td><td> A1 </td><td> m2 </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i2 </td><td>    </td><td> M2 </td><td> d3 </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i3 </td><td>    </td><td> A2 </td><td> m3 </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i4 </td><td>    </td><td>    </td><td> M3 </td><td> d4 </td><td>    </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i5 </td><td>    </td><td>    </td><td> A3 </td><td> P4 </td><td>    </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i6 </td><td>    </td><td>    </td><td>    </td><td> A4 </td><td> d5 </td><td>    </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i7 </td><td>    </td><td>    </td><td>    </td><td>    </td><td> P5 </td><td> d6 </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i8 </td><td>    </td><td>    </td><td>    </td><td>    </td><td> A5 </td><td> m6 </td><td>    </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i9 </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td><td> M6 </td><td> d7 </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i10 </td><td>   </td><td>    </td><td>    </td><td>    </td><td>    </td><td> A6 </td><td> m7 </td><td>    </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i11 </td><td>   </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td><td> M7 </td><td> d8 </td></tr>
                <tr><td style={{ textAlign: 'right' }}> i12 </td><td>   </td><td>    </td><td>    </td><td>    </td><td>    </td><td>    </td><td> A7 </td><td> P8 </td></tr>
                </table>


                <p>For example, C4–E4 is a generic third, and has a chromatic interval of i4. A third that encompasses four semitones is a <em>major third</em> (M3). Note that both generic interval and chromatic interval are necessary to find the specific interval, since there are multiple specific diatonic intervals for each generic interval and for each chromatic interval.</p>

                <p>Note that some generic intervals can be augmented, perfect, or diminished, and other intervals can be augmented, major, minor, or diminished. There is no generic interval that can be both major/minor and perfect; if it can be major or minor, it cannot be perfect, and if it can be perfect, it cannot be major or minor. An augmented version of an interval is always one semitone wider than major or perfect; diminished is always one semitone smaller than minor or perfect.</p>

                <p>Solfège can also help to determine the specific interval. Each pair of solfège syllables will have the same interval, no matter what the key, as long as it is clear which syllable is the lower pitch and which is the upper pitch. Memorizing the intervals between solfège pairs can help speed along your analysis of dyads as they appear in music. For example, knowing that <em>do</em>–<em>mi</em>, <em>fa</em>–<em>la</em>, and <em>sol</em>–<em>ti</em> are always major thirds and knowing that <em>re</em>–<em>fa</em>, <em>mi</em>–<em>sol</em>, <em>la</em>–<em>do</em>, and <em>ti</em>–<em>re</em> are always minor thirds will allow for faster analysis of dyads in major keys.</p>

                <h3>Compound intervals </h3>

                <p>The intervals discussed above, from unison to octave, are called <em>simple intervals</em>. Any interval larger than an octave is considered a <em>compound interval</em>. Take the interval C4 to E5. The generic interval is a tenth. However, it functions the same as C4 to E4 in almost all musical circumstances. Thus, the tenth C4–E5 is also called a <em>compound third</em>. A compound interval takes the same quality as the corresponding simple interval. If C4–E4 is a major third, then C4–E5 is a major tenth.</p>

                <a href="/LessonImages/compound.png"><img src={'/LessonImages/compound.png'} alt='Simple and compound major thirds.' style={{ }}/></a>

                <h3>Interval inversion </h3>

                <p>In addition to C4–E4 and C4–E5, E4–C5 also shares a similar sound and musical function. In fact, any dyad that keeps the same two pitch classes but changes register will have a similar sound and function. However, the fact that E4–C5 has E as its lowest pitch instead of C means that it has a different generic interval: E4–C5 is a sixth, not a third. Because of that difference, it will also play a different musical function in some circumstances. However, there is no escaping the relationship.</p>

                <p>Dyads formed by the same two pitch classes, but with different pitch classes on bottom and on top, are said to be <em>inversions</em> of each other, because the pitch classes are <em>inverted</em>. Likewise, the intervals marked off by those inverted dyads are said to be <em>inversions</em> of each other.</p>

                <p>Again, take C4–E4 (major third) and E4–C5 (minor sixth). These two dyads have the same two pitch classes, but one has C on bottom and E on top, while the other has E on bottom and C on top. Thus, they are inversions of each other.</p>

                <a href="/LessonImages/inversion.png"><img src={'/LessonImages/inversion.png'} alt="Inversion relationship: major third and minor sixth." style={{ }}/></a>

                <p>Three relationships exhibited by these two dyads hold for all interval inversions. </p>

                <p>First, the chromatic intervals add up to 12. (C4–E4 = i4; E4–C5 = i8; i4 + i8 = i12) This is because the two intervals add up to an octave (with an overlap on E4).</p>

                <p>Second, <em>the two generic interval values add up to nine</em> (a third plus a sixth, or 3 + 6). This is because the two intervals add up to an octave (8), and one of the notes is counted twice when you add them together. (Remember the counterintuitive way of counting off diatonic intervals, where the number includes the starting and ending pitches, and when combining inverted intervals, there is always one note that gets counted twice—in this case, E4.)</p>

                <p>Lastly, the major interval inverts into a minor, and vice versa. This always holds for interval inversion. Likewise, an augmented interval's inversion is always diminished, and vice versa. A perfect interval's inversion is always perfect.</p>

                <p> major ↔ minor  </p>
                <p>augmented ↔ diminished  </p>
                <p>perfect ↔ perfect</p>

                <p>Interval inversion may seem confusing and esoteric now, but it will be an incredibly important concept for the study of voice-leading and the study of harmony.</p>

                <h3>Methods for learning intervals</h3>

                <p>There are several methods for learning intervals. Choose your favorite:</p>

                <p>-The white-key method</p>



                <h3>Melodic and harmonic intervals </h3>

                <p>The last distinction between interval types to note is <em>melodic</em> v. <em>harmonic</em> intervals. This distinction is simple. If the two pitches of a dyad sound at the same time (a two-note chord), the interval between them is a <em>harmonic interval</em>. If the two pitches in question are sounded back-to-back (as in a melody), the interval between them is a <em>melodic interval</em>. This distinction is important in voice-leading, where different intervals are preferred or forbidden in harmonic contexts than in melodic contexts. The difference is also important for listening, as hearing melodic and harmonic intervals of the same quality requires different techniques.</p>

                <h3>Consonance and dissonance </h3>

                <p>Intervals are categorized as <em>consonant</em> or <em>dissonant</em> based on their sound (how stable, sweet, or harsh they sound), how easy they are to sing, and how they best function in a passage (beginning, middle, end; between certain other intervals; etc.). Different standards apply to melody and harmony. The following categories will be essential for your work in strict voice-leading, and they will be a helpful guide for free composition and arranging work, as well.</p>


                <h4>Melodic consonance and dissonance</h4>

                <p>The following <em>melodic</em> intervals are <em>consonant</em>, and can be used in strict voice-leading both for successive pitches and as boundaries of stepwise progressions in a single direction:</p>

                <p><li>All perfect intervals </li>(P4, P5, P8)  </p>
                <p><li>All diatonic steps </li>(M2, m2)  </p>
                <p><li>Major and minor thirds  </li></p>
                <p><li>Major and minor sixths</li></p>

                <p>All other <em>melodic</em> intervals are <em>dissonant</em>, and must be avoided for successive pitches and as boundaries of stepwise progressions in a single direction, including:</p>

                <p><li>All augmented and diminished intervals </li>(including those that are enharmonically equivalent to consonant intervals, such as A2 and A1)  </p>
                <p><li>All sevenths</li></p>

                <h4>Harmonic consonance and dissonance</h4>

                <p>The following <em>harmonic</em> intervals are <em>imperfect consonances</em>, and can be used relatively freely in strict voice-leading (except for beginnings and endings):</p>

                <p><li>Major and minor thirds  </li></p>
                <p><li>Major and minor sixths</li></p>

                <p>The following <em>harmonic</em> intervals are <em>perfect consonances</em>, and must be used with care in limited circumstances in strict voice-leading:</p>

                <p><li>All perfect intervals </li>*except the perfect fourth* (P1, P5, P8)</p>

                <p>All other <em>harmonic</em> intervals are <em>dissonant</em>, and must be employed in very specific ways in strict voice-leading, including:</p>

                <p><li>All diatonic steps </li>(M2, m2)  </p>
                <p><li>All augmented and diminished intervals </li>(including those that are enharmonically equivalent to consonant intervals, such as A2 and A1)  </p>
                <p><li>All sevenths</li></p>
                <p><li>Perfect fourths</li></p> 
                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}