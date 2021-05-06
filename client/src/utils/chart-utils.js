import { func } from "prop-types";

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

export const CHART_STRINGS = ["Race/Ethnicity", "Religion", "Gender/Sexuality", "Miscellaneous"]

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
export function getChartData(chart, allData, state) {

  if (state == 'none') {
    // All of USA
    allData = Object.values(allData).reduce(((p, c) => c instanceof Object ? p.concat(c.children) : p), [])
  } else {
    allData = allData[state].children;
  }

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
  let ret = {labels: [], counts: []}
  Object.entries(agg).sort(([k1,], [k2,]) => k1 > k2 ? 1 : -1).forEach(([k, v]) => {
    ret.labels.push(k);
    ret.counts.push(v);
  })
  return ret;
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
  let ret = {labels: [], counts: []}
  Object.entries(agg).sort(([k1,], [k2,]) => k1 > k2 ? 1 : -1).forEach(([k, v]) => {
    ret.labels.push(k);
    ret.counts.push(v);
  })
  return ret;
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
  let ret = {labels: [], counts: []}
  Object.entries(agg).sort(([k1,], [k2,]) => k1 > k2 ? 1 : -1).forEach(([k, v]) => {
    ret.labels.push(k);
    ret.counts.push(v);
  })
  return ret;
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
  let ret = {labels: [], counts: []}
  Object.entries(agg).sort(([k1,], [k2,]) => k1 > k2 ? 1 : -1).forEach(([k, v]) => {
    ret.labels.push(k);
    ret.counts.push(v);
  })
  return ret;
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
  let ret = {labels: [], counts: []}
  CHART_STRINGS.forEach(chart => {
    ret.labels.push(chart)
    ret.counts.push(agg[chart])
  })
  return ret;
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
const covidDescription = ["Description"]


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


const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]



function splitByWords(words) {
  // split string by spaces (including spaces, tabs, and newlines)
  const lowerWords = words.toLowerCase()
  const wordsArray = lowerWords.replace(/[^A-Za-z ]/g, '').split(/\s+/);
  const condensedArray = wordsArray.filter((word)=> word.length > 3).filter((word)=> !stopWords.includes(word))
  // console.log(condensedArray)

  return condensedArray;
}

function createWordMap(wordsArray) {

  // create map for word counts
  const wordsMap = {};
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}

function sortByCount (wordsMap,stateKeys) {

  // sort by count in descending order
  var tempWordsArray = [];
  tempWordsArray = Object.keys((wordsMap)).map(function (key) {
    return {
      text: key,
      value: wordsMap[key]
    };

  });

  tempWordsArray.sort(function (a, b) {
    return b.total - a.total;
  });
  return tempWordsArray

  const tempWords = tempWordsArray.reduce(((accum, wordobj) => {
    if(!accum.hasOwnProperty(wordobj.name)) {
      accum[wordobj.name] = 1;
    } else {
      accum[wordobj.name]++;
    }
    return accum;
   }), {})
  console.log(tempWordsArray)

// I HATE REDUCTIONNNNNNNNNNNNNNNNNNNNNNNNNNN -Albert
   let finalWordsArray =[]
   finalWordsArray = Object.keys(tempWords).map(totals => ({name: totals, total: tempWords[totals]}));

  console.log(finalWordsArray);
  
  // Object.keys(finalresult).map(totals => ({name: totals, total: finalresult[totals]}));
  
  
  
  
  return finalWordsArray;




}

function mergeCounts(arr1, arr2) {
  arr2.forEach(wordobj => {
    if (arr1.find(e => e.text == wordobj.text)) {
      arr1.value += wordobj.value
    } else {
      arr1.push(wordobj);
    }
  })
}

export function takeTop(arr) {
  return arr.sort((a, b) => b.value - a.value).slice(0,30);
}

export function wordCloudReducer(p, c) {
  mergeCounts(p, sortByCount(createWordMap(splitByWords(c.description))));

  // console.log(p);

  return p;
}

// function for summarizing word cloud and reducing
export function summarizeWordCloud(reportWords){
  // console.log(reportWords.state)  
  const stateKeys = reportWords.state
  const wordsArray = splitByWords(reportWords.description)
  const wordsMap = createWordMap(wordsArray);
  const finalWordsArray = sortByCount(wordsMap,stateKeys);
  // console.log(finalWordsArray)
  return finalWordsArray
}

function reduceWordCloud(item){
  // console.log(item)
  return item
  // let currentWords = currTopWords

    // // const finalWordsArray = sortByCount();
    // console.log(finalWordsArray)
    // return finalWordsArray
  }
  
  //   finalWordsArray.concat(s).slice(0,10)
  //   console.log(finalWordsArray)
  //   return finalWordsArray
  // }

// end function for word cloud

function mergeArrayObjects(arr1,arr2){
  return arr1.map((item,i)=>{
     if(item.id === arr2[i].id){
         //merging two objects
       return Object.assign({},item,arr2[i])
     }
  })
}


export const getCovidChartData = (data, state) => {
  let chartData = covidChartData;
  // let wordClouddata = 
  if (state != "none")
  {
    // filter by state first
    data = { state: data[state] }
  }

  chartData[0].datasets[0].data = covidRE.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.ethnicity.includes(filt)).length), 0)) // map from data.ethnicity::aggregate
  chartData[1].datasets[0].data = covidGender.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.gender.includes(filt)).length), 0)) // map from data.gender::aggregate
  chartData[2].datasets[0].data = covidType.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.type.includes(filt)).length), 0)) // map from data.type::aggregate

  
  // use objectvaluereport.description
  // chartData[3] = Object.values(data).filter(val => val instanceof Object).map(state => state.children.map(objectValueReport => summarizeWordCloud(objectValueReport)))
  
  // produces an array of each state, each state is referred to as children
  
  
  // console.log(chartData[3])
  // chartData[3] = wordCloudData.map(item => {
  //   const container = {};

  //   container[item.name] = item.name;
  //   container.total = item.total;

  //   return container;
  // })


// need to reduce 
  // .reduce( (reduceWordCloud(current,s)), 0);

  // .map(objectValueReport => summarizeWordCloud(objectValueReport)).reduce( (reduceWordCloud(current,s)), 0);
  
  // chartData[3].datasets[0].data = covidOther.map(filt => Object.values(data).filter(val => val instanceof Object).reduce( ((prev, s) => prev+s.children.filter(c => c.other.includes(filt)).length), 0)) // map from data.Other::aggregate
  
  return chartData
}