import Quizviewer from "../../../component/QuizView"

export default function Beams(){

    const quizzes=[
        {
            id: 10,
            title: "Beams (Concept & Purpose)",
            question: "What is the primary goal of musical notation?",
            answer: "To be easily read and interpreted by performers."
          },
          {
            id: 11,
            title: "Beams (Concept & Purpose)",
            question: "What rhythmic element are beams used to group?",
            answer: "Notes at the beat division level or shorter within the same beat."
          },
          {
            id: 12,
            title: "Beams (Concept & Purpose)",
            question: "Why is proper beaming important in musical notation?",
            answer: "It helps convey the beat structure clearly, making rhythms easier to read."
          },
          {
            id: 13,
            title: "Beams in Practice",
            question: "What happens when eighth notes are not grouped with beams?",
            answer: "The rhythm becomes harder to interpret."
          },
          {
            id: 14,
            title: "Beams in Practice",
            question: "How does beaming help in triple meter?",
            answer: "It groups notes by beat, making the meter easier to understand."
          },
          {
            id: 15,
            title: "Beams in Practice",
            question: "How could incorrect beaming affect a performer's interpretation?",
            answer: "It may obscure the intended meter and lead to rhythmic confusion during performance."
          },
          {
            id: 16,
            title: "Borrowed Divisions (Triplets & Duplets)",
            question: "What are the usual beat divisions in simple and compound meter?",
            answer: "Simple = division by two; Compound = division by three."
          },
          {
            id: 17,
            title: "Borrowed Divisions (Triplets & Duplets)",
            question: "What is a triplet, and where is it borrowed from?",
            answer: "A triplet divides a beat into three and is borrowed from compound meter."
          },
          {
            id: 18,
            title: "Borrowed Divisions (Triplets & Duplets)",
            question: "Why might a composer use triplets in simple meter or duplets in compound meter?",
            answer: "To create rhythmic contrast or expressive variation by temporarily altering the standard beat division."
          },
    ];
    return (
        
        <main style={{ /*backgroundColor: '#455090e2'*/ }} >
            <div className="lesson-div" >
                
                <h2>Beams and borrowed divisions</h2>

                <h3>Beams </h3>

                <p>It's important to remember that notation is intended to be read by performers. You should always strive to make your notation as easy to interpret as possible. Part of this includes grouping the rhythms such that they convey the beat unit and the beat division. <em>Beams</em> are used to group any notes at the beat division level or shorter that fall within the same beat. </p>

                <p>In this example, the eighth notes are not grouped with beams, making it difficult to interpret the triple meter. </p>

                <a href="/LessonImages/withoutbeams.png"><img src="/LessonImages/withoutbeams.png" alt=' Image shows a line-up of notes, that include eighth notes not being grouped together for easier interpretation of the triple meter.' width="70%"/></a>

                <p>If we re-notate the above example so that the notes that fall within the same beat are grouped together with a beam, it makes the music much easier to read. </p>

                <a href="/LessonImages/beams.png"><img src="/LessonImages/beams.png" alt='Image shows the same notes as above, but has the notes that fall within the same beat grouped together with a beam' width="70%"/></a>

                <h3>Borrowed divisions </h3>

                <p>Typically, a meter is defined by the presence of a consistent beat division: division by two in simple meter, and by three in compound meter. Occasionally, composers will use a triple division of the beat in a simple meter, or a duple division of the beat in a compound meter. </p>

                <p><em>Triplets</em> are borrowed from compound meter, and may occur at both the beat division and subdivision levels, as seen below.</p>

                <a href="/LessonImages/triplets.png"><img src ="/LessonImages/triplets.png" alt='This image illustrates triplet eighth notes alongisde standard eighth notes and triplet sixteenth notes. ' width="70%"/></a>

                <p>Likewise, <em>duplets</em> can be imported from simple meter into a compound meter.</p>

                <a href="/LessonImages/duplets.png"><img src="/LessonImages/duplets.png" alt='This image illustrates eighth notes, duplet eighth notes, and duplet sixteenth notes.' width="70%"/></a>
                <Quizviewer quizzes={quizzes}/>
            </div>
        </main>

    );
}