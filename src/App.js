import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const initialTeams = {
  "Londrina": 16,
  "Cascavel": 13,
  "ACP": 12,
  "Operário": 12,
  "Cianorte": 11,
  "Rio Branco": 10,
  "Portuguesa": 10,
  "Bandeirantes": 9,
  "Malutron": 7,
  "Maringá": 7,
  "Pinheiros": 6,
  "Matsubara": 4,
  "Colorado": 3,
  "Comercial": 0
};

const matchesList = [
  ["Colorado", "Malutron"], ["Portuguesa", "Cianorte"], ["ACP", "Operário"], 
  ["Comercial", "Pinheiros"], ["Bandeirantes", "Maringá"], ["Londrina", "Matsubara"],
  ["Maringá", "Colorado"], ["Malutron", "Comercial"], ["Cianorte", "Rio Branco"], 
  ["Cascavel", "Londrina"], ["Matsubara", "Operário"], ["Pinheiros", "Portuguesa"],
  ["Maringá", "ACP"], ["Malutron", "Bandeirantes"], ["Cianorte", "Comercial"],
  ["Cascavel", "Portuguesa"], ["Matsubara", "Rio Branco"], ["Pinheiros", "Colorado"],
  ["Colorado", "Cianorte"], ["Portuguesa", "Matsubara"], ["Rio Branco", "Operário"],
  ["ACP", "Londrina"], ["Comercial", "Cascavel"], ["Bandeirantes", "Pinheiros"],
  ["Portuguesa", "Bandeirantes"], ["Cascavel", "ACP"], ["Rio Branco", "Maringá"],
  ["Matsubara", "Cianorte"], ["Operário", "Pinheiros"], ["Londrina", "Malutron"],
  ["Operário", "Londrina"], ["Rio Branco", "Cascavel"], ["Bandeirantes", "ACP"],
  ["Maringá", "Malutron"], ["Comercial", "Colorado"], ["Londrina", "Cianorte"],
  ["Colorado", "Bandeirantes"], ["Portuguesa", "Malutron"], ["ACP", "Matsubara"],
  ["Rio Branco", "Pinheiros"], ["Operário", "Cascavel"], ["Comercial", "Maringá"],
  ["ACP", "Comercial"], ["Matsubara", "Malutron"], ["Londrina", "Rio Branco"],
  ["Operário", "Colorado"], ["Bandeirantes", "Cascavel"], ["Pinheiros", "Cianorte"],
  ["Maringá", "Portuguesa"]
];

const App = () => {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : initialTeams;
  });

  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem('scores');
    return savedScores ? JSON.parse(savedScores) : {};
  });

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
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
    </div>
  );
}

export default App;
