const { response } = require('express');
const express = require('express');
const { stream } = require('../models');
const PG = require('pg-promise')();

const db = require('../models');
const {
    checkLoginInfo,
} = require('../utilities');

const router = express.Router();


const storiesQuery = `select us.name as state, us.id, (uc.name||','||uc.statefp) as county, published, incidentdate as date, i.location, i.description
from incident i -- include all groups, even if aggregate of one is 0
join us_states us on us.id = i.state_id -- attach the state name
join us_counties uc on uc.id = i.county_id -- attach the county name
where incidentdate IS NOT NULL AND incidentdate < now()::date`



// TODO - implmeent
const cleanupStory = (data) => {
    data.forEach(element => {
        for (let i = 0; i < element.length; i++) {
            if (element[i] === '�') {
                // console.log(element.charCodeAtIndex(i)) this still isn't working
                if (i > 0) {
                    let c = element[i - 1]
                    if (c.toLowerCase() != c.toUpperCase()) {
                        element[i] = '\'';
                    } else {
                        element[i] = '"';
                        ++i;
                        while (i < element.length && element[i] != '�');

                        if (i < element.length) {
                            element[i] == '"';
                        }
                    }
                }
            }
        }
        //   console.log(`done`);
    });
    return data;
}



const processStoryData = (response) => {
    let data = response.filter(each => {
        if (each.description) {
            return each.description !== '';
        } else {
            return false;
        }
    })
    if (data.length > 10) {
        return data.splice(0, 10);
    } else {
        return data
    }
}

router.get('/:type/:name', (req, res) => {
    let query = storiesQuery;

    if (req.params.type === 'state') {
        query += ` and us.name = '${req.params.name}'`;
    } else if (req.params.type === 'county') {
        query += ` and (uc.name||','||uc.statefp) = '${req.params.name}'`;
    }

    db.any(query).then(result => {
        let data = processStoryData(result); res.send(data);
    })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

let newQuery = `select * from incident i where i.description like '%�%'`

function isAlpha(ch) {
    if (ch >= "A" && ch <= "z") {
        return true
    } else {
        return false
    }
}


String.prototype.replaceAt = function (index, replacement) { // space isn't within this range
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

/*
issue at hand - the issue that's been happening is that the script is incorrectly replacing commas with quotes
because both qualify as having a letter before and a space after 


*/
const whatCharShouldBeHere = (copy, i) => {
    if (i == 0) {
        return '"';
    } else if (i == copy.length - 1) {
        return '"';
    } else if (isAlpha(copy[i - 1]) && copy[i + 1] === '.') {
        return '"';
    } else if (isAlpha(copy[i + 1]) && isAlpha(copy[i - 1])) {
        return '\''
    } else if ((isAlpha(copy[i + 1]) && copy[i + 1] !== ' ') ||
        copy[i - 1] === '.' ||
        copy[i - 1] === '!' ||
        copy[i - 1] === '?' ||
        copy[i - 1] === ',' ||
        copy[i - 1] === ' ') {
        return '"';
    } else if (copy[i + 1] === ' ') {  // if the letter after is a space or 
        return ',"'
    } else {
        return null
    }
}

/*
i guess if a string contains the possibility of having two or more letters at one place, don't do anything and just return
otherwise, update fully
*/

const removeUnknown = (input) => {
    let copy = input.description;
    for (var i = 0; i < copy.length; i++) {
        if (copy[i] === '�') {
            if (i == 0) {
                copy = copy.replaceAt(i, '"');
            } else if (i == copy.length - 1) {
                copy = copy.replaceAt(i, '"');
            } else if (copy[i - 1] === ' ' && isAlpha(copy[i + 1])) {
                copy = copy.replaceAt(i, '"');
            } else if (isAlpha(copy[i - 1]) && copy[i + 1] === ',') {
                copy = copy.replaceAt(i, '"');
            }
            else if (isAlpha(copy[i - 1]) && copy[i + 1] === '.') {
                copy = copy.replaceAt(i, '"');
            } else if (isAlpha(copy[i + 1]) && isAlpha(copy[i - 1])) {
                copy = copy.replaceAt(i, '\'');
            } else if (copy[i - 1] === ' ' && isAlpha(copy[i + 1])) {
                copy = copy.replaceAt(i, '"');
                i++;
                while (i < copy.length && copy[i] != '�') {
                    i++;
                }
                // what if I encounter another unknown character inside this?
                if (i < copy.length) {
                    if (i < copy.length - 1) {
                        if (copy[i + 1] === ' ' && isAlpha(copy[i - 1])) {
                            copy = copy.replaceAt(i, '"');
                        }
                    } else {
                        let charToReturn = whatCharShouldBeHere(copy, i);
                        console.log(charToReturn)
                        if (!charToReturn) { return }
                        if (charToReturn.length > 1) {
                            return;
                        } else {
                            copy = copy.replaceAt(i, whatCharShouldBeHere(copy, i));
                        }
                    }
                } else {
                    return
                }
            } else if ((isAlpha(copy[i + 1]) && copy[i + 1] !== ' ') ||
                copy[i - 1] === '.' ||
                copy[i - 1] === '!' ||
                copy[i - 1] === '?' ||
                copy[i - 1] === ',' ||
                copy[i - 1] === ' ') {
                copy = copy.replaceAt(i, '"');
            } else if (copy[i + 1] === ' ') {  // if the letter after is a space or 
                copy = copy.replaceAt(i, ',');
            }
        }
    }
    input.description = copy;
}

// 2076 = apostrophe

// need 


const updateIncident = (id, newDesc) => {
    db.none('UPDATE incident SET description = $2 WHERE id = $1', [id, newDesc])
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.error(err)
        })
}


// id 1071
let data;
/* db.any(newQuery)
    .then(res => {
        res.forEach(each => {
            removeUnknown(each)
        })
        res.forEach(each => {
            updateIncident(each.id, each.description)
        })
    })
    .catch(err => {
        console.error(err);
    })
 */

// id 1209


//441 = orig num

const allIds = [1072, 1071, 1079, 1083, 1111, 1185, 1127, 1084, 1192, 1209, 1148, 1138, 1233, 1557, 1296, 1295, 1146, 1356, 1515, 1149, 1151, 1583, 1153, 1585, 1164, 1850, 1188, 1908, 1882, 1169, 1171, 1813, 1173, 2006, 1924, 1174, 1932, 1069, 1181, 1193, 1196, 1197, 1214, 1216, 281, 1108, 1219, 1232, 1236, 1087, 1251, 1254, 1267, 1272, 1268, 1298, 1300, 1315, 1345, 1366, 1367, 1379, 1393, 1415, 1428, 1431, 1464, 1091, 1465, 1468, 1471, 1480, 1481, 1485, 1486, 1487, 1491, 1495, 1499, 1503, 1516, 1519, 1092, 1093, 1096, 1527, 1531, 1098, 1102, 1538, 1104, 1105, 1761, 1115, 1826, 1131, 1771, 1143, 2002, 687, 24, 1157, 1161, 495, 804, 1546, 1550, 1551, 1552, 1561, 1569, 1574, 1575, 1584, 1589, 1587, 1593, 1602, 1604, 1620, 1625, 1641, 1642, 1646, 1650, 1651, 1653, 1659, 1669, 1678, 1680, 1683, 1978, 1988, 1974, 1982, 1229, 1969, 1915, 1917, 1918, 1930, 1964, 1955, 1960, 1927, 1943, 2053, 1061, 67, 1556, 1936, 1427, 1249, 1467, 1681, 1634, 1365, 1075, 1114, 1166, 1184, 1186, 1187, 1189, 1191, 1199, 1201, 1202, 1207, 1217, 1218, 1220, 1224, 1227, 1228, 1230, 1237, 1241, 1243, 1244, 1246, 1247, 1248, 1255, 1259, 1260, 1261, 1435, 1273, 1276, 1277, 1280, 1269, 2010, 35, 1984, 1313, 1355, 1370, 1375, 1376, 1396, 1399, 1400, 1401, 1416, 1418, 1432, 1433, 1420, 1463, 1528, 1466, 1475, 1479, 1482, 1488, 1496, 1506, 1509, 1511, 1523, 1524, 1525, 1526, 1461, 1533, 2009, 1699, 1541, 1542, 1553, 1554, 1559, 1565, 1568, 1579, 1586, 1595, 1596, 1597, 1600, 1605, 1608, 1611, 1614, 1618, 1627, 1637, 1643, 1644, 1645, 1648, 1660, 1661, 1665, 1384, 1673, 1674, 1676, 1677, 1685, 1686, 1700, 1976, 1975, 1979, 2057, 1451, 551, 1534, 1578, 1993, 1963, 2050, 1775, 1970, 1965, 1971, 1910, 1911, 1913, 1914, 1919, 1966, 1793, 1925, 288, 2062, 1840, 1938, 1940, 1626, 1941, 1947, 1649, 1842, 1843, 1847, 1855, 1856, 1715, 1716, 1857, 1858, 1859, 845, 883, 1885, 1721, 1867, 1434, 1870, 1890, 1743, 1871, 1893, 1896, 1776, 1874, 1875, 1814, 1710, 1712, 1713, 1877, 1880, 1723, 1741, 1747, 1749, 1750, 1752, 1757, 1781, 2000, 2055, 1443, 1933, 1790, 1791, 1792, 1804, 1808, 1810, 1815, 1817, 1829, 1830, 1831, 1834, 1838, 19, 34, 57, 112, 197, 227, 241, 429, 1411, 835, 821, 838, 1056, 1996, 1058, 1059, 1064, 692, 2005, 2073, 2074, 1953, 11, 2076, 64, 83, 2078, 903, 1998, 1782, 1825, 1658, 1887, 1704, 1705, 1848, 1853, 1884, 1886, 1891, 1763, 1812, 1707, 1708, 1724, 1728, 1742, 1751, 1755, 1767, 1762, 1774, 1779, 2066, 1785, 1929, 973, 1786, 1789, 1795, 1798, 1800, 1820, 1823, 1824, 58, 59, 125, 194, 213, 344, 342, 474, 13, 815, 507, 2070, 1062, 1981, 2069, 1121, 1972, 2072, 33, 1252, 1286, 1292, 1289]
module.exports = router;
