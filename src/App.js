import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const currentVersion = "1.04";  // Define the current version of your application

const initialTeams = {
  "Londrina": 22,
  "Cascavel": 16,
  "ACP": 24,
  "Operário": 13,
  "Cianorte": 21,
  "Rio Branco": 20,
  "Portuguesa": 20,
  "Bandeirantes": 21,
  "Malutron": 16,
  "Maringá": 11,
  "Pinheiros": 15,
  "Matsubara": 5,
  "Colorado": 3,
  "Comercial": 0
};

const matchesList = [
  ["Operário", "Londrina"], ["Rio Branco", "Cascavel"], ["Bandeirantes", "ACP"],
  ["Maringá", "Malutron"], ["Comercial", "Colorado"], ["Londrina", "Cianorte"],
  ["Colorado", "Bandeirantes"], ["Portuguesa", "Malutron"], ["ACP", "Matsubara"],
  ["Rio Branco", "Pinheiros"], ["Operário", "Cascavel"], ["Comercial", "Maringá"],
  ["ACP", "Comercial"], ["Matsubara", "Malutron"], ["Londrina", "Rio Branco"],
  ["Operário", "Colorado"], ["Bandeirantes", "Cascavel"], ["Pinheiros", "Cianorte"],
  ["Maringá", "Portuguesa"]
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