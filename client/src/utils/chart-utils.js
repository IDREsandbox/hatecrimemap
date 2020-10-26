export const CHARTS = {
  RACE_ETHNICITY: 1,
  RELIGION: 2,
  GENDER_SEXUALITY: 3,
  OTHER: 4,
  TOP: 5
}

export const COVID_CHARTS = {
  TOP: 0,
  RACE_ETHNICITY: 1,
  GENDER_SEXUALITY: 2,
  HARASSMENT_TYPE: 3,
  OTHER: 4
}

export const CHART_STRINGS = ["Race/Ethnicity", "Religion", "Gender/Sexuality", "Other"]

// var raceData = 
// // ( ({ african_american, arab, asian_american, latinx, native_american, pacific_islander, immigrants, white }) => ({ african_american, arab, asian_american, latinx, native_american, pacific_islander, immigrants, white }) )(statetotals[currentState]);
// var religionData = [];
// //( ({jewish, muslim, sikh}) => ({jewish, muslim, sikh}) )(statetotals[currentState]);
// var genderData = [];
// //( ({lgbt, women, girls, men, boys}) => ({lgbt, women, girls, men, boys}) )(statetotals[currentState]);
// var otherData = [];
// //( ({disabled, trump_supporter, others}) => ({disabled, trump_supporter, others}))(statetotals[currentState]);

const CHART_COLORS = ["#003f5c", "#f95d6a", "#665191", "#d45087", "#ffa600", "#a05195", "#ff7c43", "#2f4b7c"]

const RACE_LABELS = ["African American", "Asian", "Latinx", "Native American/Indigenous", "White", "Other Race/Ethnicity"]
const RELIGION_LABELS = ["Anti-Jewish", "Anti-Christian", "Anti-Muslim", "Other Religion"]
const GENDER_LABELS = ["Male", "Female", "Transgender", "LGBTQ+", "Non-Binary", "Other Gender/Sexuality"]
const MISC_LABELS = ["Immigrant", "Disabled", "National Origin", "Unknown", "Other Miscellaneous"]

var raceChartData = {
  datasets: [
  {
    label:"Number of Hate Crimes against Race Groups",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }]
};

var religionChartData = {
  datasets: [
  {
    label:"Number of Hate Crimes against Religious Groups",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }]
};
var genderChartData = {
  datasets: [
  {
    label:"Number of Hate Crimes based on Gender",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }]
};
var otherChartData = {
  datasets: [
  {
    label:"Number of Hate Crimes against Other Groups",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }]
};
var topChartData = {
  datasets: [
  {
    label:"Number of Hate Crimes",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }]
}

// Could make a single function, but this should allow us to customize chart colors more easily in the future
export function getChartData(chart, allData) {
  let chartData;
  let data;
  if (chart === CHARTS.RACE_ETHNICITY) {
    chartData = raceChartData;
    data = mapRE(allData);
  } else if (chart === CHARTS.RELIGION) {
    chartData = religionChartData;
    data = mapReligion(allData);
  } else if (chart === CHARTS.GENDER_SEXUALITY) {
    chartData = genderChartData;
    data = mapGender(allData);
  } else if (chart === CHARTS.OTHER) {
    chartData = otherChartData;
    data = mapOther(allData);
  } else if (chart === CHARTS.TOP) {
    chartData = topChartData;
    data = mapTop(allData);
  }

  // if (chart !== CHARTS.TOP) {
  //   // Sort the counts
  //   data = mapData(allData, true);
  // }

  console.log(data);

  chartData.datasets[0].data = data.counts; // because we don't want "counts" => undefined
  chartData.labels = data.labels;
  return chartData;
}

const mapRE = (data) => {
  const agg = data.filter(e => RACE_LABELS.includes(e.group)).reduce((p, c) => {
    if (!p.hasOwnProperty(c.group)) {
      p[c.group] = 1;
    } else {
      p[c.group]++;
    }
    return p;
  }, {});
  return ({
    labels: Object.keys(agg),
    counts: Object.values(agg)
  });
}

const mapReligion = (data) => {
  const agg = data.filter(e => RELIGION_LABELS.includes(e.group)).reduce((p, c) => {
    if (!p.hasOwnProperty(c.group)) {
      p[c.group] = 1;
    } else {
      p[c.group]++;
    }
    return p;
  }, {});
  return ({
    labels: Object.keys(agg),
    counts: Object.values(agg)
  });
}

const mapGender = (data) => {
  const agg = data.filter(e => GENDER_LABELS.includes(e.group)).reduce((p, c) => {
    if (!p.hasOwnProperty(c.group)) {
      p[c.group] = 1;
    } else {
      p[c.group]++;
    }
    return p;
  }, {});
  return ({
    labels: Object.keys(agg),
    counts: Object.values(agg)
  });
}

const mapOther = (data) => {
  const agg = data.filter(e => MISC_LABELS.includes(e.group)).reduce((p, c) => {
    if (!p.hasOwnProperty(c.group)) {
      p[c.group] = 1;
    } else {
      p[c.group]++;
    }
    return p;
  }, {});
  return ({
    labels: Object.keys(agg),
    counts: Object.values(agg)
  });
}

const mapTop = (data) => {
  const agg = data.filter(e => (e.parent=="Race/Ethnicity" && RACE_LABELS.includes(e.group))
    || (e.parent=="Gender/Sexuality" && GENDER_LABELS.includes(e.group))
    || (e.parent=="Religion" && RELIGION_LABELS.includes(e.group))
    || (e.parent=="Miscellaneous" && MISC_LABELS.includes(e.group))).reduce((p, c) => {
    if (!p.hasOwnProperty(c.parent)) {
      p[c.parent] = 1;
    } else {
      p[c.parent]++;
    }
    return p;
  }, {});
  return ({
    labels: Object.keys(agg),
    counts: Object.values(agg)
  });
}

const mapData = (data, sort=false) => {
  // [[label, {count: 0}], [label, {count: 1}]]
  data = Object.entries(data).filter(([key, obj]) => obj && (obj.count || obj.count===0))
  if (sort) {
    data.sort((a, b) => {
      return (a[1].count < b[1].count) ? -1 : ((a[1].count==b[1].count) ? 0 : 1)
    })
  }
  return ({
            labels: data.map(([label, x]) => label),
            counts: data.map(([parent, counts]) => counts.count)
          })
};

export const sumData = (data) => {
  return Object.entries(data).filter(([key, obj]) => obj && (obj.count || obj.count===0)).map(([key, obj]) => obj.count).reduce((a, b) => a+b)
}


const covidRE = ["Asian", "Native American/Indigenous", "African American", "Latinx", "White", "Other"]
const covidGender = ["Male", "Female", "Other"]
const covidType = ["Verbal", "Physical", "Coughing/Spitting", "Online", "Other"]
const covidOther = ["Unknown"]


var covidChartData = [
{
  datasets: [
  {
    label:"Race/Ethnicity",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }],
  labels: covidRE
},
{
  datasets: [
  {
    label:"Gender",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }],
  labels: covidGender
},
{
  datasets: [
  {
    label:"Type of Harassment",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }],
  labels: covidType
},
{
  datasets: [
  {
    label:"Other",
    backgroundColor: CHART_COLORS.map(c => c + "33"),
    borderColor: CHART_COLORS,
    borderWidth: 1,
    hoverBackgroundColor: CHART_COLORS.map(c => c + "66"),
    hoverBorderColor: CHART_COLORS
  }],
  labels: covidOther
},
]

export const getCovidChartData = (data, state) => {
  let chartData = covidChartData;
  if (state != "none")
  {
    // filter by state first
    data = { state: data[state] }
  }

  chartData[0].datasets[0].data = covidRE.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.ethnicity.includes(filt)).length), 0)) // map from data.ethnicity::aggregate
  chartData[1].datasets[0].data = covidGender.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.gender.includes(filt)).length), 0)) // map from data.gender::aggregate
  chartData[2].datasets[0].data = covidType.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.type.includes(filt)).length), 0)) // map from data.type::aggregate
  // chartData[3].datasets[0].data = covidOther.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.other.includes(filt)).length), 0)) // map from data.Other::aggregate
  
  return chartData
}