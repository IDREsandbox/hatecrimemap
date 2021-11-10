import axios from 'axios';

// TODO get rid of state
var _stateData = {};
var _countyData = {};

const STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
    "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
    "Texas", "Utah", "United States Virgin Islands", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Puerto Rico"
]

export const covidColors = ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"] // made the first two the same since the second bin isnt used ffffd4 was the original
//export const defaultColors = ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"] // lightest to darkest
//export const defaultColors =  ["#a11506", "#d04814","#ef6a1d","#ff8e33","#ffb454"] //(first orange set tried)
const colors = ["#a11506", "#d04814", "#ef6a1d", "#ff8e33", "#ffb454"];
// #582c0e|#914505|#c85700|#ff6e00|#ffa200
//export const defaultColors = ["#584100", "#886200", "#b78300", "#e7a300", "#ffc800"];
//export const defaultColors = ["#eee4d7", "#e7b439", "#e19c18", "#c73915", "#9a2d19"]
// #582c0e|#914505|#c85700|#ff6e00|#ffa200
//export const defaultColors = [ "#5f0000", "#be2d00", "#de4a00", "#ff6600", "#ff8008"];


//export const defaultColors = ["#212320", "#86310d","#B34211" ,"#CA4A13","#E05215"]// email set, dark orange ish

//export const defaultColors = ["#560000", "#7a0100", "#9e0200", "#b60200", "#ef0300"]; // 'dark red' 
export const defaultColors = ["#212320", "#007b7b", "#00a4a4", "#00cccc", "#00ffff"];


function storeStateDataReports(data) {
    let stateData = {}
    STATES.forEach(state => {
        stateData[state] = { count: 0, children: [] }
    })

    data.forEach(report => {
        if (stateData[report.state]) {
            if (!report.link || !report.link.includes("http")) report.link = "";
            if (!report.date) report.date = "Unknown";
            stateData[report.state].children.push(report);
        }
    })

    let max = 0
    Object.keys(stateData).forEach(state => {
        stateData[state].count = stateData[state].children.length
        if (stateData[state].count > max) {
            max = stateData[state].count
        }
    })
    stateData.max = max


    return stateData
}

export function filterPublishedReports(data) { // Outdated -> still called in homepage but commented out
    let newData = {}
    STATES.forEach(state => {
        newData[state] = { count: 0, children: [] }
    })

    let newMax = 0;
    Object.keys(newData).forEach(state => {
        if (data[state] instanceof Object) {
            newData[state].children = data[state].children.filter(e => e.published);
            newData[state].count = newData[state].children.length;
            if (newData[state].count > newMax) newMax = newData[state].count;
        }
    })
    newData.max = newMax;
    return newData;
}

export function storeStateData(data, start) {
    // `/api/totals/` returns: {name, parent, group, count}[]

    // let maxGroup = 0;
    let stateData = start
        // secondary groups. does not work for deeper nested groups yet
    data.forEach(state_group => {
        let { name, parent, group, count } = state_group;
        // we want to remove this if statement, the StateStructure should exactly reflect the data
        if (stateData[name][parent].children[group]) // skip those whose groups don't match with that incident's primary group
        {
            count = parseInt(count)
            stateData[name][parent].children[group].count = count
            stateData[name].count += count
        }
    })

    let maxState = 0;

    // aggregate primary groups' counts
    for (let key in stateData) {
        let state = stateData[key]
        if (state.count > maxState) maxState = state.count; // max total of all states, for coloring
        for (let parent in state) {
            if (!(state[parent] instanceof Object)) continue; // not a parent
            state[parent].count = Object.values(state[parent].children).reduce((a, b) => ({ count: a.count + b.count }), ({ count: 0 })).count
        }
    }


    stateData.max = maxState;
    return JSON.parse(JSON.stringify(stateData)); // return copy of object
}


export function counts_total(data) {
    return data.reduce((a, b) => a + b.count, 0);
}

// Issue with these "max" is we need all the values to iterate over, so we can't generalize easily
export function counts_maxPrimary(data) {
    let fields = ["Race/Ethnicity", "Religion", "Gender/Sexuality", "Miscellaneous"];
    return Math.max(...fields.map(field => counts_aggregateBy(data, 'primary_reason', field)))
}

export function counts_maxCounties(data) {
    return Math.max(Object.values(data.reduce((accumulate, row) => {
        let county = row['county'];
        if (accumulate[county]) accumulate[county] += row.count;
        else accumulate[county] = row.count;
        return accumulate;
    }, {})));
}

export function counts_maxState(data) {
    let fields = STATES;
    return Math.max(...fields.map(field => counts_aggregateBy(data, 'state', field)))
}

export function counts_aggregateBy(data, field, value) {
    return data.filter(part => part[field] == value).reduce((a, b) => a + b.count, 0);
}

export function counts_aggregateByAll(data, fieldValues) {
    return data.filter(part => fieldValues.every(fv => part[fv[0]] == fv[1])).reduce((a, b) => a + b.count, 0);
}

export function counts_aggregateRange(data, field, low, high) {
    return data.filter(part => part[field] >= low && part[field] <= high).reduce((a, b) => a + b.count, 0);
}

export function getDataCounts() {
    return axios.get('/api/totals/')
        .then(res => res.data.result)
        .catch((err) => {
            alert(`API call failed: ${err}`);
            return {};
        });
}

export function getStateDataReports() {
    return axios.get('/api/totals/reports')
        .then(res => { return storeStateDataReports(res.data.result) })
        .catch((err) => {
            alert(`API call failed: ${err}`);
            return {};
        });
}


function formatCovidData(data) {
    let stateData = {}
    STATES.forEach(state => {
        stateData[state] = { count: 0, children: [] }
    })

    data.forEach(report => {
        if (stateData[report.state]) {
            if (!report.link.includes("http")) report.link = "";
            stateData[report.state].children.push(report);
            if (report.description) {
                const description = report.description
                    // console.log(description)

            }
        }

    })

    let max = 0
    Object.keys(stateData).forEach(state => {
        stateData[state].count = stateData[state].children.length
        if (stateData[state].count > max) {
            max = stateData[state].count
        }
    })



    stateData.max = max
        // const wordData = ['test']
        // const stateData = stateData
        // console.log(stateData)
    return stateData
}

export async function getCovidData() {
    return axios.get('/api/totals/covid')
        .then(res => { return formatCovidData(res.data.result) })
        .catch((err) => {
            alert(`API call failed: ${err}`);
            return {};
        });
}

export function hashColor(sum, max, colorBin = defaultColors) {
    let colorHashed;
    if (sum < max / 10) colorHashed = colorBin[0];
    else if (sum < max / 8) colorHashed = colorBin[1];
    else if (sum < max / 5) colorHashed = colorBin[2];
    else if (sum < max / 3) colorHashed = colorBin[3];
    else if (sum < max + 1) colorHashed = colorBin[4];

    return colorHashed;
}

export function hashCovidColor(sum, max, colorBin = covidColors) {
    let colorHashed;
    if (sum === 0) colorHashed = '#cccccc';
    else if (sum < max / 10) colorHashed = colorBin[0];
    else if (sum < max / 8) colorHashed = colorBin[1];
    else if (sum < max / 5) colorHashed = colorBin[2];
    else if (sum < max / 3) colorHashed = colorBin[3];
    else if (sum < max + 1) colorHashed = colorBin[4];

    return colorHashed;
}

export const countyDisplayName = (county, state) => {
    if (state) { // plan to implement a version for the main sidebar title
        return county.substr(0, county.length - 3) + ` County, ` + state
    }
}


const idReference = {
    "01": "Alabama",
    "02": "Alaska",
    "04": "Arizona",
    "05": "Arkansas",
    "06": "California",
    "08": "Colorado",
    "09": "Connecticut",
    "10": "Delaware",
    "11": "District of Columbia",
    "12": "Florida",
    "13": "Georgia",
    "15": "Hawaii",
    "16": "Idaho",
    "17": "Illinois",
    "18": "Indiana",
    "19": "Iowa",
    "20": "Kansas",
    "21": "Kentucky",
    "22": "Louisiana",
    "23": "Maine",
    "24": "Maryland",
    "25": "Massachusetts",
    "26": "Michigan",
    "27": "Minnesota",
    "28": "Mississippi",
    "29": "Missouri",
    "30": "Montana",
    "31": "Nebraska",
    "32": "Nevada",
    "33": "New Hampshire",
    "34": "New Jersey",
    "35": "New Mexico",
    "36": "New York",
    "37": "North Carolina",
    "38": "North Dakota",
    "39": "Ohio",
    "40": "Oklahoma",
    "41": "Oregon",
    "42": "Pennsylvania",
    "44": "Rhode Island",
    "45": "South Carolina",
    "46": "South Dakota",
    "47": "Tennessee",
    "48": "Texas",
    "49": "Utah",
    "50": "Vermont",
    "51": "Virginia",
    "53": "Washington",
    "54": "West Virginia",
    "55": "Wisconsin",
    "56": "Wyoming",
    "60": "American Samoa",
    "66": "Guam",
    "69": "Commonwealth of the Northern Mariana Islands",
    "72": "Puerto Rico",
    "78": "United States Virgin Islands",
}

const nth = {
    "01": "Alabama",
    "04": "Arizona",
    "05": "Arkansas",
    "06": "California",
    "08": "Colorado",
    "09": "Connecticut",
    "10": "Delaware",
    "11": "District of Columbia",
    "12": "Florida",
    "13": "Georgia",
    "16": "Idaho",
    "17": "Illinois",
    "18": "Indiana",
    "19": "Iowa",
    "20": "Kansas",
    "21": "Kentucky",
    "22": "Louisiana",
    "23": "Maine",
    "24": "Maryland",
    "25": "Massachusetts",
    "26": "Michigan",
    "27": "Minnesota",
    "28": "Mississippi",
    "29": "Missouri",
    "30": "Montana",
    "31": "Nebraska",
    "32": "Nevada",
    "33": "New Hampshire",
    "34": "New Jersey",
    "35": "New Mexico",
    "36": "New York",
    "37": "North Carolina",
    "38": "North Dakota",
    "39": "Ohio",
    "40": "Oklahoma",
    "41": "Oregon",
    "42": "Pennsylvania",
    "44": "Rhode Island",
    "45": "South Carolina",
    "46": "South Dakota",
    "47": "Tennessee",
    "48": "Texas",
    "49": "Utah",
    "50": "Vermont",
    "51": "Virginia",
    "53": "Washington",
    "54": "West Virginia",
    "55": "Wisconsin",
    "56": "Wyoming",
}

 // should I have state id map to the number that it is?
 // I need to fetch the location that 
export const stateIdToStateName = (id) => {
    return idReference[`${id}`].toString();
}