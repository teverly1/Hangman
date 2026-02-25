import './App.scss';
import Gameboard from './components/gameboard';
import Header from './components/header';
// import BackgroundVideo from './components/backgroundvideo';
// import DynamicVideoLoader from './components/dynamicvideoloader';

function App() {
  return (
    <div className="App">
      {/* <BackgroundVideo videoId="SfWRbHOUEdU" /> */}
      {/* <DynamicVideoLoader videoName="365-136081982_tiny"></DynamicVideoLoader> */}
      <Header></Header>
      <Gameboard></Gameboard>
    </div>
  );
}

export default App;
