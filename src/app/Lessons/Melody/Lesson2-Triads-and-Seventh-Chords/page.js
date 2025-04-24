import Quizviewer from "../../../component/QuizView"

export default function Triads(){

    const quizzes=[
        {
            id: 401,
            title: "This sets broken",
            question: "The Devs are working hard to fix this issue",
            answer: "The root is the lowest pitch class in the adjacent clump on the circle (clockwise: the earliest note)."
          },
        {
            id: 10,
            title: "Triads - Basics and Identification",
            question: "What is a chord in music theory?",
            answer: "A chord is any combination of three or more pitch classes that sound simultaneously."
          },
          {
            id: 11,
            title: "Triads - Basics and Identification",
            question: "What defines a triad?",
            answer: "A triad is a three-note chord whose pitch classes can be arranged as stacked thirds."
          },
          {
            id: 12,
            title: "Triads - Basics and Identification",
            question: "How can you tell if a chord is a triad using the circle of thirds?",
            answer: "If the three pitch classes sit next to each other on the circle of thirds, it is a triad."
          },
          {
            id: 13,
            title: "Triad Roots and Qualities",
            question: "How do you find a triad's root using the circle of thirds?",
            answer: "The root is the lowest pitch class in the adjacent clump on the circle (clockwise: the earliest note)."
          },
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
                
            <div className="lesson-div" >
                <h2>Triads and seventh chords</h2>
                <p>A chord is any combination of three or more pitch classes that sound simultaneously.</p>

                <p>A three-note chord whose pitch classes can be arranged as thirds is called a <em>triad</em>.</p>

                {/*<!--To tell whether or not a chord is a triad, take the pitch classes present in the chord. Assuming there are three pitch classes (not necessarily three <em>pitches</em>), arrange them on the circle of generic scale steps. (By generic, I mean that A-natural, A-flat, and A-sharp are all kinds of A.)

                <img src={'/LessonImages/circleOfSteps-triad.png'} alt="A triad (A, C, E) on the diatonic circle of steps." style={{ }}/>-->*/}

                <p>To quickly determine whether a three-note chord is a triad, arrange the three notes on the "circle of thirds" below. The pitch classes of a triad will always sit next to each other.</p>

                <a href="/LessonImages/circleOfThirds-triad.svg"><img src={'/LessonImages/circleOfThirds-triad.svg'} alt="A triad (A, C, E) on the diatonic circle of thirds." style={{ height: '100%', width: '100%' }}/></a>

                <h4>Identifying and labeling triads </h4>

                <p>Triads are identified according to their <em>root</em> and <em>quality</em>.</p>

                <h3>Triad roots</h3>

                <p>To find a triad’s root, arrange the pitch classes on a circle of thirds (mentally or on paper). The root is the <em>lowest</em> in the three-pitch-class clump. Expressed another way, if the circle <em>ascends</em> by thirds as it moves clockwise, the root is the “earliest” note (thinking like a literal clock), and the other pitch classes come “later.”</p>

                <a href="/LessonImages/circleOfThirds-triadRTF.svg"><img src={'/LessonImages/circleOfThirds-triadRTF.svg'} alt="A triad (A, C, E) on the diatonic circle of thirds." style={{ height: '100%', width: '100%' }}/></a>

                <p>Once you know the root, you can identify the remaining notes as the <em>third</em> of the chord (a third above the root) and the <em>fifth</em> of the chord (a fifth above the root).</p>

                <h3>Triad qualities</h3>

                <p>To find a triad’s quality, identify the interval between the root and the other members of the chord. There are four qualities of triads that appear in major and minor scales, each with their own characteristic intervals.</p>

                <p><li>  major triad: M3 and P5 above the root (as in  <em>do–mi–sol</em>)</li></p>
                <p><li>  minor triad: m3 and P5 above the root (as in  <em>do–me–sol</em> or  <em>la–do–mi</em>)</li></p>
                <p><li>  diminished triad: m3 and d5 above the root (as in  <em>ti–re–fa</em>)</li></p>
                <p><li>  augmented triad: M3 and A5 above the root (as in  <em>me–sol–ti</em>)</li></p>

                <a href="/LessonImages/triads.png"><img src={'/LessonImages/triads.png'} alt='Four qualities of triads.' style={{ }}/></a>
                <h3>Lead-sheet symbols</h3>

                <p>A triad can be summed up by a single symbol, such as a lead-sheet chord symbol. A lead sheet symbol includes information about both root quality, as well as which pitch class occurs in the lowest voice (called the <em>bass</em> regardless of who is singing or playing that pitch).</p>

                <p>A lead-sheet symbol begins with a capital letter (and, if necessary, an accidental) denoting the root of the chord. That letter is followed by information about a chord’s quality:</p>

                <p><li>  major triad: no quality symbol is added</li></p>
                <p><li>  minor triad: lower-case “m”</li></p>
                <p><li>  diminished triad: lower-case “dim” or a degree sign “°”</li></p>
                <p><li>  augmented triad: lower-case “aug” or a plus sign “+”</li></p>

                <p>Finally, if a pitch class other than the chord root is the lowest note in the chord, a slash is added, followed by a capital letter denoting the pitch class in the bass (lowest) voice.</p>

                <p>A C-major triad’s lead-sheet symbol is simply  <strong>C</strong>. A C-minor triad is  <strong>Cm</strong>. A D-sharp-diminished triad with an F-sharp in the bass is **D\#dim/F\#**. And so on.</p>

                <a href="/LessonImages/triads-LS.png"><img src={'/LessonImages/triads-LS.png'} alt="Four qualities of triads with lead-sheet symbols." style={{ }}/></a>
                <h4>Roman numerals </h4>

                <p>Chords are often labeled according to their function within a key. One system for doing so uses Roman numerals to designate the scale degree of the chord’s root. Some musicians also use Roman numerals to describe the quality of the chord. Capital Roman numerals (I, II, III, etc.) are used for major triads. Lower-case Roman numerals (i, ii, iii, etc.) are used for minor triads. Lower-case Roman numerals followed by a º sign (iiº, viiº, etc.) are used for diminished triads. Capital Roman numerals followed by a <sup>+</sup> sign (V<sup>+</sup>, for example) are used for augmented triads. In general, Roman numerals are generally labeled <em>below</em> the score.</p>
                    
                <p>(Some musicians prefer to use Roman numerals <em>only</em> to reflect the scale-degree of the chord root. In such cases, all Roman numerals are capital. In this textbook, we use all-capital Roman numerals to refer to chords generally, when quality does not matter. When notating specific chords with specific qualities, we will differentiate those qualities in the Roman numerals.)</p>

                <p>In major keys, chords with the same Roman numeral are made up of the same scale-degrees (using the same solfège syllables), and they have the same quality. In other words, triads labeled “I” in any major key will be major triads containing <em>do</em>, <em>mi</em>, and <em>sol</em>. iii triads will be minor triads containing <em>mi</em>, <em>sol</em>, and <em>ti</em>, etc. The same is true for minor keys (though I in minor is different from I in major).</p>

                <p>Following are the qualities and scale-degrees belonging to each triad in every major key:</p>

                <p><li>  I: major – <em>do</em>, <em>mi</em>, <em>sol</em>  </li></p>
                <p><li>  ii: minor – <em>re</em>, <em>fa</em>, <em>la</em>  </li></p>
                <p><li>  iii: minor – <em>mi</em>, <em>sol</em>, <em>ti</em>  </li></p>
                <p><li>  IV: major – <em>fa</em>, <em>la</em>, <em>do</em>  </li></p>
                <p><li>  V: major – <em>sol</em>, <em>ti</em>, <em>re</em>  </li></p>
                <p><li>  vi: minor – <em>la</em>, <em>do</em>, <em>mi</em>  </li></p>
                <p><li>  vii°: diminished – <em>ti</em>, <em>re</em>, <em>fa</em></li></p>

                <p>Following are the qualities and scale-degrees belonging to each triad in every minor key:</p>

                <p><li>  i: minor – <em>do</em>, <em>me</em>, <em>sol</em>  </li></p>
                <p><li>  ii°: diminished – <em>re</em>, <em>fa</em>, <em>le</em>  </li></p>
                <p><li>  III: major – <em>me</em>, <em>sol</em>, <em>te</em>  </li></p>
                <p><li>  iv: minor – <em>fa</em>, <em>le</em>, <em>do</em>  </li></p>
                <p><li>  V: major – <em>sol</em>, <em>ti</em>, <em>re</em>  </li></p>
                <p><li>  VI: major – <em>le</em>, <em>do</em>, <em>me</em>  </li></p>
                <p><li>  VII: major – <em>te</em>, <em>re</em>, <em>fa</em>  </li></p>
                <p><li>  vii°: diminished – <em>ti</em>, <em>re</em>, <em>fa</em></li></p>

                <h4>Building a triad </h4>

                <p>To build a triad on the staff, identify the root, quality, and bass note from the lead-sheet symbol. The root and quality will tell you what three pitch classes belong to the triad. For example, <strong>C<sup>+</sup></strong> tells you the root is C, and the quality is augmented. Since the quality is augmented, there is a major third above the root (E) and an augmented fifth above the root (G-sharp). Since there is no bass note appended to the lead-sheet symbol, the bass note is the same as the root: C. Write a C on the staff (in any comfortable register), then write the other chord tones (E and G-sharp) <em>above</em> the C (see the Caug triad in the above figure).</p>

                <p>For <strong>Cm/E&#9837;</strong>, the root is C, and the quality is minor. Since the quality is minor, there is a minor third above the root (E-flat) and a perfect fifth above the root (G). The slash identifies E-flat as the bass note. Write the E-flat on the staff. Then write a C and a G above it to complete the chord (again, see above).</p>

                <p>When all the members of the triad are as close to the bass note as they can be, the chord is in what is called <em>close position</em> (C, Cm/E&#9837;, and Cdim/G&#9837; above). When there are spaces between chord tones, the chord is in <em>open position</em> (Caug above). (In certain musical situations, only one of those positions will be useful or desirable.)</p>

                <h4>Listening to triads </h4>

                <p>Each triad quality has its own distinct sound, and to an extent that sound is preserved even when the chord is <em>inverted</em> (when the pitch classes are arranged so that a pitch class other than the root is in the lowest voice). As you practice identifying and writing triads, be sure to play the triads, both to check your analysis/writing and to develop the ability to identify chord qualities quickly by ear.</p>

                <h4>Seventh chords </h4>

                <p>A four-note chord whose pitch classes can be arranged as thirds is called a <em>seventh chord</em>.</p>

                <p>Like with a triad, the pitch classes belonging to a seventh chord occupy adjacent positions (a four-pitch-class clump) on the circle of thirds. The four members of a seventh chord are the <em>root</em>, <em>third</em>, <em>fifth</em>, and <em>seventh</em>.</p>

                <a href="/LessonImages/circleOfThirds-seventhRTFS.svg"><img src={'/LessonImages/circleOfThirds-seventhRTFS.svg'} alt="A seventh chord (A, C, E, G) on the diatonic circle of thirds." style={{ height: '100%', width: '100%' }}/></a>
                <p>There are five qualities of seventh chords that appear in diatonic music: major seventh, dominant seventh, minor seventh, diminished seventh (also called fully-diminished), and half-diminished seventh. They are comprised of the following intervals above their roots:</p>

                <p><li>  major seventh: M3, P5, and M7 above the root (or major triad with a major seventh)</li></p>
                <p><li>  dominant seventh: M3, P5, and m7 above the root (or major triad with a minor seventh)</li></p>
                <p><li>  minor seventh: m3, P5, and m7 above the root (or minor triad with a minor seventh)</li></p>
                <p><li>  diminished seventh: m3, d5, and d7 above the root (or diminished triad with a diminished seventh)</li></p>
                <p><li>  half-diminished seventh: m3, d5, and m7 above the root (or diminished triad with a minor seventh)</li></p>

                <p>Following are the lead-sheet abbreviations for seventh-chord qualities:</p>

                <p><li>  major seventh: maj7 or △7 (G<sup>maj7</sup> or G<sup>△7</sup>)</li></p>
                <p><li>  dominant seventh: 7 (B<sup>7</sup>)</li></p>
                <p><li>  minor seventh: m7 (F&#9839;<sup>m7</sup>)</li></p>
                <p><li>  diminished seventh: dim7 or °7 (D<sup>dim7</sup> or D<sup>°7</sup>)</li></p>
                <p><li>  half-diminished seventh: ⦰7 (A<sup>⦰7</sup>)</li></p>

                <h3>Roman numerals</h3>

                <p>Following are the qualities and scale-degrees belonging to each seventh chord in every major key, along with the corresponding Roman numeral reflecting those qualities:</p>

                <p><li>  I<sup>7</sup>: major seventh – <em>do</em>, <em>mi</em>, <em>sol</em>, <em>ti</em>  </li></p>
                <p><li>  ii<sup>7</sup>: minor seventh – <em>re</em>, <em>fa</em>, <em>la</em>, <em>do</em>  </li></p>
                <p><li>  iii<sup>7</sup>: minor seventh – <em>mi</em>, <em>sol</em>, <em>ti</em>, <em>re</em>  </li></p>
                <p><li>  IV<sup>7</sup>: major seventh – <em>fa</em>, <em>la</em>, <em>do</em>, <em>mi</em>  </li></p>
                <p><li>  V<sup>7</sup>: dominant seventh – <em>sol</em>, <em>ti</em>, <em>re</em>, <em>fa</em>  </li></p>
                <p><li>  vi<sup>7</sup>: minor seventh – <em>la</em>, <em>do</em>, <em>mi</em>, <em>sol</em>  </li></p>
                <p><li>  vii<sup>⦰7</sup>: half-diminished seventh – <em>ti</em>, <em>re</em>, <em>fa</em>, <em>la</em></li></p>

                <p>Following are the qualities and scale-degrees belonging to each seventh chord in every minor key, along with the corresponding Roman numeral reflecting those qualities:</p>

                <p><li>  i<sup>7</sup>: minor seventh – <em>do</em>, <em>me</em>, <em>sol</em>, <em>te</em>  </li></p>
                <p><li>  ii<sup>7</sup>: half-diminished seventh – <em>re</em>, <em>fa</em>, <em>le</em>, <em>do</em>  </li></p>
                <p><li>  III<sup>7</sup>: major seventh – <em>me</em>, <em>sol</em>, <em>te</em>, <em>re</em>  </li></p>
                <p><li>  iv<sup>7</sup>: minor seventh – <em>fa</em>, <em>le</em>, <em>do</em>, <em>me</em>  </li></p>
                <p><li>  V<sup>7</sup>: dominant seventh – <em>sol</em>, <em>ti</em>, <em>re</em>, <em>fa</em>  </li></p>
                <p><li>  VI<sup>7</sup>: major seventh – <em>le</em>, <em>do</em>, <em>me</em>, <em>sol</em>  </li></p>
                <p><li>  VII<sup>7</sup>: dominant seventh – <em>te</em>, <em>re</em>, <em>fa</em>, <em>le</em>  </li></p>
                <p><li>  vii°<sup>7</sup>: diminished seventh – <em>ti</em>, <em>re</em>, <em>fa</em>, <em>le</em></li></p>

                <p>Note that major-seventh and dominant-seventh chords have the same Roman numeral nomenclature. The difference is discerned from the context of the key.</p> 
                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>
    );
}