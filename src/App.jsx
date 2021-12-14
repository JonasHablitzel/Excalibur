import useScript from "./utils/useScript";
import Controls from "./Controls";
import Map from "./Map";
import "./App.css";
import ImgOverlay from "./ImgOverlay";
import RefImgMap from "./RefImgMap";

function App() {
  const status = useScript("https://docs.opencv.org/4.5.3/opencv.js");
  return status === "ready" ? (
    <div className="App">
      <Controls />
      <Map />
      <ImgOverlay />
      <RefImgMap />
      <div className="DragRestrictor" />
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
