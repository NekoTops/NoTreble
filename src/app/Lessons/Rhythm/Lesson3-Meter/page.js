import Quizviewer from "../../../component/QuizView"

export default function Meter(){
    const quizzes=[
        {
            id: 19,
            title: "Meter Basics & Classification",
            question: "What are the two main ways meter is classified?",
            answer: "Simple vs. compound and duple vs. triple vs. quadruple."
          },
          {
            id: 20,
            title: "Meter Basics & Classification",
            question: "How do simple and compound meters differ?",
            answer: "Simple meters divide each beat into two; compound meters divide each beat into three."
          },
          {
            id: 21,
            title: "Meter Basics & Classification",
            question: "How does the classification of duple, triple, or quadruple relate to conducting patterns?",
            answer: "Conducting patterns are determined by how beats group in each measure: 2 (duple), 3 (triple), or 4 (quadruple)."
          },
          {
            id: 22,
            title: "Time Signatures and Meter Types",
            question: "What does the top number of a time signature indicate?",
            answer: "The type of meter."
          },
          {
            id: 23,
            title: "Time Signatures and Meter Types",
            question: "Which top number represents compound triple meter?",
            answer: "9"
          },
          {
            id: 24,
            title: "Time Signatures and Meter Types",
            question: "Why is the top number alone sufficient to identify the meter type?",
            answer: "Because each top number uniquely corresponds to one of the six standard meters in Western music."
          },
          {
            id: 25,
            title: "Bottom Numbers & Beat Values",
            question: "In simple meter, what does the bottom number of a time signature represent?",
            answer: "The note that gets one beat."
          },
          {
            id: 26,
            title: "Bottom Numbers & Beat Values",
            question: "In compound meter, what does the bottom number represent?",
            answer: "The note that equals one division of the beat."
          },
          {
            id: 27,
            title: "Bottom Numbers & Beat Values",
            question: "Why is the beat always dotted in compound meter?",
            answer: "Because the beat is divided into three equal parts, so the beat duration is three times that of the division note."
          },
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
                <h2>Meter and time signatures</h2>

                <p>Meter involves the way multiple pulse layers work together to organize music in time. Standard meters in Western music can be classified into <em>simple meters</em> and <em>compound meters</em>, as well as <em>duple</em>, <em>triple</em>, and <em>quadruple</em> meters. </p>

                <p>Duple, triple, and quadruple classifications result from the relationship between the counting pulse and the pulses that are <em>slower</em> than the counting pulse. In other words, it is a question of <em>grouping</em>: how many beats occur in each bar. If counting-pulse beats group into twos, we have duple meter; groups of three, triple meter; groups of four, quadruple meter. Conducting patterns are determined based on these classifications. </p>

                <p>Simple and compound classifications result from the relationship between the counting pulse and the pulses that are <em>faster</em> than the counting pulse. In other words, it is a question of <em>division</em>: does each beat divide into two equal parts, or three equal parts. Meters that divide the beat into two equal parts are <em>simple meters</em>; meters that divide the beat into three equal parts are <em>compound meters</em>. </p>

                <p>Thus, there are six types of standard meter in Western music:</p>

                <p><li>simple duple (beats group into two, divide into two)</li></p>
                <p><li>simple triple (beats group into three, divide into two)</li></p>
                <p><li>simple quadruple (beats group into four, divide into two)</li></p>
                <p><li>compound duple (beats group into two, divide into three)</li></p>
                <p><li>compound triple (beats group into three, divide into three)</li></p>
                <p><li>compound quadruple (beats group into four, divide into three)</li></p>

                <p>In a time signature, the <em>top number</em> (and the top number only!) describes the type of meter. Following are the top numbers that always correspond to each type of meter:</p>

                <p><li>simple duple: 2</li></p>
                <p><li>simple triple: 3</li></p>
                <p><li>simple quadruple: 4</li></p>
                <p><li>compound duple: 6</li></p>
                <p><li>compound triple: 9</li></p>
                <p><li>compound quadruple: 12</li></p>


                <h3> Notating meter</h3>

                <p>In <em>simple meters</em>, the bottom number of the time signature corresponds to the type of note corresponding to <em>a single beat</em>. If a simple meter is notated such that each quarter note corresponds to a beat, the bottom number of the time signature is 4. If a simple meter is notated such that each half note corresponds to a beat, the bottom number of the time signature is 2. If a simple meter is notated such that each eighth note corresponds to a beat, the bottom number of the time signature is 8. And so on. </p>

                <p>In <em>compound meters</em>, the bottom number of the time signature corresponds to the type of note corresponding to <em>a single division of the beat</em>. If a compound meter is notated such that each dotted-quarter note corresponds to a beat, the eighth note is the division of the beat, and thus the bottom number of the time signature is 8. If a compound meter is notated such that each dotted-half note corresponds to a beat, the quarter note is the division of the beat, and thus the bottom number of the time signature is 4. Note that because the beat is divided into three in a compound meter, the beat is always three times as long as the division note, and <em>the beat is always dotted</em>.</p>

                <h3> Examples</h3>

                <h4>Simple duple meter</h4>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:7GGgQvI5OOv1GL9wehJC2w" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">Symphony No. 5, Movement IV., Ludwig van Beethoven</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:1mblryRrYNlSJqvrrtvzyq" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">"Idioteque," Radiohead</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:3QKUA7OAaQu3Zl1cqMa9gq" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">Sonata No. 1 in F Minor, Op. 2, No. 1, Movement I., Ludwig van Beethoven</p>


                <h4>Simple triple meter</h4>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:3kxQTMpuCVX5L34GjHy61h" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">String Quartet No. 15 in D Minor, K. 421, Movement III., Wolfgang A. Mozart</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:6T5JlpcvC0RbPpexl8xXMI" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">Symphony No. 90 in C Major, Hob: I:90, Movement III., Joseph Haydn</p>



                <h4>Simple quadruple meter</h4>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:5JGEAz15LkPoOtFHttDtVs" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">"With or Without You," U2</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:2GnWmYszHAtRKJeODAXuT2" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">"Come Out Clean," Jump Little Children</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:0jXRQSoOA01VTmrVIDbhtm" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">"Shh," Imogen Heap</p>


                <h4>Compound duple meter</h4>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:0qksx8mV28lztYIZ1om8ml" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true"}}></iframe><p className="caption">"Shiver," Radiohead</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:1w6C2YqIHygosg9OY6v7Wl" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true"}}></iframe><p className="caption">Strong Quartet No. 17 in B-flat Major, K. 458, "The Hunt," Movement I., Wolfgang A. Mozart</p>


                <h4>Compound triple meter</h4>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:40J9dEDG0unV6LyYOHfMi9" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">"The Tourist," Radiohead</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:4mu9wgDkwUSbOGvx2iQfFf" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">Sonata No. 42 in G Major, Hob. XVI:27, Movement II., Joseph Haydn</p>


                <h4>Compound quadruple meter</h4>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:76ZDwA8uTyMys4LIS3pBUX" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">"Exogenesis: Symphony Part 3," Muse</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:70TI9J2rsGIuXyFqVzOswh" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">Sonata No. 14 in C-sharp Minor, Op. 27, No. 2, "Moonlight," Movement I., Ludwig van Beethoven</p>

                <iframe src="https://embed.spotify.com/?uri=spotify:track:6M1Eo5wuTl8f5qbpLCuph0" style={{ width: "300", height: "80", frameborder: "0", allowtransparency: "true" }}></iframe><p className="caption">St. Matthew Passion, No. 1, Chorus, "Kommt, ihr Töchter, helft mir klagen," J.S. Bach</p>

                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}