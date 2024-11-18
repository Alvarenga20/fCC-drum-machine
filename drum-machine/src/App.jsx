import { useState, useRef, useEffect } from 'react';
import './App.css';
import soundBanks from './assets/soundBanks.json';

function App() {
  const [displayText, setDisplayText] = useState('');
  const [powerBtn, setPowerBtn] = useState('ON');
  const [isDefaultBank, setIsDefaultBank] = useState(true);
  const [bankSongs, setBankSongs] = useState(soundBanks.bank1);
  const [toggleBtnStr, setToggleBtnStr] = useState('Bank 1');
  const [volume, setVolume] = useState(0.5);

  const audioRefs = {
    Q: useRef(null),
    W: useRef(null),
    E: useRef(null),
    A: useRef(null),
    S: useRef(null),
    D: useRef(null),
    Z: useRef(null),
    X: useRef(null),
    C: useRef(null)
  };

  const bankToggle = () => {
    setIsDefaultBank(prevState => !prevState);
    setBankSongs(isDefaultBank ? soundBanks.bank1 : soundBanks.bank2);
    setToggleBtnStr(isDefaultBank ? "Bank 2" : "Bank 1");
  }

  useEffect(() => {
    if(powerBtn === 'ON') {
      const handleChange = (e) => {
        const key = e.key.toUpperCase();
        if (audioRefs[key]) {
          audioRefs[key].current.play();
        }
        const buttonId = document.getElementById(key).parentElement.id;
        setDisplayText(buttonId);
        audioRefs[key].current.volume = volume;
      }
      document.addEventListener("keydown", handleChange)
      return () => {
        document.removeEventListener("keydown", handleChange)
      }
    }
  }, [audioRefs, powerBtn, volume])

  const playSong = (key) => {
    if(powerBtn === 'ON') {
      audioRefs[key].current.play();
      const buttonId = document.getElementById(key).parentElement.id;
      setDisplayText(buttonId);
      audioRefs[key].current.volume = volume;
    }  
  }

  const handleVolume = (e) => {
    setVolume(e.target.value);
    setDisplayText(`Volume: ${Math.round(volume * 100)}%`)
  }

  return (
    <div className="background">
      <div id="drum-machine">
        <div id="songs-btn">
          {['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'].map((key, index) => (
            <button key={key} onClick={() => playSong(key)} className="drum-pad" id={bankSongs[index].songName}>
              <strong>{key}</strong>
              <audio ref={audioRefs[key]} className="clip" id={key} src={bankSongs[index].songUrl} />
            </button>
          ))}
        </div>  
        <div id="other-controls">
          <button onClick={() => setPowerBtn(prevState => prevState === 'ON' ? 'OFF' : 'ON')} id="power-btn">
            <strong></strong>Power: {powerBtn}
          </button>
          <div id="display">
            <strong>{displayText}</strong>
          </div>
          {/*Volume Control Slide:*/}
          <div id="volume-control">
            <input 
              type="range"
              id="volume"
              min="0"
              max="1"
              step="0.01" 
              value={volume}
              onChange={handleVolume}
            />
          </div>
          <button onClick={() => bankToggle()} id="bank-btn">
            <strong>{toggleBtnStr}</strong>
          </button>
        </div>  
      </div>
    </div>
  );
}

export default App
