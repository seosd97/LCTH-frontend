import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import _ from 'underscore';
import moment from 'moment';
import MainLayout from './layout/MainLayout';
import './MatchDetail.css';
import MatchDetailStat from './MatchDetailStat';
import Scoreboard from './Scoreboard';

class MatchDetail extends React.Component {
  constructor() {
    super();

    this.state = { matchData: {}, team1: {}, team2: {}, round: '1' };

    this.onChangeRound = this.onChangeRound.bind(this);
    // this.findGameId = this.findGameId.bind(this);
  }

  async componentDidMount() {
    const res = await Axios.get(
      `http://localhost:8080/matchlists/by_matchgroup/${this.props.match.params.id}`
    );

    const team1 = res.data.Teams.find(t => {
      return t.id === res.data.team1_id;
    });
    const team2 = res.data.Teams.find(t => {
      return t.id === res.data.team2_id;
    });

    this.setState({
      matchData: res.data,
      team1: team1,
      team2: team2
    });
  }

  onChangeRound(e) {
    // const tabs = e.target.parentNode.children;
    console.log(e.target.className);
    if (e.target.className.includes('selected')) {
      return;
    }

    this.setState({
      round: e.target.dataset.value
    });
  }

  findGameId(round) {
    const { matchData } = this.state;
    if (_.isEmpty(matchData)) {
      return 0;
    }

    const match = matchData.Matches.find(m => {
      return `${m.round}` === round;
    });

    if (_.isUndefined(match)) {
      return 0;
    }

    return match.game_id;
  }

  render() {
    const { matchData, team1, team2 } = this.state;

    return (
      <MainLayout>
        {!_.isEmpty(matchData) ? (
          <div className="match-detail-root flex-col flex-j-c width-100">
            <section className="detail-header">
              <h1 className="text-align-center">
                POSTGAME
                <br />
                BREAKDOWN
              </h1>
              <Scoreboard
                team1={team1.name}
                team2={team2.name}
                team1_score={matchData.team1_score}
                team2_score={matchData.team2_score}
                fontSize="2.3rem"
              />
            </section>
            <div className="match-statics flex-col flex-align-c">
              <div className="round-tab-group flex-row flex-align-c flex-j-c">
                {matchData.Matches.map((m, i) => {
                  return (
                    <div
                      key={i}
                      className={'round-tab' + (`${i + 1}` === this.state.round ? ' selected' : '')}
                      data-value={i + 1}
                      onClick={this.onChangeRound}
                    >
                      {`ROUND ${i + 1}`}
                    </div>
                  );
                })}
              </div>
              <MatchDetailStat gameId={this.findGameId(this.state.round)} />
            </div>
          </div>
        ) : (
          ''
        )}
      </MainLayout>
    );
  }
}

export default MatchDetail;
