

export default function Rhythm(){

    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
                
                <h2>Rhythmic values</h2>

                <p>Rhythm refers to the combination of long and short durations in time. Durations are notated with either unfilled or filled noteheads. Unfilled noteheads can appear with or without a stem; filled noteheads always appear with a stem. Flags can be added to the stems of filled noteheads; each flag shortens the duration by half. </p>

                <img src="/LessonImages/durations.png" width="60%"/>

                <h3>Rests</h3>

                <p>Rests represent silence in musical notation. For each durational symbol there exists a corresponding rest. </p>

                <img src="/LessonImages/rests.png" width="60%"/>

                <h3>Dots and ties</h3>

                <p>Dots and ties allow for basic durations to be lengthened. A dot occurs after a pitch or a rest, and it increases its duration by half. For example, if a quarter note is equivalent in duration to two eighth notes, a dotted quarter note would be equivalent to <em>three</em> eighth notes. Generally, undotted notes divide into two notes; dotted notes divide into three. Thus, undotted notes are typically used to represent the beat level in simple meter, while dotted notes are used to represent the beat in compound meter.</p>

                <p>Multiple dots can be added to a duration. Subsequent dots add half the duration of the previous dot. For example, a quarter note with two dots would be equivalent in duration to a quarter, eighth, and sixteenth note. </p>

                <a href="/LessonImages/dots.png"><img src="/LessonImages/dots.png" width="50%"/></a>

                <p>A <em>tie</em> lengthens a duration by connecting two adjacent identical pitches. Ties are used to either sustain a pitch beyond the length of a single measure, or to make a particular rhythmic grouping in a measure more clear. </p>

                <p>In the example below, the duration of the first pitch is longer than a single measure, so it is represented by tying the dotted half note, which lasts the full measure, to the first beat of the subsequent measure. </p>

                <a href="/LessonImages/ties.png"><img src="/LessonImages/ties.png" width="50%"/></a>


            </div>
        </main>

    );
}