"use client";
import { set } from "firebase/database";
import { useState }from "react";

//Array of all terms and definitions
const terms = [

    { 
        term:	'Staff/stave', 
        definition: 'The five-line staff (often "stave" in British usage) is used to indicate pitch. Each line or space indicates the pitch belonging to a note with a letter name: A, B, C, D, E, F, G. Moving vertically upwards, the letter names proceed alphabetically with the alternating lines and spaces, and represent ascending pitches. The A-G pattern repeats continually—the note above "G" is always another "A". A clef is almost always added, which assigns one specific pitch to one specific line; the other lines and spaces are determined alphabetically as described.', 
        group: 'Lines',
        image: ''
    },
    {
        term: 'Ledger or Leger Lines',
        definition: 'These additional lines (and the spaces they form) indicate pitches above or below the staff. The diagram shows one ledger line above the staff and one below, but multiple ledger lines can be used.',
        group: 'Lines',
        image: ''
    },
    {
        term: 'Bar Line (or Barline)',
        definition: 'Bar lines separate measures ("bars") of music according to the indicated time signature. They sometimes extend through multiple staves to group them together when a grand staff is used or when indicating groups of similar instruments in a conductor\'s score.',
        group: 'Lines',
        image: ''
    },	
    {
        term: 'Double Bar Line',
        definition: 'These indicate some change in the music, such as a new musical section, or a new key/time signature.',
        group: 'Lines',
        image: ''
    },	
    {
        term: 'Bold Double Bar Line',
        definition: 'These indicate the conclusion of a movement or composition.',
        group: 'Lines',
        image: ''
    },	
    {
        term: 'Dotted bar line',
        definition: 'These can be used to subdivide measures of complex meter into shorter segments for ease of reading.',
        group: 'Lines',
        image: ''
    },	
    {
        term: 'Brace',
        definition: 'A brace is used to connect two or more lines of music that are played simultaneously, usually by a single player, generally when using a grand staff. The grand staff is used for piano, harp, organ, and some pitched percussion instruments. The brace is occasionally called an accolade in some old texts and can vary in design and style.',
        group: 'Lines',
        image: ''
    },	
    {
        term: 'Bracket',
        definition: 'A bracket is used to connect two or more lines of music that sound simultaneously. In contemporary usage it usually connects staves of individual instruments (e.g., flute and clarinet; two trumpets; etc.) or multiple vocal parts, whereas the brace connects multiple parts for a single instrument (e.g., the right-hand and left-hand staves of a piano or harp part).',
        group: 'Lines',
        image: ''
    },	
    {
        term: 'Clef',
        definition: 'A clef assigns one particular pitch to one particular line of the staff on which it is placed. This also effectively defines the pitch range or tessitura of the music on that staff. A clef is usually the leftmost symbol on a staff, although a different clef may appear elsewhere to indicate a change in register. Historically, clefs could be placed on any line on a staff (or even on a space), but modern notation almost exclusively uses treble, bass, alto, and tenor clef.',
        group: 'Clefs',
        image: ''
    },	
    {
        term: 'G Clef (Treble Clef)',
        definition: 'The spiral of a G clef (not a point on the spiral, but the center around which the spiral is drawn) shows where the G above middle C is located on the staff. A G clef with the spiral centered on the second line of the staff is called treble clef. The treble clef is the most commonly encountered clef in modern notation.',
        group: 'Clefs',
        image: ''
    },	{
        term: 'C Clef (Alto and Tenor Clefs)',
        definition: 'The center of a C clef points to the line representing middle C. The first illustration here is centered on the third line on the staff, making that line middle C. When placed there, the clef is called alto clef, mainly used for the viola but sometimes used for other instruments. The second illustration shows the clef centered on the fourth line—called tenor clef. Tenor clef is used for bassoon, cello, trombone, and double bass when the notes get very high, avoiding the use of excessive ledger lines.',
        group: 'Clefs',
        image: ''
    },	{
        term: 'F Clef (Bass Clef)',
        definition: 'An F clef places the F below middle C on the line between the dots. When placing the F below middle C on the fourth line, as shown here, it is called bass clef, which is by far its most common usage. Bass clef appears nearly as often as treble clef in modern music notation. In older notation, particularly for vocal music, F clefs were sometimes centered on the third line (baritone clef) but this usage has essentially become obsolete.',
        group: 'Clefs',
        image: ''
    },	{
        term: 'Octave Clef',
        definition: 'Treble and bass clefs can be modified by octave numbers. An "8" below the clef (as in the third diagram) indicates that pitches will sound an octave lower than they would with the unmodified clef. A "15" below indicates a two-octave shift. These numbers may also be used above the clef to indicate pitches one or two octaves higher. A treble clef with an eight below is the most common version, typically used in music for guitar or tenor voice. Sometimes a shift of one octave up is indicated by drawing two clefs instead of one.',
        group: 'Clefs',
        image: ''
    },	
    {
        term: 'Neutral clef',
        definition: 'Used for pitchless instruments, such as percussion instruments. Not a true clef—the lines and spaces do not indicate pitches—but it occupies the position of a clef. In this case, the lines and spaces indicate specific instruments, such as the different individual instruments in a drum set. It may also be drawn on a single-line staff for single percussion instruments.',
        group: 'Clefs',
        image: ''
    },		
    {
        term: 'Tablature',
        definition: 'Used in place of ordinary staff notation for some string instruments, such as the guitar. Not a true clef—the lines and spaces do not represent pitches. The lines represent the strings of an instrument (for standard 6-stringed guitars, six lines would be used). Numbers on the lines show which fret to use. Because the lines represent strings rather than pitches, the spaces between the lines are never used.',
        group: 'Clefs',
        image: ''
    },	
    {
        term: 'Rhythmic Values of Notes and Rests',
        definition: 'In American usage, musical note and rest values have names that indicate their length relative to a whole note. A half note is half the length of a whole note, a quarter note is one quarter the length, etc.',
        group: 'Rhythmic Values',
        image: ''
    },		
    /*
        Large (Latin: Maxima) / Octuple whole note	
        Long / Quadruple whole note
        Breve / Double whole note	
        Semibreve / Whole note	
        Minim / Half note	
        Crotchet / Quarter note	
        Quaver / Eighth note
    For notes of this length and shorter, the note
    has the same number of flags (or hooks) as the rest has branches.	
        Semiquaver / Sixteenth note	
        Demisemiquaver / Thirty-second note	
        Hemidemisemiquaver / Sixty-fourth note	
        Semihemidemisemiquaver / Quasihemidemisemiquaver / Hundred twenty-eighth note	
        Demisemihemidemisemiquaver / Two hundred fifty-sixth note	
    */
    {
        term: 'Beamed notes',
        definition: 'Eighth notes (quavers) and shorter notes have flags to indicate their duration, but beams can be used instead of flags to connect groups of these notes. This is usually done to indicate a rhythmic grouping but can also be used to connect notes in ametrical passages. The number of beams is equivalent to the number of flags on the note value—eighth notes are beamed together with a single beam, sixteenth notes with two, and so on. In older printings of vocal music, the use of beams is sometimes reserved for notes that are sung on one syllable of text (melisma). Modern notation of vocal music encourages the use of beaming in a consistent manner with instrumental engraving, however. In non-traditional meters, beaming is at the discretion of composers and arrangers and can be used to emphasize a rhythmic pattern.',
        group: 'Rhythmic Values',
        image: ''
    },	
    {
        term: 'Dotted note',
        definition: 'Placing a dot to the right of a notehead lengthens the note\'s duration by one-half. Additional dots lengthen the previous dot instead of the original note, thus a note with one dot is one and one half its original value, a note with two dots is one and three quarters—use of more than two dots is rare. Rests can be dotted in the same manner as notes.',
        group: 'Rhythmic Values',
        image: ''
    },	
    {
        term: 'Ghost note',
        definition: 'A ghost note has a rhythmic value but no discernible pitch. It is represented by a (saltire) cross (similar to the letter x) notehead instead of an oval. It is primarily used to represent percussive pitches or spoken words.',
        group: 'Rhythmic Values',
        image: ''
    },	
    {
        term: 'Multi-measure rest',
        definition: 'The multi-measure rest is a compact way to indicate multiple measures of rest. It is also called gathered rest or multi-bar rest.',
        group: 'Rhythmic Values',
        image: ''
    },
    
    {
        term: 'Breath mark',
        definition: 'This symbol tells the performer to take a breath (for singers and aerophones), to lift the bow and start the next note with a new bowing (for bowed instruments), or to leave a slight space (for other instruments). This marking does not affect the tempo.',
        group: 'Breaks',
        image: ''
    },
    {
        term: 'Caesura',
        definition: 'A caesura indicates a pause during which time is not counted.',
        group: 'Breaks',
        image: ''
    },
    {
        term: 'Common accidentals',
        definition: 'Accidentals modify the pitch of the notes that follow them on the same staff position within a measure, unless cancelled by an additional accidental.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Flat',
        definition: 'The flat symbol lowers the pitch of a note by one semitone.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Sharp',
        definition: 'The sharp symbol raises the pitch of a note by one semitone.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Natural',
        definition: 'A natural cancels a sharp or flat. This sharp or flat may have been indicated as an accidental or defined by the key signature.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Double flat',
        definition: 'A double flat lowers the pitch of a note by two semitones.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Double sharp',
        definition: 'A double sharp raises the pitch of a note by two semitones.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Key signatures',
        definition: 'Key signatures indicate which notes are to be played as sharps or flats in the music that follows, showing up to seven sharps or flats. Notes that are shown as sharp or flat in a key signature will be played that way in every octave—e.g., a key signature with a B♭ indicates that every B is played as a B♭. A key signature indicates the prevailing key of the music and eliminates the need to use accidentals for the notes that are always flat or sharp in that key. A key signature with no flats or sharps generally indicates the key of C major or A minor, but can also indicate that pitches will be notated with accidentals as required. The key signature examples shown here are as they would appear in treble clef.',
        group: 'Accidentals and key signatures',
        image: ''
    },
    {
        term: 'Demiflat / Half flat',
        definition: 'Lowers the pitch of a note by one quarter tone. (Another notation for the demiflat is a flat with a diagonal slash through its stem. In systems where pitches are divided into intervals smaller than a quarter tone, the slashed flat represents a lower note than the reversed flat.)',
        group: 'Microtones',
        image: ''
    },
    {
        term: 'Flat-and-a-half (sesquiflat)',
        definition: 'Lowers the pitch of a note by three quarter tones. As with a demiflat, a slashed double-flat symbol is also used.',
        group: 'Microtones',
        image: ''
    },
    {
        term: 'Demisharp / Half sharp',
        definition: 'Raises the pitch of a note by one quarter tone.',
        group: 'Microtones',
        image: ''
    },	
    {
        term: 'Sharp-and-a-half (sesquisharp)',
        definition: 'Raises the pitch of a note by three quarter tones. Occasionally represented with two vertical and three diagonal bars instead.',
        group: 'Microtones',
        image: ''
    },
    {
        term: 'Harmonic flat',
        definition: 'Lowers the pitch of a note to a pitch matching the indicated number in the harmonic series of the root (bottom) of the chord. The diagram shows a specific example, the septimal flat, in the context of a septimal minor third, in which the E♭ is tuned exactly to a 7:6 frequency ratio with the root (C).',
        group: 'Microtones',
        image: ''
    },
    
    {
        term: 'Time signatures',
        definition: 'Most music has a rhythmic pulse with a uniform number of beats—each segment of this pulse is shown as a measure. Time signatures indicate the number of beats in each measure (the top number) and also show what type of note represents a single beat (the bottom number). There may be any number of beats in a measure but the most common by far are multiples of 2 or 3 (i.e., a top number of 2, 3, 4, or 6). Likewise, any note length can be used to represent a beat, but a quarter note (indicated by a bottom number of 4) or eighth note (bottom number of 8) are by far the most common.',
    
        group: 'Time signatures',
        image: ''
    },
    {
        term: 'Simple time signatures',
        definition: 'Simple time signatures are usually classified as those with an upper number of 2, 3, or 4. This example shows that each measure is the length of three quarter notes (crotchets). 3/4 is pronounced as "three-four" or "three-quarter time".',
        group: 'Time signatures',
        image: ''
    },
    {
        term: 'Compound time signatures',
        definition: 'In a compound meter, there is an additional rhythmic grouping within each measure. This example shows 6/8 time, indicating 6 beats per measure, with an eighth note representing one beat. The rhythm within each measure is divided into two groups of three eighth notes each (notated by beaming in groups of three). This indicates a pulse that follows the eighth notes (as expected) along with a pulse that follows a dotted quarter note (equivalent to three eighth notes).',
        group: 'Time signatures',
        image: ''
    },
    {
        term: 'Complex/irregular time signatures',
        definition: 'Time signatures that cannot be classified as simple or compound, such as 5/4 or 11/8, are often called complex, irregular or odd. These time signatures cannot be evenly subdivided into groups of two or three.',
        group: 'Time signatures',
        image: ''
    },
    {
        term: 'Common time',
        definition: 'This symbol represents 4/4 time—four beats per measure with a quarter note representing one beat. It derives from the broken circle that represented "imperfect" duple meter in fourteenth-century mensural time signatures.',
        group: 'Time signatures',
        image: ''
    },
    {
        term: 'Alla breve / cut time',
        definition: 'This symbol represents 2/2 time—two beats per measure with a half-note representing one beat.',
        group: 'Time signatures',
        image: ''
    },
    {
        term: 'Metronome mark',
        definition: 'This notation is used to precisely define the tempo of the music by assigning an absolute duration to each beat. This example indicates a tempo of 120 quarter notes (crotchets) per minute. Many publishers precede the marking with letters "M.M.", referring to Maelzel\'s Metronome. This is a tempo marking, not a time signature—it is independent of how the beats are grouped (the top number in a time signature), although it defines the tempo in terms of the counting note (the bottom number).',
        group: 'Time signatures',
        image: ''
    },
    
    
    
    {
        term: 'Tie',
        definition: 'When tied together, two notes with the same pitch are played as a single note. The length of this single note is the sum of the time values of the two tied notes. The symbol for the tie and the symbol for the slur appear the same, but a tie can join only two notes of the same pitch.',
        group: 'Note relationships',
        image: ''
    },
    {
        term: 'Slur',
        definition: 'While the first note of a slurred group is articulated, the others are not. For bowed instruments this entails playing the notes in a single bow movement, for wind instruments (aerophones) the first note of the slurred group is tongued but the rest of the notes are not—they are played in one continuous breath. On other instruments, like pitched percussion instruments, the notes are connected in a phrase, as if a singer were to sing them in a single breath. In certain contexts a slur may instead indicate that the notes are to be played legato, in which case rearticulation is permitted.\nWhile the slur symbol and the tie symbol appear the same, a tie can only connect exactly two notes of the same pitch; a slur can connect two or more of any pitches. In vocal music a slur normally indicates that notes under the slur should be sung to a single syllable.\nA phrase mark (or less commonly, ligature) is visually identical to a slur but connects a passage of music over several measures. A phrase mark indicates a musical phrase and may not necessarily require that the music be slurred.',
        group: 'Note relationships',
        image: ''
    },
    {
        term: 'Glissando / Portamento',
        definition: 'A continuous, uninterrupted glide from one note to the next that includes the pitches between. Some instruments such as the violin can make this glide continuously (portamento), while other instruments such as the harp blur the discrete pitches between the start and end notes to mimic a continuous slide (glissando).',
        group: 'Note relationships',
        image: ''
    },
    {
        term: 'Tuplet',
        definition: 'A tuplet is a group of notes that would not normally fit into the rhythmic space they occupy. The example shown is a quarter-note triplet—three quarter notes are to be played in the space that would normally contain two. (To determine how many "normal" notes are being replaced by the tuplet, it is sometimes necessary to examine the context.) While triplets are the most common version, many other tuplets are possible: five notes in the space of four, seven notes in the space of eight, etc. Specific tuplets are named according to the number of grouped notes; e.g., quintuplets.',
        group: 'Note relationships',
        image: ''
    },
    {
        term: 'Chord',
        definition: 'A chord is several notes sounded simultaneously. Two-note chords are called dyads, three-note chords built by using the interval of a third are called triads.',
        group: 'Note relationships',
        image: ''
    },
    {
        term: 'Arpeggiated chord',
        definition: 'A chord with notes played in rapid succession, usually ascending, each note being sustained as the others are played. It is also called a broken chord, a rolled chord, or an arpeggio.',
        group: 'Note relationships',
        image: ''
    },
    
    {
        term: 'Dynamics',
        definition: 'Dynamics are indicators of the relative intensity or volume of a musical line.\nRarely, even softer or louder dynamic levels are indicated by adding more ps or fs. While ppp is called "pianississimo" and fff is called "fortississimo", these words (formed by adding an additional "iss") are not proper Italian.\nDynamics are relative, and the meaning of each level is at the discretion of the performer or the conductor. Laws to curb high noise levels in the workplace have changed the interpretation of very loud dynamics in some large orchestral works, as noise levels within the orchestra itself can easily exceed safe levels.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Pianississimo',
        definition: 'Extremely soft. Softer dynamics occur very infrequently and would be specified with additional ps.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Pianissimo',
        definition: 'Very soft.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Piano',
        definition: 'Soft.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Mezzo piano',
        definition: 'Moderately soft; louder than piano.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Mezzo forte',
        definition: 'Moderately loud; softer than forte. If no dynamic appears, mezzo-forte is assumed to be the default dynamic level.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Forte',
        definition: 'Loud.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Fortissimo',
        definition: 'Very loud.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Fortississimo',
        definition: 'Extremely loud. Louder dynamics occur very infrequently and would be specified with additional fs.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Sforzando / Sforzato ,(subito forzando/forzato)',
        definition: 'Literally "suddenly forced", denotes an abrupt, fierce accent on a single sound or chord. When written out in full, it applies to the sequence of sounds or chords under or over which it is placed. The weaker version is "forzando" or "forzato". Sforzando is not to be confused with rinforzando. Also written sf or fz.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Fortepiano',
        definition: 'Indicates that the note is to be played with a loud attack, and then immediately become soft.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Crescendo',
        definition: 'A gradual increase in volume.\nCan be extended under many notes to indicate that the volume steadily increases during the passage.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Diminuendo / Decrescendo',
        definition: 'A gradual decrease in volume.\nCan be extended under many notes to indicate that the volume steadily decreases during the passage.',
        group: 'Dynamics',
        image: ''
    },
    {
        term: 'Niente',
        definition: 'Meaning "nothing". May be used at the start of a crescendo to indicate "start from nothing" or at the end of a diminuendo to indicate "fade out to nothing".',
        group: 'Dynamics',
        image: ''
    },
    
    
    {
        term: 'Articulation',
        definition: 'Articulations specify the length, volume, and style of attack of individual notes. This category includes accents. Articulations can be combined with one another and may appear in conjunction with phrasing marks (above). Any of these markings may be placed either above or below a note.',
        group: 'Articulation',
        image: ''
    },
    {
        term: 'Staccato',
        definition: 'This indicates that the note should be played shorter than notated, usually half the value, leaving the rest of the metric value silent. Staccato marks may appear on notes of any value, shortening their performed duration without speeding up the music.',
        group: 'Articulation',
        image: ''
    },
    {
        term: 'Staccatissimo or Spiccato',
        definition: 'This indicates that the note should be played even shorter than staccato. It is usually applied to quarter notes or shorter notes. In the past this marking\'s meaning was more ambiguous—it was sometimes used interchangeably with staccato and sometimes indicated an accent and not a shortened note. These usages are now almost defunct but still appear in some scores. For string instruments this indicates a bowing technique in which the bow bounces lightly upon the string.',
        group: 'Articulation',
        image: ''
    },
    {
        term: 'Tenuto',
        definition: 'This symbol indicates that the note should be played at its full value, or slightly longer. It can also indicate a degree of emphasis, especially when combined with dynamic markings to indicate a change in loudness, or combined with a staccato dot to indicate a slight detachment (portato or mezzo staccato). In percussion notation, this sign indicates a slight accent.',
        group: 'Articulation',
        image: ''
    },
    {
        term: 'Fermata or Pause',
        definition: 'A fermata indicates that a note, chord, or rest is sustained longer than its written value. It will usually appear on all parts in an ensemble. The fermata is held for as long as the performer or conductor desires.',
        group: 'Articulation',
        image: ''
    },
    {
        term: 'Accent',
        definition: 'An accent indicates that a note should be played louder, or with a harder attack than surrounding unaccented notes. It may appear on notes of any duration.',
        group: 'Articulation',
        image: ''
    },
    {
        term: 'Marcato',
        definition: 'A marcato marking indicates that the note should be played louder or more forcefully than a note with a regular accent mark. In organ notation, this sign often does not indicate marcato, but instead that a pedal note should be played with the toe. When placed above the note it indicates the right foot\'s toe, and below the note it indicates the left foot\'s toe.',
        group: 'Articulation',
        image: ''
    },
    
    {
        term: 'Ornaments',
        definition: 'Ornaments modify the pitch pattern of individual notes.',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Tremolo',
        definition: 'A rapidly repeated note. If the tremolo is between two notes, then they are played in rapid alternation. The number of slashes through the stem (or number of diagonal bars between two notes) indicates the frequency to repeat (or alternate) the note. As shown here, the note is to be repeated at a demisemiquaver (thirty-second note) rate, but it is a common convention for three slashes to be interpreted as "as fast as possible", or at any rate at a speed to be left to the player\'s judgment.\nIn percussion notation, tremolos indicate rolls, diddles, and drags. Typically, a single tremolo line on a sufficiently short note (such as a sixteenth) is played as a drag, and a combination of three stem and tremolo lines indicates a double-stroke roll (or a single-stroke roll, in the case of timpani, mallet percussion and some untuned percussion instruments such as triangle and bass drum) for a period equivalent to the duration of the note. In other cases, the interpretation of tremolos is highly variable, and should be examined by the director and performers.\nThe tremolo symbol also represents flutter-tonguing.',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Trill',
        definition: 'A rapid alternation between the specified note and the next higher note (determined by key signature) within its duration, also called a "shake". When followed by a wavy horizontal line, this symbol indicates an extended, or running, trill. In music up to the time of Haydn or Mozart the trill begins on the upper auxiliary note. In percussion notation, a trill is sometimes used to indicate a tremolo. In French baroque notation, the trill, or tremblement, was notated as a small cross above or beside the note.',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Upper mordent',
        definition: 'Rapidly play the principal note, the next higher note (according to key signature) then return to the principal note for the remaining duration. In some music, the mordent begins on the auxiliary note, and the alternation between the two notes may be extended. (In other words, in some music, the upper-mordent sign means exactly the same as the trill sign.) Regardless of the style of music, the pattern finishes on the principal note. In handbells, this symbol is a "shake" and indicates the rapid shaking of the bells for the duration of the note.',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Lower mordent (inverted)',
        definition: 'Rapidly play the principal note, the note below it, then return to the principal note for the remaining duration. In much music, the mordent begins on the auxiliary note, and the alternation between the two notes may be extended.',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Gruppetto or Turn',
        definition: 'When placed directly above the note, the turn (also known as a gruppetto) indicates a sequence of upper auxiliary note, principal note, lower auxiliary note, and a return to the principal note. When placed to the right of the note, the principal note is played first, followed by the above pattern. Placing a vertical line through the turn symbol or inverting it, it indicates an inverted turn, in which the order of the auxiliary notes is reversed.',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Appoggiatura',
        definition: 'The first half of the principal note\'s duration has the pitch of the grace note (the first two-thirds if the principal note is a dotted note).',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Acciaccatura',
        definition: 'The acciaccatura is of very brief duration, as though brushed on the way to the principal note, which receives virtually all of its notated duration. In some styles of music, the acciaccatura is played exactly on the beat and the principal note is marginally late; in other styles, the acciaccatura is marginally early and the principal note is on the beat. It is also possible on some instruments to play both notes exactly on the beat and then quickly release the acciaccatura. In percussion notation, the acciaccatura symbol denotes the flam, the miniature note still positioned behind the main note but on the same line or space of the staff. The flam note is usually played just before the natural durational subdivision the main note is played on, with the timing and duration of the main note remaining unchanged. Also known by the English translation of the Italian term, crushed note, and in German as Zusammenschlag (simultaneous stroke).',
        group: 'Ornaments',
        image: ''
    },
    {
        term: 'Ottava alta',
        definition: '8va is placed above the staff to indicate that the passage is to be played one octave higher.',
        group: 'Octave signs',
        image: ''
    },
    {
        term: 'Ottava bassa',
        definition: '8vb is placed below the staff to indicate that the passage is to be played one octave lower.[10][11]',
        group: 'Octave signs',
        image: ''
    },
    {
        term: 'Quindicesima alta',
        definition: '15ma is placed above the staff to indicate that the passage is to be played two octaves higher.',
        group: 'Octave signs',
        image: ''
    },
    {
        term: 'Quindicesima bassa',
        definition: '15mb is placed below the staff to indicate that the passage is to be played two octaves lower.',
        group: 'Octave signs',
        image: ''
    },
    
    {
        term: 'Repeat signs',
        definition: 'Enclose a passage that is to be played more than once. If there is no left repeat sign, the right repeat sign sends the performer back to the start of the piece or the movement.',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Simile marks',
        definition: 'Denote that preceding groups of beats or measures are to be repeated. In the examples here, the first usually means to repeat the previous measure, and the second usually means to repeat the previous two measures. This mark is normally only used in styles of music in which the players commonly expect to play repeated patterns, and in which the mark is therefore frequently encountered; in styles where such a mark would be unusual, repeated measures are written out in full, or the "repeat sign" is used instead.',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Volta brackets (1st and 2nd endings, or 1st- and 2nd-time bars)',
        definition: 'A repeated passage is to be played with different endings on different playings. Although two endings are most common, it is possible to have multiple endings (1st, 2nd, 3rd ...).',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Da capo',
        definition: '(lit. "From top") Tells the performer to repeat playing of the music from its beginning. This is usually followed by al fine (lit. "to the end"), which means to repeat to the word fine and stop, or al coda (lit. "to the tail"), which means repeat up to the coda sign and then jump forward into the coda.',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Dal segno',
        definition: '(lit. "From the sign") Tells the performer to repeat playing of the music starting at the nearest preceding segno. This is followed by al fine or al coda just as with da capo.',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Segno',
        definition: 'Mark used with dal segno.',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Coda sign',
        definition: 'Indicates a forward jump in the music to its coda (ending passage), which is marked with the same sign. Only used after playing through a D.S. al coda (Dal segno al coda) or D.C. al coda (Da capo al coda).\nFine Marks the end of a composition or movement, usually following a repeat command such as D.C. al fine or D.S.',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },
    {
        term: 'Direct symbol',
        definition: 'Used to indicate the first note on the next staff of the following page. Similar to a catchword in literature.[12]',
        group: 'Repetition, codas, and other direction symbols',
        image: ''
    },        
];


export default function Reference(){

    //This keeps track of how terms are sorted and updates the page when the state changes
    const [sort, setSort] = useState(1);
    const [filteredTerms, setFilteredTerms] = useState([]);
    const [noMatch, setnoMatch] = useState(0);
    //Sort terms by group/category
    function SortByGroup (termlist) {
        //compare group and sort
        return termlist.sort((a,b) => a.group.localeCompare(b.group)).map((term, index) => {
            //render with group as header if it is the first term in the group
            if (index === 0 || term.group !== terms[index - 1].group) {
                return <div className="reference-div" key={term.term}>
                    <h3>{term.group}</h3>
                    <h4>{term.term}</h4>
                    <p>{term.definition}</p>
                </div>;
            }
            //all other terms in the group rendered without the group name
            else {
                return <div className="reference-div" key={term.term}>
                    <h4>{term.term}</h4>
                    <p>{term.definition}</p>
                </div>;
            }
                        
        })
    }

    //Sort terms alphabetically
    function SortAlpha (termlist) {
        //sort terms alphabetically and render them with term group and definition
        return termlist.sort((a,b) => a.term.localeCompare(b.term)).map((term, index) => {
            return <div className="reference-div" key={term.term}>
                <h4>{term.term}</h4>
                <p><strong>{term.group}</strong></p>
                <p>{term.definition}</p>
            </div>;
        })
    }

    //Render based on the value of sort, 1 for group, 2 for alphabetical
    function renderSort() {
        //If there is something in the search bar, render the filtered terms by group or alphabetically
        if (filteredTerms.length > 0) {
            if (sort == 1) {
                return SortByGroup(filteredTerms);
            }
            else if (sort == 2) {
               return SortAlpha(filteredTerms); 
            }
        }
        //If there is nothing in the search bar, render the full list of terms by group or alphabetically
        else if (noMatch == 1) {
            return <div className="reference-div"><h4>No Terms Found</h4></div>;
        }
        else {
            if (sort == 1) {
                return SortByGroup(terms);
            }
            else if (sort == 2) {
                return SortAlpha(terms); 
            }
        }
    }
    return (
        <>
          {/* Add manual top border if necessary */}
          <div className="w-full h-px bg-gray-500"></div> 
      
          <div
            className="min-h-screen w-full flex items-center justify-center p-8"
            style={{
              background: "linear-gradient(to bottom, white, #4b5583)",
              paddingBottom: "2rem",
            }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-6xl">
              <div className="reference-title">
                <h1
                  className="text-center font-bold"
                  style={{
                    fontSize: "calc(var(--h3-text-size) + 8px)",
                  }}
                >
                  Reference Guide
                </h1>
      
                <div className="term-search">
                  <input
                    type="text"
                    placeholder="Search Terms..."
                    onChange={(a) => {
                      const query = a.target.value.toLowerCase();
                      const filtered = terms.filter((term) =>
                        term.term.toLowerCase().includes(query) ||
                        term.group.toLowerCase().includes(query) ||
                        term.definition.toLowerCase().includes(query)
                      );
                      setFilteredTerms(filtered);
                      if (filtered.length === 0 && query.length > 0) {
                        setnoMatch(1);
                      } else {
                        setnoMatch(0);
                      }
                    }}
                  />
                </div>
      
                <div className="sort-buttons">
                  <button onClick={() => setSort(1)}>Sort by Category</button>
                  <button onClick={() => setSort(2)}>Sort Alphabetically</button>
                </div>
      
                {renderSort()}
              </div>
            </div>
          </div>
        </>
      );
    }      