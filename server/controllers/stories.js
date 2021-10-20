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

function isAlpha(ch){
     if (ch >= "A" && ch <= "z") { 
         return true 
    } else { 
        return false 
    } 
}


String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


// so -> if it is a unknown char 
const removeUnknown = (input) => {
    let copy = input.description;
    for (var i = 0; i < copy.length; i++) {
        if (copy[i] === '�') {
            console.log(copy[i + 1])
            // two cases - the question mark is either a comma or a quotation mark
            // 

            // cases where it can equal a quote 
                /*
                any punctuation before

                */
            if (i == 0) {
                copy = copy.replaceAt(i, '"');
            } else if (i == copy.length - 1) {
                copy = copy.replaceAt(i, '"');
            } else if (isAlpha(copy[i + 1]) && isAlpha(copy[i - 1])) {
                copy = copy.replaceAt(i, '\'');
            } else if (isAlpha(copy[i + 1]) ||
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
    console.log(copy)
    input.description = copy;
    console.log(input.description)
}

// 2076 = apostrophe

// need 



const updateIncident = (id, newDesc) => {
    db.none('UPDATE incident SET description = $2 WHERE id = ANY($1)', [id, newDesc])
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.error(err)
    })
}


// id 1071
let data;
db.any(newQuery)
.then(res => {
    res.forEach(each => {
        removeUnknown(each)
    })

    res.forEach(each => {
        if (each.id === 2076) {
        console.log(each.description)
        }
    })
})
.catch(err => {
    console.error(err);
})








module.exports = router;
