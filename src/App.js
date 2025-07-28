import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const currentVersion = "2.00";  // Define the current version of your application

const initialTeams = {
  "Juventus": 19,
  "Fiorentina": 17,
  "Parma": 16,
  "Torino": 13,
  "Sampdoria": 13,
  "Palermo": 11,
  "Roma": 10,
  "Napoli": 10,
  "Atalanta": 10,
  "Lazio": 9,
  "Verona": 8,
  "Milan": 7,
  "Udinese": 3,
  "Internazionale": 0
};

const matchesList = [
  ["Napoli", "Internazionale"], ["Palermo", "Juventus"], ["Fiorentina", "Sampdoria"],
  ["Parma", "Roma"], ["Udinese", "Lazio"], ["Milan", "Atalanta"],
  ["Roma", "Fiorentina"], ["Atalanta", "Udinese"], ["Lazio", "Torino"],
  ["Internazionale", "Verona"], ["Sampdoria", "Milan"], ["Juventus", "Parma"],
  ["Atalanta", "Juventus"], ["Milan", "Internazionale"], ["Lazio", "Napoli"],
  ["Udinese", "Fiorentina"], ["Torino", "Parma"], ["Verona", "Palermo"],
  ["Torino", "Verona"], ["Lazio", "Milan"], ["Juventus", "Internazionale"], ["Napoli", "Palermo"], 
  ["Sampdoria", "Roma"], ["Roma", "Juventus"], ["Atalanta", "Palermo"], ["Internazionale", "Udinese"], 
  ["Lazio", "Palermo"], ["Torino", "Milan"], ["Sampdoria", "Napoli"], ["Verona", "Fiorentina"],
  ["Udinese", "Palermo"],["Verona", "Lazio"],["Torino", "Roma"],["Juventus", "Milan"],["Parma", "Fiorentina"],
  ["Napoli", "Atalanta"],["Internazionale", "Sampdoria"]
];

const App = () => {
  const [teams, setTeams] = useState(null);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    const savedVersion = localStorage.getItem('version');

    if (!savedVersion || savedVersion < currentVersion) {
      setTimeout(() => {
        // Clear local storage and set the current version
        localStorage.clear();
        localStorage.setItem('version', currentVersion);
        resetScores();        
      }, 300);
    } else {
      // Load from local storage
      const savedTeams = localStorage.getItem('teams');
      const savedScores = localStorage.getItem('scores');
      setTeams(savedTeams ? JSON.parse(savedTeams) : initialTeams);
      setScores(savedScores ? JSON.parse(savedScores) : {});
    }
  }, []);

  useEffect(() => {
    if (teams !== null) {
      localStorage.setItem('teams', JSON.stringify(teams));
    }
  }, [teams]);

  useEffect(() => {
    if (scores !== null) {
      localStorage.setItem('scores', JSON.stringify(scores));
    }
  }, [scores]);

  const handleScoreChange = (index, team1Score, team2Score) => {
    const newScores = { ...scores, [index]: { team1Score, team2Score } };
    setScores(newScores);
    updateStandings(newScores);
  };

  const updateStandings = (scores) => {
    const newTeams = { ...initialTeams };
    Object.entries(scores).forEach(([index, score]) => {
      const [team1, team2] = matchesList[index];
      const team1Score = score.team1Score !== "" ? score.team1Score : null;
      const team2Score = score.team2Score !== "" ? score.team2Score : null;

      if (team1Score !== null && team2Score !== null) {
        if (team1Score > team2Score) {
          newTeams[team1] += 3;
        } else if (team1Score < team2Score) {
          newTeams[team2] += 3;
        } else {
          newTeams[team1] += 1;
          newTeams[team2] += 1;
        }
      }
    });
    setTeams(newTeams);
  };

  const resetScores = () => {
    setScores({});
    setTeams(initialTeams);
    localStorage.removeItem('teams');
    localStorage.removeItem('scores');
  };

  if (teams === null || scores === null) {
    // Render nothing or a loading state until initialization is complete
    return <div>Loading...</div>;
  }

  const standings = Object.entries(teams).sort((a, b) => b[1] - a[1]);

  return (
    <div className="App container my-4">
      <h1 className="text-center mb-4">Simulador CEA</h1>      
      <button className="btn btn-danger mb-4" onClick={resetScores}>Limpar tudo</button>
      <div className="row">
        <div className="col-md-8">
          <div className="matches mb-4 row">
            {matchesList.map(([team1, team2], index) => (
              <div key={index} className="match row mb-2 align-items-center">
                <div className="col-4 col-md-4">
                  <span>{team1}</span>
                </div>
                <div className="col-2 col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={scores[index]?.team1Score || ""}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleScoreChange(index, e.target.value !== "0" ? parseInt(e.target.value) : "0", scores[index]?.team2Score !== undefined ? scores[index].team2Score : "0")}
                  />
                </div>
                <div className="col-1 text-center">&nbsp;X&nbsp;</div>
                <div className="col-2 col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={scores[index]?.team2Score || ""}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleScoreChange(index, scores[index]?.team1Score !== undefined ? scores[index].team1Score : "0", e.target.value !== "0" ? parseInt(e.target.value) : "0")}
                  />
                </div>
                <div className="col-3 col-md-2">{team2}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Time</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {standings.map(([team, points]) => (
                <tr key={team}>
                  <td>{team}</td>
                  <td>{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <small>version {currentVersion}</small>
    </div>
  );
};

export default App;