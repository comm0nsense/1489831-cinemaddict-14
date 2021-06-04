import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { getRankName } from '../utils/rank';
import { StatPeriod } from '../utils/const';
import { getFilmsByPeriod, getTotaDuration, getCountByGenre } from '../utils/stats';

const renderChart = (statisticCtx, data) => {
  const { films, statsPeriod} = data;

  const watchedFilms = films.filter((film) => film.isAlreadyWatched);
  const watchedFilmsByPeriod = getFilmsByPeriod(watchedFilms, statsPeriod);
  const genreCounts = getCountByGenre(watchedFilmsByPeriod);
  const genres = genreCounts.map((obj) => obj.genre);
  const counts = genreCounts.map((obj) => obj.count);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data) => {
  const { films, statsPeriod} = data;

  const watchedFilms = films.filter((film) => film.isAlreadyWatched);
  const watchedFilmsByPeriod = getFilmsByPeriod(watchedFilms, statsPeriod);
  const totalDuration = getTotaDuration(watchedFilmsByPeriod);
  const totalDurationHours = totalDuration < 60 ? totalDuration : parseInt(totalDuration / 60);
  const totalDurationMins = totalDuration - totalDurationHours * 60;
  const genreCounts = getCountByGenre(watchedFilmsByPeriod);
  const topGenre = genreCounts.length === 0 ? '' : genreCounts[0].genre;

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRankName(watchedFilms)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${statsPeriod === StatPeriod.ALL ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${statsPeriod === StatPeriod.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${statsPeriod === StatPeriod.WEEK? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${statsPeriod === StatPeriod.MONTH? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${statsPeriod === StatPeriod.YEAR? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsByPeriod ? watchedFilmsByPeriod.length : '0'} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text"> ${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMins} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Stats extends SmartView {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;

    this._currentStatsPeriod = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._chart = null;
  }

  init() {
    const films = this._filmsModel.getFilms();

    this._data = {
      films,
      statsPeriod: StatPeriod.ALL,
    };

    this.updateData(films);

    if(this._chart !== null) {
      this._chart.destroy();
      this._chart = null;
    }

    this._setChart();
    this._setInnersHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnersHandler();
    this._setChart();
  }

  _setChart() {

    if(this._chart !== null) {
      this._chart.destroy();
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * 5;

    this._chart = renderChart(statisticCtx, this._data);
  }

  _periodChangeHandler(evt) {
    this._currentStatsPeriod = evt.target.value;
    this.updateData({
      statsPeriod: this._currentStatsPeriod,
    });
  }

  _setInnersHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._periodChangeHandler);
  }
}

