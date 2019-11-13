export const CHARTS = {
  RACE_ETHNICITY: 1,
  RELIGION: 2,
  GENDER_SEXUALITY: 3,
  OTHER: 4
}

// var raceData = 
// // ( ({ african_american, arab, asian_american, latinx, native_american, pacific_islander, immigrants, white }) => ({ african_american, arab, asian_american, latinx, native_american, pacific_islander, immigrants, white }) )(statetotals[currentState]);
// var religionData = [];
// //( ({jewish, muslim, sikh}) => ({jewish, muslim, sikh}) )(statetotals[currentState]);
// var genderData = [];
// //( ({lgbt, women, girls, men, boys}) => ({lgbt, women, girls, men, boys}) )(statetotals[currentState]);
// var otherData = [];
// //( ({disabled, trump_supporter, others}) => ({disabled, trump_supporter, others}))(statetotals[currentState]);

var raceChartData = {
  labels: ["Jewish", "African American", "Arab", "Asian American", "Chinese", "Native American/Indigenous", "Latinx", "Pacific Islander", "White"],
  datasets: [
  {
    label:"Number of Hate Crimes against Race Groups",
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)'
  }]
};

var religionChartData = {
  labels: ["Muslim", "Sikh"],
  datasets: [
  {
    label:"Number of Hate Crimes against Religious Groups",
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)'
  }]
};
var genderChartData = {
  labels: ["Male", "Female", "Non-Binary", "LGBTQ"],
  datasets: [
  {
    label:"Number of Hate Crimes based on Gender",
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)'
  }]
};
var otherChartData = {
  labels: ["Trump Supporter", "Disabled", "Immigrants", "Other"],
  datasets: [
  {
    label:"Number of Hate Crimes against Other Groups",
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)'
  }]
};

// Could make a single function, but this should allow us to customize chart colors more easily in the future
export function getChartData(chart, allData) {
  var chartData;
  var data;
  if (chart === CHARTS.RACE_ETHNICITY) {
    chartData = raceChartData;
    data = getRaceData(allData);
  } else if (chart === CHARTS.RELIGION) {
    chartData = religionChartData;
    data = getReligionData(allData);
  } else if (chart === CHARTS.GENDER_SEXUALITY) {
    chartData = genderChartData;
    data = getGenderData(allData);
  } else if (chart === CHARTS.OTHER) {
    chartData = otherChartData;
    data = getOtherData(allData);
  }

  chartData.datasets[0].data = data;
  return chartData;
}

// TODO: move labels to globals for consistency
const getRaceData = (data) => (
  [
    data['jewish'],
    data['african_american'], data['arab'],
    data['asian_american'], data['chinese'], 
    data['native_american'], data['latinx'], data['pacific_islander'],
    data['white']
  ]
);

const getReligionData = (data) => (
  [
    data['muslim'],
    data['sikh']
  ]
);

const getGenderData = (data) => (
  [
    data['male'], data['female'], data['nonbinary']
  ]
);

const getOtherData = (data) => (
  [
    data['trump_supporter'],
    data['diabled'],
    data['immigrants'],
    data['others']
  ]
);

export const wholeYAxis = {scales: {
      yAxes: [{
        ticks: {
          // beginAtZero:true,
          // callback: function(value) {if(value % 1 ===0) {return value;}},
          min: 0,
          max: 30
          // stepSize: 1
        }
      }]
    }};
