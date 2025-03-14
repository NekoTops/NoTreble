import LevelButton from "../component/LevelButton"

export default function Lessons(){
    const Columns = () =>
    <div className="grid grid-cols-3 mt-4">
    <div className="col-span-1 font-bold text-3xl text-center">Scales</div>
    <div className="col-span-1 font-bold text-3xl text-center">Rhythm</div>
    <div className="col-span-1 font-bold text-3xl text-center">Dynamics</div>
    <LevelButton level = {1} address ="/Lessons/Fundamentals" ></LevelButton>
    <LevelButton level = {1} address ="/" ></LevelButton>
    <LevelButton level = {1} address ="/" ></LevelButton>
    <LevelButton level = {2} address ="/" ></LevelButton>
    <LevelButton level = {2} address ="/" ></LevelButton>
    <LevelButton level = {2} address ="/" ></LevelButton>
    <LevelButton level = {3} address ="/" ></LevelButton>
    <LevelButton level = {3} address ="/" ></LevelButton>
    <LevelButton level = {3} address ="/" ></LevelButton>
    <LevelButton level = {4} address ="/" ></LevelButton>
    <LevelButton level = {4} address ="/" ></LevelButton>
    <LevelButton level = {4} address ="/" ></LevelButton>
    </div>

    
    return (
        <main>
        <h1 className="text-center font-bold text-4xl mt-6">Music Theory Lessons</h1>    
        <div className= "mb-6 bg-gray-200 p-10 rounded-lg shadow-lg w-lg mt-4 ">
        <Columns/>
        </div>
        </main>
    );
}